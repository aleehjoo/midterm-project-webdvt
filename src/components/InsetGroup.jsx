/**
 * The inset grouped list from Settings: a rounded card on the grouped
 * background, an optional caption above, and an optional footnote below.
 */
export function InsetGroup({ header, footer, children, className = '' }) {
  return (
    <section className={className}>
      {header ? (
        <h2 className="px-4 pb-1.5 text-[13px] tracking-[0.02em] text-label-2 uppercase">
          {header}
        </h2>
      ) : null}

      <div className="overflow-hidden rounded-group bg-surface">{children}</div>

      {footer ? <p className="px-4 pt-2 text-[13px] leading-snug text-label-2">{footer}</p> : null}
    </section>
  )
}

/**
 * One row of an inset group. `inset` moves the hairline separator inward to
 * line up with the row's label rather than its icon.
 *
 * Pass `as` to render a `<button>`, a router `<Link>`, or anything else — the
 * padding and separator behaviour stay identical either way.
 */
export function GroupRow({ as: Component = 'div', inset, className = '', style, children, ...rest }) {
  return (
    <Component
      {...rest}
      style={inset ? { '--hairline-inset': inset, ...style } : style}
      className={`hairline flex w-full items-center gap-3 px-4 text-left ${className}`}
    >
      {children}
    </Component>
  )
}
