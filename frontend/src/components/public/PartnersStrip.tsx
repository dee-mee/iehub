import { partners } from '@/data/mockContent'

// Duplicate list so the scroll loop is seamless
const allLogos = [...partners, ...partners]

export function PartnersStrip() {
  return (
    <section className="border-y border-gray-100 bg-gray-50 py-10 overflow-hidden" aria-labelledby="partners-heading">
      <div className="container-page mb-6">
        <h2 id="partners-heading" className="text-center text-sm font-bold uppercase tracking-widest text-gray-400">
          Our Partners
        </h2>
      </div>

      {/* Scrolling track */}
      <div className="relative overflow-hidden">
        <div className="partners-track">
          {allLogos.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm"
              style={{ minWidth: '160px' }}
            >
              {/* Logo placeholder — swap <span> for <img> with real logo */}
              <span className="text-sm font-bold text-gray-600 whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
