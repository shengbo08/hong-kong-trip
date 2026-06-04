import { useMemo, useState } from 'react';
import { MapPinned, X } from 'lucide-react';
import type { FoodCategory, FoodRecommendation, ReservationStatus } from '../data/trip';
import { EmptyState } from './EmptyState';

interface FoodRecommendationsProps {
  categories: FoodCategory[];
}

const hkdToTwd = 4.15;

const reservationLabels: Record<ReservationStatus, { label: string; className: string }> = {
  available: {
    label: '可現場或線上',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  },
  recommended: {
    label: '建議預約',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-100',
  },
  walkIn: {
    label: '現場排隊',
    className: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200',
  },
};

export function FoodRecommendations({ categories }: FoodRecommendationsProps) {
  const [lightboxRestaurant, setLightboxRestaurant] = useState<FoodRecommendation | null>(null);

  if (categories.length === 0) return <EmptyState />;

  return (
    <>
      <div className="space-y-5">
        {categories.map((category) => (
          <div key={category.category}>
            <h3 className="mb-2 text-lg font-bold text-stone-950 dark:text-white">
              {category.category}
            </h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {category.restaurants.map((restaurant) => (
                <FoodCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onOpenPhoto={setLightboxRestaurant}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {lightboxRestaurant ? (
        <button
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-stone-950/88 p-4"
          type="button"
          onClick={() => setLightboxRestaurant(null)}
          aria-label="關閉照片"
        >
          <span className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white">
            <X className="h-6 w-6" aria-hidden="true" />
          </span>
          <img
            src={lightboxRestaurant.photoUrl}
            alt={lightboxRestaurant.name}
            className="max-h-[82vh] w-full max-w-5xl rounded-lg object-contain shadow-2xl"
          />
        </button>
      ) : null}
    </>
  );
}

function FoodCard({
  restaurant,
  onOpenPhoto,
}: {
  restaurant: FoodRecommendation;
  onOpenPhoto: (restaurant: FoodRecommendation) => void;
}) {
  const reservation = reservationLabels[restaurant.reservationStatus];
  const spendWithTwd = useMemo(
    () => appendTwdEstimate(restaurant.averageSpend),
    [restaurant.averageSpend],
  );

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <button
        className="block w-full cursor-zoom-in"
        type="button"
        onClick={() => onOpenPhoto(restaurant)}
        aria-label={`查看 ${restaurant.name} 照片`}
      >
        <img
          src={restaurant.photoUrl}
          alt={restaurant.name}
          className="h-28 w-full object-cover transition hover:scale-[1.02]"
          loading="lazy"
        />
      </button>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold leading-snug text-stone-950 dark:text-white">
            {restaurant.name}
          </h4>
          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${reservation.className}`}>
            {reservation.label}
          </span>
        </div>
        <dl className="mt-2 space-y-1.5 text-xs leading-5 text-stone-600 dark:text-stone-300">
          <InfoRow label="推薦" value={restaurant.recommendedItems} />
          <InfoRow label="營業" value={restaurant.hours} />
          <InfoRow label="均消" value={spendWithTwd} />
        </dl>
        <a
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          href={restaurant.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPinned className="h-3.5 w-3.5" />
          Google Maps
        </a>
      </div>
    </article>
  );
}

function appendTwdEstimate(value: string) {
  const numbers = [...value.matchAll(/HK\$([\d,]+)/g)].map((match) =>
    Number(match[1].replaceAll(',', '')),
  );

  if (numbers.length === 0) return value;

  const twd = numbers.map((amount) => Math.round(amount * hkdToTwd));
  const twdText =
    twd.length >= 2
      ? `約 NT$${twd[0].toLocaleString('zh-TW')}-${twd[1].toLocaleString('zh-TW')}`
      : `約 NT$${twd[0].toLocaleString('zh-TW')}`;

  return `${value}（${twdText}）`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-stone-800 dark:text-stone-100">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
