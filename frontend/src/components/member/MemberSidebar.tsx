import { Link, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { apiFetch, apiList } from '@/api/client'
import { getMemberNavItems } from '@/lib/memberNav'
import { MemberIcon } from './MemberIcons'

type UnreadCounts = { messages: number; notifications: number }

export function MemberSidebar() {
  const { user, logout } = useAuth()
  const navItems = getMemberNavItems(user)

  const { data: unread } = useQuery<UnreadCounts>({
    queryKey: ['member-unread-counts'],
    queryFn: async () => {
      const [msgs, forumNotifs, userNotifs] = await Promise.all([
        apiFetch<{ results?: { is_read: boolean }[] } | { is_read: boolean }[]>(
          '/forum/messages/?box=inbox',
        ).catch(() => []),
        apiFetch<{ results?: { is_read: boolean }[] } | { is_read: boolean }[]>(
          '/forum/notifications/unread/',
        ).catch(() => []),
        apiFetch<{ results?: { is_read: boolean }[] } | { is_read: boolean }[]>(
          '/auth/notifications/',
        ).catch(() => []),
      ])
      const messageList = apiList(msgs)
      const forumList = apiList(forumNotifs)
      const userList = apiList(userNotifs)
      return {
        messages: messageList.filter((m) => !m.is_read).length,
        notifications:
          forumList.filter((n) => !n.is_read).length + userList.filter((n) => !n.is_read).length,
      }
    },
    enabled: Boolean(user),
    refetchInterval: 60_000,
  })

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen flex flex-col shadow-sm transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          IE
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
            {user?.organization || 'Members Forum'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">Community of Practice</p>
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">
          Members Forum
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const badge =
              item.badgeKey === 'messages'
                ? unread?.messages
                : item.badgeKey === 'notifications'
                  ? unread?.notifications
                  : undefined

            return (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-primary-200/50 dark:ring-primary-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className={`transition-colors duration-200`}>
                  <MemberIcon name={item.icon} />
                </div>
                <span className="flex-1">{item.label}</span>
                {item.hasArrow && (
                  <div className="opacity-40">
                    <MemberIcon name="chevronRight" />
                  </div>
                )}
                {badge != null && badge > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-primary-600 text-white rounded-full shadow-sm">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <MemberIcon name="external" />
          <span>IE Hub Website</span>
        </Link>
        <button 
          type="button" 
          onClick={() => logout()} 
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <MemberIcon name="logout" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
