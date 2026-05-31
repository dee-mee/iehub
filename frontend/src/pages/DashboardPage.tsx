import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { useAuth } from '@/context/AuthContext'
import { fetchEvents, fetchResources } from '@/api/public'
import { apiFetch, apiList } from '@/api/client'
import type { EventItem } from '@/types/content'

type ForumThread = {
  id: number
  title: string
  slug: string
  author: {
    first_name: string
    last_name: string
    username: string
  }
  category?: { name: string }
  post_count: number
  last_activity: string
}

type ForumCategory = {
  id: number
  name: string
  slug: string
  description: string
  category_type: string
  icon: string
  thread_count: number
  post_count: number
  last_thread?: {
    title: string
    author_name: string
    last_activity: string
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function Icon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    discussions: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    announcements: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    resources: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    events: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    members: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    messages: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    notifications: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    chevronRight: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  }
  return icons[name] ?? null
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, linkTo, color }: {
  icon: ReactNode
  value: number | string
  label: string
  linkTo: string
  color: string
}) {
  return (
    <div className="member-stat-card">
      <div className="member-stat-card__icon" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <Link to={linkTo} className="text-xs font-bold text-[#00a170] hover:underline">
          View all
        </Link>
      </div>
    </div>
  )
}

// ─── Category Icon ─────────────────────────────────────────────────────────────
function CategoryBadge({ type, icon }: { type: string; icon?: string }) {
  if (icon) return <span className="text-xl">{icon}</span>
  const map: Record<string, { bg: string; color: string; icon: ReactNode }> = {
    ANNOUNCEMENT: { bg: '#e6f5f0', color: '#00a170', icon: <Icon name="announcements" /> },
    GENERAL: { bg: '#f0fdf4', color: '#16a34a', icon: <Icon name="discussions" /> },
    THEMATIC: { bg: '#faf5ff', color: '#7c3aed', icon: <Icon name="members" /> },
    COUNTRY: { bg: '#fff7ed', color: '#d97706', icon: <Icon name="events" /> },
  }
  const style = map[type] ?? map['GENERAL']
  return (
    <div style={{ background: style.bg, color: style.color }} className="w-10 h-10 border-2 border-[#b8b8b8] flex items-center justify-center shrink-0">
      {style.icon}
    </div>
  )
}

