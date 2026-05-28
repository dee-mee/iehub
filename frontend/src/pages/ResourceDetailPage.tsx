import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader'
import { fetchResourceById } from '@/api/public'
import { resources as fallbackResources } from '@/data/mockContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  
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

  const isRestricted = resource.accessLevel === 'MEMBERS_ONLY' && !isAuthenticated

  const published = new Date(resource.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <PageHeader title={resource.title} />
      <article className="container-page max-w-3xl py-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded uppercase">
            {resource.resourceType.replace('_', ' ')}
          </span>
          {resource.accessLevel === 'MEMBERS_ONLY' && (
            <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-bold rounded uppercase flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Members Only
            </span>
          )}
        </div>

        <p className="text-muted text-lg leading-relaxed">{resource.description}</p>
        
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
          <div className="sm:col-span-2 border-t border-primary-50 pt-4 mt-2">
            <dt className="text-sm font-semibold text-ink">Topics</dt>
            <dd className="text-muted mt-1 flex flex-wrap gap-1">
              {resource.topics.map(topic => (
                <span key={topic} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs">
                  {topic}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        {isRestricted ? (
          <div className="mt-12 p-8 bg-primary-900 text-white rounded-2xl text-center shadow-lg">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Member-only Content</h2>
            <p className="text-primary-100 mb-8 max-w-md mx-auto">
              This resource is part of our professional library. Please join the Community of Practice or sign in to download.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-accent-500 hover:bg-accent-600 text-ink">
                Join Community
              </Link>
              <Link to="/login" className="btn-secondary border-white text-white hover:bg-white/10">
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <button type="button" className="btn-primary" aria-describedby="download-note">
              Download resource
            </button>
            <p id="download-note" className="mt-2 text-sm text-muted">
              File: {resource.title.toLowerCase().replace(/\s+/g, '-')}.pdf
            </p>
          </div>
        )}

        <Link to="/resources" className="mt-12 inline-block text-sm font-semibold text-primary-600 hover:underline">
          ← Back to library
        </Link>
        
        {resourceQuery.isError && (
          <p className="mt-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100" role="status">
            Note: Live API details could not be loaded; fallback content shown.
          </p>
        )}
      </article>
    </>
  )
}
