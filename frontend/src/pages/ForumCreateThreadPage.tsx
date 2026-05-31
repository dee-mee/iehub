import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type ForumCategory = {
  id: number
  name: string
  slug: string
}

export function ForumCreateThreadPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { data: category, isLoading } = useQuery<ForumCategory>({
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

  const createThreadMutation = useMutation({
    mutationFn: async (payload: { title: string, content: string }) => {
      if (!category) return
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      
      // 1. Create Thread
      const threadResponse = await fetch(`${API_BASE_URL}/forum/threads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          category: category.id,
          title: payload.title
        })
      })
      if (!threadResponse.ok) throw new Error('Failed to create thread')
      const thread = await threadResponse.json()

      // 2. Create Initial Post
      const postResponse = await fetch(`${API_BASE_URL}/forum/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          thread: thread.id,
          content: payload.content
        })
      })
      if (!postResponse.ok) throw new Error('Failed to create initial post')
      
      return thread
    },
    onSuccess: (thread) => {
      navigate(`/forum/t/${thread.slug}`)
    }
  })

  if (isLoading) {
    return (
      <MemberPageShell title="New discussion">
        <LoadingSpinner label="Preparing form..." />
      </MemberPageShell>
    )
  }

  if (!category) {
    return (
      <MemberPageShell title="New discussion">
        <p className="text-center text-gray-500">Category not found.</p>
      </MemberPageShell>
    )
  }

  return (
    <MemberPageShell title="Start new discussion">
      <p className="text-sm text-gray-600 mb-6">Posting in {category.name}</p>
        <div className="max-w-3xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); createThreadMutation.mutate({ title, content }); }}
            className="card space-y-6"
          >
            <div>
              <label htmlFor="title" className="label">Discussion Title</label>
              <input
                id="title"
                type="text"
                className="input"
                placeholder="What would you like to discuss?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={255}
              />
              <p className="mt-1 text-xs text-muted">Keep it descriptive and concise.</p>
            </div>

            <div>
              <label className="label">Message</label>
              <RichTextEditor
                value={content}
                onChange={(data) => setContent(data)}
                placeholder="Provide details, context, or ask a question to start the conversation..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => navigate(`/forum/c/${slug}`)}
                className="btn-secondary flex-1"
                disabled={createThreadMutation.isPending}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary flex-1"
                disabled={createThreadMutation.isPending || !title.trim() || !content.trim()}
              >
                {createThreadMutation.isPending ? 'Creating...' : 'Start Discussion'}
              </button>
            </div>
          </form>
        </div>
    </MemberPageShell>
  )
}
