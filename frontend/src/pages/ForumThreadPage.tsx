import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type ForumPost = {
  id: number
  content: string
  author: {
    id: number
    first_name: string
    last_name: string
    username: string
    professional_title?: string
    organization?: string
  }
  created_at: string
  reaction_counts: Record<string, number>
  user_reaction: string | null
}

type ForumThread = {
  id: number
  title: string
  slug: string
  category: number
}

const REACTION_TYPES = [
  { type: 'LIKE', emoji: '👍', label: 'Like' },
  { type: 'INSIGHTFUL', emoji: '💡', label: 'Insightful' },
  { type: 'HELPFUL', emoji: '🤝', label: 'Helpful' },
  { type: 'CELEBRATE', emoji: '🙌', label: 'Celebrate' },
]

export function ForumThreadPage() {
  const { slug } = useParams()
  const queryClient = useQueryClient()
  const [replyContent, setReplyContent] = useState('')

  const { data: thread, isLoading: threadLoading } = useQuery<ForumThread>({
    queryKey: ['forum-thread', slug],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/threads/${slug}/`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch thread')
      return response.json()
    },
    enabled: !!slug,
  })

  const { data: posts, isLoading: postsLoading } = useQuery<ForumPost[]>({
    queryKey: ['forum-posts', slug],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/posts/?thread__slug=${slug}`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      return data.results || data
    },
    enabled: !!slug,
  })

  const postReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!thread) return
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          thread: thread.id,
          content: content,
        }),
      })
      if (!response.ok) throw new Error('Failed to post reply')
      return response.json()
    },
    onSuccess: () => {
      setReplyContent('')
      queryClient.invalidateQueries({ queryKey: ['forum-posts', slug] })
    },
  })

  const reactMutation = useMutation({
    mutationFn: async ({ postId, type }: { postId: number; type: string }) => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/react/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          reaction_type: type,
        }),
      })
      if (!response.ok) throw new Error('Failed to react')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts', slug] })
    },
  })

  if (threadLoading || postsLoading) {
    return (
      <MemberPageShell title="Discussion">
        <LoadingSpinner label="Loading discussion..." />
      </MemberPageShell>
    )
  }

  if (!thread) {
    return (
      <MemberPageShell title="Discussion">
        <p className="text-gray-600">Thread not found.</p>
        <Link to="/forum" className="btn-primary inline-block mt-4">
          Back to forum
        </Link>
      </MemberPageShell>
    )
  }

  return (
    <MemberPageShell title={thread.title}>
      <nav className="text-xs font-extrabold text-[#00a170] uppercase tracking-wider mb-6">
        <Link to="/forum" className="hover:underline">
          Forum
        </Link>
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-gray-600">Discussion</span>
      </nav>

      <div className="max-w-4xl space-y-6">
        {posts?.map((post) => (
          <article
            key={post.id}
            className="member-panel p-0 overflow-hidden flex flex-col md:flex-row"
          >
            <div className="w-full md:w-48 bg-[#f0f0f0] p-6 border-b-2 md:border-b-0 md:border-r-2 border-[#2d2d2d] flex flex-row md:flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#2d2d2d] bg-[#e6f5f0] flex items-center justify-center text-[#00a170] font-extrabold text-xl shrink-0">
                {post.author.first_name?.[0]}
                {post.author.last_name?.[0]}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-gray-900 truncate">
                  {post.author.first_name} {post.author.last_name}
                </div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1 truncate">
                  {post.author.professional_title || 'Member'}
                </div>
                <div className="text-[10px] text-[#00a170] font-bold mt-0.5 truncate">
                  {post.author.organization}
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between min-h-[200px]">
              <div>
                <div
                  className="prose prose-sm max-w-none text-gray-800 ck-content mb-8"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  {REACTION_TYPES.map((rt) => {
                    const count = post.reaction_counts[rt.type] || 0
                    const isActive = post.user_reaction === rt.type
                    if (count === 0 && !isActive) return null
                    return (
                      <button
                        key={rt.type}
                        type="button"
                        onClick={() => reactMutation.mutate({ postId: post.id, type: rt.type })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border-2 border-[#2d2d2d] ${
                          isActive
                            ? 'bg-[#e6f5f0] text-[#006b4f]'
                            : 'bg-white text-gray-600 hover:bg-[#fafafa]'
                        }`}
                      >
                        <span>{rt.emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t-2 border-[#e5e5e5] flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-[#00a170]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      React
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-white border-2 border-[#2d2d2d] p-1 gap-1 z-10">
                      {REACTION_TYPES.map((rt) => (
                        <button
                          key={rt.type}
                          type="button"
                          onClick={() => reactMutation.mutate({ postId: post.id, type: rt.type })}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#e6f5f0] text-lg border border-transparent hover:border-[#2d2d2d]"
                          title={rt.label}
                        >
                          {rt.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-[#00a170]"
                  >
                    Quote
                  </button>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 italic">
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </article>
        ))}

        <div className="member-panel mt-8 border-dashed">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Post a Reply</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              postReplyMutation.mutate(replyContent)
            }}
          >
            <RichTextEditor
              value={replyContent}
              onChange={(data) => setReplyContent(data)}
              placeholder="Share your thoughts or ask a question..."
            />
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="btn-primary px-8"
                disabled={
                  postReplyMutation.isPending || !replyContent.trim() || replyContent === '<p></p>'
                }
              >
                {postReplyMutation.isPending ? 'Posting...' : 'Submit Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MemberPageShell>
  )
}
