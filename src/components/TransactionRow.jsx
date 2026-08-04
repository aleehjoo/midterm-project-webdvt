import { memo } from 'react'
import { Link } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import { CategoryIcon } from './CategoryIcon'
import { getCategory } from '../data/categories'
import { formatCurrency, formatRelativeDate, signedAmount } from '../utils/format'

function TransactionRowBase({ transaction, index = 0 }) {
  const category = getCategory(transaction.categoryId)
  const isIncome = transaction.type === 'income'

  return (
    <Link
      to={`/transaction/${transaction.id}`}
      style={{
        '--hairline-inset': '3.75rem',
        animationDelay: `${index * 40}ms`,
      }}
      className="hairline flex items-center gap-3 bg-surface px-4 py-2.5 transition-[background-color,transform] duration-200 ease-ios press active:bg-fill hover:bg-fill/60 animate-row-in"
    >
      <CategoryIcon category={category} />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[17px] leading-snug">{transaction.title}</span>
        <span className="block truncate text-[13px] text-label-2">
          {category.label} · {formatRelativeDate(transaction.date)}
        </span>
      </span>

      <span
        className={`tnum shrink-0 text-[17px] font-medium ${isIncome ? 'text-income' : 'text-label'}`}
      >
        {formatCurrency(signedAmount(transaction), { signed: true })}
      </span>

      <IoChevronForward aria-hidden="true" className="shrink-0 text-[16px] text-label-3" />
    </Link>
  )
}

/**
 * PERFORMANCE — memoised list row.
 *
 * The dashboard re-renders on every keystroke in the search field and on every
 * filter change. Without `memo`, each of those renders would rebuild all of the
 * rows, even the ones whose data has not moved: currency and date formatting,
 * a category lookup, and a fresh `<Link>` per row, all thrown away immediately.
 *
 * `transaction` objects are only ever replaced — never mutated in place — by
 * `useTransactions`, so a row's props stay reference-equal unless that specific
 * transaction actually changed. That makes the default shallow comparison
 * enough: filtering a list re-renders only the rows entering or leaving it.
 *
 * See also the `useMemo` over the filtered list in pages/Dashboard.jsx, which
 * is the other half of this optimisation.
 */
export const TransactionRow = memo(TransactionRowBase)
