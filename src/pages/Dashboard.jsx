import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoAdd, IoFileTrayOutline, IoSearchOutline } from 'react-icons/io5'
import { BalanceCard } from '../components/BalanceCard'
import { EmptyState } from '../components/EmptyState'
import { InsetGroup } from '../components/InsetGroup'
import { PageHeader } from '../components/PageHeader'
import { SegmentedControl } from '../components/SegmentedControl'
import { TransactionRow } from '../components/TransactionRow'
import { useTransactionStore } from '../context/TransactionsContext'
import { CATEGORIES, getCategory } from '../data/categories'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
]

/**
 * Home. Shows the running balance and the full transaction list, filterable by
 * type and by category, with every row linking to its own detail route.
 */
export function Dashboard() {
  const { transactions, totals } = useTransactionStore()

  const [type, setType] = useState('all')
  const [categoryId, setCategoryId] = useState('all')
  const [query, setQuery] = useState('')

  // Only offer categories that something is actually filed under, so the rail
  // never shows a chip that would filter the list down to nothing.
  const availableCategories = useMemo(() => {
    const used = new Set(
      transactions
        .filter((transaction) => type === 'all' || transaction.type === type)
        .map((transaction) => transaction.categoryId),
    )
    return CATEGORIES.filter((category) => used.has(category.id))
  }, [transactions, type])

  // Switching type can strand the category selection on a chip that no longer
  // exists. Resolving it during render avoids an effect and a second paint.
  const activeCategoryId = availableCategories.some((category) => category.id === categoryId)
    ? categoryId
    : 'all'

  /**
   * PERFORMANCE — memoised derived list.
   *
   * This runs on every keystroke in the search field. Memoising it means the
   * array identity only changes when the filters or the underlying data do, so
   * the memoised `TransactionRow`s below keep their props reference-equal and
   * skip re-rendering entirely. Without it, typing one character would rebuild
   * every row in the list.
   */
  const visibleTransactions = useMemo(() => {
    const search = query.trim().toLowerCase()

    return transactions.filter((transaction) => {
      if (type !== 'all' && transaction.type !== type) return false
      if (activeCategoryId !== 'all' && transaction.categoryId !== activeCategoryId) return false
      if (!search) return true

      return (
        transaction.title.toLowerCase().includes(search) ||
        getCategory(transaction.categoryId).label.toLowerCase().includes(search)
      )
    })
  }, [transactions, type, activeCategoryId, query])

  const hasTransactions = transactions.length > 0
  const isFiltered = type !== 'all' || activeCategoryId !== 'all' || query.trim() !== ''

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={
          hasTransactions
            ? `${transactions.length} transaction${transactions.length === 1 ? '' : 's'} recorded`
            : 'Start by logging your first transaction'
        }
        action={
          <Link
            to="/add"
            aria-label="Add transaction"
            className="grid h-9 w-9 place-items-center rounded-full bg-accent text-[22px] text-white press"
          >
            <IoAdd aria-hidden="true" />
          </Link>
        }
      />

      <div className="space-y-5">
        <BalanceCard totals={totals} />

        {hasTransactions ? (
          <div className="space-y-3">
            <label className="flex items-center gap-2 rounded-[10px] bg-fill px-2.5 py-2">
              <IoSearchOutline aria-hidden="true" className="text-[18px] text-label-2" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transactions"
                aria-label="Search transactions"
                className="w-full min-w-0 bg-transparent text-[17px] outline-none placeholder:text-label-2"
              />
            </label>

            <SegmentedControl
              label="Filter by type"
              options={TYPE_OPTIONS}
              value={type}
              onChange={setType}
            />

            {availableCategories.length > 0 ? (
              <div
                role="radiogroup"
                aria-label="Filter by category"
                className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6"
              >
                <CategoryChip
                  label="All Categories"
                  isActive={activeCategoryId === 'all'}
                  onSelect={() => setCategoryId('all')}
                />
                {availableCategories.map((category) => (
                  <CategoryChip
                    key={category.id}
                    label={category.label}
                    color={category.color}
                    isActive={activeCategoryId === category.id}
                    onSelect={() => setCategoryId(category.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleTransactions.length > 0 ? (
          <InsetGroup
            header={isFiltered ? `${visibleTransactions.length} matching` : 'All transactions'}
          >
            {visibleTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </InsetGroup>
        ) : (
          <div className="rounded-group bg-surface">
            <EmptyState
              icon={IoFileTrayOutline}
              title={hasTransactions ? 'No matching transactions' : 'Nothing logged yet'}
              message={
                hasTransactions
                  ? 'Try a different category, type, or search term.'
                  : 'Add an income or expense and it will show up here.'
              }
              action={
                hasTransactions ? (
                  <button
                    type="button"
                    onClick={() => {
                      setType('all')
                      setCategoryId('all')
                      setQuery('')
                    }}
                    className="rounded-full bg-fill px-4 py-2 text-[15px] font-medium text-accent press"
                  >
                    Clear filters
                  </button>
                ) : (
                  <Link
                    to="/add"
                    className="rounded-full bg-accent px-5 py-2.5 text-[15px] font-semibold text-white press"
                  >
                    Add transaction
                  </Link>
                )
              }
            />
          </div>
        )}
      </div>
    </>
  )
}

/** A pill in the horizontally scrolling category rail. */
function CategoryChip({ label, color, isActive, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={onSelect}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-medium whitespace-nowrap transition-colors duration-200 press-sm ${
        isActive ? 'bg-accent text-white' : 'bg-surface text-label-2'
      }`}
    >
      {color ? (
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: isActive ? 'currentColor' : color }}
        />
      ) : null}
      {label}
    </button>
  )
}
