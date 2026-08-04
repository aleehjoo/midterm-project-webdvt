import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from './Button'
import { CategoryIcon } from './CategoryIcon'
import { GroupRow, InsetGroup } from './InsetGroup'
import { SegmentedControl } from './SegmentedControl'
import { categoriesForType, getCategory } from '../data/categories'
import { CURRENCY_SYMBOL, today } from '../utils/format'

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

/**
 * Every required field is enforced here rather than in the markup, so the same
 * rules apply whether a transaction is being created or edited.
 */
const schema = yup.object({
  type: yup.string().oneOf(['income', 'expense']).required(),
  amount: yup
    .number()
    // An empty field arrives as '' and would otherwise cast to NaN, which
    // produces a confusing "must be a number" message instead of "required".
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError('Enter a valid amount')
    .positive('Amount must be greater than zero')
    .required('Amount is required'),
  title: yup
    .string()
    .trim()
    .required('Description is required')
    .max(60, 'Keep the description under 60 characters'),
  categoryId: yup.string().required('Choose a category'),
  date: yup.string().required('Date is required'),
  note: yup.string().trim().max(200, 'Keep the note under 200 characters'),
})

function FieldError({ children }) {
  if (!children) return null
  return <p className="px-4 pt-2 text-[13px] text-expense">{children}</p>
}

/**
 * The shared add/edit form.
 *
 * The Add screen and the Detail screen's edit mode render this same component,
 * so the validation rules, the category picker, and the field layout can only
 * ever be defined once.
 */
export function TransactionForm({ defaultValues, submitLabel = 'Save', onSubmit, onCancel }) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      amount: '',
      title: '',
      categoryId: '',
      date: today(),
      note: '',
      ...defaultValues,
    },
  })

  // `useWatch` subscribes to just these two fields, so typing in the amount or
  // note does not re-render the whole form along with the category grid.
  const type = useWatch({ control, name: 'type' })
  const categoryId = useWatch({ control, name: 'categoryId' })

  const categories = useMemo(() => categoriesForType(type), [type])

  /** Switching type invalidates a category belonging to the other type. */
  function handleTypeChange(nextType) {
    setValue('type', nextType)

    const current = getValues('categoryId')
    if (current && getCategory(current).type !== nextType) {
      setValue('categoryId', '')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <SegmentedControl
        label="Transaction type"
        options={TYPE_OPTIONS}
        value={type}
        onChange={handleTypeChange}
      />

      {/* Amount leads the form and is sized like the Wallet app's keypad total. */}
      <div>
        <div className="rounded-group bg-surface px-4 py-7">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-display text-[30px] font-semibold text-label-2">
              {CURRENCY_SYMBOL}
            </span>
            <input
              {...register('amount')}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              aria-label="Amount"
              aria-invalid={Boolean(errors.amount)}
              className="tnum w-[8ch] bg-transparent text-center font-display text-[48px] leading-none font-bold tracking-[-0.02em] outline-none placeholder:text-label-3"
            />
          </div>
        </div>
        <FieldError>{errors.amount?.message}</FieldError>
      </div>

      <div>
        <InsetGroup header="Details">
          <GroupRow inset="7.5rem" className="py-3">
            <label htmlFor="title" className="w-28 shrink-0 text-[17px]">
              Description
            </label>
            <input
              id="title"
              {...register('title')}
              type="text"
              autoComplete="off"
              placeholder="Coffee with a friend"
              aria-invalid={Boolean(errors.title)}
              className="min-w-0 flex-1 bg-transparent text-right text-[17px] outline-none placeholder:text-label-3"
            />
          </GroupRow>

          <GroupRow inset="7.5rem" className="py-3">
            <label htmlFor="date" className="w-28 shrink-0 text-[17px]">
              Date
            </label>
            <input
              id="date"
              {...register('date')}
              type="date"
              aria-invalid={Boolean(errors.date)}
              className="min-w-0 flex-1 bg-transparent text-right text-[17px] outline-none"
            />
          </GroupRow>
        </InsetGroup>
        <FieldError>{errors.title?.message ?? errors.date?.message}</FieldError>
      </div>

      <div>
        <h2 className="px-4 pb-1.5 text-[13px] tracking-[0.02em] text-label-2 uppercase">
          Category
        </h2>

        <div className="grid grid-cols-4 gap-x-2 gap-y-4 rounded-group bg-surface p-4 sm:grid-cols-5">
          {categories.map((category) => {
            const isSelected = category.id === categoryId

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setValue('categoryId', category.id, { shouldValidate: true })}
                className="flex flex-col items-center gap-1.5 press-sm"
              >
                <span
                  className={`rounded-[17px] p-[3px] transition-colors duration-200 ${
                    isSelected ? 'bg-accent' : 'bg-transparent'
                  }`}
                >
                  <CategoryIcon category={category} size="lg" />
                </span>
                <span
                  className={`text-center text-[11px] leading-tight transition-colors duration-200 ${
                    isSelected ? 'font-semibold text-accent' : 'text-label-2'
                  }`}
                >
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
        <FieldError>{errors.categoryId?.message}</FieldError>
      </div>

      <div>
        <InsetGroup header="Note" footer="Optional — anything worth remembering later.">
          <div className="px-4 py-3">
            <textarea
              {...register('note')}
              rows={3}
              placeholder="Add a note"
              className="w-full resize-none bg-transparent text-[17px] outline-none placeholder:text-label-3"
            />
          </div>
        </InsetGroup>
        <FieldError>{errors.note?.message}</FieldError>
      </div>

      <div className="space-y-3">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>

        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
