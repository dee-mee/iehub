import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { fetchResources } from '@/api/public'

export function MemberResourcesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['member-resources'],
    queryFn: () => fetchResources({ page: 1 }),
  })

  return (
    <MemberPageShell title="Member Resources">
      <p className="text-sm text-gray-600 mb-6">
        Curated tools and publications for IE Hub members. Open a resource for downloads and details.
      </p>
      {isLoading ? (
        <LoadingSpinner label="Loading resources..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.results ?? []).map((resource) => (
            <Link
              key={resource.id}
              to={`/member-resources/${resource.id}`}
              className="oxygen-grid-card"
            >
              <p className="text-xs font-bold text-[#00a170] uppercase">{resource.resourceType}</p>
              <h3 className="font-bold text-gray-900 mt-1">{resource.title}</h3>
              {resource.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{resource.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </MemberPageShell>
  )
}
