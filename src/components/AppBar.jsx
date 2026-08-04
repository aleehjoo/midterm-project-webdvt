import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IoChevronBack } from 'react-icons/io5'
import { NAV_ITEMS, titleForPath } from '../data/navigation'
import { useScrolled } from '../hooks/useScrolled'

/**
 * The translucent bar pinned to the top of every screen.
 *
 * It is invisible until the page scrolls, at which point the blur, the hairline
 * border, and the compact title fade in together — the transition UIKit runs
 * when a large title scrolls up into the navigation bar.
 */
export function AppBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const scrolled = useScrolled(24)

  const isDetail = pathname.startsWith('/transaction/')
  const title = titleForPath(pathname)

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ease-ios ${
        scrolled
          ? 'border-b border-separator bg-nav backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="relative mx-auto flex h-12 max-w-2xl items-center gap-2 px-2 sm:h-14 sm:px-4">
        {/* Leading: a back affordance on the detail screen, the brand elsewhere. */}
        <div className="flex min-w-0 flex-1 items-center">
          {isDetail ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="-ml-1 flex items-center gap-0.5 rounded-field py-1 pr-2 pl-1 text-[17px] text-accent press-sm"
            >
              <IoChevronBack aria-hidden="true" className="text-[22px]" />
              Back
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2 py-1 press-sm">
              <img src="/favicon.svg" alt="" width="26" height="26" className="rounded-[7px]" />
              <span className="hidden text-[17px] font-semibold tracking-tight sm:inline">
                Ledger
              </span>
            </Link>
          )}
        </div>

        {/* Centre: the compact title, revealed only once the large one is gone. */}
        <h1
          className={`pointer-events-none absolute inset-x-0 mx-auto w-max max-w-[50%] truncate text-center text-[17px] font-semibold transition-opacity duration-200 sm:hidden ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </h1>

        {/* Trailing: the full nav, which replaces the tab bar from sm upwards. */}
        <nav aria-label="Primary" className="hidden flex-1 justify-end sm:flex">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, Icon, IconActive }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[15px] font-medium transition-all duration-200 ease-ios press-sm ${
                      isActive
                        ? 'bg-accent-soft text-accent shadow-[0_0_12px_rgba(88,86,214,0.15)]'
                        : 'text-label-2 hover:bg-fill hover:text-label hover:scale-105'
                    }`
                  }
                >
                  {({ isActive }) => {
                    const Glyph = isActive ? IconActive : Icon
                    return (
                      <>
                        <Glyph aria-hidden="true" className="text-[18px]" />
                        {label}
                      </>
                    )
                  }}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Balances the leading column on mobile so the title stays centred. */}
        <div className="flex-1 sm:hidden" />
      </div>
    </header>
  )
}
