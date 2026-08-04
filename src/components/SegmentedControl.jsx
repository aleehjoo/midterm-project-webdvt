/**
 * The iOS segmented control: a recessed track with a raised thumb that slides
 * between options rather than the options themselves changing colour.
 *
 * @param {{value: string, label: string}[]} options
 */
export function SegmentedControl({ options, value, onChange, label, className = '' }) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`relative flex rounded-[9px] bg-fill p-0.5 ${className}`}
    >
      {/* The thumb. Its width is one slot, so translating by whole multiples of
          its own width lands it exactly on each option. */}
      <span
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 left-0.5 rounded-[7px] bg-surface shadow-[0_3px_8px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-ios"
        style={{
          width: `calc((100% - 0.25rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex-1 rounded-[7px] px-3 py-1.5 text-[13px] font-semibold transition-colors duration-200 ${
              isActive ? 'text-label' : 'text-label-2'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
