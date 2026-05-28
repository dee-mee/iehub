import type { EventItem } from '@/types/content'

const typeLabels: Record<EventItem['eventType'], string> = {
  WEBINAR: 'Webinar',
  WORKSHOP: 'Workshop',
  CONFERENCE: 'Conference',
  TRAINING: 'Training',
  OTHER: 'Event',
}

interface EventCardProps {
  event: EventItem
}

export function EventCard({ event }: EventCardProps) {
  const start = new Date(event.startDatetime)
  const dateStr = start.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <article className="card">
      <p className="text-xs font-semibold uppercase text-accent-600">{typeLabels[event.eventType]}</p>
      <h3 className="mt-2 text-lg font-bold text-ink">{event.title}</h3>
      <p className="mt-2 text-sm text-muted">{event.description}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div>
          <dt className="inline font-semibold text-ink">When: </dt>
          <dd className="inline text-muted">
            <time dateTime={event.startDatetime}>
              {dateStr} at {timeStr}
            </time>
          </dd>
        </div>
        <div>
          <dt className="inline font-semibold text-ink">Where: </dt>
          <dd className="inline text-muted">
            {event.locationType === 'ONLINE'
              ? 'Online'
              : event.locationType === 'HYBRID'
                ? `Hybrid — ${event.locationAddress}`
                : event.locationAddress}
          </dd>
        </div>
      </dl>
      {event.onlineLink && (
        <a
          href={event.onlineLink}
          className="btn-primary mt-4 inline-flex text-sm"
          rel="noopener noreferrer"
          target="_blank"
        >
          Register for event
          <span className="sr-only"> (opens in new tab): {event.title}</span>
        </a>
      )}
    </article>
  )
}
