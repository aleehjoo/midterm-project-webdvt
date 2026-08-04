import moment from 'moment'

/**
 * Placeholder transactions used only on a visitor's very first load, so the
 * dashboard and summary have something to show before anything is entered.
 * Once the user adds, edits, or deletes anything the stored list takes over and
 * this is never consulted again.
 *
 * Dates are generated relative to today so the sample data never looks stale.
 */
export function createSeedTransactions() {
  const daysAgo = (n) => moment().subtract(n, 'days').format('YYYY-MM-DD')

  const entries = [
    { type: 'income', title: 'Monthly salary', categoryId: 'salary', amount: 32000, day: 12 },
    {
      type: 'income',
      title: 'Landing page project',
      categoryId: 'freelance',
      amount: 8500,
      day: 6,
      note: 'Second milestone payment.',
    },
    { type: 'expense', title: 'Apartment rent', categoryId: 'housing', amount: 11000, day: 11 },
    { type: 'expense', title: 'Weekly groceries', categoryId: 'groceries', amount: 2480.5, day: 9 },
    { type: 'expense', title: 'Electricity bill', categoryId: 'bills', amount: 1875, day: 8 },
    { type: 'expense', title: 'Bus and jeepney fare', categoryId: 'transport', amount: 640, day: 5 },
    {
      type: 'expense',
      title: 'Dinner with friends',
      categoryId: 'food',
      amount: 1150,
      day: 4,
      note: 'Split five ways.',
    },
    { type: 'expense', title: 'Streaming subscription', categoryId: 'entertainment', amount: 549, day: 3 },
    { type: 'expense', title: 'Running shoes', categoryId: 'shopping', amount: 3299, day: 2 },
    { type: 'expense', title: 'Coffee and pastry', categoryId: 'food', amount: 285, day: 0 },
  ]

  return entries.map(({ day, note = '', ...entry }, index) => ({
    ...entry,
    id: `seed-${index + 1}`,
    date: daysAgo(day),
    note,
    createdAt: moment().subtract(day, 'days').toISOString(),
  }))
}
