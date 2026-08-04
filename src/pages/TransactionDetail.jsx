import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { IoAlertCircle } from 'react-icons/io5'
import { ActionSheet } from '../components/ActionSheet'
import { Button } from '../components/Button'
import { CategoryIcon } from '../components/CategoryIcon'
import { EmptyState } from '../components/EmptyState'
import { GroupRow, InsetGroup } from '../components/InsetGroup'
import { PageHeader } from '../components/PageHeader'
import { TransactionForm } from '../components/TransactionForm'
import { useTransactionStore } from '../context/TransactionsContext'
import { getCategory } from '../data/categories'
import { formatCurrency, formatFullDate, signedAmount } from '../utils/format'

/** A label/value pair in the details group. */
function DetailRow({ label, children }) {
  return (
    <GroupRow className="min-h-11 py-3">
      <span className="shrink-0 text-[17px]">{label}</span>
      <span className="min-w-0 flex-1 text-right text-[17px] text-label-2">{children}</span>
    </GroupRow>
  )
}

/**
 * One transaction at its own URL. Supports editing in place and deleting behind
 * a confirmation sheet.
 */
export function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTransaction, updateTransaction, removeTransaction } = useTransactionStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const transaction = getTransaction(id)

  // Reachable by bookmarking a transaction and then deleting it elsewhere.
  if (!transaction) {
    return (
      <>
        <PageHeader title="Not Found" />
        <div className="rounded-group bg-surface">
          <EmptyState
            icon={IoAlertCircle}
            title="This transaction no longer exists"
            message="It may have been deleted, or the link may be wrong."
            action={
              <Link
                to="/"
                className="rounded-full bg-accent px-5 py-2.5 text-[15px] font-semibold text-white press"
              >
                Back to Dashboard
              </Link>
            }
          />
        </div>
      </>
    )
  }

  const category = getCategory(transaction.categoryId)
  const isIncome = transaction.type === 'income'

  function handleSave(values) {
    updateTransaction(transaction.id, values)
    setIsEditing(false)
  }

  function handleDelete() {
    setIsConfirmingDelete(false)
    removeTransaction(transaction.id)
    navigate('/', { replace: true })
  }

  if (isEditing) {
    return (
      <>
        <PageHeader title="Edit Transaction" subtitle={transaction.title} />
        <TransactionForm
          defaultValues={{
            type: transaction.type,
            amount: String(transaction.amount),
            title: transaction.title,
            categoryId: transaction.categoryId,
            date: transaction.date,
            note: transaction.note ?? '',
          }}
          submitLabel="Save Changes"
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title="Transaction" />

      <div className="space-y-6">
        {/* Hero: what it was, and how much it moved. */}
        <section className="flex flex-col items-center rounded-group bg-surface px-5 py-8 text-center">
          <CategoryIcon category={category} size="xl" />
          <h2 className="mt-4 text-[22px] font-semibold tracking-tight">{transaction.title}</h2>
          <p
            className={`tnum mt-1 font-display text-[34px] leading-tight font-bold tracking-[-0.02em] ${
              isIncome ? 'text-income' : 'text-label'
            }`}
          >
            {formatCurrency(signedAmount(transaction), { signed: true })}
          </p>
          <p className="mt-1 text-[15px] text-label-2">{formatFullDate(transaction.date)}</p>
        </section>

        <InsetGroup header="Details">
          <DetailRow label="Type">
            <span className={isIncome ? 'text-income' : 'text-expense'}>
              {isIncome ? 'Income' : 'Expense'}
            </span>
          </DetailRow>

          <DetailRow label="Category">
            <span className="inline-flex items-center gap-2">
              <CategoryIcon category={category} size="sm" />
              {category.label}
            </span>
          </DetailRow>

          <DetailRow label="Amount">
            <span className="tnum">{formatCurrency(transaction.amount)}</span>
          </DetailRow>

          <DetailRow label="Date">{formatFullDate(transaction.date)}</DetailRow>
        </InsetGroup>

        <InsetGroup header="Note">
          <div className="px-4 py-3">
            <p className="text-[17px] leading-relaxed whitespace-pre-wrap text-label-2">
              {transaction.note?.trim() ? transaction.note : 'No note added.'}
            </p>
          </div>
        </InsetGroup>

        <div className="space-y-3">
          <Button onClick={() => setIsEditing(true)}>Edit Transaction</Button>
          <Button variant="destructive" onClick={() => setIsConfirmingDelete(true)}>
            Delete Transaction
          </Button>
        </div>

        {transaction.createdAt ? (
          <p className="pb-2 text-center text-[13px] text-label-3">
            Added {moment(transaction.createdAt).format('D MMM YYYY [at] h:mm A')}
          </p>
        ) : null}
      </div>

      <ActionSheet
        open={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        title="Delete this transaction?"
        message="This cannot be undone."
        actions={[{ label: 'Delete', destructive: true, onSelect: handleDelete }]}
      />
    </>
  )
}
