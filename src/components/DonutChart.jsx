/**
 * A ring chart of proportional segments.
 *
 * Each arc is a circle with `pathLength="100"`, which lets the dash array be
 * written directly in percent instead of being derived from the radius. The
 * group is rotated a quarter turn so the first segment starts at twelve
 * o'clock, the way Apple's own ring charts do.
 *
 * @param {{id: string, color: string, share: number}[]} segments  shares sum to 1
 */
export function DonutChart({ segments, size = 180, thickness = 24, caption, value }) {
  const radius = 50 - thickness / 4

  // Each arc needs to know where the previous ones ended, so the running total
  // is folded into the list up front rather than mutated while rendering.
  const arcs = segments.reduce((placed, segment) => {
    const previous = placed[placed.length - 1]
    const start = previous ? previous.start + previous.share : 0
    return [...placed, { ...segment, start }]
  }, [])

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="presentation">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-fill)"
          strokeWidth={thickness / 2}
        />

        {arcs.map((arc, index) => {
          const length = Math.max(arc.share * 100, 0)

          return (
            <circle
              key={arc.id}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness / 2}
              pathLength="100"
              strokeDasharray={`${length} ${100 - length}`}
              strokeDashoffset={-arc.start * 100}
              className="animate-draw-ring"
              style={{ animationDelay: `${index * 120}ms` }}
            />
          )
        })}
      </svg>

      {/* The ring's hole carries the headline figure. */}
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          {caption ? <p className="text-[12px] text-label-2">{caption}</p> : null}
          {value ? (
            <p className="tnum font-display text-[20px] font-bold tracking-tight">{value}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
