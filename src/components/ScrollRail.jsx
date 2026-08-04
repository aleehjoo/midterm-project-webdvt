import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A horizontal scroll rail that works on every input method:
 *
 * - **Touch** — native momentum scroll (the default).
 * - **Mouse drag** — click-and-drag scrolls the rail, with a grab cursor.
 * - **Wheel** — vertical wheel is translated into horizontal scroll.
 * - **Fade edges** — subtle gradient masks hint that more content exists on
 *   either side, disappearing when the rail reaches an edge.
 *
 * Drop this around any overflow-x container to make it usable on desktops that
 * have no touchpad gesture support.
 */
export function ScrollRail({ children, className = '' }) {
  const railRef = useRef(null)
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0, hasMoved: false })

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // ── Overflow detection ──────────────────────────────────────────────────
  const updateEdges = useCallback(() => {
    const el = railRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 2)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return

    updateEdges()

    // ResizeObserver catches container resizes and content changes.
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)

    el.addEventListener('scroll', updateEdges, { passive: true })

    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', updateEdges)
    }
  }, [updateEdges])

  // ── Mouse-drag scrolling ────────────────────────────────────────────────
  function handlePointerDown(event) {
    // Only the primary button; ignore touch (handled natively).
    if (event.pointerType === 'touch' || event.button !== 0) return

    const el = railRef.current
    if (!el) return

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
      hasMoved: false,
    }

    el.setPointerCapture(event.pointerId)
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }

  function handlePointerMove(event) {
    if (!dragState.current.isDragging) return

    const dx = event.clientX - dragState.current.startX
    if (Math.abs(dx) > 3) dragState.current.hasMoved = true

    const el = railRef.current
    if (el) el.scrollLeft = dragState.current.scrollLeft - dx
  }

  function handlePointerUp(event) {
    if (!dragState.current.isDragging) return
    dragState.current.isDragging = false

    const el = railRef.current
    if (el) {
      el.releasePointerCapture(event.pointerId)
      el.style.cursor = ''
      el.style.userSelect = ''
    }

    // If the pointer moved, swallow the subsequent click so the chip under
    // the cursor is not accidentally selected at the end of a drag.
    if (dragState.current.hasMoved) {
      const suppress = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
      el?.addEventListener('click', suppress, { capture: true, once: true })
    }
  }

  // ── Wheel → horizontal scroll ──────────────────────────────────────────
  function handleWheel(event) {
    const el = railRef.current
    if (!el) return

    // Only hijack when there is something to scroll and the shift key is
    // not already held (which natively scrolls horizontally).
    if (el.scrollWidth <= el.clientWidth) return
    if (event.shiftKey) return

    // Prefer deltaY (normal vertical wheel) but fall back to deltaX.
    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ? event.deltaY
      : event.deltaX

    if (delta === 0) return

    event.preventDefault()
    el.scrollLeft += delta
  }

  return (
    <div className={`scroll-rail relative ${className}`}>
      {/* Left fade */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-canvas to-transparent transition-opacity duration-200 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={railRef}
        className="no-scrollbar flex gap-2 overflow-x-auto cursor-grab"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {children}
      </div>

      {/* Right fade */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-canvas to-transparent transition-opacity duration-200 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
