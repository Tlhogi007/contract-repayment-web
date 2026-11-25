/** Convert ZAR decimal string/number to integer cents (half-up). */
export function zarToCents(value: string | number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error('Principal must be a positive amount');
  }
  return Math.round(n * 100);
}

export function centsToZar(cents: number): string {
  return (cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  });
}
