import type { CurrencyCode } from '../data/trip';

export type ExchangeRates = Record<CurrencyCode, number>;

const fallbackRatesToTwd: ExchangeRates = {
  TWD: 1,
  HKD: 4.15,
  VND: 0.0012,
  JPY: 0.21,
  USD: 32,
  EUR: 35,
  KRW: 0.024,
  THB: 0.9,
};

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Partial<Record<CurrencyCode, number>>;
}

export async function fetchRatesToTwd(
  currencies: CurrencyCode[],
): Promise<{ rates: ExchangeRates; source: 'live' | 'fallback'; date: string }> {
  const uniqueCurrencies = Array.from(new Set(currencies));
  const nonTwdCurrencies = uniqueCurrencies.filter((currency) => currency !== 'TWD');

  if (nonTwdCurrencies.length === 0) {
    return {
      rates: fallbackRatesToTwd,
      source: 'fallback',
      date: new Date().toISOString().slice(0, 10),
    };
  }

  try {
    const results = await Promise.all(
      nonTwdCurrencies.map(async (currency) => {
        const response = await fetch(
          `https://api.frankfurter.app/latest?from=${currency}&to=TWD`,
        );

        if (!response.ok) {
          throw new Error(`Exchange rate request failed: ${response.status}`);
        }

        const data = (await response.json()) as FrankfurterResponse;
        const rate = data.rates.TWD;

        if (!rate || Number.isNaN(rate)) {
          throw new Error(`Missing TWD exchange rate for ${currency}`);
        }

        return { currency, rate, date: data.date };
      }),
    );

    return {
      rates: results.reduce<ExchangeRates>(
        (acc, item) => ({ ...acc, [item.currency]: item.rate }),
        { ...fallbackRatesToTwd, TWD: 1 },
      ),
      source: 'live',
      date: results[0]?.date ?? new Date().toISOString().slice(0, 10),
    };
  } catch (error) {
    console.warn(error);

    return {
      rates: fallbackRatesToTwd,
      source: 'fallback',
      date: new Date().toISOString().slice(0, 10),
    };
  }
}

export function convertToTwd(amount: number, currency: CurrencyCode, rates: ExchangeRates) {
  return amount * (rates[currency] ?? fallbackRatesToTwd[currency] ?? 1);
}
