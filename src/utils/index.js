// StarPad shared utilities

/**
 * Format large numbers to human-readable strings
 * e.g. 986000 → "98.6万", 999 → "999"
 */
export function formatCount(n) {
  if (!n) return '0';
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return String(n);
}
