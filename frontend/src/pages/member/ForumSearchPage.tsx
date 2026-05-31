import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiFetch, apiList } from '@/api/client'

type Thread = {
  id: number
  title: string
  slug: string
  category_name: string
  post_count: number
  last_activity: string
}

export function ForumSearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''

  const threadsQuery = useQuery({
    queryKey: ['forum-search', q],
    queryFn: () =>
      apiFetch<{ results?: Thread[] } | Thread[]>(
        `/forum/threads/?search=${encodeURIComponent(q)}&ordering=-last_activity`,
      ).then(apiList),
    enabled: q.length > 1,
  })

  return (
    <MemberPageShell title="Search">
      <p className="text-sm text-gray-600 mb-4">
        {q ? (
          <>
            Results for <strong>&quot;{q}&quot;</strong>
          </>
        ) : (
          'Use the search bar above to find threads and discussions.'
        )}
      </p>
      {q.length <= 1 ? null : threadsQuery.isLoading ? (
        <LoadingSpinner label="Searching..." />
      ) : (
        <div className="member-panel p-0 divide-y-2 divide-[#e5e5e5]">
          {(threadsQuery.data ?? []).map((thread) => (
            <Link
              key={thread.id}
              to={`/forum/t/${thread.slug}`}
              className="block p-4 hover:bg-gray-50"
            >
              <p className="font-semibold text-gray-900">{thread.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {thread.category_name} · {thread.post_count} posts ·{' '}
                {new Date(thread.last_activity).toLocaleDateString()}
              </p>
            </Link>
          ))}
          {(threadsQuery.data ?? []).length === 0 && (
            <p className="p-8 text-center text-gray-500 text-sm">No threads found.</p>
          )}
        </div>
      )}
    </MemberPageShell>
  )
}
