import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { HeroCarousel } from '@/components/public/HeroCarousel'
import { ImpactStats } from '@/components/public/ImpactStats'
import { ResourceCard } from '@/components/public/ResourceCard'
import { NewsCard } from '@/components/public/NewsCard'
import { EventCard } from '@/components/public/EventCard'
import { PartnersStrip } from '@/components/public/PartnersStrip'
import { fetchResources, fetchNews, fetchEvents } from '@/api/public'
import {
  resources as fallbackResources,
  newsArticles as fallbackNews,
  events as fallbackEvents,
} from '@/data/mockContent'

// ─── Colour tokens ────────────────────────────────────────────────────────────
const GREEN  = '#00a170'
const PURPLE = '#662d91'
const PINK   = '#ec559f'
const BLUE   = '#1cb7ee'

// ─── "What We Do" items ───────────────────────────────────────────────────────
const whatWeDoItems = [
  {
    icon: '📚',
    title: 'Resource Library',
    desc: 'A curated, multilingual library of policy briefs, toolkits, research and practical guides for inclusive education practitioners.',
    href: '/resources',
    color: GREEN,
  },
  {
    icon: '🤝',
    title: 'Community of Practice',
    desc: 'A safe, moderated forum connecting educators, policymakers and OPDs across 54 African countries to share experiences and solutions.',
    href: '/forum',
    color: PURPLE,
  },
  {
    icon: '📅',
    title: 'Events & Webinars',
    desc: 'Online and in-person events — from regional conferences to monthly teacher training webinars — accessible with captions and transcripts.',
    href: '/news',
    color: BLUE,
  },
  {
    icon: '📊',
    title: 'Research & Evidence',
    desc: 'Data, case studies and evidence to help governments and partners make the case for inclusive education investment.',
    href: '/resources?topic=research-evidence',
    color: PINK,
  },
]

