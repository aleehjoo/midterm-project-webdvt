import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { TransactionForm } from '../components/TransactionForm'
import { useTransactionStore } from '../context/TransactionsContext'

/**
 * Logs a new transaction. Validation is handled by the shared form; on success
 * the entry is committed to storage and the user is returned to the dashboard.
 */
export function AddTransaction() {
  const { addTransaction } = useTransactionStore()
  const navigate = useNavigate()

  function handleSubmit(values) {
    addTransaction(values)
    // `replace` keeps the form out of history, so Back from the dashboard does
    // not drop the user into a form they have already submitted.
    navigate('/', { replace: true })
  }

  return (
    <>
      <PageHeader title="Add Transaction" subtitle="Log income or an expense" />
      <TransactionForm submitLabel="Save Transaction" onSubmit={handleSubmit} />
    </>
  )
}
