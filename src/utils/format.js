import moment from 'moment'

/**
 * Change these two constants to move the whole app to another currency —
 * every amount in the UI is formatted through the helpers below.
 */
export const CURRENCY = 'PHP'
export const LOCALE = 'en-PH'

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Just the symbol — "₱" — for use as a field prefix. */
export const CURRENCY_SYMBOL =
  currencyFormatter.formatToParts(0).find((part) => part.type === 'currency')?.value ?? ''

/**
 * "₱1,240.50". Pass `signed` to prefix an explicit + or −, which is how the
 * transaction list distinguishes income from expense at a glance.
 */
export function formatCurrency(amount, { signed = false, compact = false } = {}) {
  const formatter = compact ? compactFormatter : currencyFormatter
  const value = formatter.format(Math.abs(amount))
  if (!signed) return formatter.format(amount)
  // U+2212 MINUS SIGN, not a hyphen — it aligns with the digit stroke weight.
  return `${amount < 0 ? '−' : '+'}${value}`
}

/** The signed amount for a transaction: income adds, expense subtracts. */
export function signedAmount(transaction) {
  return transaction.type === 'income' ? transaction.amount : -transaction.amount
}

/** "Today" / "Yesterday" / "Mar 4" — the list-row date treatment. */
export function formatRelativeDate(date) {
  const value = moment(date, 'YYYY-MM-DD')
  if (!value.isValid()) return ''

  const today = moment().startOf('day')
  const days = today.diff(value.clone().startOf('day'), 'days')

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days > 1 && days < 7) return value.format('dddd')
  if (value.isSame(today, 'year')) return value.format('MMM D')
  return value.format('MMM D, YYYY')
}

/** "Tuesday, 4 March 2026" — the detail-screen date treatment. */
export function formatFullDate(date) {
  const value = moment(date, 'YYYY-MM-DD')
  return value.isValid() ? value.format('dddd, D MMMM YYYY') : ''
}

/** "March 2026" — section and summary headings. */
export function formatMonth(date) {
  const value = moment(date, 'YYYY-MM-DD')
  return value.isValid() ? value.format('MMMM YYYY') : ''
}

/** Today as `YYYY-MM-DD`, the storage format used throughout. */
export function today() {
  return moment().format('YYYY-MM-DD')
}

/** Rounds to whole percent for the summary bars, guarding against 0 totals. */
export function percentOf(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}
