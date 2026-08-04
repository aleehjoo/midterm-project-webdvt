import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { createSeedTransactions } from '../data/seed'

export const TRANSACTIONS_STORAGE_KEY = 'ledger.transactions'

/** Prefers the platform UUID generator, with a fallback for insecure origins. */
function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `txn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Newest first; ties broken by entry order so same-day edits stay put. */
function byDateDescending(a, b) {
  if (a.date === b.date) return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
  return b.date.localeCompare(a.date)
}

/**
 * Normalises whatever the form hands us into the canonical stored shape, so
 * every consumer can rely on `amount` being a positive number and `date` being
 * a `YYYY-MM-DD` string.
 */
function normalise(input) {
  return {
    type: input.type === 'income' ? 'income' : 'expense',
    title: String(input.title ?? '').trim(),
    categoryId: input.categoryId,
    amount: Math.abs(Number(input.amount) || 0),
    date: input.date,
    note: String(input.note ?? '').trim(),
  }
}

/**
 * The app's transaction store: reading, writing, and deriving totals.
 *
 * This is the project's required custom hook. Every component that touches
 * transactions goes through this one API rather than reaching for localStorage
 * itself, so the persistence format is defined in exactly one place. It is
 * deliberately independent of React Router and of any particular screen — the
 * same hook backs the dashboard, the detail view, the form, and the summary.
 *
 * `TransactionsProvider` calls it once and shares the result through context so
 * all four screens read from a single instance. Calling it directly in a
 * component is still valid and gives that component its own synced copy, which
 * is what makes the hook genuinely reusable rather than a disguised singleton.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage(
    TRANSACTIONS_STORAGE_KEY,
    createSeedTransactions,
  )

  /** Adds a transaction and returns it, so the caller can navigate to it. */
  const addTransaction = useCallback(
    (input) => {
      const transaction = {
        ...normalise(input),
        id: createId(),
        createdAt: new Date().toISOString(),
      }
      setTransactions((current) => [transaction, ...current])
      return transaction
    },
    [setTransactions],
  )

  /** Applies a partial update to one transaction, leaving the rest untouched. */
  const updateTransaction = useCallback(
    (id, changes) => {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === id
            ? { ...transaction, ...normalise({ ...transaction, ...changes }) }
            : transaction,
        ),
      )
    },
    [setTransactions],
  )

  const removeTransaction = useCallback(
    (id) => {
      setTransactions((current) => current.filter((transaction) => transaction.id !== id))
    },
    [setTransactions],
  )

  const clearTransactions = useCallback(() => setTransactions([]), [setTransactions])

  // Sorting once here means no screen has to re-sort, and the memo keeps the
  // array identity stable so memoised list rows are not invalidated by an
  // unrelated re-render.
  const sortedTransactions = useMemo(
    () => [...transactions].sort(byDateDescending),
    [transactions],
  )

  /** Looked up from the sorted list rather than re-scanning storage. */
  const getTransaction = useCallback(
    (id) => sortedTransactions.find((transaction) => transaction.id === id) ?? null,
    [sortedTransactions],
  )

  const totals = useMemo(() => {
    let income = 0
    let expenses = 0

    for (const transaction of transactions) {
      if (transaction.type === 'income') income += transaction.amount
      else expenses += transaction.amount
    }

    return { income, expenses, balance: income - expenses }
  }, [transactions])

  /**
   * Spending per category, largest first — the shape the summary screen needs.
   * Derived here rather than in the screen so the calculation is testable and
   * reusable, and so the summary stays a presentation component.
   */
  const spendingByCategory = useMemo(() => {
    const perCategory = new Map()

    for (const transaction of transactions) {
      if (transaction.type !== 'expense') continue
      const running = perCategory.get(transaction.categoryId) ?? { total: 0, count: 0 }
      running.total += transaction.amount
      running.count += 1
      perCategory.set(transaction.categoryId, running)
    }

    return [...perCategory.entries()]
      .map(([categoryId, { total, count }]) => ({
        categoryId,
        total,
        count,
        share: totals.expenses ? total / totals.expenses : 0,
      }))
      .sort((a, b) => b.total - a.total)
  }, [transactions, totals.expenses])

  // One memoised object, so consumers listed in a dependency array (and the
  // context provider below) do not see a new reference on every render.
  return useMemo(
    () => ({
      transactions: sortedTransactions,
      totals,
      spendingByCategory,
      addTransaction,
      updateTransaction,
      removeTransaction,
      clearTransactions,
      getTransaction,
    }),
    [
      sortedTransactions,
      totals,
      spendingByCategory,
      addTransaction,
      updateTransaction,
      removeTransaction,
      clearTransactions,
      getTransaction,
    ],
  )
}
