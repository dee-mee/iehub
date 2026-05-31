import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MemberPageShell } from '@/components/member/MemberPageShell'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type ForumThread = {
  id: number
  title: string
  slug: string
  author: {
    first_name: string
    last_name: string
    username: string
  }
  is_pinned: boolean
  is_locked: boolean
  is_announcement: boolean
  view_count: number
  last_activity: string
  post_count: number
}

type ForumCategory = {
  id: number
  name: string
  slug: string
  description: string
  icon: string
}

export function ForumCategoryPage() {
  const { slug } = useParams()

  const { data: category, isLoading: catLoading } = useQuery<ForumCategory>({
    queryKey: ['forum-category', slug],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/categories/${slug}/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch category')
      return response.json()
    },
    enabled: !!slug
  })

  const { data: threads, isLoading: threadsLoading } = useQuery<ForumThread[]>({
    queryKey: ['forum-threads', slug],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/threads/?category__slug=${slug}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch threads')
      const data = await response.json()
      return data.results || data 
    },
    enabled: !!slug
  })

  if (catLoading || threadsLoading) {
    return (
      <MemberPageShell title="Category">
        <LoadingSpinner label="Loading threads..." />
      </MemberPageShell>
    )
  }

  if (!category) {
    return (
      <MemberPageShell title="Category">
        <p className="text-center text-gray-500">Category not found.</p>
      </MemberPageShell>
    )
  }

  return (
    <MemberPageShell
      title={category.name}
      actions={
        <Link to={`/forum/c/${slug}/new`} className="member-btn-primary text-sm flex items-center gap-2">
          Start new thread
        </Link>
      }
    >
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">
          <Link to="/forum" className="hover:text-primary-700 transition-colors">Forum</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{category.name}</span>
        </nav>
        <p className="text-slate-500 max-w-3xl leading-relaxed">{category.description}</p>
      </div>

      <div className="member-panel p-0 divide-y divide-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex-1">Discussion</div>
            <div className="w-24 text-center hidden md:block">Stats</div>
            <div className="w-48 text-right hidden md:block">Last Activity</div>
          </div>

          {threads?.map((thread) => (
            <div key={thread.id} className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50/50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  {thread.is_pinned && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wider">Pinned</span>
                  )}
                  {thread.is_announcement && (
                    <span className="px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">Hub Update</span>
                  )}
                </div>
                <Link to={`/forum/t/${thread.slug}`} className="text-lg font-bold text-slate-900 hover:text-primary-600 transition-colors block leading-snug">
                  {thread.title}
                </Link>
                <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-400">
                  <span>by <span className="font-bold text-slate-700">{thread.author.first_name || thread.author.username}</span></span>
                  <span className="text-slate-200">•</span>
                  <span>{new Date(thread.last_activity).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="w-24 flex-row md:flex-col items-center justify-center gap-4 md:gap-0 hidden md:flex">
                <div className="text-center">
                  <span className="block text-xl font-bold text-slate-900 leading-none">{thread.post_count}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none mt-1">Posts</span>
                </div>
              </div>

              <div className="w-48 text-right hidden md:block">
                <span className="text-sm text-slate-700 block font-bold">Last activity</span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {new Date(thread.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {threads?.length === 0 && (
            <div className="px-6 py-12 text-center text-muted">
              No discussions have been started in this category yet.
              <div className="mt-4">
                <Link to={`/forum/c/${slug}/new`} className="text-primary-700 font-bold hover:underline">Be the first to post!</Link>
              </div>
            </div>
          )}
        </div>
    </MemberPageShell>
  )
}
