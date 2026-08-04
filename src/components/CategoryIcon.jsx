const SIZES = {
  sm: 'h-7 w-7 rounded-[7px] text-[15px]',
  md: 'h-9 w-9 rounded-[9px] text-[19px]',
  lg: 'h-12 w-12 rounded-[13px] text-[24px]',
  xl: 'h-16 w-16 rounded-[18px] text-[32px]',
}

/**
 * A category rendered as a rounded, saturated tile — the same shape language as
 * a home-screen app icon, which is what makes a list of them scannable.
 */
export function CategoryIcon({ category, size = 'md', className = '' }) {
  const { Icon, color } = category

  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color }}
      className={`grid shrink-0 place-items-center text-white ${SIZES[size]} ${className}`}
    >
      <Icon />
    </span>
  )
}
