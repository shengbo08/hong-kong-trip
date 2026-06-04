import { MapPinned } from 'lucide-react';

interface MapButtonProps {
  url?: string;
}

export function MapButton({ url }: MapButtonProps) {
  if (!url) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-2 text-sm font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
        <MapPinned className="h-4 w-4" aria-hidden="true" />
        地圖待補
      </span>
    );
  }

  return (
    <a
      className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <MapPinned className="h-4 w-4" aria-hidden="true" />
      Google Maps
    </a>
  );
}
