import { BedDouble, CalendarCheck, Phone, Wallet } from 'lucide-react';
import type { Accommodation } from '../data/trip';
import { formatDate, formatMoney, valueOrEmpty } from '../utils/format';
import { EmptyState } from './EmptyState';
import { MapButton } from './MapButton';

interface AccommodationListProps {
  accommodations: Accommodation[];
}

export function AccommodationList({ accommodations }: AccommodationListProps) {
  if (accommodations.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {accommodations.map((hotel) => (
        <article
          key={hotel.id}
          className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <BedDouble className="mb-4 h-6 w-6 text-teal-700 dark:text-teal-300" aria-hidden="true" />
          <h3 className="text-xl font-bold text-stone-950 dark:text-white">{hotel.hotelName}</h3>
          <p className="mt-3 flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
            {formatDate(hotel.checkIn)} - {formatDate(hotel.checkOut)}
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <InfoBlock label="地址" value={valueOrEmpty(hotel.address)} />
            <InfoBlock label="訂房資訊" value={valueOrEmpty(hotel.bookingInfo)} />
            <InfoBlock
              label="聯絡電話"
              value={valueOrEmpty(hotel.phone)}
              icon={<Phone className="h-4 w-4" aria-hidden="true" />}
            />
            <InfoBlock
              label="費用"
              value={formatMoney(hotel.price)}
              icon={<Wallet className="h-4 w-4" aria-hidden="true" />}
            />
          </dl>

          {hotel.facilities?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {hotel.facilities.map((facility) => (
                <span
                  key={facility}
                  className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200"
                >
                  {facility}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5">
            <MapButton url={hotel.googleMapsUrl} />
          </div>
        </article>
      ))}
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-800">
      <dt className="flex items-center gap-2 font-semibold text-stone-800 dark:text-stone-100">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-stone-600 dark:text-stone-300">{value}</dd>
    </div>
  );
}
