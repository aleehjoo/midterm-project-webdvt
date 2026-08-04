import {
  IoAirplane,
  IoBag,
  IoBriefcase,
  IoCarSport,
  IoCart,
  IoEllipsisHorizontal,
  IoFitness,
  IoFlash,
  IoGameController,
  IoGift,
  IoHome,
  IoLaptop,
  IoRestaurant,
  IoSchool,
  IoTrendingUp,
} from 'react-icons/io5'

/**
 * Categories a transaction can be filed under.
 *
 * Colours are taken straight from the iOS system palette so the category tiles
 * read as native app icons. `Icon` is a component, not a string, so a category
 * renders itself without any lookup table at the call site.
 */
export const CATEGORIES = [
  // ── Expense ──────────────────────────────────────────────────────────────
  { id: 'food', label: 'Food & Drink', type: 'expense', color: '#FF9500', Icon: IoRestaurant },
  { id: 'groceries', label: 'Groceries', type: 'expense', color: '#34C759', Icon: IoCart },
  { id: 'transport', label: 'Transport', type: 'expense', color: '#007AFF', Icon: IoCarSport },
  { id: 'housing', label: 'Housing', type: 'expense', color: '#A2845E', Icon: IoHome },
  { id: 'shopping', label: 'Shopping', type: 'expense', color: '#FF2D55', Icon: IoBag },
  { id: 'health', label: 'Health', type: 'expense', color: '#FF3B30', Icon: IoFitness },
  {
    id: 'entertainment',
    label: 'Entertainment',
    type: 'expense',
    color: '#AF52DE',
    Icon: IoGameController,
  },
  { id: 'bills', label: 'Bills & Utilities', type: 'expense', color: '#30B0C7', Icon: IoFlash },
  { id: 'education', label: 'Education', type: 'expense', color: '#5856D6', Icon: IoSchool },
  { id: 'travel', label: 'Travel', type: 'expense', color: '#32ADE6', Icon: IoAirplane },
  {
    id: 'other-expense',
    label: 'Other',
    type: 'expense',
    color: '#8E8E93',
    Icon: IoEllipsisHorizontal,
  },

  // ── Income ───────────────────────────────────────────────────────────────
  { id: 'salary', label: 'Salary', type: 'income', color: '#34C759', Icon: IoBriefcase },
  { id: 'freelance', label: 'Freelance', type: 'income', color: '#00C7BE', Icon: IoLaptop },
  { id: 'investments', label: 'Investments', type: 'income', color: '#007AFF', Icon: IoTrendingUp },
  { id: 'gifts', label: 'Gifts', type: 'income', color: '#FF2D55', Icon: IoGift },
  {
    id: 'other-income',
    label: 'Other',
    type: 'income',
    color: '#8E8E93',
    Icon: IoEllipsisHorizontal,
  },
]

/** Stand-in for a category id that no longer exists, so the UI never blanks. */
export const UNKNOWN_CATEGORY = {
  id: 'unknown',
  label: 'Uncategorised',
  type: 'expense',
  color: '#8E8E93',
  Icon: IoEllipsisHorizontal,
}

const CATEGORY_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]))

/** Looks a category up by id, always returning something renderable. */
export function getCategory(id) {
  return CATEGORY_BY_ID.get(id) ?? UNKNOWN_CATEGORY
}

/** The categories offered for a given transaction type. */
export function categoriesForType(type) {
  return CATEGORIES.filter((category) => category.type === type)
}
