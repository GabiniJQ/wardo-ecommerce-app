/**
 * List of zero-decimal currencies (no cents/pence)
 * These currencies don't have fractional units
 */
const ZERO_DECIMAL_CURRENCIES = [
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
]

/**
 * Convert a decimal amount to smallest currency unit
 * @param amount - The amount in decimal format (e.g., 10.50)
 * @param currency - The currency code (e.g., 'usd', 'jpy')
 * @returns Amount in smallest currency unit
 */
export function toSmallestUnit(amount: number, currency: string): number {
  const upperCurrency = currency.toUpperCase()

  // Zero-decimal currencies: return as-is (no multiplication)
  if (ZERO_DECIMAL_CURRENCIES.includes(upperCurrency)) {
    return Number(amount.toFixed(0))
  }

  // Standard currencies: multiply by 100
  return amount * 100
}

/**
 * Convert from smallest currency unit to decimal
 * @param amount - Amount in smallest unit (e.g., 1050)
 * @param currency - The currency code (e.g., 'usd', 'jpy')
 * @returns Decimal amount
 */
export function fromSmallestUnit(amount: number, currency: string): number {
  const upperCurrency = currency.toUpperCase()

  // Zero-decimal currencies: return as-is
  if (ZERO_DECIMAL_CURRENCIES.includes(upperCurrency)) {
    return amount
  }

  // Standard currencies: divide by 100
  return amount / 100
}

/**
 * Format amount for display
 * @param amount - Amount in smallest unit
 * @param currency - Currency code
 * @param locale - Locale for formatting (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: string = 'en-US',
): string {
  const decimalAmount = fromSmallestUnit(amount, currency)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(decimalAmount)
}

/**
 * Validate amount meets Stripe requirements
 * @param amount - Amount in smallest unit
 * @param currency - Currency code
 */
export function validateStripeAmount(
  amount: number,
  currency: string,
): {
  valid: boolean
  error?: string
} {
  const upperCurrency = currency.toUpperCase()

  // Must be positive integer
  if (!Number.isInteger(amount) || amount <= 0) {
    return {
      valid: false,
      error: 'Amount must be a positive integer',
    }
  }

  // Check minimum amount (50 cents USD or equivalent)
  const minAmount = ZERO_DECIMAL_CURRENCIES.includes(upperCurrency) ? 50 : 50
  if (amount < minAmount) {
    return {
      valid: false,
      error: `Amount must be at least ${formatCurrency(minAmount, currency)}`,
    }
  }

  // Check maximum (8 digits)
  if (amount > 99999999) {
    return {
      valid: false,
      error: 'Amount exceeds maximum allowed value',
    }
  }

  return { valid: true }
}
