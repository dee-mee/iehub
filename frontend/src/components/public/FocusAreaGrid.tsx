import { Link } from 'react-router-dom'
import { focusAreas } from '@/data/mockContent'

export function FocusAreaGrid() {
  return (
    <section className="py-16" aria-labelledby="programs-heading">
      <div className="container-page">
        <h2 id="programs-heading" className="section-heading">
          Focus areas
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Programmes and thematic communities — inspired by leading disability-inclusive
          organisations across Africa and globally.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <li key={area.id}>
              <article className="card flex h-full flex-col">
                <h3 className="text-lg font-bold text-primary-800">{area.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{area.description}</p>
                <Link
                  to={area.href}
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-600 underline-offset-2 hover:underline"
                >
                  View resources
                  <span className="sr-only"> for {area.title}</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
