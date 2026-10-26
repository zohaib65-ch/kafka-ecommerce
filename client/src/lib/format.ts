const dateOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric'
};

export const formatDate = (date: string | number | Date) =>
  new Date(date).toLocaleDateString('en-US', dateOptions);

export const formatTime = (date: string | number | Date) =>
  new Date(date).toLocaleTimeString(undefined, timeOptions);

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

/** Formats a number (or numeric string) as US dollars, e.g. 1234.5 -> "$1,234.50". */
export const formatPrice = (value: number | string | null | undefined) => {
  const amount = Number(value);
  return currency.format(Number.isFinite(amount) ? amount : 0);
};