// ─── Programmes ───────────────────────────────────────────────────────────────
const programmes = [
  {
    num: '01',
    title: 'Early Childhood Development',
    desc: 'Inclusive early learning programmes that identify and support children with disabilities from birth.',
    href: '/programmes#early-childhood',
    color: GREEN,
  },
  {
    num: '02',
    title: 'Teacher Capacity Building',
    desc: 'Training and professional development equipping teachers with universal design for learning strategies.',
    href: '/programmes#teacher-training',
    color: PURPLE,
  },
  {
    num: '03',
    title: 'Policy Reform & Advocacy',
    desc: 'Evidence-based policy development aligned with UN CRPD and SDG 4 for inclusive national education systems.',
    href: '/programmes#policy-reform',
    color: BLUE,
  },
  {
    num: '04',
    title: 'Assistive Technology',
    desc: 'Guidance on procurement, maintenance and teacher training for assistive devices in low-resource settings.',
    href: '/programmes#assistive-tech',
    color: PINK,
  },
  {
    num: '05',
    title: 'Education in Emergencies',
    desc: 'Ensuring children with disabilities are not left behind during conflicts and humanitarian crises.',
    href: '/programmes#emergencies',
    color: GREEN,
  },
  {
    num: '06',
    title: 'Community Engagement',
    desc: 'Strengthening parent, OPD and community involvement in school governance and inclusion planning.',
    href: '/programmes#community',
    color: PURPLE,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function HomePage() {

  const resourcesQuery = useQuery({ queryKey: ['featured-resources'], queryFn: () => fetchResources({ page: 1 }) })
  const newsQuery      = useQuery({ queryKey: ['home-news'],           queryFn: () => fetchNews({ page: 1 }) })
  const eventsQuery    = useQuery({ queryKey: ['home-events'],         queryFn: () => fetchEvents() })

  const featuredResources = (resourcesQuery.data?.results ?? fallbackResources).filter(r => r.isFeatured).slice(0, 3)
  const latestNews        = (newsQuery.data?.results ?? fallbackNews).slice(0, 3)
  const upcomingEvents    = (eventsQuery.data?.results ?? fallbackEvents).slice(0, 3)

  return (
    <>
      {/* ── 1. HERO ── */}
      <HeroCarousel />

      {/* ── 2. IMPACT STATS ── */}
      <ImpactStats />

      {/* ── 3. ABOUT US ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="about-heading">
        <div className="container-page">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
                  alt="Family with wheelchair user outdoors"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Decorative accent box */}
              <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-2xl hidden md:block"
                style={{ background: PINK, opacity: 0.12 }} />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl hidden md:block"
                style={{ background: GREEN, opacity: 0.15 }} />
            </div>

            {/* Text side */}
            <div>
              <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white mb-4"
                style={{ background: GREEN }}>
                About Us
              </span>
              <h2 id="about-heading" className="section-heading">
                A Hub for Inclusive Education Across Africa
              </h2>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                The Inclusive Education Hub for Africa (IE Hub) is a continental platform that brings together government institutions, Organisations of Persons with Disabilities (OPDs), Civil Society Organisations, Faith-Based Organisations, academic institutions, the corporate sector, international partners, learners, teachers and other key education stakeholders.
              </p>
              <p className="mt-3 text-base text-gray-600 leading-relaxed">
                Hosted by LM International and governed by a 13-member Steering Committee, IE Hub supports practitioners across 54 African countries through resources, peer learning, and evidence-based advocacy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/about"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: GREEN }}>
                  Learn More About Us
                </Link>
                <Link to="/register"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 px-6 py-2.5 text-sm font-bold transition-all hover:bg-pink-50"
                  style={{ borderColor: PINK, color: PINK }}>
                  Join the Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHAT WE DO ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: '#f8f9fa' }} aria-labelledby="what-we-do-heading">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white mb-4"
              style={{ background: PURPLE }}>
              What We Do
            </span>
            <h2 id="what-we-do-heading" className="section-heading">
              How IE Hub Supports Inclusive Education
            </h2>
            <p className="mt-4 text-base text-gray-500">
              We provide the tools, connections, and evidence needed to make inclusive education a reality across Africa.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whatWeDoItems.map(item => (
              <Link key={item.title} to={item.href}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col">
                {/* Color accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: item.color }} />
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-base font-bold text-gray-900 group-hover:underline">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 flex-1 leading-relaxed">{item.desc}</p>
                <span className="mt-4 text-sm font-semibold" style={{ color: item.color }}>
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. OUR PROGRAMMES ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="programmes-heading">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-12">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white mb-4"
                style={{ background: BLUE }}>
                Our Programmes
              </span>
              <h2 id="programmes-heading" className="section-heading">
                Focus Areas & Thematic Programmes
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Specialized support and evidence-based resources across priority areas to ensure no child is excluded from learning.
              </p>
            </div>
            <Link to="/programmes"
              className="inline-flex min-h-11 items-center rounded-lg border-2 px-5 py-2.5 text-sm font-bold transition-all whitespace-nowrap hover:bg-green-50"
              style={{ borderColor: GREEN, color: GREEN }}>
              View All Programmes
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map(prog => (
              <Link key={prog.num} to={prog.href}
                className="group flex gap-4 items-start rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <span className="text-2xl font-extrabold flex-shrink-0 leading-none"
                  style={{ color: prog.color, opacity: 0.4 }}>
                  {prog.num}
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:underline">{prog.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{prog.desc}</p>
                  <span className="mt-3 inline-block text-xs font-semibold" style={{ color: prog.color }}>
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FEATURED RESOURCES ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: '#f8f9fa' }} aria-labelledby="resources-heading">
        <div className="container-page">
          <div className="flex items-center justify-between mb-10">
            <h2 id="resources-heading" className="section-heading">Featured Resources</h2>
            <Link to="/resources" className="text-sm font-bold hover:underline" style={{ color: GREEN }}>
              View All →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. NEWS & EVENTS ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="news-events-heading">
        <div className="container-page">
          <div className="flex items-center justify-between mb-10">
            <h2 id="news-events-heading" className="section-heading">News & Events</h2>
            <Link to="/news" className="text-sm font-bold hover:underline" style={{ color: GREEN }}>
              View All →
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* News */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="h-1 w-6 rounded inline-block" style={{ background: PINK }} />
                Latest News
              </h3>
              <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-1">
                {latestNews.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              <Link to="/news" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
                style={{ color: PINK }}>
                All news stories →
              </Link>
            </div>

            {/* Events */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="h-1 w-6 rounded inline-block" style={{ background: BLUE }} />
                Upcoming Events
              </h3>
              <div className="grid gap-5">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <Link to="/news#events" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
                style={{ color: BLUE }}>
                All events →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. PARTNERS (sliding logos — just above footer) ───────────────────── */}
      <PartnersStrip />

      {/* ── 9. JOIN CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page">
          <div className="rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${GREEN} 0%, ${PURPLE} 100%)` }}>
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 bg-white" />

            <h2 className="text-3xl md:text-4xl font-extrabold relative">
              Join the Community of Practice
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base opacity-85 relative">
              Connect with educators, policymakers and advocates across 54 African countries. Access exclusive resources, join discussions, and help shape the future of inclusive education.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link to="/register"
                className="rounded-lg px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90 min-h-11"
                style={{ background: PINK }}>
                Join as a Member
              </Link>
              <Link to="/about"
                className="rounded-lg border-2 border-white px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 min-h-11">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
