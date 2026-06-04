export interface LiveExchangeRates {
  twdToHkd: number;
  hkdToTwd: number;
  updatedAt: string;
  source: 'live' | 'fallback';
}

interface ExchangeRateResponse {
  time_last_update_utc?: string;
  rates?: Record<string, number>;
}

const fallbackRates: LiveExchangeRates = {
  twdToHkd: 0.24,
  hkdToTwd: 4.15,
  updatedAt: new Date().toISOString(),
  source: 'fallback',
};

export async function fetchLiveExchangeRates(): Promise<LiveExchangeRates> {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/TWD?_=${Date.now()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Exchange rate request failed');
    }

    const data = (await response.json()) as ExchangeRateResponse;
    const twdToHkd = data.rates?.HKD;

    if (!twdToHkd) {
      throw new Error('Missing HKD exchange rate');
    }

    return {
      twdToHkd,
      hkdToTwd: 1 / twdToHkd,
      updatedAt: data.time_last_update_utc ?? new Date().toISOString(),
      source: 'live',
    };
  } catch (error) {
    console.warn(error);
    return fallbackRates;
  }
}
