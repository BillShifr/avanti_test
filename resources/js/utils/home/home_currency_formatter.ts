/**
 * форматирует сумму из младших единиц
 */

const NON_BREAKING_SPACE = ' '

const CURRENCY_SYMBOLS: Readonly<Record<string, string>> = {
  EUR: '€',
}

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency
}

export function formatMajorAmount(amountMinor: number, currency: string): string {
  if (!Number.isFinite(amountMinor)) {
    return `${currencySymbol(currency)}${NON_BREAKING_SPACE}0`
  }

  const isNegative = amountMinor < 0
  const absolute = Math.abs(Math.trunc(amountMinor))
  const units = Math.trunc(absolute / 100)
  const cents = absolute % 100

  const groupedUnits = groupThousands(units)
  const fraction = cents === 0 ? '' : `,${String(cents).padStart(2, '0')}`
  const sign = isNegative ? '−' : ''

  return `${currencySymbol(currency)}${NON_BREAKING_SPACE}${sign}${groupedUnits}${fraction}`
}

function groupThousands(value: number): string {
  const digits = String(value)
  let grouped = ''

  for (let index = 0; index < digits.length; index += 1) {
    const fromEnd = digits.length - index
    grouped += digits[index] ?? ''

    if (fromEnd > 1 && (fromEnd - 1) % 3 === 0) {
      grouped += NON_BREAKING_SPACE
    }
  }

  return grouped
}

/**
 * ограничивает счетчик двумя разрядами
 */
export function formatBadgeCount(count: number): string {
  if (!Number.isFinite(count) || count <= 0) {
    return '0'
  }

  const normalized = Math.trunc(count)

  return normalized > 99 ? '99+' : String(normalized)
}
