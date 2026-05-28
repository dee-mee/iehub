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
import { fetchEvents, fetchNews, fetchResources } from '@/api/public'
import {
  resources as fallbackResources,
  newsArticles as fallbackNews,
  events as fallbackEvents,
} from '@/data/mockContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function HomePage() {
  const { t } = useTranslation()
  const resourcesQuery = useQuery({
    queryKey: ['home-resources'],
    queryFn: () => fetchResources({ page: 1 }),
  })
  const newsQuery = useQuery({
    queryKey: ['home-news'],
    queryFn: () => fetchNews({ page: 1 }),
  })
  const eventsQuery = useQuery({
    queryKey: ['home-events'],
    queryFn: () => fetchEvents({ page: 1 }),
  })

  const featured = (resourcesQuery.data?.results ?? fallbackResources).filter((r) => r.isFeatured).slice(0, 3)
  const latestNews = (newsQuery.data?.results ?? fallbackNews).slice(0, 3)
  const upcoming = (eventsQuery.data?.results ?? fallbackEvents).slice(0, 2)

  return (
    <>
      <HeroCarousel />

      <section className="container-page py-16" aria-labelledby="who-heading">
        <div className="grid gap-8 md:grid-cols-3">
          <article className="card border-t-4 border-t-primary-500">
            <h2 id="who-heading" className="text-xl font-bold text-primary-800">
              {t('home.whoWeAre')}
            </h2>
            <p className="mt-3 text-sm text-muted">
              IE Hub is a continental Community of Practice led by LM International, connecting
              educators, OPDs, governments, and partners advancing inclusive education across Africa.
            </p>
          </article>
          <article className="card border-t-4 border-t-accent-500">
            <h2 className="text-xl font-bold text-primary-800">{t('home.whyWeDoIt')}</h2>
            <p className="mt-3 text-sm text-muted">
              Because inclusive education is a human right — and no learner should be excluded from
              quality education due to disability, poverty, or crisis.
            </p>
          </article>
          <article className="card border-t-4 border-t-primary-500">
            <h2 className="text-xl font-bold text-primary-800">{t('home.whatWeDo')}</h2>
            <p className="mt-3 text-sm text-muted">
              We provide open resources, regional forums, training, and advocacy tools — built
              accessible from the ground up.
            </p>
          </article>
        </div>
      </section>

      <ImpactStats />
      <FocusAreaGrid />

      <section className="bg-primary-50 py-16" aria-labelledby="featured-resources-heading">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="featured-resources-heading" className="section-heading">
              Featured resources
            </h2>
            <Link to="/resources" className="btn-secondary text-sm">
              View all resources
            </Link>
          </div>
          {resourcesQuery.isLoading ? (
            <LoadingSpinner label="Loading featured resources" />
          ) : (
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {featured.map((resource) => (
                <li key={resource.id}>
                  <ResourceCard resource={resource} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="container-page py-16" aria-labelledby="latest-news-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-news-heading" className="section-heading">
            {t('home.latestNews')}
          </h2>
          <Link to="/news" className="btn-secondary text-sm">
            All news
          </Link>
        </div>
        {newsQuery.isLoading ? (
          <LoadingSpinner label="Loading latest news" />
        ) : (
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {latestNews.map((article) => (
              <li key={article.id}>
                <NewsCard article={article} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white py-16" aria-labelledby="events-heading">
        <div className="container-page">
          <h2 id="events-heading" className="section-heading">
            {t('home.upcomingEvents')}
          </h2>
          {eventsQuery.isLoading ? (
            <LoadingSpinner label="Loading upcoming events" />
          ) : (
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <PartnersStrip />

      <section className="bg-primary-800 py-16 text-white" aria-labelledby="cta-heading">
        <div className="container-page text-center">
          <h2 id="cta-heading" className="text-3xl font-bold">
            {t('home.ctaTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">{t('home.ctaDesc')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact#join" className="btn-primary bg-accent-500 hover:bg-accent-600">
              {t('nav.join')}
            </Link>
            <Link to="/resources" className="btn-secondary border-white text-white hover:bg-white/10">
              Browse library
            </Link>
          </div>
        </div>
      </section>
      {(resourcesQuery.isError || newsQuery.isError || eventsQuery.isError) && (
        <div className="container-page py-4">
          <p className="text-sm text-red-700" role="status">
            Live homepage content unavailable; fallback content is displayed.
          </p>
        </div>
      )}
    </>
  )
}
