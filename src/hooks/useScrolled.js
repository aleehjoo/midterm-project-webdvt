import { useEffect, useState } from 'react'

/**
 * True once the window has scrolled past `threshold` pixels.
 *
 * Drives the nav bar's transition from transparent to blurred-with-a-hairline,
 * which is how iOS signals that content has moved underneath the bar.
 */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function check() {
      setScrolled(window.scrollY > threshold)
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [threshold])

  return scrolled
}
