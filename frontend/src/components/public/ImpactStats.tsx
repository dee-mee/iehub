import { impactStats } from '@/data/mockContent'

export function ImpactStats() {
  return (
    <section className="bg-white py-12" aria-labelledby="impact-heading">
      <div className="container-page">
        <h2 id="impact-heading" className="section-heading text-center">
          Our reach
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
