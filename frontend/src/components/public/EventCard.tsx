import type { EventItem } from '@/types/content'

const typeLabels: Record<EventItem['eventType'], string> = {
  WEBINAR: 'Webinar',
  WORKSHOP: 'Workshop',
  CONFERENCE: 'Conference',
  TRAINING: 'Training',
  OTHER: 'Event',
}

const placeholderImgs: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=70',
  '2': 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70',
  '3': 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=600&q=70',
}
const fallbackImg = 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=70'

export function EventCard({ event }: { event: EventItem }) {
  const start = new Date(event.startDatetime)
  const dateStr = start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const img = placeholderImgs[event.id] ?? fallbackImg

  return (
    <article className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={img}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: '#1cb7ee' }}
        >
          {typeLabels[event.eventType]}
        </span>
      </div>

      {/* Description on the card */}
      <div className="bg-[#00a170] px-5 py-4 text-white">
        <h3 className="text-base font-bold leading-snug">{event.title}</h3>
        <p className="mt-1.5 text-sm text-white/80 line-clamp-2">{event.description}</p>
        <div className="mt-3 space-y-1 text-xs text-white/70">
          <p>📅 {dateStr} at {timeStr}</p>
          <p>📍 {event.locationType === 'ONLINE' ? 'Online' : event.locationType === 'HYBRID' ? `Hybrid — ${event.locationAddress}` : event.locationAddress}</p>
        </div>
        {event.onlineLink && (
          <a href={event.onlineLink} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#662d91' }}>
            Register →
          </a>
        )}
      </div>
    </article>
  )
}
