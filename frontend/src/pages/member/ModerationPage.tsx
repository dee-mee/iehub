import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiFetch, apiList } from '@/api/client'

type Report = {
  id: number
  reason: string
  description: string
  status: string
  created_at: string
  post: number
}

type PendingMember = {
  id: number
  email: string
  first_name: string
  last_name: string
  organization: string
  professional_title: string
  country: string
}

export function ModerationPage() {
  const queryClient = useQueryClient()
  
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['forum-reports'],
    queryFn: () =>
      apiFetch<{ results?: Report[] } | Report[]>('/forum/reports/?status=PENDING').then(apiList),
  })

  const { data: pendingMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['pending-members'],
    queryFn: () =>
      apiFetch<{ results?: PendingMember[] } | PendingMember[]>('/auth/admin/pending/').then(apiList),
  })

  const reviewMutation = useMutation({
    mutationFn: ({ id, action_taken }: { id: number; action_taken: string }) =>
      apiFetch(`/forum/reports/${id}/review/`, {
        method: 'POST',
        body: JSON.stringify({ action_taken, review_notes: 'Reviewed from member portal' }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forum-reports'] }),
  })

  const approveMemberMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'approve' | 'reject' }) =>
      apiFetch(`/auth/admin/approve/${id}/`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-members'] }),
  })

  return (
    <MemberPageShell title="Moderation & Administration">
      <div className="space-y-12">
        {/* Member Approvals Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Pending Memberships</h2>
            <div className="h-px bg-slate-100 flex-1 ml-4" />
          </div>
          
          {membersLoading ? (
            <LoadingSpinner label="Loading pending members..." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(pendingMembers ?? []).map((member) => (
                <article key={member.id} className="member-panel flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-gray-900">{member.first_name} {member.last_name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded">PENDING</span>
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-semibold">Role:</span> {member.professional_title}<br />
                      <span className="font-semibold">Org:</span> {member.organization}<br />
                      <span className="font-semibold">Country:</span> {member.country}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                    <button
                      type="button"
                      className="flex-1 text-xs font-bold px-3 py-2 border-2 border-[#2d2d2d] bg-[#e6f5f0] text-[#006b4f] hover:shadow-[2px_2px_0_#2d2d2d] transition-all"
                      onClick={() => approveMemberMutation.mutate({ id: member.id, action: 'approve' })}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="flex-1 text-xs font-bold px-3 py-2 border-2 border-[#2d2d2d] bg-red-50 text-red-800 hover:shadow-[2px_2px_0_#2d2d2d] transition-all"
                      onClick={() => approveMemberMutation.mutate({ id: member.id, action: 'reject' })}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
              {(pendingMembers ?? []).length === 0 && (
                <p className="text-gray-500 text-sm">No pending member requests.</p>
              )}
            </div>
          )}
        </section>

        {/* Forum Reports Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Content Reports</h2>
            <div className="h-px bg-slate-100 flex-1 ml-4" />
          </div>

          {reportsLoading ? (
            <LoadingSpinner label="Loading reports..." />
          ) : (
            <div className="space-y-4">
              {(reports ?? []).map((report) => (
                <article key={report.id} className="member-panel">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900">{report.reason}</p>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Post #{report.post} · {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        className="text-xs font-bold px-3 py-1.5 border-2 border-[#2d2d2d] bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() =>
                          reviewMutation.mutate({ id: report.id, action_taken: 'Dismissed' })
                        }
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        className="text-xs font-bold px-3 py-1.5 border-2 border-[#2d2d2d] bg-red-50 text-red-800 hover:bg-red-100"
                        onClick={() =>
                          reviewMutation.mutate({ id: report.id, action_taken: 'Post hidden' })
                        }
                      >
                        Take action
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {(reports ?? []).length === 0 && (
                <p className="text-gray-500 text-sm">No pending content reports.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </MemberPageShell>
  )
}
