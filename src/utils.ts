
/**
 * Normalizes a date string to YYYY-MM-DD.
 * Returns null if invalid.
 */
export function normalizeDate(dateStr: string): string | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

/**
 * Normalizes currency codes.
 */
export function normalizeCurrency(currencyStr: string): string {
  const upper = currencyStr.toUpperCase().trim();
  const map: Record<string, string> = {
    '€': 'EUR',
    '$': 'USD',
    '£': 'GBP',
    'US DOLLAR': 'USD',
    'EURO': 'EUR'
  };
  return map[upper] || upper;
}

/**
 * Simple text similarity (levenshtein-like or substring check could go here).
 * For now, just a basic inclusion check.
 */
export function containsText(fullText: string, search: string): boolean {
  return fullText.toLowerCase().includes(search.toLowerCase());
}

/**
 * Generate a unique ID for memories.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
