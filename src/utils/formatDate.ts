function getLocale() {
  if (typeof document === 'undefined') {
    return 'en-US';
  }

  return document.documentElement.lang === 'ar' ? 'ar-JO' : 'en-US';
}

export function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
