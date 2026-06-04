import { Bus, Car, Plane, Route, Train } from 'lucide-react';
import type { TransportInfo, TransportType } from '../data/trip';
import { transportTypeLabels, valueOrEmpty } from '../utils/format';
import { EmptyState } from './EmptyState';

const iconMap: Record<TransportType, typeof Plane> = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car: Car,
  other: Route,
};

interface TransportListProps {
  transports: TransportInfo[];
}

export function TransportList({ transports }: TransportListProps) {
  if (transports.length === 0) return <EmptyState />;

  return (
    <div>
      <h3 className="mb-3 text-xl font-bold text-stone-950 dark:text-white">去程 / 回程</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {transports.map((transport) => {
          const Icon = iconMap[transport.type];

          return (
            <article
              key={transport.id}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex items-start gap-4">
                <span className="rounded-lg bg-teal-50 p-3 text-teal-700 dark:bg-teal-950 dark:text-teal-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                    {transportTypeLabels[transport.type]}
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-stone-950 dark:text-white">
                    {transport.title}
                  </h4>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <TimeBlock label="出發" place={transport.from} time={transport.departureTime} />
                <TimeBlock label="抵達" place={transport.to} time={transport.arrivalTime} />
              </div>
              <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">
                備註：{valueOrEmpty(transport.ticketNote)}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TimeBlock({ label, place, time }: { label: string; place: string; time: string }) {
  return (
    <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-800">
      <p className="font-semibold text-stone-800 dark:text-stone-100">{label}</p>
      <p className="mt-1 text-stone-600 dark:text-stone-300">{valueOrEmpty(place)}</p>
      <p className="mt-1 text-stone-500 dark:text-stone-400">{valueOrEmpty(time)}</p>
    </div>
  );
}
