import { createContext, useContext } from 'react'

export const TransactionsContext = createContext(null)

/**
 * Reads the shared transaction store.
 *
 * This is a thin wrapper over the `useTransactions` custom hook: the provider
 * calls the hook once and publishes the result here, so all four screens read
 * and write the same list instead of each holding an independent copy.
 */
export function useTransactionStore() {
  const context = useContext(TransactionsContext)

  if (context === null) {
    throw new Error('useTransactionStore must be called inside a <TransactionsProvider>.')
  }

  return context
}
