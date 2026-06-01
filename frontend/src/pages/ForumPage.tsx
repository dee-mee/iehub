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

  const CategoryCard = ({ category }: { category: ForumCategory }) => (
    <Link
      to={`/forum/c/${category.slug}`}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md hover:border-primary-100 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0 shadow-sm">
        {category.icon || '💬'}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{category.name}</h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{category.description}</p>
        <div className="flex gap-4 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="text-slate-900">{category.thread_count}</span> threads
          </span>
          <span className="flex items-center gap-1">
            <span className="text-slate-900">{category.post_count}</span> posts
          </span>
        </div>
      </div>
    </Link>
  )

  const Section = ({ title, icon, items }: { title: string; icon: string; items: ForumCategory[] }) =>
    items.length > 0 ? (
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <div className="h-px bg-slate-100 flex-1 ml-4" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>
    ) : null

  return (
    <MemberPageShell title="Discussions">
      <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100/50 mb-10">
        <p className="text-sm text-slate-700 font-medium">
          Welcome back{user?.first_name ? `, ${user.first_name}` : ''}.
          <span className="text-slate-500 ml-1">
            Browse categories matched to your membership
            {user?.profile?.expertise_areas?.length
              ? ` and expertise (${user.profile.expertise_areas.map((t) => t.name).join(', ')})`
              : ''}
            .
          </span>
        </p>
      </div>

      <div className="space-y-16">
        <Section title="Announcements" icon="📢" items={announcements} />
        <Section title="General Discussion" icon="💬" items={general} />
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
