import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

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

  if (catLoading || threadsLoading) return <LoadingSpinner label="Loading threads..." />

  if (!category) return <div className="container-page py-12 text-center">Category not found.</div>

  return (
    <>
      <div className="bg-primary-50 border-b border-primary-100 py-8">
        <div className="container-page flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
              {category.icon || '💬'}
            </div>
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
                <Link to="/forum" className="hover:underline">Forum</Link>
                <span>/</span>
                <span>Category</span>
              </nav>
              <h1 className="text-2xl font-bold text-ink">{category.name}</h1>
              <p className="text-muted mt-1">{category.description}</p>
            </div>
          </div>
          <div>
            <Link to={`/forum/c/${slug}/new`} className="btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Start New Thread
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="card divide-y divide-primary-100 overflow-hidden">
          <div className="bg-primary-900/5 px-6 py-3 flex items-center text-xs font-bold text-primary-800 uppercase tracking-wider">
            <div className="flex-1">Discussion</div>
            <div className="w-24 text-center hidden md:block">Stats</div>
            <div className="w-48 text-right hidden md:block">Last Activity</div>
          </div>

          {threads?.map((thread) => (
            <div key={thread.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-primary-50/50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {thread.is_pinned && (
                    <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-[10px] font-bold rounded uppercase">Pinned</span>
                  )}
                  {thread.is_announcement && (
                    <span className="px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded uppercase">Hub Update</span>
                  )}
                </div>
                <Link to={`/forum/t/${thread.slug}`} className="text-lg font-bold text-ink hover:text-primary-700 transition-colors block leading-snug">
                  {thread.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <span>by <span className="font-medium text-primary-700">{thread.author.first_name || thread.author.username}</span></span>
                  <span className="text-primary-200">•</span>
                  <span>{new Date(thread.last_activity).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="w-24 flex-row md:flex-col items-center justify-center gap-4 md:gap-0 hidden md:flex">
                <div className="text-center">
                  <span className="block text-lg font-bold text-ink leading-none">{thread.post_count}</span>
                  <span className="text-[10px] text-muted uppercase font-bold tracking-tighter leading-none">Posts</span>
                </div>
              </div>

              <div className="w-48 text-right hidden md:block">
                <span className="text-sm text-ink block font-medium">Last active</span>
                <span className="text-xs text-muted block italic">
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
      </div>
    </>
  )
}
