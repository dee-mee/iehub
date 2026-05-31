import { impactStats } from '@/data/mockContent'

export function ImpactStats() {
  return (
    <section className="oxygen-section border-t-2 border-[#2d2d2d]" aria-labelledby="impact-heading">
      <div className="container-page">
        <div className="border-2 border-[#2d2d2d] bg-white p-6 mb-8 text-center">
          <h2 id="impact-heading" className="section-heading inline-block border-0 pl-0">
            Our reach
          </h2>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {impactStats.map((stat) => (
            <li key={stat.id} className="card text-center">
              <p className="text-4xl font-bold text-primary-600">{stat.value}</p>
              <p className="mt-2 font-semibold text-ink">{stat.label}</p>
              <p className="mt-2 text-sm text-muted">{stat.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
