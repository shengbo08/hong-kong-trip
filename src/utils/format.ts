import type { CurrencyCode, Money } from '../data/trip';

export const currencyLabels: Record<CurrencyCode, string> = {
  TWD: 'NT$',
  HKD: 'HK$',
  VND: '₫',
  JPY: '¥',
  USD: 'US$',
  EUR: '€',
  KRW: '₩',
  THB: '฿',
};

export const budgetCategoryLabels = {
  flight: '機票',
  accommodation: '住宿',
  transport: '交通',
  food: '餐飲',
  ticket: '門票體驗',
  other: '其他',
} as const;

export const transportTypeLabels = {
  flight: '航班',
  train: '鐵路',
  bus: '巴士',
  car: '包車 / 計程車',
  other: '其他',
} as const;

export function formatDate(date: string) {
  if (!date) return '待確認';

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(parsed);
}

export function formatDateRange(startDate: string, endDate: string) {
  return `${startDate.replaceAll('-', '/')} - ${endDate.replaceAll('-', '/')}`;
}

export function getCountdownDays(startDate: string) {
  const today = new Date();
  const start = new Date(`${startDate}T00:00:00`);
  today.setHours(0, 0, 0, 0);

  return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatMoney(money?: Money) {
  if (!money) return '待確認';

  return `${currencyLabels[money.currency]}${new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: ['TWD', 'JPY', 'KRW', 'VND'].includes(money.currency) ? 0 : 2,
  }).format(money.amount)} ${money.currency}`;
}

export function formatTwd(amount: number) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function valueOrEmpty(value?: string) {
  return value?.trim() ? value : '待確認';
}
