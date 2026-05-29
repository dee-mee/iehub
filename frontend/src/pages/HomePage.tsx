import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { HeroCarousel } from '@/components/public/HeroCarousel'
import { ImpactStats } from '@/components/public/ImpactStats'
import { FocusAreaGrid } from '@/components/public/FocusAreaGrid'
import { ResourceCard } from '@/components/public/ResourceCard'
import { NewsCard } from '@/components/public/NewsCard'
import { EventCard } from '@/components/public/EventCard'
import { PartnersStrip } from '@/components/public/PartnersStrip'
import { fetchResources, fetchNews, fetchEvents } from '@/api/public'
import { 
  resources as fallbackResources, 
  newsArticles as fallbackNews, 
  events as fallbackEvents 
} from '@/data/mockContent'

export function HomePage() {
  const { t } = useTranslation()

  const resourcesQuery = useQuery({
    queryKey: ['featured-resources'],
    queryFn: () => fetchResources({ page: 1 }),
  })

  const newsQuery = useQuery({
    queryKey: ['home-news'],
    queryFn: () => fetchNews({ page: 1 }),
  })

  const eventsQuery = useQuery({
    queryKey: ['home-events'],
    queryFn: () => fetchEvents(),
  })

  const featuredResources = (resourcesQuery.data?.results ?? fallbackResources)
    .filter((r) => r.isFeatured)
    .slice(0, 3)

  const latestNews = (newsQuery.data?.results ?? fallbackNews).slice(0, 3)
  const upcomingEvents = (eventsQuery.data?.results ?? fallbackEvents).slice(0, 2)

  return (
    <>
      <HeroCarousel />
      
      <ImpactStats />

      <section className="bg-primary-50 py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="section-heading">{t('home.programs')}</h2>
              <p className="mt-4 text-lg text-muted">
                IE Hub provides specialized support and evidence-based resources across several 
                priority areas to ensure no child is excluded from learning.
              </p>
            </div>
            <Link to="/resources" className="btn-secondary whitespace-nowrap">
              {t('dashboard.browseLibrary')}
            </Link>
          </div>
          <div className="mt-12">
            <FocusAreaGrid />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <h2 className="section-heading">Featured Resources</h2>
            <Link to="/resources" className="text-sm font-bold text-primary-700 hover:underline">
              {t('dashboard.viewAll')}
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-900 py-16 text-white md:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">{t('home.latestNews')}</h2>
              <div className="mt-8 space-y-6">
                {latestNews.map((article) => (
                  <NewsCard key={article.id} article={article} variant="dark" />
                ))}
              </div>
              <Link to="/news" className="mt-8 inline-block font-bold text-accent-400 hover:underline">
                {t('dashboard.viewAll')} news stories →
              </Link>
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t('home.upcomingEvents')}</h2>
              <div className="mt-8 space-y-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <Link to="/news" className="mt-8 inline-block font-bold text-accent-400 hover:underline">
                View all events →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PartnersStrip />

      <section className="py-16 md:py-24">
        <div className="container-page rounded-3xl bg-accent-500 p-8 text-center text-ink shadow-xl md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            {t('home.ctaDesc')}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="btn-primary w-full sm:w-auto bg-primary-800 text-white hover:bg-primary-900 border-none">
              {t('nav.join')}
            </Link>
            <Link to="/about" className="btn-secondary w-full sm:w-auto border-primary-800 text-primary-800 hover:bg-primary-800/10">
              {t('home.whoWeAre')}
            </Link>
          </div>
        </div>
      </section>

      {resourcesQuery.isError && (
        <div className="container-page py-4">
          <p className="text-sm text-red-700" role="status">
            Live homepage content unavailable; fallback content is displayed.
          </p>
        </div>
      )}
    </>
  )
}
