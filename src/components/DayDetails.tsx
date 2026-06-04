import { Clock, CreditCard, Navigation, StickyNote } from 'lucide-react';
import type { TripDay } from '../data/trip';
import { formatDate, formatMoney, valueOrEmpty } from '../utils/format';
import type { DailyWeather } from '../utils/weather';
import { EmptyState } from './EmptyState';
import { MapButton } from './MapButton';

interface DayDetailsProps {
  day?: TripDay;
  weather?: DailyWeather;
}

export function DayDetails({ day, weather }: DayDetailsProps) {
  if (!day) return <EmptyState label="請選擇行程日期" />;

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Day {day.day}</p>
          <h3 className="mt-1 text-2xl font-bold text-stone-950 dark:text-white">{day.city}</h3>
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">{formatDate(day.date)}</p>
      </div>

      <div className="mb-5 rounded-lg border border-sky-100 bg-sky-50 p-4 dark:border-sky-950 dark:bg-sky-950/40">
        {weather ? (
          <div className="grid gap-3 text-sm sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="text-4xl">{weather.icon}</div>
            <div>
              <p className="font-bold text-stone-950 dark:text-white">
                Day {day.day} 天氣：{weather.description}
              </p>
              <p className="mt-1 text-stone-700 dark:text-stone-300">
                最高 {weather.maxTemperature}°C / 最低 {weather.minTemperature}°C / 降雨機率{' '}
                {weather.precipitationProbability}%
              </p>
              {weather.precipitationProbability >= 70 ? (
                <p className="mt-2 rounded-md bg-amber-100 px-3 py-2 font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                  降雨機率偏高，建議帶傘並保留室內備案。
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-600 dark:text-stone-300">
            暫定日期超過即時天氣預報範圍時，這裡會先保留空白；出發前再查看最新天氣即可。
          </p>
        )}
      </div>

      {day.activities.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {day.activities.map((activity) => {
            const detailItems = [
              activity.transport
                ? {
                    icon: Navigation,
                    label: '交通',
                    value: activity.transport,
                  }
                : null,
              activity.estimatedCost
                ? {
                    icon: CreditCard,
                    label: '預估費用',
                    value: formatMoney(activity.estimatedCost),
                  }
                : null,
              activity.note
                ? {
                    icon: StickyNote,
                    label: '備註',
                    value: activity.note,
                  }
                : null,
            ].filter((item): item is DetailTileProps => item !== null);

            return (
              <article
                key={activity.id}
                className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                      <Clock className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                      {valueOrEmpty(activity.time)}
                    </p>
                    <h4 className="text-xl font-bold text-stone-950 dark:text-white">
                      {activity.place}
                    </h4>
                    <p className="mt-2 leading-7 text-stone-700 dark:text-stone-300">
                      {activity.activity}
                    </p>
                    {activity.address ? (
                      <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                        地址：{activity.address}
                      </p>
                    ) : null}
                  </div>
                  <MapButton url={activity.googleMapsUrl} />
                </div>

                {detailItems.length > 0 ? (
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    {detailItems.map((item) => (
                      <DetailTile key={item.label} {...item} />
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface DetailTileProps {
  icon: typeof Clock;
  label: string;
  value: string;
}

function DetailTile({ icon: Icon, label, value }: DetailTileProps) {
  return (
    <div className="rounded-lg bg-white p-3 dark:bg-stone-900">
      <p className="mb-1 flex items-center gap-2 font-semibold text-stone-800 dark:text-stone-100">
        <Icon className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
        {label}
      </p>
      <p className="text-stone-600 dark:text-stone-300">{value}</p>
    </div>
  );
}
