import { partners } from '@/data/mockContent'

export function PartnersStrip() {
  return (
    <section className="border-y border-primary-100 bg-white py-12" aria-labelledby="partners-heading">
      <div className="container-page">
        <h2 id="partners-heading" className="section-heading text-center">
          Our partners
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {partners.map((name) => (
            <li
              key={name}
              className="rounded-lg border border-primary-100 bg-surface px-5 py-3 text-sm font-medium text-muted"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
