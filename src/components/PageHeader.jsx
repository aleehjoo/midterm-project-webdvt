/**
 * The large title that opens every screen, with an optional trailing control.
 *
 * On iOS this title is the anchor of the screen: it sits in the content, scrolls
 * away with it, and hands off to the compact title in the nav bar.
 */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 pt-2 pb-5 sm:pt-4">
      <div className="min-w-0">
        <h1 className="font-display text-[34px] leading-[1.08] font-bold tracking-[-0.022em]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1.5 text-[15px] text-label-2">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0 pb-1">{action}</div> : null}
    </div>
  )
}
