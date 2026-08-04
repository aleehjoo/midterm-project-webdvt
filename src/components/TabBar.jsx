import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../data/navigation'

/**
 * The iOS tab bar: fixed to the bottom, translucent, one glyph per
 * destination. Phone-sized viewports only — wider ones get the nav links in
 * the top bar instead.
 */
export function TabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-separator bg-nav backdrop-blur-xl sm:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch pb-safe">
        {NAV_ITEMS.map(({ to, label, Icon, IconActive }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className="flex flex-col items-center gap-0.5 pt-2 pb-1.5 press-sm"
            >
              {({ isActive }) => {
                const Glyph = isActive ? IconActive : Icon
                return (
                  <>
                    <Glyph
                      aria-hidden="true"
                      className={`text-[26px] transition-colors duration-200 ${
                        isActive ? 'text-accent' : 'text-label-2'
                      }`}
                    />
                    <span
                      className={`text-[10px] leading-none font-medium transition-colors duration-200 ${
                        isActive ? 'text-accent' : 'text-label-2'
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
