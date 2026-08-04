const VARIANTS = {
  primary: 'bg-accent text-white',
  secondary: 'bg-fill text-accent',
  destructive: 'bg-surface text-expense',
  plain: 'text-accent',
}

/**
 * A full-width iOS action button. `destructive` is the red treatment Apple
 * reserves for irreversible actions such as delete.
 */
export function Button({ variant = 'primary', className = '', type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`w-full rounded-field px-4 py-3.5 text-[17px] font-semibold press disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}
