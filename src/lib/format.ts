// Deutsche Zahlenformatierung

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const formatCurrencyShort = (value: number): string => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace('.', ',')} Mio €`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k €`;
  }
  return formatCurrency(value);
};

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('de-DE').format(value);

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);

export const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const formatMonthYear = (date: Date): string =>
  new Intl.DateTimeFormat('de-DE', {
    month: 'long',
    year: 'numeric',
  }).format(date);
