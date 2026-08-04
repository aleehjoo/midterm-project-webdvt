import { Link } from 'react-router-dom'
import { IoCompassOutline } from 'react-icons/io5'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'

export function NotFound() {
  return (
    <>
      <PageHeader title="Page Not Found" />
      <div className="rounded-group bg-surface">
        <EmptyState
          icon={IoCompassOutline}
          title="There is nothing at this address"
          message="The page you were looking for does not exist."
          action={
            <Link
              to="/"
              className="rounded-full bg-accent px-5 py-2.5 text-[15px] font-semibold text-white press"
            >
              Back to Dashboard
            </Link>
          }
        />
      </div>
    </>
  )
}
