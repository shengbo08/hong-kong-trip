import { useCallback, useMemo, useState } from 'react';
import { AccommodationList } from './components/AccommodationList';
import { BudgetSection } from './components/BudgetSection';
import { DayDetails } from './components/DayDetails';
import { ExchangeRateCard } from './components/ExchangeRateCard';
import { FoodRecommendations } from './components/FoodRecommendations';
import { Hero } from './components/Hero';
import { ImportantInfo } from './components/ImportantInfo';
import { MapCollection } from './components/MapCollection';
import { Section } from './components/Section';
import { TransportList } from './components/TransportList';
import { TripOverview } from './components/TripOverview';
import { WeatherCard } from './components/WeatherCard';
import { trip } from './data/trip';
import type { DailyWeather } from './utils/weather';

function App() {
  const [selectedDayId, setSelectedDayId] = useState(trip.days[0]?.id ?? '');
  const [dailyWeather, setDailyWeather] = useState<DailyWeather[]>([]);

  const selectedDay = useMemo(
    () => trip.days.find((day) => day.id === selectedDayId) ?? trip.days[0],
    [selectedDayId],
  );

  const selectedDayWeather = useMemo(
    () => dailyWeather.find((weather) => weather.date === selectedDay?.date),
    [dailyWeather, selectedDay?.date],
  );

  const handleDailyWeatherChange = useCallback((weather: DailyWeather[]) => {
    setDailyWeather(weather);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <Hero trip={trip} />

      <main className="mx-auto max-w-6xl overflow-hidden px-4 pb-16 sm:px-6">
        <Section id="live" eyebrow="Live" title="即時資訊">
          <div className="grid gap-4 lg:grid-cols-2">
            <WeatherCard onDailyWeatherChange={handleDailyWeatherChange} />
            <ExchangeRateCard />
          </div>
        </Section>

        <Section id="flights" eyebrow="Flight" title="航班與交通">
          <TransportList transports={trip.transports} />
        </Section>

        <Section id="daily" eyebrow="Daily Plan" title="每日行程">
          <div className="space-y-5">
            <TripOverview
              days={trip.days}
              selectedDayId={selectedDay?.id ?? ''}
              onSelectDay={setSelectedDayId}
            />
            <DayDetails day={selectedDay} weather={selectedDayWeather} />
          </div>
        </Section>

        <Section id="stays" eyebrow="Stay" title="住宿規劃">
          <AccommodationList accommodations={trip.accommodations} />
        </Section>

        <Section id="food" eyebrow="Food" title="餐廳推薦">
          <FoodRecommendations categories={trip.foodRecommendations} />
        </Section>

        <Section id="maps" eyebrow="Map" title="景點地圖">
          <MapCollection places={trip.mapPlaces} collectionUrl={trip.mapCollectionUrl} />
        </Section>

        <Section id="budget" eyebrow="Budget" title="預算估算">
          <BudgetSection items={trip.budget} baseCurrency={trip.homeBaseCurrency} />
        </Section>

        <Section id="notes" eyebrow="Notes" title="重要提醒">
          <ImportantInfo info={trip.importantInfo} />
        </Section>
      </main>
    </div>
  );
}

export default App;
