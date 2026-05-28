import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

type ForumCategory = {
  id: number
  name: string
  slug: string
  description: string
  category_type: 'COUNTRY' | 'THEMATIC' | 'GENERAL' | 'ANNOUNCEMENT'
  icon: string
  thread_count: number
  post_count: number
}

export function ForumPage() {
  const { data: categories, isLoading, error } = useQuery<ForumCategory[]>({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/forum/categories/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch forum categories')
      return response.json()
    }
  })

  if (isLoading) return <LoadingSpinner label="Loading forum..." />

  const announcements = categories?.filter(c => c.category_type === 'ANNOUNCEMENT') || []
  const general = categories?.filter(c => c.category_type === 'GENERAL') || []
  const thematic = categories?.filter(c => c.category_type === 'THEMATIC') || []
  const country = categories?.filter(c => c.category_type === 'COUNTRY') || []

  const CategoryCard = ({ category }: { category: ForumCategory }) => (
    <Link 
      to={`/forum/c/${category.slug}`} 
      className="card hover:border-primary-400 transition-all group flex items-start gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
        {category.icon || '💬'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-ink group-hover:text-primary-700 transition-colors">{category.name}</h3>
        <p className="text-sm text-muted mt-1 line-clamp-2">{category.description}</p>
        <div className="flex gap-4 mt-3 text-xs font-medium text-muted">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {category.thread_count} threads
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            {category.post_count} posts
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <>
      <PageHeader 
        title="Community of Practice" 
        description="Share knowledge, discuss challenges, and connect with peers." 
      />

      <div className="container-page py-12 space-y-12">
        {/* Announcements */}
        {announcements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <span className="text-accent-500">📢</span> Announcements
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {announcements.map(c => <CategoryCard key={c.id} category={c} />)}
            </div>
          </section>
        )}

        {/* General Discussion */}
        <section>
          <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
            <span className="text-primary-600">💬</span> General Discussion
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {general.map(c => <CategoryCard key={c.id} category={c} />)}
          </div>
        </section>

        {/* Thematic Groups */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <span className="text-primary-600">🎯</span> Thematic Communities
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {thematic.map(c => <CategoryCard key={c.id} category={c} />)}
          </div>
        </section>

        {/* Country Groups */}
        <section>
          <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
            <span className="text-primary-600">🌍</span> Regional Groups
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {country.map(c => <CategoryCard key={c.id} category={c} />)}
          </div>
        </section>

        {error && (
          <div className="card p-8 text-center text-red-600 bg-red-50">
            Error loading forum. Please ensure you are logged in.
          </div>
        )}
      </div>
    </>
  )
}
