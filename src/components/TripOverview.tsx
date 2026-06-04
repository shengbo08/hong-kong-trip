import { Calendar, MapPin } from 'lucide-react';
import type { TripDay } from '../data/trip';
import { formatDate } from '../utils/format';
import { EmptyState } from './EmptyState';

interface TripOverviewProps {
  days: TripDay[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
}

export function TripOverview({ days, selectedDayId, onSelectDay }: TripOverviewProps) {
  if (days.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {days.map((day) => {
        const isSelected = day.id === selectedDayId;

        return (
          <button
            key={day.id}
            className={`rounded-lg border p-4 text-left shadow-sm transition ${
              isSelected
                ? 'border-teal-700 bg-teal-700 text-white shadow-sm'
                : 'border-stone-200 bg-white text-stone-800 hover:-translate-y-0.5 hover:border-teal-300 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100'
            }`}
            type="button"
            onClick={() => onSelectDay(day.id)}
          >
            <span
              className={`mb-4 inline-flex rounded-md px-3 py-1 text-sm font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              Day {day.day}
            </span>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatDate(day.date)}
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {day.city}
              </p>
              <ul className="space-y-1 text-sm opacity-90">
                {day.highlights.length > 0 ? (
                  day.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)
                ) : (
                  <li>行程待補</li>
                )}
              </ul>
            </div>
          </button>
        );
      })}
    </div>
  );
}
