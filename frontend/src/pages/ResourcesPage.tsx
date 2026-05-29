import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { ResourceCard } from '@/components/public/ResourceCard'
import { fetchResources } from '@/api/public'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { ResourceType } from '@/types/content'

const RESOURCE_TYPES: { value: ResourceType | ''; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'POLICY_BRIEF', label: 'Policy brief' },
  { value: 'TOOLKIT', label: 'Toolkit' },
  { value: 'REPORT', label: 'Report' },
  { value: 'RESEARCH', label: 'Research' },
  { value: 'PUBLICATION', label: 'Publication' },
]

export function ResourcesPage() {
  const [searchParams] = useSearchParams()
  const topicParam = searchParams.get('topic') ?? ''
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ResourceType | ''>('')
  const [accessFilter, setAccessFilter] = useState<'ALL' | 'PUBLIC' | 'MEMBERS_ONLY'>('ALL')
  const [page, setPage] = useState(1)

  const resourcesQuery = useQuery({
    queryKey: ['resources', query, page],
    queryFn: () => fetchResources({ page, search: query }),
  })

  const allResources = resourcesQuery.data?.results ?? []
  const totalCount = resourcesQuery.data?.count ?? 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allResources.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      const matchesType = !typeFilter || r.resourceType === typeFilter
      const matchesAccess = accessFilter === 'ALL' || r.accessLevel === accessFilter
      const matchesTopic =
        !topicParam ||
        r.topics.some((t) => t.slug === topicParam)
      return matchesQuery && matchesType && matchesTopic && matchesAccess
    })
  }, [allResources, typeFilter, topicParam, accessFilter, query])

  return (
    <>
      <PageHeader
        title="Resource Library"
        description="Reports, toolkits, policy briefs, and research for inclusive education — filterable and downloadable."
      />

      <div className="container-page py-12">
        <form
          className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm"
          role="search"
            onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="text-lg font-semibold text-ink">Search and filter</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="resource-search" className="block text-sm font-medium text-ink">
                Search resources
              </label>
              <input
                id="resource-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setPage(1)
                  setQuery(e.target.value)
                }}
                className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3"
                placeholder="Search by title or description"
              />
            </div>
            <div>
              <label htmlFor="resource-type" className="block text-sm font-medium text-ink">
                Resource type
              </label>
              <select
                id="resource-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ResourceType | '')}
                className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3"
              >
                {RESOURCE_TYPES.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="access-level" className="block text-sm font-medium text-ink">
                Access level
              </label>
              <select
                id="access-level"
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as any)}
                className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3"
              >
                <option value="ALL">All access levels</option>
                <option value="PUBLIC">Publicly available</option>
                <option value="MEMBERS_ONLY">Member-only content</option>
              </select>
            </div>
          </div>
          {topicParam && (
            <p className="mt-3 text-sm text-muted" role="status">
              Filtering by topic: <strong>{topicParam.replace(/-/g, ' ')}</strong>
            </p>
          )}
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            Showing {filtered.length} of {totalCount} resources
          </p>
        </form>

        {resourcesQuery.isLoading ? (
          <LoadingSpinner label="Loading resources" />
        ) : filtered.length === 0 ? (
          <p className="mt-12 text-center text-muted" role="status">
            No resources match your search. Try different keywords or filters.
          </p>
        ) : (
          <>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resource) => (
                <li key={resource.id}>
                  <ResourceCard resource={resource} />
                </li>
              ))}
            </ul>
            {resourcesQuery.data && (
              <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Resource pagination">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={!resourcesQuery.data.previous}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className="text-sm text-muted">Page {page}</span>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={!resourcesQuery.data.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
        {resourcesQuery.isError && (
          <p className="mt-6 text-sm text-red-700" role="status">
            Could not load latest resources from API.
          </p>
        )}
      </div>
    </>
  )
}
