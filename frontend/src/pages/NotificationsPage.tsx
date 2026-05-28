import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

type Notification = {
  id: number
  notification_type: 'SYSTEM' | 'FORUM_REPLY' | 'MEMBER_APPROVAL' | 'NEW_RESOURCE'
  title: string
  message: string
  link: string
  is_read: boolean
  created_at: string
}

const typeIcons = {
  SYSTEM: '⚙️',
  FORUM_REPLY: '💬',
  MEMBER_APPROVAL: '✅',
  NEW_RESOURCE: '📚'
}

export function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/auth/notifications/`, {
        headers: { 'Authorization': `Bearer ${tokens.access}` }
      })
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      return data.results || data
    }
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      await fetch(`${API_BASE_URL}/auth/notifications/${id}/mark_read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.access}` }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] })
    }
  })

  if (isLoading) return <LoadingSpinner label="Loading notifications..." />

  return (
    <>
      <PageHeader 
        title="Notifications" 
        description="Stay updated with the latest activity in your Community of Practice." 
      />

      <div className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <div className="card divide-y divide-primary-50">
            {data?.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 flex gap-4 transition-colors ${notification.is_read ? 'bg-white' : 'bg-primary-50/30'}`}
              >
                <div className="w-10 h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {typeIcons[notification.notification_type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-bold text-ink ${notification.is_read ? 'opacity-70' : ''}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm text-muted leading-relaxed ${notification.is_read ? 'opacity-70' : ''}`}>
                    {notification.message}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    {notification.link && (
                      <Link 
                        to={notification.link} 
                        className="text-xs font-bold text-primary-700 hover:underline"
                        onClick={() => !notification.is_read && markReadMutation.mutate(notification.id)}
                      >
                        View Details →
                      </Link>
                    )}
                    {!notification.is_read && (
                      <button 
                        onClick={() => markReadMutation.mutate(notification.id)}
                        className="text-xs font-bold text-muted hover:text-ink transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {data?.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-300 mb-4 text-2xl">
                  🔔
                </div>
                <h3 className="text-lg font-bold text-ink">No notifications yet</h3>
                <p className="text-muted text-sm mt-1">We'll alert you here when there's new activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
