import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiFetch, apiList } from '@/api/client'
import { useAuth } from '@/context/AuthContext'

type ForumCategory = {
  id: number
  name: string
  slug: string
  description: string
  category_type: 'COUNTRY' | 'THEMATIC' | 'GENERAL' | 'ANNOUNCEMENT' | 'EXPERT_ONLY'
  icon: string
  thread_count: number
  post_count: number
  can_access?: boolean
}

export function ForumPage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const filterType = params.get('type')

  const { data: categories, isLoading, error } = useQuery<ForumCategory[]>({
    queryKey: ['forum-categories'],
    queryFn: () =>
      apiFetch<{ results?: ForumCategory[] } | ForumCategory[]>('/forum/categories/').then(
        (data) => apiList(data).filter((c) => c.can_access !== false),
      ),
  })

  if (isLoading) {
    return (
      <MemberPageShell title="Discussions">
        <LoadingSpinner label="Loading forum..." />
      </MemberPageShell>
    )
  }

  const list = filterType
    ? categories?.filter((c) => c.category_type === filterType) ?? []
    : categories ?? []

  const announcements = list.filter((c) => c.category_type === 'ANNOUNCEMENT')
  const general = list.filter((c) => c.category_type === 'GENERAL')
  const thematic = list.filter((c) => c.category_type === 'THEMATIC')
  const country = list.filter((c) => c.category_type === 'COUNTRY')
  const expert = list.filter((c) => c.category_type === 'EXPERT_ONLY')

  const CategoryCard = ({ category }: { category: ForumCategory }) => (
    <Link
      to={`/forum/c/${category.slug}`}
      className="oxygen-grid-card group flex-row items-start gap-4"
    >
      <div className="w-12 h-12 border-2 border-[#2d2d2d] bg-[#e6f5f0] flex items-center justify-center text-2xl group-hover:bg-[#00a170] group-hover:text-white transition-colors shrink-0">
        {category.icon || '💬'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold text-gray-900 group-hover:text-[#00a170] transition-colors">{category.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
        <div className="flex gap-4 mt-3 text-xs font-medium text-gray-500">
          <span>{category.thread_count} threads</span>
          <span>{category.post_count} posts</span>
        </div>
      </div>
    </Link>
  )

  const Section = ({ title, icon, items }: { title: string; icon: string; items: ForumCategory[] }) =>
    items.length > 0 ? (
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>
    ) : null

  return (
    <MemberPageShell title="Discussions">
      <p className="text-sm text-gray-600 mb-8">
        Welcome{user?.first_name ? `, ${user.first_name}` : ''}. Browse categories matched to your membership
        {user?.profile?.expertise_areas?.length
          ? ` and expertise (${user.profile.expertise_areas.map((t) => t.name).join(', ')})`
          : ''}
        .
      </p>

      <div className="space-y-12">
        <Section title="Announcements" icon="📢" items={announcements} />
        <Section title="General Discussion" icon="💬" items={general} />
        <Section title="Expert Discussions" icon="⭐" items={expert} />
        <Section title="Thematic Communities" icon="🎯" items={thematic} />
        <Section title="Regional Groups" icon="🌍" items={country} />

        {error && (
          <div className="card p-8 text-center text-red-600 bg-red-50">
            Error loading forum. Please try again later.
          </div>
        )}
        {!error && list.length === 0 && (
          <p className="text-gray-500 text-sm">No categories available for your profile yet.</p>
        )}
      </div>
    </MemberPageShell>
  )
}
