/**
 * The iOS toggle, at its native 51×31 with a 27pt knob. Apple keeps this green
 * regardless of the app's tint colour, so it stays green here too.
 */
export function Switch({ checked, onChange, label, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300 ease-ios ${
        checked ? 'bg-income' : 'bg-fill-strong'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-ios ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
