import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiFetch, apiList } from '@/api/client'

type Message = {
  id: number
  subject: string
  body: string
  is_read: boolean
  created_at: string
  sender: { id: number; username: string; first_name: string; last_name: string }
  recipient: { id: number; username: string; first_name: string; last_name: string }
}

type Member = { id: number; first_name: string; last_name: string; email: string }

export function MessagesPage() {
  const [box, setBox] = useState<'inbox' | 'sent'>('inbox')
  const [compose, setCompose] = useState(false)
  const queryClient = useQueryClient()

  const messagesQuery = useQuery({
    queryKey: ['messages', box],
    queryFn: () =>
      apiFetch<{ results?: Message[] } | Message[]>(`/forum/messages/?box=${box}`).then(apiList),
  })

  const membersQuery = useQuery({
    queryKey: ['message-recipients'],
    queryFn: () =>
      apiFetch<{ results: Member[] }>('/members/?page_size=100').then((d) => d.results ?? []),
    enabled: compose,
  })

  const sendMutation = useMutation({
    mutationFn: (body: { recipient_id: number; subject: string; body: string }) =>
      apiFetch('/forum/messages/', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      setCompose(false)
    },
  })

  const markRead = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/forum/messages/${id}/mark_read/`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  })

  return (
    <MemberPageShell
      title="Messages"
      actions={
        <button
          type="button"
          onClick={() => setCompose((v) => !v)}
          className="btn-primary text-sm"
        >
          {compose ? 'Cancel' : 'New message'}
        </button>
      }
    >
      <div className="flex gap-2 mb-4">
        {(['inbox', 'sent'] as const).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBox(b)}
            className={`px-4 py-2 text-sm font-bold capitalize border-2 border-[#2d2d2d] ${
              box === b ? 'bg-[#00a170] text-white' : 'bg-white text-gray-700'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {compose && (
        <form
          className="card mb-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            sendMutation.mutate({
              recipient_id: Number(data.get('recipient_id')),
              subject: String(data.get('subject')),
              body: String(data.get('body')),
            })
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <select name="recipient_id" required className="input w-full">
              <option value="">Select member</option>
              {membersQuery.data?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.first_name} {m.last_name} ({m.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input name="subject" required className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea name="body" required rows={5} className="input w-full" />
          </div>
          <button type="submit" className="btn-primary" disabled={sendMutation.isPending}>
            Send message
          </button>
        </form>
      )}

      {messagesQuery.isLoading ? (
        <LoadingSpinner label="Loading messages..." />
      ) : (
        <div className="member-panel p-0 divide-y-2 divide-[#e5e5e5]">
          {(messagesQuery.data ?? []).length === 0 ? (
            <p className="p-8 text-center text-gray-500 text-sm">No messages in {box}.</p>
          ) : (
            messagesQuery.data?.map((msg) => (
              <article
                key={msg.id}
                className={`p-4 ${!msg.is_read && box === 'inbox' ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{msg.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {box === 'inbox'
                        ? `From ${msg.sender.first_name || msg.sender.username}`
                        : `To ${msg.recipient.first_name || msg.recipient.username}`}
                      {' · '}
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  {box === 'inbox' && !msg.is_read && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#00a170]"
                      onClick={() => markRead.mutate(msg.id)}
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{msg.body}</p>
              </article>
            ))
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Need help? Visit the <Link to="/members" className="text-[#00a170] underline">members directory</Link> to find colleagues.
      </p>
    </MemberPageShell>
  )
}
