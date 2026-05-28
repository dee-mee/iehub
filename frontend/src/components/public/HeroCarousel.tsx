import { useEffect, useState } from 'react'
import { heroStats } from '@/data/mockContent'

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const stat = heroStats[index]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroStats.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-primary-800 text-white"
      aria-labelledby="hero-stat-heading"
      aria-live="polite"
    >
      <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            Inclusive Education Hub for Africa
          </p>
          <h1 id="hero-stat-heading" className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            {stat.headline}
          </h1>
          <p className="mt-4 text-xl text-primary-100">{stat.subline}</p>
          <p className="mt-4 text-primary-200">{stat.detail}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/resources" className="btn-primary bg-accent-500 hover:bg-accent-600">
              Explore resources
            </a>
            <a href="/about" className="btn-secondary border-white text-white hover:bg-white/10">
              About IE Hub
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-600 bg-primary-900/50 p-6">
          <h2 className="text-lg font-semibold text-accent-400">Why IE Hub exists</h2>
          <p className="mt-3 text-primary-100">
            Like continental disability and development networks, IE Hub connects practitioners,
            policymakers, and communities so no learner is left behind in Africa&apos;s education
            systems.
          </p>
          <div className="mt-6 flex gap-2" role="tablist" aria-label="Impact statistics">
            {heroStats.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls="hero-stat-panel"
                className={`min-h-11 min-w-11 rounded-full px-3 text-sm font-medium transition-colors ${
                  i === index ? 'bg-accent-500 text-ink' : 'bg-primary-700 text-primary-100 hover:bg-primary-600'
                }`}
                onClick={() => setIndex(i)}
              >
                <span className="sr-only">Show statistic: </span>
                {item.headline}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
