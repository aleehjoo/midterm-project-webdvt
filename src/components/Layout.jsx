import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppBar } from './AppBar'
import { TabBar } from './TabBar'

/**
 * The persistent shell every route renders inside: translucent bar on top,
 * tab bar along the bottom on phones, and a centred reading column between.
 */
export function Layout() {
  const { pathname } = useLocation()

  // A push in a native app always lands at the top of the new screen.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-dvh bg-canvas">
      <AppBar />

      {/* Keying on the pathname replays the entrance transition on every
          navigation, which reads as a screen push rather than a swap.

          `motion-safe` matters here beyond preference: the animation starts at
          opacity 0, so anywhere animations do not run it must not apply at all
          or the page would stay invisible. */}
      <main
        key={pathname}
        className="mx-auto w-full max-w-2xl px-4 pb-28 motion-safe:animate-slide-up sm:px-6 sm:pb-16"
      >
        <Outlet />
      </main>

      <TabBar />
    </div>
  )
}
