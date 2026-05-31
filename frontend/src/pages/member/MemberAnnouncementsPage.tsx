import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiFetch, apiList } from '@/api/client'

type Thread = {
  id: number
  title: string
  slug: string
  created_at: string
  author: { first_name: string; username: string }
  post_count: number
}

export function MemberAnnouncementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['announcement-threads'],
    queryFn: async () => {
      const byFlag = await apiFetch<{ results?: Thread[] } | Thread[]>(
        '/forum/threads/?is_announcement=true&ordering=-created_at',
      ).then(apiList)
      if (byFlag.length > 0) return byFlag
      const cats = await apiFetch<{ results?: { slug: string }[] } | { slug: string }[]>(
        '/forum/categories/?category_type=ANNOUNCEMENT',
      ).then(apiList)
      const slug = cats[0]?.slug
      if (!slug) return []
      return apiFetch<{ results?: Thread[] } | Thread[]>(
        `/forum/threads/?category__slug=${slug}&ordering=-created_at`,
      ).then(apiList)
    },
  })

  return (
    <MemberPageShell title="Announcements">
      {isLoading ? (
        <LoadingSpinner label="Loading announcements..." />
      ) : (
        <div className="member-panel p-0 divide-y-2 divide-[#e5e5e5]">
          {(data ?? []).map((thread) => (
            <Link
              key={thread.id}
              to={`/forum/t/${thread.slug}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold text-gray-900">{thread.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {thread.author.first_name || thread.author.username} ·{' '}
                  {new Date(thread.created_at).toLocaleDateString()} · {thread.post_count} replies
                </p>
              </div>
              <span className="text-[#00a170] text-sm font-bold">Read →</span>
            </Link>
          ))}
          {(data ?? []).length === 0 && (
            <p className="p-8 text-center text-gray-500 text-sm">No announcements yet.</p>
          )}
        </div>
      )}
    </MemberPageShell>
  )
}
