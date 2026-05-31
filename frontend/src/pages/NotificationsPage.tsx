import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiFetch, apiList } from '@/api/client'

type Notification = {
  id: number
  notification_type: 'SYSTEM' | 'FORUM_REPLY' | 'MEMBER_APPROVAL' | 'NEW_RESOURCE'
  title: string
  message: string
  link: string
  is_read: boolean
  created_at: string
}

const typeIcons: Record<string, string> = {
  SYSTEM: '⚙️',
  FORUM_REPLY: '💬',
  MEMBER_APPROVAL: '✅',
  NEW_RESOURCE: '📚',
}

export function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () =>
      apiFetch<{ results?: Notification[] } | Notification[]>('/auth/notifications/').then(apiList),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/auth/notifications/${id}/mark_read/`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['member-unread-counts'] })
    },
  })

  if (isLoading) {
    return (
      <MemberPageShell title="Notifications">
        <LoadingSpinner label="Loading notifications..." />
      </MemberPageShell>
    )
  }

  return (
    <MemberPageShell title="Notifications">
      <div className="max-w-3xl">
        <div className="member-panel p-0 divide-y-2 divide-[#e5e5e5]">
          {data?.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 flex gap-4 border-b-2 border-[#e5e5e5] last:border-b-0 ${notification.is_read ? 'bg-white' : 'bg-[#e6f5f0]'}`}
            >
              <div className="w-10 h-10 bg-white border-2 border-[#2d2d2d] flex items-center justify-center text-xl shrink-0">
                {typeIcons[notification.notification_type] ?? '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-bold text-gray-900 ${notification.is_read ? 'opacity-70' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className={`mt-1 text-sm text-gray-600 ${notification.is_read ? 'opacity-70' : ''}`}>
                  {notification.message}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  {notification.link && (
                    <Link
                      to={notification.link.startsWith('/') ? notification.link : `/${notification.link}`}
                      className="text-xs font-bold text-[#00a170] hover:underline"
                      onClick={() => !notification.is_read && markReadMutation.mutate(notification.id)}
                    >
                      View details →
                    </Link>
                  )}
                  {!notification.is_read && (
                    <button
                      type="button"
                      onClick={() => markReadMutation.mutate(notification.id)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <div className="py-16 text-center text-gray-500 text-sm">No notifications yet.</div>
          )}
        </div>
      </div>
    </MemberPageShell>
  )
}
