import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { MemberIcon } from './MemberIcons'

type Props = {
  title?: string
  searchTo?: string
}

export function MemberTopBar({ title, searchTo = '/forum/search' }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="member-topbar">
      {title && (
        <h1 className="text-lg font-extrabold text-gray-900 shrink-0 hidden sm:block border-r-2 border-[#b8b8b8] pr-4">
          {title}
        </h1>
      )}
      <form
        className="flex-1 max-w-md"
        onSubmit={(e) => {
          e.preventDefault()
          const q = new FormData(e.currentTarget).get('q')
          navigate(`${searchTo}?q=${encodeURIComponent(String(q ?? ''))}`)
        }}
      >
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <MemberIcon name="search" />
          </span>
          <input
            name="q"
            type="search"
            placeholder="Search discussions, members..."
            className="member-topbar__search"
          />
        </div>
      </form>
      <div className="flex items-center gap-2 ml-auto">
        <Link to="/notifications" className="member-topbar__icon-btn" aria-label="Notifications">
          <MemberIcon name="notifications" />
        </Link>
        <Link to="/messages" className="member-topbar__icon-btn" aria-label="Messages">
          <MemberIcon name="messages" />
        </Link>
        <Link to="/profile" className="member-topbar__profile">
          <div className="member-avatar">
            {(user?.first_name?.[0] ?? user?.username?.[0] ?? '?').toUpperCase()}
          </div>
          <span className="text-sm font-bold text-gray-800 hidden md:inline">
            {user?.first_name || user?.username}
          </span>
        </Link>
      </div>
    </header>
  )
}
