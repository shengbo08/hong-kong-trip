import { MapPinned } from 'lucide-react';
import type { MapPlace } from '../data/trip';
import { EmptyState } from './EmptyState';

interface MapCollectionProps {
  places: MapPlace[];
  collectionUrl?: string;
}

interface Coordinate {
  lat: number;
  lng: number;
}

interface Tile {
  x: number;
  y: number;
  left: number;
  top: number;
}

const tileSize = 256;
const mapZoom = 12;
const mapColumns = 5;
const mapRows = 4;
const mapWidth = tileSize * mapColumns;
const mapHeight = tileSize * mapRows;
const mapCenter: Coordinate = { lat: 22.3027, lng: 114.1772 };

const placeCoordinates: Record<string, Coordinate> = {
  'hkg-airport': { lat: 22.308, lng: 113.9185 },
  'tsim-sha-tsui': { lat: 22.2988, lng: 114.1722 },
  'avenue-stars': { lat: 22.2933, lng: 114.1748 },
  'harbour-city': { lat: 22.295, lng: 114.1685 },
  'k11-musea': { lat: 22.2939, lng: 114.1745 },
  central: { lat: 22.2819, lng: 114.158 },
  'mid-levels': { lat: 22.2827, lng: 114.1545 },
  'tai-kwun': { lat: 22.2817, lng: 114.1539 },
  pmq: { lat: 22.2832, lng: 114.1522 },
  'victoria-peak': { lat: 22.2759, lng: 114.1455 },
  'causeway-bay': { lat: 22.2797, lng: 114.1843 },
  'mong-kok': { lat: 22.3193, lng: 114.1694 },
  'sneaker-street': { lat: 22.3172, lng: 114.1716 },
  'ladies-market': { lat: 22.3184, lng: 114.1706 },
};

const mappedPlaceIds = new Set(Object.keys(placeCoordinates));

const statusStyles = {
  planned: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200',
  optional: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-100',
} as const;

const pinStyles = {
  planned: 'border-white bg-green-700 text-white',
  optional: 'border-white bg-amber-400 text-stone-950',
} as const;

export function MapCollection({ places, collectionUrl }: MapCollectionProps) {
  if (places.length === 0) return <EmptyState />;

  const groupedPlaces = places.reduce<Record<string, MapPlace[]>>((acc, place) => {
    acc[place.category] = [...(acc[place.category] ?? []), place];
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <AttractionMap places={places} />

      {collectionUrl ? (
        <a
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 sm:w-auto"
          href={collectionUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPinned className="h-4 w-4" aria-hidden="true" />
          開啟香港景點 Google Maps
        </a>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(groupedPlaces).map(([category, categoryPlaces]) => (
          <section
            key={category}
            className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <h3 className="text-sm font-bold text-stone-950 dark:text-white">{category}</h3>
            <div className="mt-2 space-y-1.5">
              {categoryPlaces.map((place) => (
                <PlaceRow key={place.id} place={place} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function AttractionMap({ places }: { places: MapPlace[] }) {
  const tileLayout = getTileLayout();
  const mappedPlaces = places.filter(
    (place) => mappedPlaceIds.has(place.id) && placeCoordinates[place.id],
  );

  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-col gap-3 border-b border-stone-100 p-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-950 dark:text-white">香港景點分布</h3>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            點擊標記可開啟 Google Maps，適合出發前快速檢查動線。
          </p>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <span className="rounded-md bg-teal-50 px-2 py-1 text-teal-700 dark:bg-teal-950 dark:text-teal-200">
            已排入
          </span>
          <span className="rounded-md bg-amber-50 px-2 py-1 text-amber-700 dark:bg-amber-950 dark:text-amber-100">
            備選
          </span>
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden bg-slate-100 dark:bg-stone-950 sm:h-[540px]">
        <div className="absolute inset-0">
          {tileLayout.tiles.map((tile) => (
            <img
              key={`${tile.x}-${tile.y}`}
              className="absolute select-none"
              src={`https://tile.openstreetmap.org/${mapZoom}/${tile.x}/${tile.y}.png`}
              alt=""
              draggable={false}
              loading="lazy"
              style={{
                left: `${(tile.left / mapWidth) * 100}%`,
                top: `${(tile.top / mapHeight) * 100}%`,
                width: `${(tileSize / mapWidth) * 100}%`,
                height: `${(tileSize / mapHeight) * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-white/10 dark:bg-stone-950/20" />

        {mappedPlaces.map((place, index) => {
          const position = getPinPosition(placeCoordinates[place.id], tileLayout.origin);

          return (
            <a
              key={place.id}
              className={`group absolute flex h-6 w-6 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 shadow-lg ring-1 ring-stone-950/20 transition hover:z-20 hover:scale-110 ${pinStyles[place.status]}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              href={place.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${place.name} Google Maps`}
              title={place.name}
            >
              <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-max max-w-44 -translate-x-1/2 rounded-md bg-stone-950 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover:block">
                {index + 1}. {place.name}
              </span>
            </a>
          );
        })}

        <a
          className="absolute bottom-3 right-3 rounded bg-white/90 px-2 py-1 text-xs font-medium text-stone-600 shadow-sm hover:text-stone-950"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          © OpenStreetMap
        </a>
      </div>
    </section>
  );
}

function getTileLayout() {
  const center = getGlobalPixel(mapCenter, mapZoom);
  const origin = {
    x: center.x - mapWidth / 2,
    y: center.y - mapHeight / 2,
  };
  const firstTileX = Math.floor(origin.x / tileSize);
  const firstTileY = Math.floor(origin.y / tileSize);
  const tiles: Tile[] = [];

  for (let row = 0; row < mapRows + 1; row += 1) {
    for (let column = 0; column < mapColumns + 1; column += 1) {
      const x = firstTileX + column;
      const y = firstTileY + row;
      tiles.push({
        x,
        y,
        left: x * tileSize - origin.x,
        top: y * tileSize - origin.y,
      });
    }
  }

  return { origin, tiles };
}

function getGlobalPixel({ lat, lng }: Coordinate, zoom: number) {
  const scale = 2 ** zoom;
  const sinLat = Math.sin((lat * Math.PI) / 180);

  return {
    x: ((lng + 180) / 360) * scale * tileSize,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      scale *
      tileSize,
  };
}

function getPinPosition(coordinate: Coordinate, origin: { x: number; y: number }) {
  const point = getGlobalPixel(coordinate, mapZoom);
  const x = ((point.x - origin.x) / mapWidth) * 100;
  const y = ((point.y - origin.y) / mapHeight) * 100;

  return {
    x: Math.max(3, Math.min(97, x)),
    y: Math.max(8, Math.min(96, y)),
  };
}

function PlaceRow({ place }: { place: MapPlace }) {
  return (
    <a
      className="flex items-center justify-between gap-2 rounded-md bg-stone-50 px-2.5 py-2 text-xs transition hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-800"
      href={place.googleMapsUrl}
      target="_blank"
      rel="noreferrer"
    >
      <span className="font-semibold text-stone-950 dark:text-white">{place.name}</span>
      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${statusStyles[place.status]}`}>
        {place.status === 'planned' ? '已排入' : '備選'}
      </span>
    </a>
  );
}
