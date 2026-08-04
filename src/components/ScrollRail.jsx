import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A horizontal scroll rail that works on every input method:
 *
 * - **Touch** — native momentum scroll (the default).
 * - **Mouse drag** — click-and-drag scrolls the rail, with a grab cursor when dragging.
 * - **Wheel** — vertical wheel is translated into horizontal scroll.
 * - **Fade edges** — subtle gradient masks hint that more content exists on
 *   either side, disappearing when the rail reaches an edge.
 *
 * Designed so normal clicks on child elements (like category buttons) pass
 * through cleanly without being intercepted by pointer capture.
 */
export function ScrollRail({ children, className = '' }) {
  const railRef = useRef(null)
  const dragState = useRef({
    isMouseDown: false,
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: undefined,
  })

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
    // Only primary button; ignore touch (handled natively).
    if (event.pointerType === 'touch' || event.button !== 0) return

    const el = railRef.current
    if (!el) return

    dragState.current = {
      isMouseDown: true,
      isDragging: false,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: event.pointerId,
    }
  }

  function handlePointerMove(event) {
    const { isMouseDown, startX, scrollLeft, isDragging } = dragState.current
    if (!isMouseDown) return

    const dx = event.clientX - startX

    // Only initiate drag mode if mouse moved more than 5px.
    // This leaves simple clicks 100% untouched for child buttons.
    if (!isDragging && Math.abs(dx) > 5) {
      dragState.current.isDragging = true
      const el = railRef.current
      if (el) {
        try {
          el.setPointerCapture(event.pointerId)
        } catch {
          // Fallback if browser doesn't support capture
        }
        el.style.cursor = 'grabbing'
        el.style.userSelect = 'none'
      }
    }

    if (dragState.current.isDragging) {
      const el = railRef.current
      if (el) el.scrollLeft = scrollLeft - dx
    }
  }

  function handlePointerUp(event) {
    const { isDragging, pointerId } = dragState.current
    dragState.current.isMouseDown = false

    const el = railRef.current
    if (el) {
      el.style.cursor = ''
      el.style.userSelect = ''
      if (isDragging && pointerId !== undefined) {
        try {
          el.releasePointerCapture(pointerId)
        } catch {
          // Ignore release errors if pointer wasn't captured
        }
      }
    }

    // If we were actually dragging, swallow the trailing click event
    // so the button under the mouse isn't accidentally clicked on release.
    if (isDragging) {
      const suppress = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
      el?.addEventListener('click', suppress, { capture: true, once: true })
    }

    dragState.current.isDragging = false
  }

  // ── Wheel → horizontal scroll ──────────────────────────────────────────
  function handleWheel(event) {
    const el = railRef.current
    if (!el) return

    if (el.scrollWidth <= el.clientWidth) return
    if (event.shiftKey) return

    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX

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
