import {
  IoAddCircle,
  IoAddCircleOutline,
  IoPieChart,
  IoPieChartOutline,
  IoWallet,
  IoWalletOutline,
} from 'react-icons/io5'

/**
 * The app's top-level destinations, shared by the mobile tab bar and the
 * desktop nav so the two can never drift apart.
 *
 * iOS tab bars use an outline glyph for the inactive state and its filled
 * counterpart for the active one, which is why each item carries both.
 */
export const NAV_ITEMS = [
  {
    to: '/',
    label: 'Home',
    title: 'Dashboard',
    Icon: IoWalletOutline,
    IconActive: IoWallet,
  },
  {
    to: '/add',
    label: 'Add',
    title: 'Add Transaction',
    Icon: IoAddCircleOutline,
    IconActive: IoAddCircle,
  },
  {
    to: '/summary',
    label: 'Summary',
    title: 'Summary',
    Icon: IoPieChartOutline,
    IconActive: IoPieChart,
  },
]

/** The compact nav-bar title for a pathname, including the detail route. */
export function titleForPath(pathname) {
  const item = NAV_ITEMS.find((navItem) => navItem.to === pathname)
  if (item) return item.title
  if (pathname.startsWith('/transaction/')) return 'Transaction'
  return 'Ledger'
}
