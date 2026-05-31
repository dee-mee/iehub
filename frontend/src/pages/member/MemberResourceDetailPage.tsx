import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { fetchResourceById } from '@/api/public'

export function MemberResourceDetailPage() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['member-resource', id],
    queryFn: () => fetchResourceById(id ?? ''),
    enabled: Boolean(id),
  })

  return (
    <MemberPageShell title={data?.title ?? 'Resource'}>
      <Link to="/member-resources" className="text-sm text-[#00a170] font-semibold hover:underline mb-4 inline-block">
        ← Back to resources
      </Link>
      {isLoading ? (
        <LoadingSpinner label="Loading..." />
      ) : data ? (
        <article className="card max-w-3xl">
          <p className="text-xs font-bold text-[#00a170] uppercase">{data.resourceType}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{data.title}</h1>
          {data.description && <p className="text-gray-600 mt-4">{data.description}</p>}
        </article>
      ) : (
        <p className="text-gray-500">Resource not found.</p>
      )}
    </MemberPageShell>
  )
}
