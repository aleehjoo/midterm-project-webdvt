import { useTransactions } from '../hooks/useTransactions'
import { TransactionsContext } from './TransactionsContext'

/**
 * Shares one instance of the `useTransactions` hook with the whole app.
 *
 * Without this, adding a transaction on `/add` would not appear on `/` until a
 * reload, because each screen would be holding its own copy of the list.
 *
 * The hook already returns a memoised object, so no extra `useMemo` is needed
 * here — the value only changes identity when the data behind it actually does.
 */
export function TransactionsProvider({ children }) {
  const store = useTransactions()

  return <TransactionsContext.Provider value={store}>{children}</TransactionsContext.Provider>
}
