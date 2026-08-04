import { useEffect, useRef, useState } from 'react'

/**
 * Exponential ease-out — fast initial jump, long satisfying deceleration.
 * This is the same curve Apple uses for the Stocks and Wallet count-ups.
 */
function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Animates a number from 0 to `target` using `requestAnimationFrame`.
 *
 * Returns the current interpolated value which updates every frame for the
 * duration of the animation. The animation replays from 0 every time the
 * component remounts or when the target changes.
 *
 * @param {number} target    The value to animate towards.
 * @param {number} duration  Animation length in milliseconds (default 1400).
 * @returns {number}         The current animated value.
 */
export function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }

    let start = null

    function tick(timestamp) {
      if (start === null) start = timestamp

      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)

      setValue(target * eased)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        // Snap to exact target to avoid floating-point drift.
        setValue(target)
      }
    }

    // Small delay so the page entrance animation is visible first,
    // then the numbers start rolling.
    const timeout = setTimeout(() => {
      frameRef.current = requestAnimationFrame(tick)
    }, 120)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return value
}
