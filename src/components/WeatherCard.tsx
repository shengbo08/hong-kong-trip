import { useCallback, useEffect, useState } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { fetchHongKongWeather, type CurrentWeather, type DailyWeather } from '../utils/weather';

interface WeatherCardProps {
  onDailyWeatherChange?: (daily: DailyWeather[]) => void;
}

export function WeatherCard({ onDailyWeatherChange }: WeatherCardProps) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [sourceState, setSourceState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [lastFetchedAt, setLastFetchedAt] = useState('');

  const loadWeather = useCallback(async () => {
    setSourceState('loading');

    try {
      const result = await fetchHongKongWeather();

      setWeather(result.current);
      setLastFetchedAt(new Date().toISOString());
      setSourceState('ready');
      onDailyWeatherChange?.(result.daily);
    } catch (error) {
      console.warn(error);
      setSourceState('error');
    }
  }, [onDailyWeatherChange]);

  useEffect(() => {
    loadWeather();
    const intervalId = window.setInterval(loadWeather, 30 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadWeather]);

  return (
    <article className="min-w-0 rounded-lg border border-sky-100 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-sky-50 p-3 text-sky-700 dark:bg-sky-950 dark:text-sky-200">
            <CloudSun className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">香港即時天氣</p>
            <h3 className="text-xl font-bold text-stone-950 dark:text-white">
              {weather ? `${weather.icon} ${weather.description}` : '讀取中'}
            </h3>
          </div>
        </div>
        <button
          className="rounded-md p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          type="button"
          onClick={loadWeather}
          aria-label="重新整理香港天氣"
          title="重新整理香港天氣"
        >
          <RefreshCw
            className={`h-4 w-4 ${sourceState === 'loading' ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {sourceState === 'error' ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-100">
          暫時無法取得即時天氣，請稍後再試。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <WeatherMetric label="溫度" value={weather ? `${weather.temperature}°C` : '--'} />
          <WeatherMetric
            label="體感溫度"
            value={weather ? `${weather.apparentTemperature}°C` : '--'}
          />
          <WeatherMetric
            label="降雨機率"
            value={weather ? `${weather.precipitationProbability}%` : '--'}
          />
          <WeatherMetric label="濕度" value={weather ? `${weather.humidity}%` : '--'} />
          <WeatherMetric label="風速" value={weather ? `${weather.windSpeed} km/h` : '--'} />
          <WeatherMetric
            label="更新時間"
            value={weather ? new Date(weather.updatedAt).toLocaleString('zh-TW') : '--'}
          />
        </div>
      )}

      <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
        每 30 分鐘自動更新
        {lastFetchedAt ? `，最後讀取 ${new Date(lastFetchedAt).toLocaleTimeString('zh-TW')}` : ''}
      </p>
    </article>
  );
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-800">
      <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-stone-950 dark:text-white">{value}</p>
    </div>
  );
}
