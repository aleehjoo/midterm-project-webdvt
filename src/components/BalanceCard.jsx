import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5'
import { formatCurrency } from '../utils/format'

function Stat({ icon: Icon, tone, label, amount }) {
  return (
    <div className="flex flex-1 items-center gap-2.5 px-4 py-3.5">
      <Icon aria-hidden="true" className={`text-[26px] ${tone}`} />
      <div className="min-w-0">
        <p className="text-[13px] text-label-2">{label}</p>
        <p className="tnum truncate text-[17px] font-semibold">{formatCurrency(amount)}</p>
      </div>
    </div>
  )
}

/**
 * The hero of the dashboard: current balance, with the income and expense
 * totals it was derived from sitting underneath.
 */
export function BalanceCard({ totals }) {
  const isNegative = totals.balance < 0

  return (
    <section className="overflow-hidden rounded-group bg-surface">
      <div className="px-5 pt-6 pb-5 text-center">
        <p className="text-[13px] tracking-[0.06em] text-label-2 uppercase">Current Balance</p>
        <p
          className={`tnum mt-1.5 font-display text-[40px] leading-none font-bold tracking-[-0.02em] ${
            isNegative ? 'text-expense' : 'text-label'
          }`}
        >
          {formatCurrency(totals.balance)}
        </p>
      </div>

      <div className="flex border-t border-separator">
        <Stat icon={IoArrowUpCircle} tone="text-income" label="Income" amount={totals.income} />
        <div className="w-px bg-separator" />
        <Stat
          icon={IoArrowDownCircle}
          tone="text-expense"
          label="Expenses"
          amount={totals.expenses}
        />
      </div>
    </section>
  )
}
