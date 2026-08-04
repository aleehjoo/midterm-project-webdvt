import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Resolves a value that may have been supplied as a lazy initialiser.
 */
function resolveInitial(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue
}

/**
 * Reads a JSON value out of localStorage, falling back cleanly when the key is
 * absent, the payload is corrupt, or storage is unavailable (Safari private
 * browsing throws on access rather than returning null).
 */
function readFromStorage(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return resolveInitial(initialValue)
    return JSON.parse(raw)
  } catch {
    return resolveInitial(initialValue)
  }
}

/**
 * `useState`, but the value survives reloads.
 *
 * This is the low-level persistence primitive for the whole app. It knows about
 * localStorage and nothing else — no notion of transactions, themes, or any
 * other domain concept — which is what lets `useTransactions` and
 * `ThemeProvider` both build on it without duplicating any storage code.
 *
 * @param {string} key                 localStorage key to read and write.
 * @param {*|Function} initialValue    Value (or lazy initialiser) used when
 *                                     nothing is stored yet.
 * @returns {[*, Function]}            A `[value, setValue]` pair. `setValue`
 *                                     accepts a value or an updater function,
 *                                     exactly like `useState`.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readFromStorage(key, initialValue))

  // Held in a ref so the `storage` listener below can be registered once per
  // key instead of being torn down and rebuilt on every value change.
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  // Persist on every change. Writing on the very first render is intentional:
  // it commits seed data so a fresh visitor's starting state is durable.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Quota exceeded or storage disabled — the app stays fully usable for
      // this session, it just will not survive a reload.
    }
  }, [key, value])

  // Keep duplicate tabs consistent. `storage` fires only in *other* tabs, so
  // there is no feedback loop with the effect above.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== key || event.storageArea !== window.localStorage) return
      setValue(readFromStorage(key, valueRef.current))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  // Stable identity, so consumers can safely list it in dependency arrays.
  const setStoredValue = useCallback((next) => setValue(next), [])

  return [value, setStoredValue]
}
