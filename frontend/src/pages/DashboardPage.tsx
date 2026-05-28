import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'
import { fetchNews, fetchEvents, fetchResources } from '@/api/public'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const newsQuery = useQuery({
    queryKey: ['dashboard-news'],
    queryFn: () => fetchNews({ page: 1 }),
  })

  const eventsQuery = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => fetchEvents(),
  })

  const resourcesQuery = useQuery({
    queryKey: ['dashboard-resources'],
    queryFn: () => fetchResources({ page: 1 }),
  })

  const forumQuery = useQuery({
    queryKey: ['dashboard-forum'],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/threads/?ordering=-last_activity`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch threads')
      const data = await response.json()
      return data.results.slice(0, 5)
    }
  })

  const isLoading = newsQuery.isLoading || eventsQuery.isLoading || resourcesQuery.isLoading || forumQuery.isLoading

  if (isLoading) return <LoadingSpinner label={t('dashboard.assembling', { defaultValue: 'Assembling your dashboard...' })} />

  return (
    <>
      <div className="bg-primary-900 text-white py-12">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-accent-400 font-bold uppercase tracking-widest text-xs mb-2">{t('nav.dashboard')}</p>
              <h1 className="text-3xl md:text-4xl font-bold">
                {t('dashboard.welcome', { name: user?.first_name || user?.username })}
              </h1>
            </div>
            <div className="flex gap-3">
              <Link to="/profile" className="btn-secondary border-white/20 text-white hover:bg-white/10 py-2">
                {t('profile.editProfile')}
              </Link>
              <Link to="/forum" className="btn-primary bg-accent-500 hover:bg-accent-600 text-ink py-2 font-bold">
                {t('forum.startDiscussion')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Forum Activity */}
            <section className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-ink">{t('dashboard.recentDiscussions')}</h2>
                <Link to="/forum" className="text-sm font-bold text-primary-700 hover:underline">{t('dashboard.viewAll')}</Link>
              </div>
              <div className="divide-y divide-primary-50">
                {forumQuery.data?.map((thread: any) => (
                  <Link 
                    key={thread.id} 
                    to={`/forum/t/${thread.slug}`}
                    className="block py-4 hover:bg-primary-50/30 transition-colors group"
                  >
                    <h3 className="font-bold text-ink group-hover:text-primary-700">{thread.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      <span>{thread.author.first_name || thread.author.username}</span>
                      <span className="text-primary-100">•</span>
                      <span>{thread.post_count} {t('forum.posts')}</span>
                      <span className="text-primary-100">•</span>
                      <span>{t('forum.lastActive')} {new Date(thread.last_activity).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Latest News */}
            <section className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-ink">{t('dashboard.latestUpdates')}</h2>
                <Link to="/news" className="text-sm font-bold text-primary-700 hover:underline">{t('nav.news')}</Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {newsQuery.data?.results.slice(0, 2).map((article) => (
                  <Link key={article.id} to={`/news/${article.slug}`} className="group">
                    <div className="aspect-video bg-primary-100 rounded-lg mb-3 overflow-hidden">
                      <div className="w-full h-full bg-primary-200 flex items-center justify-center text-primary-400 group-hover:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2-0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-ink group-hover:text-primary-700 leading-snug">{article.title}</h3>
                    <p className="text-xs text-muted mt-1">{new Date(article.publishedAt).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <section className="card border-accent-100 bg-accent-50/30">
              <h2 className="text-lg font-bold text-ink mb-4">{t('dashboard.upcomingEvents')}</h2>
              <div className="space-y-4">
                {eventsQuery.data?.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border border-accent-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-accent-700 uppercase">
                        {new Date(event.startDatetime).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-ink leading-none">
                        {new Date(event.startDatetime).getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink leading-tight">{event.title}</h3>
                      <p className="text-xs text-muted mt-0.5">{event.eventType.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-secondary w-full mt-6 text-xs font-bold py-2 bg-white">
                {t('dashboard.viewCalendar')}
              </Link>
            </section>

            {/* Featured Resources */}
            <section className="card">
              <h2 className="text-lg font-bold text-ink mb-4">{t('dashboard.featuredResources')}</h2>
              <div className="space-y-4">
                {resourcesQuery.data?.results.slice(0, 3).map((res) => (
                  <Link key={res.id} to={`/resources/${res.id}`} className="block group">
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{res.resourceType.replace('_', ' ')}</p>
                    <h3 className="text-sm font-bold text-ink group-hover:text-primary-700 leading-tight mt-0.5">{res.title}</h3>
                  </Link>
                ))}
              </div>
              <Link to="/resources" className="btn-secondary w-full mt-6 text-xs font-bold py-2">
                {t('dashboard.browseLibrary')}
              </Link>
            </section>

            {/* Quick Links */}
            <section className="card bg-primary-50 border-primary-100">
              <h2 className="text-sm font-bold text-primary-800 uppercase tracking-wider mb-4">{t('dashboard.quickActions')}</h2>
              <ul className="space-y-2 text-sm">
                <li><Link to="/members" className="text-primary-700 hover:underline font-medium">{t('nav.members')}</Link></li>
                <li><Link to="/forum/c/general-discussion/new" className="text-primary-700 hover:underline font-medium">{t('forum.startDiscussion')}</Link></li>
                <li><Link to="/profile/accessibility" className="text-primary-700 hover:underline font-medium">{t('nav.accessibility')}</Link></li>
                <li><Link to="/contact" className="text-primary-700 hover:underline font-medium">{t('footer.contact')}</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
