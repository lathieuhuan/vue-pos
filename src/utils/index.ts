const numberFormatter = new Intl.NumberFormat('en-EN');
const dateFormatter = new Intl.DateTimeFormat('vi-VN');

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatDate(value: Date) {
  return dateFormatter.format(value);
}