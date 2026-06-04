import { useEffect, useMemo, useState } from 'react';
import { Calculator, RefreshCw, WalletCards } from 'lucide-react';
import type { BudgetCategory, BudgetItem, CurrencyCode } from '../data/trip';
import { budgetCategoryLabels, formatMoney, formatTwd } from '../utils/format';
import { convertToTwd, fetchRatesToTwd, type ExchangeRates } from '../utils/exchangeRates';
import { EmptyState } from './EmptyState';

interface BudgetSectionProps {
  items: BudgetItem[];
  baseCurrency: CurrencyCode;
}

export function BudgetSection({ items, baseCurrency }: BudgetSectionProps) {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [source, setSource] = useState<'live' | 'fallback'>('fallback');
  const [rateDate, setRateDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const currencies = useMemo(
    () => Array.from(new Set(items.map((item) => item.cost.currency))),
    [items],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRates() {
      setIsLoading(true);
      const result = await fetchRatesToTwd(currencies);

      if (!isMounted) return;

      setRates(result.rates);
      setSource(result.source);
      setRateDate(result.date);
      setIsLoading(false);
    }

    loadRates();

    return () => {
      isMounted = false;
    };
  }, [currencies]);

  const totals = useMemo(() => {
    if (!rates) {
      return { total: 0, byCategory: {} as Record<BudgetCategory, number> };
    }

    return items.reduce(
      (acc, item) => {
        const twdValue = convertToTwd(item.cost.amount, item.cost.currency, rates);
        acc.total += twdValue;
        acc.byCategory[item.category] = (acc.byCategory[item.category] ?? 0) + twdValue;
        return acc;
      },
      { total: 0, byCategory: {} as Record<BudgetCategory, number> },
    );
  }, [items, rates]);

  if (items.length === 0) return <EmptyState />;

  const hkdRateToTwd = rates?.HKD ?? 4.15;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="rounded-lg bg-stone-950 p-5 text-white shadow-sm dark:bg-teal-950">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-100">預估總預算</p>
            <p className="mt-2 text-4xl font-black">{formatTwd(totals.total)}</p>
            <p className="mt-2 text-sm font-semibold text-white/75">
              約 {formatHkdFromTwd(totals.total, hkdRateToTwd)}
            </p>
          </div>
          <Calculator className="h-9 w-9 text-amber-200" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm leading-6 text-white/75">
          以 {baseCurrency} 為主要記帳幣別，所有預算項目上方顯示台幣，下方顯示約港幣。
        </p>
        <div className="mt-5 rounded-lg bg-white/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? '讀取匯率中' : source === 'live' ? '即時匯率' : '備用匯率'}
          </p>
          <p className="mt-2 text-white/70">匯率日期：{rateDate || '待確認'}</p>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(budgetCategoryLabels) as BudgetCategory[]).map((category) => {
            const twdValue = totals.byCategory[category] ?? 0;

            return (
              <div
                key={category}
                className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
              >
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {budgetCategoryLabels[category]}
                </p>
                <p className="mt-1 text-xl font-bold text-stone-950 dark:text-white">
                  {formatTwd(twdValue)}
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-500 dark:text-stone-400">
                  約 {formatHkdFromTwd(twdValue, hkdRateToTwd)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          {items.map((item, index) => {
            const twdValue = rates
              ? convertToTwd(item.cost.amount, item.cost.currency, rates)
              : convertToTwdFallback(item);

            return (
              <div
                key={item.id}
                className={`grid gap-3 p-4 sm:grid-cols-[1fr_auto] ${
                  index === 0 ? '' : 'border-t border-stone-100 dark:border-stone-800'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <WalletCards className="mt-1 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" />
                  <div>
                    <p className="font-semibold text-stone-950 dark:text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                      {budgetCategoryLabels[item.category]}，{item.note || '暫估項目'}
                    </p>
                    {item.cost.currency !== 'TWD' ? (
                      <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
                        原始估算：{formatMoney(item.cost)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-stone-950 dark:text-white">{formatTwd(twdValue)}</p>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    約 {formatHkdFromTwd(twdValue, hkdRateToTwd)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatHkdFromTwd(twdValue: number, hkdRateToTwd: number) {
  const hkdValue = hkdRateToTwd > 0 ? twdValue / hkdRateToTwd : 0;

  return `HK$${new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0,
  }).format(hkdValue)} HKD`;
}

function convertToTwdFallback(item: BudgetItem) {
  if (item.cost.currency === 'TWD') return item.cost.amount;
  if (item.cost.currency === 'HKD') return item.cost.amount * 4.15;
  return 0;
}
