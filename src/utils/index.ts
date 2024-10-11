const numberFormatter = new Intl.NumberFormat('en-EN');

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}
