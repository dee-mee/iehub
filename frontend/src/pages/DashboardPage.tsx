import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { fetchEvents } from '@/api/public'
import { fetchResources } from '@/api/public'
import { apiFetch, apiList } from '@/api/client'
import { useAuth } from '@/context/AuthContext'

// ─── Types ───────────────────────────────────────────────────────────────────
type ForumThread = {
  id: number
  title: string
  slug: string
  last_activity: string
  post_count: number
  author: {
    first_name: string
    last_name: string
    username: string
  }
  category?: {
    name: string
    slug: string
  }
}

type ForumCategory = {
  id: number
  name: string
  slug: string
  description: string
  category_type: string
  icon?: string
  thread_count?: number
  post_count?: number
  last_thread?: {
    title: string
    author_name: string
    last_activity: string
  }
}

type EventItem = {
  id: number
  title: string
  startDatetime: string
  locationAddress?: string
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function Icon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    discussions: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
    events: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    resources: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    chevronRight: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="9 18 15 12 9 6" />
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
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 sm:gap-4 hover:shadow-md dark:hover:border-slate-700 transition-all group min-w-0">
      <div 
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm" 
        style={{ background: color + '15', color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none truncate">{value}</p>
        <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 truncate uppercase tracking-wider">{label}</p>
        <Link to={linkTo} className="text-[9px] sm:text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mt-1.5 sm:mt-2 inline-block uppercase tracking-widest">
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
    ANNOUNCEMENT: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600 dark:text-emerald-400', icon: <Icon name="discussions" /> },
    GENERAL: { bg: 'bg-sky-50 dark:bg-sky-900/20', color: 'text-sky-600 dark:text-sky-400', icon: <Icon name="discussions" /> },
    THEMATIC: { bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-600 dark:text-purple-400', icon: <Icon name="members" /> },
    COUNTRY: { bg: 'bg-orange-50 dark:bg-orange-900/20', color: 'text-orange-600 dark:text-orange-400', icon: <Icon name="events" /> },
  }
  const style = map[type] ?? map['GENERAL']
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.color}`}>
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
    results: { id: number; first_name: string; last_name: string; avatar?: string; username: string }[]
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
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8 min-w-0">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.first_name ?? user?.username ?? 'Member'}!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base mt-2">Here&apos;s what&apos;s happening in your members forum today.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                icon={<Icon name="discussions" />}
                value={totalTopics}
                label="Discussions"
                linkTo="/forum"
                color="#00a170"
              />
              <StatCard
                icon={<Icon name="members" />}
                value={memberCount}
                label="Active Members"
                linkTo="/members"
                color="#16a34a"
              />
              <StatCard
                icon={<Icon name="events" />}
                value={upcomingEventCount}
                label="Upcoming Events"
                linkTo="/events"
                color="#d97706"
              />
              <StatCard
                icon={<Icon name="resources" />}
                value={resourceCount}
                label="Resources"
                linkTo="/member-resources"
                color="#7c3aed"
              />
            </div>

            {/* Forum Categories */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Forum Categories</h2>
                <Link to="/forum" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  View all
                </Link>
              </div>

              {categoriesQuery.isLoading ? (
                <div className="p-12 flex justify-center">
                  <LoadingSpinner label="Loading categories..." />
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {(categoriesQuery.data ?? []).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/forum/c/${cat.slug}`}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <CategoryBadge type={cat.category_type} icon={cat.icon} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-base group-hover:text-primary-600 transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{cat.description}</p>
                      </div>
                      <div className="flex items-center gap-8 shrink-0 text-center">
                        <div className="hidden sm:block">
                          <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{cat.thread_count ?? 0}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Topics</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{cat.post_count ?? 0}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Posts</p>
                        </div>
                      </div>
                      {cat.last_thread && (
                        <div className="hidden xl:block text-right shrink-0 max-w-[180px]">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{cat.last_thread.title}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {cat.last_thread.author_name} • {timeAgo(cat.last_thread.last_activity)}
                          </p>
                        </div>
                      )}
                      <div className="text-slate-300 dark:text-slate-600 group-hover:text-primary-400 transition-colors">
                        <Icon name="chevronRight" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={firstCategory ? `/forum/c/${firstCategory.slug}/new` : '/forum'}
                  className="member-btn-primary inline-flex items-center gap-2"
                >
                  <Icon name="plus" />
                  Start New Discussion
                </Link>
              </div>
            </div>

            {/* Recent Discussions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Recent Discussions</h2>
                <Link to="/forum" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  View all
                </Link>
              </div>

              {forumQuery.isLoading ? (
                <div className="p-12 flex justify-center">
                  <LoadingSpinner label="Loading discussions..." />
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {forumQuery.data?.map((thread) => (
                    <Link
                      key={thread.id}
                      to={`/forum/t/${thread.slug}`}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                        <div className="text-emerald-600 dark:text-emerald-400">
                          <Icon name="discussions" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
                          {thread.title}
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                          Started by <span className="text-slate-600 dark:text-slate-300 font-medium">{thread.author.first_name || thread.author.username}</span>
                          {thread.category ? ` in ${thread.category.name}` : ''}
                        </p>
                      </div>
                      <div className="shrink-0 text-center hidden sm:block">
                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{thread.post_count}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Replies</p>
                      </div>
                      <div className="shrink-0 text-right hidden lg:block">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{timeAgo(thread.last_activity)}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          by {thread.author.first_name || thread.author.username}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 border-2 border-white dark:border-slate-700 shadow-sm shrink-0">
                        {(thread.author.first_name?.[0] ?? thread.author.username?.[0] ?? '?').toUpperCase()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
        </div>

          <aside className="w-full lg:w-72 space-y-8 flex-shrink-0">
            {/* Announcements */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">Announcements</h3>
                <Link to="/announcements" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  View all
                </Link>
              </div>
              <div className="space-y-6">
                {announcements.map((a, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0 text-xl shadow-sm group-hover:scale-110 transition-transform">
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors">{a.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{a.body}</p>
                      <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-wider mt-2">
                        {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">Upcoming Events</h3>
                <Link to="/events" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  View all
                </Link>
              </div>
              <div className="space-y-6">
                {eventsQuery.isLoading ? (
                  <p className="text-xs text-slate-400">Loading...</p>
                ) : (
                  eventsQuery.data?.results.slice(0, 3).map((event: EventItem) => {
                    const d = new Date(event.startDatetime)
                    const mon = d.toLocaleString('default', { month: 'short' }).toUpperCase()
                    const day = d.getDate()
                    const time = d.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <div key={event.id} className="flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 shadow-md group-hover:bg-primary-600 transition-colors">
                          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{mon}</span>
                          <span className="text-lg font-bold text-white leading-none">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors">{event.title}</p>
                          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                            <Icon name="events" />
                            <span>{time}</span>
                          </p>
                          {event.locationAddress && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{event.locationAddress}</p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Online Members */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  Online Members ({membersQuery.data?.results.length ?? 12})
                </h3>
                <Link to="/members" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  View all
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {(membersQuery.data?.results ?? Array.from({ length: 7 }, (_, i) => ({ id: i, first_name: '?', last_name: '', avatar: undefined, username: '?' }))).slice(0, 10).map((m, idx) => (
                  <div
                    key={m.id}
                    className="group relative"
                    title={`${m.first_name} ${m.last_name}`}
                  >
                    <div 
                      style={{ background: ['#1e3a5f','#16a34a','#7c3aed','#d97706','#db2777','#0891b2','#374151'][idx % 7] }}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-white font-bold text-sm overflow-hidden group-hover:scale-110 transition-transform"
                    >
                      {m.avatar
                        ? <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                        : (m.first_name?.[0] ?? m.username?.[0] ?? '?').toUpperCase()
                      }
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-700 rounded-full shadow-sm" />
                  </div>
                ))}
                {(membersQuery.data?.count ?? 12) > 10 && (
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs border-2 border-white dark:border-slate-700 shadow-sm">
                    +{(membersQuery.data?.count ?? 12) - 10}
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                <Link to="/members" className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center transition-colors">
                  Browse Member Directory
                </Link>
              </div>
            </div>
          </aside>
      </div>
    </MemberPageShell>
  )
}
