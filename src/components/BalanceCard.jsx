import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5'
import { useCountUp } from '../hooks/useCountUp'
import { formatCurrency } from '../utils/format'

function Stat({ icon: Icon, tone, label, amount }) {
  const animated = useCountUp(amount, 1200)

  return (
    <div className="flex flex-1 items-center gap-2.5 px-4 py-3.5">
      <Icon aria-hidden="true" className={`text-[26px] ${tone}`} />
      <div className="min-w-0">
        <p className="text-[13px] text-label-2">{label}</p>
        <p className="tnum truncate text-[17px] font-semibold">{formatCurrency(animated)}</p>
      </div>
    </div>
  )
}

/**
 * The hero of the dashboard: current balance, with the income and expense
 * totals it was derived from sitting underneath.
 *
 * All three figures count up from zero on every navigation, matching the
 * premium feel of Apple's Wallet app. The shimmer-glow animation on the card
 * fires simultaneously to draw the eye.
 */
export function BalanceCard({ totals }) {
  const animatedBalance = useCountUp(totals.balance, 1400)
  const isNegative = totals.balance < 0

  return (
    <section className="overflow-hidden rounded-group bg-surface motion-safe:animate-shimmer-glow">
      <div className="px-5 pt-6 pb-5 text-center">
        <p className="text-[13px] tracking-[0.06em] text-label-2 uppercase">Current Balance</p>
        <p
          className={`tnum mt-1.5 font-display text-[40px] leading-none font-bold tracking-[-0.02em] ${
            isNegative ? 'text-expense' : 'text-label'
          }`}
        >
          {formatCurrency(animatedBalance)}
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
