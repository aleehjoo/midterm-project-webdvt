import { useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { THEME_STORAGE_KEY, ThemeContext } from './ThemeContext'

/** Falls back to the operating system setting the first time someone visits. */
function preferredTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Owns the light/dark choice for the entire app.
 *
 * The theme is applied by toggling a single `dark` class on `<html>`, which is
 * what makes the choice global: every screen is styled from the same set of CSS
 * variables, so one class flip re-themes routes that are not even mounted.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, preferredTheme)

  useEffect(() => {
    const isDark = theme === 'dark'
    const root = document.documentElement

    root.classList.toggle('dark', isDark)
    // Tells the browser to render native controls, scrollbars, and form
    // widgets in the matching scheme.
    root.style.colorScheme = isDark ? 'dark' : 'light'

    // Keeps the iOS status bar and Android address bar in step with the app.
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute('content', isDark ? '#000000' : '#F2F2F7')
      meta.removeAttribute('media')
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  // Memoised so a re-render of this provider does not hand every consumer a
  // brand-new object and force them all to re-render along with it.
  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
