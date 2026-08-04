import { createContext, useContext } from 'react'

/** Kept in sync with the pre-paint script in index.html. */
export const THEME_STORAGE_KEY = 'ledger.theme'

export const ThemeContext = createContext(null)

/**
 * Reads the current theme from context.
 *
 * Every component that needs the theme calls this directly, which is the point
 * of using context here: the toggle lives on the Summary screen but the theme
 * itself is consumed at the root and by the nav bar, several levels apart, with
 * no `theme` prop threaded through anything in between.
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error('useTheme must be called inside a <ThemeProvider>.')
  }

  return context
}
