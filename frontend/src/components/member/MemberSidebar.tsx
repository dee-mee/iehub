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
    <aside className="member-sidebar">
      <div className="member-sidebar__brand">
        <div className="member-sidebar__logo">IE</div>
        <div>
          <p className="font-extrabold text-sm text-[#1a1a1a] leading-tight">
            {user?.organization || 'Members Forum'}
          </p>
          <p className="text-xs font-semibold text-gray-600">Community of Practice</p>
        </div>
      </div>

      <p className="member-sidebar__label">Members Forum</p>

      <nav className="flex-1 overflow-y-auto py-1">
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
                `member-nav-link${isActive ? ' member-nav-link--active' : ''}`
              }
            >
              <MemberIcon name={item.icon} />
              <span className="flex-1">{item.label}</span>
              {item.hasArrow && <MemberIcon name="chevronRight" />}
              {badge != null && badge > 0 && (
                <span className="member-nav-badge">{badge > 9 ? '9+' : badge}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="member-sidebar__footer">
        <Link to="/" className="member-nav-link">
          <MemberIcon name="external" />
          IE Hub Website
        </Link>
        <button type="button" onClick={() => logout()} className="member-nav-link w-[calc(100%-1rem)]">
          <MemberIcon name="logout" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
