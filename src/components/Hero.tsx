import { CalendarDays, MapPin } from 'lucide-react';
import type { TripData } from '../data/trip';
import { formatDateRange } from '../utils/format';

interface HeroProps {
  trip: TripData;
}

const navItems = [
  ['#live', '即時'],
  ['#flights', '航班'],
  ['#daily', '行程'],
  ['#stays', '住宿'],
  ['#food', '餐廳'],
  ['#maps', '地圖'],
  ['#budget', '預算'],
  ['#notes', '提醒'],
] as const;

export function Hero({ trip }: HeroProps) {
  return (
    <header className="relative min-h-[560px] overflow-hidden bg-stone-950 text-white">
      <img
        src={trip.coverImageUrl}
        alt={trip.destination}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/35 to-stone-950/88" />

      <nav className="relative z-10 mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a className="w-fit text-sm font-semibold tracking-wide" href="#top">
          Hong Kong Handbook
        </a>
        <div className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 text-sm text-white/90 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-end sm:gap-2 sm:overflow-visible sm:px-0">
          {navItems.map(([href, label]) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </div>
      </nav>

      <div
        id="top"
        className="relative z-10 mx-auto flex min-h-[440px] max-w-6xl flex-col justify-end px-4 pb-14 pt-16 sm:px-6 lg:pb-20"
      >
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {trip.destination}
        </p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{trip.name}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/88 sm:text-lg">
          {trip.intro}
        </p>
        <div className="mt-7 max-w-md text-sm">
          <HeroMetric
            icon={CalendarDays}
            label="暫定日期"
            value={`${formatDateRange(trip.startDate, trip.endDate)}（9 月暫定）`}
          />
        </div>
      </div>
    </header>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white/12 p-4 backdrop-blur">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-100" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        <p className="mt-1 break-words text-white/82">{value}</p>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="shrink-0 rounded-md px-2.5 py-2 transition hover:bg-white/15 sm:px-3" href={href}>
      {label}
    </a>
  );
}
