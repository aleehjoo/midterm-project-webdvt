import { useEffect } from 'react'

/**
 * The iOS action sheet: options rise from the bottom edge on a blurred panel,
 * with Cancel detached below and destructive choices set in red.
 *
 * @param {{label: string, onSelect: Function, destructive?: boolean}[]} actions
 */
export function ActionSheet({ open, onClose, title, message, actions = [], cancelLabel = 'Cancel' }) {
  // Escape dismisses, and the page behind stops scrolling while it is up.
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md p-2 pb-safe animate-sheet-in">
        <div className="overflow-hidden rounded-[13px] bg-nav backdrop-blur-2xl">
          {title || message ? (
            <div className="hairline px-6 py-3.5 text-center" style={{ '--hairline-inset': '0px' }}>
              {title ? <p className="text-[13px] font-semibold text-label-2">{title}</p> : null}
              {message ? <p className="mt-0.5 text-[13px] text-label-2">{message}</p> : null}
            </div>
          ) : null}

          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onSelect}
              style={{ '--hairline-inset': '0px' }}
              className={`hairline w-full px-4 py-3.5 text-[20px] transition-colors duration-150 active:bg-fill ${
                action.destructive ? 'text-expense' : 'text-accent'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-[13px] bg-surface px-4 py-3.5 text-[20px] font-semibold text-accent press"
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  )
}
