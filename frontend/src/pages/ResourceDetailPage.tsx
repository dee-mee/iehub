import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader'
import { fetchResourceById } from '@/api/public'
import { resources as fallbackResources } from '@/data/mockContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const resourceQuery = useQuery({
    queryKey: ['resource', id],
    queryFn: () => fetchResourceById(id ?? ''),
    enabled: Boolean(id),
  })
  const resource = resourceQuery.data ?? fallbackResources.find((r) => String(r.id) === id)

  if (resourceQuery.isLoading) {
    return <LoadingSpinner label="Loading resource details" />
  }

  if (!resource) {
    return (
      <div className="container-page py-16" role="alert">
        <h1 className="section-heading">Resource not found</h1>
        <Link to="/resources" className="btn-primary mt-6 inline-flex">
          Back to library
        </Link>
      </div>
    )
  }

  const published = new Date(resource.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <PageHeader title={resource.title} />
      <article className="container-page max-w-3xl py-12">
        <p className="text-muted">{resource.description}</p>
        <dl className="mt-8 grid gap-4 rounded-xl border border-primary-100 bg-white p-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-ink">Published</dt>
            <dd className="text-muted">
              <time dateTime={resource.publishedAt}>{published}</time>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">Language</dt>
            <dd className="text-muted">{resource.language}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">Topics</dt>
            <dd className="text-muted">{resource.topics.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">Countries</dt>
            <dd className="text-muted">{resource.countries.join(', ')}</dd>
          </div>
        </dl>
        <button type="button" className="btn-primary mt-8" aria-describedby="download-note">
          Download resource
        </button>
        <p id="download-note" className="mt-2 text-sm text-muted">Download endpoint is coming next.</p>
        <Link to="/resources" className="mt-6 inline-block text-sm font-semibold text-primary-600 hover:underline">
          ← Back to library
        </Link>
        {resourceQuery.isError && (
          <p className="mt-4 text-sm text-red-700" role="status">
            API detail could not be loaded; fallback content shown.
          </p>
        )}
      </article>
    </>
  )
}
