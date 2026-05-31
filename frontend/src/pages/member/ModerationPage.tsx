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

export function ModerationPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['forum-reports'],
    queryFn: () =>
      apiFetch<{ results?: Report[] } | Report[]>('/forum/reports/?status=PENDING').then(apiList),
  })

  const reviewMutation = useMutation({
    mutationFn: ({ id, action_taken }: { id: number; action_taken: string }) =>
      apiFetch(`/forum/reports/${id}/review/`, {
        method: 'POST',
        body: JSON.stringify({ action_taken, review_notes: 'Reviewed from member portal' }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forum-reports'] }),
  })

  return (
    <MemberPageShell title="Moderation">
      <p className="text-sm text-gray-600 mb-6">
        Review flagged posts and community reports. Resolve or escalate items pending investigation.
      </p>
      {isLoading ? (
        <LoadingSpinner label="Loading reports..." />
      ) : (
        <div className="space-y-4">
          {(data ?? []).map((report) => (
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
                    className="text-xs font-bold px-3 py-1.5 border-2 border-[#2d2d2d] bg-[#e6f5f0] text-[#006b4f]"
                    onClick={() =>
                      reviewMutation.mutate({ id: report.id, action_taken: 'Dismissed — no violation' })
                    }
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    className="text-xs font-bold px-3 py-1.5 border-2 border-[#2d2d2d] bg-red-50 text-red-800"
                    onClick={() =>
                      reviewMutation.mutate({ id: report.id, action_taken: 'Post hidden by moderator' })
                    }
                  >
                    Take action
                  </button>
                </div>
              </div>
            </article>
          ))}
          {(data ?? []).length === 0 && (
            <p className="text-gray-500 text-sm">No pending reports. Great job keeping the community healthy!</p>
          )}
        </div>
      )}
    </MemberPageShell>
  )
}
