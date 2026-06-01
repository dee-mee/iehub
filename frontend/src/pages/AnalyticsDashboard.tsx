import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { apiFetch } from '@/api/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type AnalyticsData = {
  members: {
    total: number
    verified: number
    approved: number
    new_30d: number
  }
  content: {
    resources: number
    public_resources: number
    private_resources: number
    downloads: number
  }
  forum: {
    threads: number
    posts: number
    reactions: number
    new_threads_30d: number
    new_posts_30d: number
  }
  regional: Array<{ country: string, count: number }>
}

export function AnalyticsDashboard() {
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['platform-analytics'],
    queryFn: () => apiFetch<AnalyticsData>('/analytics/')
  })

  if (isLoading) {
    return (
      <MemberPageShell title="Analytics">
        <LoadingSpinner label="Collecting platform data..." />
      </MemberPageShell>
    )
  }

  if (error || !data) {
    return (
      <MemberPageShell title="Analytics">
        <p className="text-red-600 mb-4">Error loading analytics data.</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </MemberPageShell>
    )
  }

  return (
    <MemberPageShell title="Platform Analytics">
      <p className="text-sm text-gray-600 mb-6">
        Growth, engagement, and impact metrics across the IE Hub community.
      </p>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="member-stat-card text-center py-8">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Total Members</p>
            <p className="text-4xl font-bold text-ink">{data.members.total}</p>
            <p className="text-xs text-green-600 font-bold mt-2">
              {data.members.approved} Approved · +{data.members.new_30d} new
            </p>
          </div>
          <div className="member-stat-card text-center py-8">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Resources</p>
            <p className="text-4xl font-bold text-ink">{data.content.resources}</p>
            <p className="text-xs text-primary-600 font-bold mt-2">{data.content.private_resources} Members-only</p>
          </div>
          <div className="member-stat-card text-center py-8">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Downloads</p>
            <p className="text-4xl font-bold text-ink">{data.content.downloads}</p>
            <p className="text-xs text-muted font-bold mt-2">Continental Impact</p>
          </div>
          <div className="member-stat-card text-center py-8">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Forum Posts</p>
            <p className="text-4xl font-bold text-ink">{data.forum.posts}</p>
            <p className="text-xs text-accent-600 font-bold mt-2">
              {data.forum.reactions} Reactions · +{data.forum.new_posts_30d} new
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Regional Table */}
          <section className="member-panel">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Membership by Country
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-primary-50 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <th className="pb-3">Country</th>
                    <th className="pb-3 text-right">Members</th>
                    <th className="pb-3 text-right">Market Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50">
                  {data.regional.map((region) => (
                    <tr key={region.country}>
                      <td className="py-3 font-medium text-ink">{region.country || 'Unknown'}</td>
                      <td className="py-3 text-right font-bold text-primary-700">{region.count}</td>
                      <td className="py-3 text-right text-muted text-xs">
                        {((region.count / data.members.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Admin Actions */}
          <section className="space-y-6">
            <div className="member-panel bg-[#e6f5f0]">
              <h2 className="text-lg font-bold text-accent-900 mb-2">Pending Member Approvals</h2>
              <p className="text-accent-800 text-sm mb-4">There are {data.members.verified - data.members.approved} members awaiting review.</p>
              <a href="/admin/users/customuser/?is_approved__exact=0&is_verified__exact=1" className="btn-primary bg-accent-600 hover:bg-accent-700 border-none text-white inline-block">
                Open Admin Approval
              </a>
            </div>

            <div className="member-panel">
              <h2 className="text-lg font-bold text-ink mb-4">Oversight Shortcuts</h2>
              <ul className="space-y-3">
                <li>
                  <a href="/admin/forum/forumpost/?is_approved__exact=0" className="flex items-center justify-between p-3 border-2 border-[#2d2d2d] hover:bg-[#f0f0f0] transition-colors">
                    <span className="text-sm font-medium">Unapproved Forum Posts</span>
                    <span className="bg-[#e6f5f0] text-[#006b4f] px-2 py-0.5 border border-[#2d2d2d] text-[10px] font-bold">Manage</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/public/resource/" className="flex items-center justify-between p-3 border-2 border-[#2d2d2d] hover:bg-[#f0f0f0] transition-colors">
                    <span className="text-sm font-medium">Resource Library Management</span>
                    <span className="bg-[#e6f5f0] text-[#006b4f] px-2 py-0.5 border border-[#2d2d2d] text-[10px] font-bold">Manage</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/public/donation/" className="flex items-center justify-between p-3 border-2 border-[#2d2d2d] hover:bg-[#f0f0f0] transition-colors">
                    <span className="text-sm font-medium">Donation Records</span>
                    <span className="bg-[#e6f5f0] text-[#006b4f] px-2 py-0.5 border border-[#2d2d2d] text-[10px] font-bold">View</span>
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </MemberPageShell>
  )
}
