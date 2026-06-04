export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  description: string;
  icon: string;
  precipitationProbability: number;
  humidity: number;
  windSpeed: number;
  updatedAt: string;
}

export interface DailyWeather {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  precipitationProbability: number;
  weatherCode: number;
  description: string;
  icon: string;
}

interface OpenMeteoResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    time: string[];
    precipitation_probability: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

const HONG_KONG_LATITUDE = 22.3193;
const HONG_KONG_LONGITUDE = 114.1694;

const weatherDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: '晴朗', icon: '☀️' },
  1: { description: '大致晴朗', icon: '🌤️' },
  2: { description: '局部多雲', icon: '⛅' },
  3: { description: '多雲', icon: '☁️' },
  45: { description: '有霧', icon: '🌫️' },
  48: { description: '霧凇', icon: '🌫️' },
  51: { description: '毛毛雨', icon: '🌦️' },
  53: { description: '毛毛雨', icon: '🌦️' },
  55: { description: '毛毛雨', icon: '🌦️' },
  61: { description: '小雨', icon: '🌧️' },
  63: { description: '陣雨', icon: '🌧️' },
  65: { description: '大雨', icon: '🌧️' },
  80: { description: '短暫陣雨', icon: '🌦️' },
  81: { description: '陣雨', icon: '🌧️' },
  82: { description: '強陣雨', icon: '⛈️' },
  95: { description: '雷雨', icon: '⛈️' },
  96: { description: '雷雨', icon: '⛈️' },
  99: { description: '強雷雨', icon: '⛈️' },
};

function describeWeather(code: number) {
  return weatherDescriptions[code] ?? { description: '天氣資料', icon: '🌤️' };
}

export async function fetchHongKongWeather() {
  const params = new URLSearchParams({
    latitude: String(HONG_KONG_LATITUDE),
    longitude: String(HONG_KONG_LONGITUDE),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'precipitation_probability',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Asia/Hong_Kong',
    forecast_days: '16',
    _: String(Date.now()),
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;

  if (!data.current) {
    throw new Error('Missing current weather data');
  }

  const currentHourIndex =
    data.hourly?.time.findIndex((time) => time.slice(0, 13) === data.current?.time.slice(0, 13)) ??
    -1;

  const weatherMeta = describeWeather(data.current.weather_code);
  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    weatherCode: data.current.weather_code,
    description: weatherMeta.description,
    icon: weatherMeta.icon,
    precipitationProbability:
      currentHourIndex >= 0 ? data.hourly?.precipitation_probability[currentHourIndex] ?? 0 : 0,
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    updatedAt: data.current.time,
  };

  const daily: DailyWeather[] =
    data.daily?.time.map((date, index) => {
      const dailyMeta = describeWeather(data.daily?.weather_code[index] ?? 0);

      return {
        date,
        maxTemperature: Math.round(data.daily?.temperature_2m_max[index] ?? 0),
        minTemperature: Math.round(data.daily?.temperature_2m_min[index] ?? 0),
        precipitationProbability: data.daily?.precipitation_probability_max[index] ?? 0,
        weatherCode: data.daily?.weather_code[index] ?? 0,
        description: dailyMeta.description,
        icon: dailyMeta.icon,
      };
    }) ?? [];

  return { current, daily };
}
