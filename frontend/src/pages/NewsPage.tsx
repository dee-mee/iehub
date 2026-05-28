import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NewsCard } from '@/components/public/NewsCard'
import { EventCard } from '@/components/public/EventCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { fetchEvents, fetchNews } from '@/api/public'
import { newsArticles as fallbackNews, events as fallbackEvents } from '@/data/mockContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function NewsPage() {
  const [newsPage, setNewsPage] = useState(1)
  const [eventsPage, setEventsPage] = useState(1)

  const newsQuery = useQuery({
    queryKey: ['news', newsPage],
    queryFn: () => fetchNews({ page: newsPage }),
  })
  const eventsQuery = useQuery({
    queryKey: ['events', eventsPage],
    queryFn: () => fetchEvents({ page: eventsPage }),
  })

  const newsArticles = newsQuery.data?.results ?? fallbackNews
  const events = eventsQuery.data?.results ?? fallbackEvents

  return (
    <>
      <PageHeader
        title="News & Events"
        description="Latest stories, announcements, and upcoming activities from the IE Hub community."
      />

      <div className="container-page py-12">
        <section aria-labelledby="news-list-heading">
          <h2 id="news-list-heading" className="text-2xl font-bold text-primary-800">
            News and stories
          </h2>
          {newsQuery.isLoading ? (
            <LoadingSpinner label="Loading news" />
          ) : (
            <>
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsArticles.map((article) => (
                  <li key={article.id}>
                    <NewsCard article={article} />
                  </li>
                ))}
              </ul>
              {newsQuery.data && (
                <nav className="mt-8 flex items-center justify-center gap-3" aria-label="News pagination">
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    disabled={!newsQuery.data.previous}
                    onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted">Page {newsPage}</span>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    disabled={!newsQuery.data.next}
                    onClick={() => setNewsPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        <section className="mt-16" aria-labelledby="events-list-heading">
          <h2 id="events-list-heading" className="text-2xl font-bold text-primary-800">
            Upcoming events
          </h2>
          {eventsQuery.isLoading ? (
            <LoadingSpinner label="Loading events" />
          ) : (
            <>
              <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
              {eventsQuery.data && (
                <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Events pagination">
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    disabled={!eventsQuery.data.previous}
                    onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted">Page {eventsPage}</span>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    disabled={!eventsQuery.data.next}
                    onClick={() => setEventsPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
        {(newsQuery.isError || eventsQuery.isError) && (
          <p className="mt-8 text-sm text-red-700" role="status">
            Some live content could not be loaded. Fallback content is displayed.
          </p>
        )}
      </div>
    </>
  )
}
