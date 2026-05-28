import { PageHeader } from '@/components/ui/PageHeader'
import { lmOffices, steeringCommittee } from '@/data/mockContent'

export function AboutPage() {
  return (
    <>
      <PageHeader
        title="About IE Hub"
        description="A continental platform for inclusive education — governed by partners, hosted for Africa."
      />

      <div className="container-page space-y-16 py-16">
        <section aria-labelledby="about-iehub">
          <h2 id="about-iehub" className="section-heading">
            Inclusive Education Hub for Africa
          </h2>
          <p className="mt-4 max-w-3xl text-muted">
            IE Hub is an initiative of LM International (Läkarmissionen), developed in partnership
            with ADRES Group. It combines an open public website with a members-only Community of
            Practice where practitioners share knowledge, resources, and advocacy across 54 African
            countries.
          </p>
        </section>

        <section aria-labelledby="about-lm">
          <h2 id="about-lm" className="text-2xl font-bold text-primary-800">
            About LM International
          </h2>
          <p className="mt-4 max-w-3xl text-muted">
            LM International works through 11 country offices across East, Central, and West Africa,
            supporting inclusive education, disability rights, and community development. IE Hub
            amplifies this work at continental scale.
          </p>
        </section>

        <section aria-labelledby="steering">
          <h2 id="steering" className="text-2xl font-bold text-primary-800">
            Steering Committee
          </h2>
          <p className="mt-2 text-muted">
            Thirteen organisations govern the platform and guide editorial direction.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steeringCommittee.map((org) => (
              <li key={org} className="rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm font-medium">
                {org}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="offices">
          <h2 id="offices" className="text-2xl font-bold text-primary-800">
            LM country offices
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lmOffices.map((office) => (
              <li key={office} className="card text-sm font-medium">
                {office}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-primary-50 p-8" aria-labelledby="values">
          <h2 id="values" className="text-2xl font-bold text-primary-800">
            Our values
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            <li className="card">
              <h3 className="font-bold text-primary-700">Human rights for all</h3>
              <p className="mt-2 text-sm text-muted">
                Every programme and resource aligns with the UN CRPD and the right to inclusive
                education.
              </p>
            </li>
            <li className="card">
              <h3 className="font-bold text-primary-700">Inclusion and diversity</h3>
              <p className="mt-2 text-sm text-muted">
                We respond to intersectionality and ensure no group is left behind.
              </p>
            </li>
            <li className="card">
              <h3 className="font-bold text-primary-700">Partnership</h3>
              <p className="mt-2 text-sm text-muted">
                We work with OPDs, governments, CSOs, and communities as equal partners.
              </p>
            </li>
            <li className="card">
              <h3 className="font-bold text-primary-700">Accessibility</h3>
              <p className="mt-2 text-sm text-muted">
                WCAG 2.2 AA is non-negotiable — the platform is built for everyone from day one.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