// ─── Time ago helper ──────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`
  return new Date(dateStr).toLocaleDateString()
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuth()

  const eventsQuery = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => fetchEvents(),
  })

  const resourcesQuery = useQuery({
    queryKey: ['dashboard-resources'],
    queryFn: () => fetchResources({ page: 1 }),
  })

  const forumQuery = useQuery<ForumThread[]>({
    queryKey: ['dashboard-forum'],
    queryFn: async () => {
      const data = await apiFetch<{ results: ForumThread[] }>(
        '/forum/threads/?ordering=-last_activity',
      )
      return (data.results ?? []).slice(0, 5)
    },
  })

  const categoriesQuery = useQuery<ForumCategory[]>({
    queryKey: ['forum-categories'],
    queryFn: () =>
      apiFetch<{ results?: ForumCategory[] } | ForumCategory[]>('/forum/categories/').then((data) =>
        apiList(data).filter((c) => (c as ForumCategory & { can_access?: boolean }).can_access !== false),
      ),
  })

  const membersQuery = useQuery<{
    count: number
    results: { id: number; first_name: string; last_name: string; avatar?: string }[]
  }>({
    queryKey: ['dashboard-members'],
    queryFn: () => apiFetch('/members/?is_active=true&page_size=12'),
  })

  // Fake announcement data fallback
  const announcements = [
    { title: 'New Membership Guidelines', body: 'Please review the updated membership guidelines effective June 1, 2026.', date: '2026-05-28', icon: '📋' },
    { title: 'AGM Notice', body: 'The Annual General Meeting is scheduled for June 20, 2026.', date: '2026-05-27', icon: '📣' },
    { title: 'Training Calendar Released', body: 'Check out the new training calendar for Q2 and Q3.', date: '2026-05-26', icon: '🎓' },
  ]

  const totalTopics = categoriesQuery.data?.reduce((a, c) => a + (c.thread_count ?? 0), 0) ?? 245
  const upcomingEventCount = eventsQuery.data?.results?.length ?? 4
  const resourceCount = resourcesQuery.data?.count ?? 38
  const memberCount = membersQuery.data?.count ?? 156

  const firstCategory = categoriesQuery.data?.[0]

  return (
    <MemberPageShell title="Dashboard">
      <div className="member-layout-split -m-6">
        <div className="member-layout-split__main space-y-6">
            <div className="member-panel">
              <h1 className="text-2xl font-extrabold text-gray-900 border-0 pl-0 section-heading">
                Welcome back, {user?.first_name ?? user?.username ?? 'Member'}!
              </h1>
              <p className="text-gray-600 text-sm mt-2 font-medium">Here&apos;s what&apos;s happening in your members forum.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                value={totalTopics}
                label="Discussions"
                linkTo="/forum"
                color="#00a170"
              />
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                value={memberCount}
                label="Active Members"
                linkTo="/members"
                color="#16a34a"
              />
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                value={upcomingEventCount}
                label="Upcoming Events"
                linkTo="/events"
                color="#d97706"
              />
              <StatCard
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
                value={resourceCount}
                label="Resources"
                linkTo="/member-resources"
                color="#7c3aed"
              />
            </div>

            {/* Forum Categories */}
            <div className="member-panel p-0 overflow-hidden">
              <div className="member-panel__header px-6 py-4 mb-0">
                <h2 className="font-extrabold text-gray-900 border-0 pl-0 section-heading text-lg">Forum Categories</h2>
                <Link to="/forum" className="text-xs font-bold text-[#00a170] hover:underline">
                  View all categories
                </Link>
              </div>

              {categoriesQuery.isLoading ? (
                <div className="p-8 flex justify-center">
                  <LoadingSpinner label="Loading categories..." />
                </div>
              ) : (
                <div className="divide-y-2 divide-[#e5e5e5]">
                  {(categoriesQuery.data ?? []).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/forum/c/${cat.slug}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <CategoryBadge type={cat.category_type} icon={cat.icon} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{cat.description}</p>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 text-center">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{cat.thread_count ?? 0}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Topics</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{cat.post_count ?? 0}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Posts</p>
                        </div>
                      </div>
                      {cat.last_thread && (
                        <div className="hidden xl:block text-right shrink-0 max-w-[160px]">
                          <p className="text-xs font-medium text-gray-700 truncate">{cat.last_thread.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            by {cat.last_thread.author_name}
                          </p>
                          <p className="text-[10px] text-gray-400">{timeAgo(cat.last_thread.last_activity)}</p>
                        </div>
                      )}
                      <Icon name="chevronRight" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Start discussion button */}
              <div className="px-6 py-4 border-t-2 border-[#2d2d2d]">
                <Link
                  to={firstCategory ? `/forum/c/${firstCategory.slug}/new` : '/forum'}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Icon name="plus" />
                  Start New Discussion
                </Link>
              </div>
            </div>

            {/* Recent Discussions */}
            <div className="member-panel p-0 overflow-hidden">
              <div className="member-panel__header px-6 py-4 mb-0">
                <h2 className="font-extrabold text-gray-900 border-0 pl-0 section-heading text-lg">Recent Discussions</h2>
                <Link to="/forum" className="text-xs font-bold text-[#00a170] hover:underline">
                  View all discussions
                </Link>
              </div>

              {forumQuery.isLoading ? (
                <div className="p-6 flex justify-center">
                  <LoadingSpinner label="Loading discussions..." />
                </div>
              ) : (
                <div className="divide-y-2 divide-[#e5e5e5]">
                  {forumQuery.data?.map((thread) => (
                    <Link
                      key={thread.id}
                      to={`/forum/t/${thread.slug}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-9 h-9 border-2 border-[#2d2d2d] bg-[#e6f5f0] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#00a170" strokeWidth={2} className="w-4 h-4">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate">{thread.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Started by {thread.author.first_name || thread.author.username}
                          {thread.category ? ` in ${thread.category.name}` : ''}
                        </p>
                      </div>
                      <div className="shrink-0 text-center">
                        <p className="text-sm font-bold text-gray-900">{thread.post_count}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Replies</p>
                      </div>
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="text-xs text-gray-500">{timeAgo(thread.last_activity)}</p>
                        <p className="text-[10px] text-gray-400">
                          by {thread.author.first_name || thread.author.username}
                        </p>
                      </div>
                      <div className="w-8 h-8 border-2 border-[#2d2d2d] bg-[#f0f0f0] flex items-center justify-center text-sm font-extrabold text-gray-600 shrink-0">
                        {(thread.author.first_name?.[0] ?? thread.author.username?.[0] ?? '?').toUpperCase()}
                      </div>
                      <Icon name="chevronRight" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
        </div>

          <aside className="member-layout-split__aside space-y-6">
            {/* Announcements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Latest Announcements</h3>
                <Link to="/announcements" className="text-xs font-bold text-[#00a170] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {announcements.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 border-2 border-[#2d2d2d] bg-[#e6f5f0] flex items-center justify-center shrink-0 text-base">
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[#2d2d2d]" />

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Upcoming Events</h3>
                <Link to="/events" className="text-xs font-bold text-[#00a170] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {eventsQuery.isLoading ? (
                  <p className="text-xs text-gray-400">Loading...</p>
                ) : (
                  eventsQuery.data?.results.slice(0, 3).map((event: EventItem) => {
                    const d = new Date(event.startDatetime)
                    const mon = d.toLocaleString('default', { month: 'short' }).toUpperCase()
                    const day = d.getDate()
                    const time = d.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <div key={event.id} className="flex gap-3 items-start">
                        <div className="border-2 border-[#2d2d2d] bg-[#003d2e] min-w-[44px] flex flex-col items-center py-1.5 px-2 shrink-0">
                          <span className="text-[9px] font-bold text-blue-300 uppercase">{mon}</span>
                          <span className="text-lg font-bold text-white leading-none">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {time}
                          </p>
                          {event.locationAddress && (
                            <p className="text-[11px] text-gray-400">{event.locationAddress}</p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="border-t-2 border-[#2d2d2d]" />

            {/* Online Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">
                  Online Members ({membersQuery.data?.results.length ?? 12})
                </h3>
                <Link to="/members" className="text-xs font-bold text-[#00a170] hover:underline">
                  View all
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {(membersQuery.data?.results ?? Array.from({ length: 7 }, (_, i) => ({ id: i, first_name: '?', last_name: '', avatar: undefined }))).slice(0, 7).map((m, idx) => (
                  <div
                    key={m.id}
                    style={{ background: ['#1e3a5f','#16a34a','#7c3aed','#d97706','#db2777','#0891b2','#374151'][idx % 7] }}
                    className="w-10 h-10 border-2 border-[#2d2d2d] flex items-center justify-center text-white font-extrabold text-sm relative"
                    title={`${m.first_name} ${m.last_name}`}
                  >
                    {m.avatar
                      ? <img src={m.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      : (m.first_name?.[0] ?? '?').toUpperCase()
                    }
                    <span className="member-avatar-dot absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white" />
                  </div>
                ))}
                {(membersQuery.data?.count ?? 12) > 7 && (
                  <div className="w-10 h-10 border-2 border-[#2d2d2d] bg-[#e5e7eb] flex items-center justify-center text-gray-600 font-extrabold text-xs">
                    +{(membersQuery.data?.count ?? 12) - 7}
                  </div>
                )}
              </div>
            </div>
          </aside>
      </div>
    </MemberPageShell>
  )
}
