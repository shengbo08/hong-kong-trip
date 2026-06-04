import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { fetchLiveExchangeRates, type LiveExchangeRates } from '../utils/liveExchange';

const quickHkdAmounts = [50, 100, 300, 500, 1000, 2000];

export function ExchangeRateCard() {
  const [rates, setRates] = useState<LiveExchangeRates | null>(null);
  const [amount, setAmount] = useState('1000');
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedAt, setLastFetchedAt] = useState('');

  const loadRates = useCallback(async () => {
    setIsLoading(true);
    const nextRates = await fetchLiveExchangeRates();

    setRates(nextRates);
    setLastFetchedAt(new Date().toISOString());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadRates();
    const intervalId = window.setInterval(loadRates, 30 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadRates]);

  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount.replaceAll(',', ''));
    if (!rates || Number.isNaN(numericAmount)) return 0;
    return numericAmount * rates.hkdToTwd;
  }, [amount, rates]);

  return (
    <article className="min-w-0 rounded-lg border border-emerald-100 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
            <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">即時匯率</p>
            <h3 className="text-xl font-bold text-stone-950 dark:text-white">TWD / HKD</h3>
          </div>
        </div>
        <button
          className="rounded-md p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          type="button"
          onClick={loadRates}
          aria-label="重新整理匯率"
          title="重新整理匯率"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <RateTile label="1 TWD" value={rates ? `${rates.twdToHkd.toFixed(3)} HKD` : '--'} />
        <RateTile label="1 HKD" value={rates ? `NT$${rates.hkdToTwd.toFixed(2)}` : '--'} />
      </div>

      <div className="mt-4 rounded-lg border border-stone-200 p-3 dark:border-stone-700">
        <label className="text-sm font-semibold text-stone-700 dark:text-stone-200" htmlFor="hkd-converter">
          港幣換算台幣
        </label>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            id="hkd-converter"
            className="min-w-0 rounded-md border border-stone-300 px-3 py-2 text-base text-stone-950 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <p className="rounded-md bg-emerald-700 px-3 py-2 text-base font-bold text-white">
            約 NT${Math.round(convertedAmount).toLocaleString('zh-TW')}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700">
        <div className="grid grid-cols-2 bg-stone-100 px-3 py-2 text-sm font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
          <span>HKD</span>
          <span>TWD</span>
        </div>
        {quickHkdAmounts.map((hkd) => (
          <div
            key={hkd}
            className="grid grid-cols-2 border-t border-stone-100 px-3 py-2 text-sm dark:border-stone-800"
          >
            <span>{hkd.toLocaleString('zh-TW')}</span>
            <span>
              {rates ? Math.round(hkd * rates.hkdToTwd).toLocaleString('zh-TW') : '--'}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
        每 30 分鐘更新匯率
        {lastFetchedAt ? `，最後讀取 ${new Date(lastFetchedAt).toLocaleTimeString('zh-TW')}` : ''}
        {rates ? `，來源日期 ${new Date(rates.updatedAt).toLocaleString('zh-TW')}` : ''}
        {rates?.source === 'fallback' ? '，目前使用備用匯率' : '，目前使用即時資料'}
      </p>
    </article>
  );
}

function RateTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-800">
      <p className="text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-stone-950 dark:text-white">{value}</p>
    </div>
  );
}
