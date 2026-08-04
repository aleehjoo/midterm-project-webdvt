import { useMemo, useState } from 'react'
import {
  IoLogoFacebook,
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoMail,
  IoMoon,
  IoOpenOutline,
  IoPieChartOutline,
  IoTrashOutline,
} from 'react-icons/io5'
import { ActionSheet } from '../components/ActionSheet'
import { DonutChart } from '../components/DonutChart'
import { EmptyState } from '../components/EmptyState'
import { GroupRow, InsetGroup } from '../components/InsetGroup'
import { PageHeader } from '../components/PageHeader'
import { CategoryIcon } from '../components/CategoryIcon'
import { Switch } from '../components/Switch'
import { useTheme } from '../context/ThemeContext'
import { useTransactionStore } from '../context/TransactionsContext'
import { getCategory } from '../data/categories'
import { formatCurrency, percentOf } from '../utils/format'

const CONTACTS = [
  {
    label: 'LinkedIn',
    value: 'alejandro-umila',
    href: 'https://www.linkedin.com/in/alejandro-umila-a33756349/',
    color: '#0A66C2',
    Icon: IoLogoLinkedin,
  },
  {
    label: 'Instagram',
    value: '@adomin.dev',
    href: 'https://www.instagram.com/adomin.dev/',
    color: '#E4405F',
    Icon: IoLogoInstagram,
  },
  {
    label: 'Facebook',
    value: 'alejandro.umila.5',
    href: 'https://www.facebook.com/alejandro.umila.5/',
    color: '#1877F2',
    Icon: IoLogoFacebook,
  },
  {
    label: 'GitHub',
    value: '@aleehjoo',
    href: 'https://github.com/aleehjoo',
    color: '#24292F',
    Icon: IoLogoGithub,
  },
  {
    label: 'Email',
    value: 'umila.alejandro@gmail.com',
    href: 'mailto:umila.alejandro@gmail.com',
    color: '#5856D6',
    Icon: IoMail,
  },
]

/**
 * Spending broken down by category, plus the app-wide appearance control.
 *
 * The theme switch lives here but is read from context at the root, which is
 * what lets it re-theme routes that are not currently mounted.
 */
export function Summary() {
  const { totals, spendingByCategory, clearTransactions } = useTransactionStore()
  const { isDark, setTheme } = useTheme()

  const [isConfirmingErase, setIsConfirmingErase] = useState(false)

  const segments = useMemo(
    () =>
      spendingByCategory.map((entry) => ({
        id: entry.categoryId,
        color: getCategory(entry.categoryId).color,
        share: entry.share,
      })),
    [spendingByCategory],
  )

  const savedShare = totals.income > 0 ? percentOf(totals.balance, totals.income) : 0

  return (
    <>
      <PageHeader title="Summary" subtitle="Where your money goes" />

      <div className="space-y-6">
        {spendingByCategory.length > 0 ? (
          <section className="flex flex-col items-center rounded-group bg-surface px-5 py-7">
            <DonutChart
              segments={segments}
              caption="Total spent"
              value={formatCurrency(totals.expenses, { compact: true })}
            />
            <p className="mt-5 text-center text-[15px] text-label-2">
              Across{' '}
              <span className="font-semibold text-label">
                {spendingByCategory.length}{' '}
                {spendingByCategory.length === 1 ? 'category' : 'categories'}
              </span>
              {totals.income > 0 ? (
                <>
                  {' · '}
                  <span className={savedShare >= 0 ? 'text-income' : 'text-expense'}>
                    {savedShare}% of income kept
                  </span>
                </>
              ) : null}
            </p>
          </section>
        ) : (
          <div className="rounded-group bg-surface">
            <EmptyState
              icon={IoPieChartOutline}
              title="No spending to break down"
              message="Log an expense and the breakdown will appear here."
            />
          </div>
        )}

        {spendingByCategory.length > 0 ? (
          <InsetGroup
            header="By Category"
            footer="Percentages are of total spending, not of income."
          >
            {spendingByCategory.map((entry) => {
              const category = getCategory(entry.categoryId)

              return (
                <GroupRow key={entry.categoryId} inset="3.75rem" className="py-3">
                  <CategoryIcon category={category} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[17px]">{category.label}</span>
                      <span className="tnum shrink-0 text-[17px] font-medium">
                        {formatCurrency(entry.total)}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-fill">
                        <span
                          className="block h-full rounded-full transition-[width] duration-500 ease-ios"
                          style={{
                            width: `${Math.max(entry.share * 100, 2)}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </span>
                      <span className="tnum w-10 shrink-0 text-right text-[13px] text-label-2">
                        {percentOf(entry.total, totals.expenses)}%
                      </span>
                    </div>
                  </div>
                </GroupRow>
              )
            })}
          </InsetGroup>
        ) : null}

        <InsetGroup
          header="Appearance"
          footer="Applies to every screen in the app and is remembered on this device."
        >
          <GroupRow inset="3.75rem" className="py-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-accent text-[19px] text-white">
              <IoMoon aria-hidden="true" />
            </span>
            <span className="flex-1 text-[17px]">Dark Mode</span>
            <Switch
              checked={isDark}
              label="Dark mode"
              onChange={(next) => setTheme(next ? 'dark' : 'light')}
            />
          </GroupRow>
        </InsetGroup>

        <InsetGroup header="About" footer="Built by Alejandro Umila — WEBDVT midterm project.">
          {CONTACTS.map(({ label, value, href, color, Icon }) => (
            <GroupRow
              key={label}
              as="a"
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              inset="3.75rem"
              className="py-2.5 press active:bg-fill"
            >
              <span
                aria-hidden="true"
                style={{ backgroundColor: color }}
                className="grid h-9 w-9 place-items-center rounded-[9px] text-[19px] text-white"
              >
                <Icon />
              </span>
              <span className="flex-1 text-[17px]">{label}</span>
              <span className="max-w-[45%] truncate text-[15px] text-label-2">{value}</span>
              <IoOpenOutline aria-hidden="true" className="shrink-0 text-[16px] text-label-3" />
            </GroupRow>
          ))}
        </InsetGroup>

        <InsetGroup header="Data" footer="Transactions are stored only in this browser.">
          <GroupRow
            as="button"
            type="button"
            onClick={() => setIsConfirmingErase(true)}
            className="py-3 press active:bg-fill"
          >
            <IoTrashOutline aria-hidden="true" className="text-[19px] text-expense" />
            <span className="flex-1 text-[17px] text-expense">Erase All Transactions</span>
          </GroupRow>
        </InsetGroup>
      </div>

      <ActionSheet
        open={isConfirmingErase}
        onClose={() => setIsConfirmingErase(false)}
        title="Erase all transactions?"
        message="Every entry will be removed from this browser. This cannot be undone."
        actions={[
          {
            label: 'Erase Everything',
            destructive: true,
            onSelect: () => {
              clearTransactions()
              setIsConfirmingErase(false)
            },
          },
        ]}
      />
    </>
  )
}
