import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { fetchEvents } from '@/api/public'

export function MemberEventsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['member-events'],
    queryFn: () => fetchEvents(),
  })

  return (
    <MemberPageShell title="Events">
      {isLoading ? (
        <LoadingSpinner label="Loading events..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(data?.results ?? []).map((event) => {
            const start = new Date(event.startDatetime)
            return (
              <article key={event.id} className="member-panel">
                <p className="text-xs font-bold text-[#00a170] uppercase">
                  {start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{event.title}</h3>
                {event.description && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{event.description}</p>}
                <p className="text-xs text-gray-500 mt-3">
                  {event.locationAddress || event.locationType} · {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </p>
                {event.onlineLink && (
                  <a
                    href={event.onlineLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-sm font-semibold text-[#00a170] hover:underline"
                  >
                    Register →
                  </a>
                )}
              </article>
            )
          })}
          {(data?.results ?? []).length === 0 && (
            <p className="text-gray-500 col-span-2">No upcoming events scheduled.</p>
          )}
        </div>
      )}
      <p className="text-sm text-gray-500 mt-6">
        Public event listings are also on the{' '}
        <Link to="/news" className="text-[#00a170] underline">news page</Link>.
      </p>
    </MemberPageShell>
  )
}
