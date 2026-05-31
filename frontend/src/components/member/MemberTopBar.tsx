import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { MemberIcon } from './MemberIcons'

type Props = {
  title?: string
  searchTo?: string
}

export function MemberTopBar({ title, searchTo = '/forum/search' }: Props) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="h-16 flex items-center gap-4 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors">
      {title && (
        <h1 className="text-lg font-bold text-slate-900 dark:text-white shrink-0 hidden sm:block border-r border-slate-200 dark:border-slate-800 pr-6">
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
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <MemberIcon name="search" />
          </span>
          <input
            name="q"
            type="search"
            placeholder="Search discussions, members..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </form>
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
        <Link 
          to="/notifications" 
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all" 
          aria-label="Notifications"
        >
          <MemberIcon name="notifications" />
        </Link>
        <Link 
          to="/messages" 
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all" 
          aria-label="Messages"
        >
          <MemberIcon name="messages" />
        </Link>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
        <Link 
          to="/profile" 
          className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
            {(user?.first_name?.[0] ?? user?.username?.[0] ?? '?').toUpperCase()}
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden md:inline">
            {user?.first_name || user?.username}
          </span>
        </Link>
      </div>
    </header>
  )
}
