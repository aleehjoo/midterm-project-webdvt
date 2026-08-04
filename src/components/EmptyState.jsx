/**
 * The placeholder shown when a list has nothing in it — a muted glyph, a short
 * explanation, and an optional way out.
 */
export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {Icon ? <Icon aria-hidden="true" className="mb-4 text-[44px] text-label-3" /> : null}
      <p className="text-[17px] font-semibold">{title}</p>
      {message ? <p className="mt-1 max-w-xs text-[15px] text-label-2">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
