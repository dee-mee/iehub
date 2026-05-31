import { useEffect, useState, useCallback } from 'react'

// ─── Hero slides ──────────────────────────────────────────────────────────────
const slides = [
  {
    id: 'slide-1',
    badge: '• Continental Initiative · Africa',
    title: 'Strengthening\nInclusive Education',
    titleAccent: 'Across Africa',
    body: 'The Hub brings together government institutions, Organisations of Persons with Disabilities (OPDs), Civil Society Organisations (CSOs), Faith-Based Organisations, academic institutions, the corporate sector, international partners, learners, teachers and other key education stakeholders.',
    img: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900&q=80',
    imgAlt: 'Three students studying together with a tablet',
  },
  {
    id: 'slide-2',
    badge: '• Inclusive Learning · All Abilities',
    title: 'Every Child\nDeserves Access',
    titleAccent: 'To Quality Education',
    body: 'IE Hub connects practitioners, policymakers, and communities so no learner is left behind. Supporting inclusive education across 54 African countries through evidence-based resources and peer learning.',
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&q=80',
    imgAlt: 'Family with wheelchair user outdoors',
  },
  {
    id: 'slide-3',
    badge: '• Sign Language · Deaf Education',
    title: 'Breaking Barriers\nBuilding Bridges',
    titleAccent: 'For Deaf Learners',
    body: 'From sign language instruction to accessible classrooms, IE Hub resources empower teachers and communities to create truly inclusive learning environments for every learner.',
    img: 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=900&q=80',
    imgAlt: 'Woman teaching sign language in a library',
  },
  {
    id: 'slide-4',
    badge: '• Technology · Innovation',
    title: 'Technology as\na Bridge to Learning',
    titleAccent: 'For All Learners',
    body: 'Explore resources on assistive technology, digital learning tools, and universal design for learning that open doors for students with disabilities across the continent.',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
    imgAlt: 'Students collaborating on a laptop',
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState<number | null>(null)
  const [fading, setFading]   = useState(false)

  const goTo = useCallback((idx: number) => {
    if (fading || idx === current) return
    setFading(true)
    setPrev(current)
    setCurrent(idx)
    // allow the fade-in transition to complete before allowing next click
    setTimeout(() => { setFading(false); setPrev(null) }, 1200)
  }, [fading, current])

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [current, goTo])

  const slide = slides[current]

  return (
    <section
      className="relative overflow-hidden border-b-2 border-[#2d2d2d]"
      style={{ background: '#00a170' }}
      aria-label="Hero carousel"
    >
      <div className="container-page border-x-2 border-[#2d2d2d] max-w-[calc(80rem+4px)]">
        <div className="grid gap-0 md:grid-cols-2 md:items-center min-h-[360px] md:min-h-[420px]">

          {/* ── Left: text content with fade transition ── */}
          <div className="py-12 md:py-16 pr-0 md:pr-8 z-10 relative">
            {/* Badge */}
            <div
              key={`badge-${slide.id}`}
              className="inline-flex items-center gap-2 border-2 border-white bg-white/10 px-4 py-1.5 text-xs font-bold text-white mb-6 animate-hero-fade"
            >
              {slide.badge}
            </div>

            {/* Title */}
            <h1
              key={`title-${slide.id}`}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white whitespace-pre-line animate-hero-fade"
            >
              {slide.title}
            </h1>
            <p
              key={`accent-${slide.id}`}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-1 animate-hero-fade"
              style={{ color: '#ec559f', animationDelay: '80ms' }}
            >
              {slide.titleAccent}
            </p>

            {/* Body */}
            <p
              key={`body-${slide.id}`}
              className="mt-5 text-sm sm:text-base text-white/85 max-w-[480px] leading-relaxed animate-hero-fade"
              style={{ animationDelay: '160ms' }}
            >
              {slide.body}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/resources"
                className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[#1a1a1a] px-6 py-2.5 text-sm font-bold text-white hover:opacity-95"
                style={{ background: '#662d91', boxShadow: '3px 3px 0 #1a1a1a' }}>
                Explore resources
              </a>
              <a href="/register"
                className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-white bg-transparent px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.25)' }}>
                Join as a member
              </a>
            </div>

            {/* Dot navigation */}
            <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === current}
                  onClick={() => goTo(i)}
                  className={`h-2 border border-white transition-all duration-500 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: images with slow cross-fade ── */}
          <div className="relative h-[260px] md:h-full md:min-h-[420px] overflow-hidden">
            {slides.map((s, i) => (
              <img
                key={s.id}
                src={s.img}
                alt={s.imgAlt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === current ? 1 : 0,
                  transition: 'opacity 1.4s ease-in-out',
                  zIndex: i === current ? 2 : (i === prev ? 1 : 0),
                }}
              />
            ))}
            {/* Gradient blend */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #00a170 0%, transparent 30%)', zIndex: 3 }}
            />
          </div>
        </div>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-fade {
          animation: hero-fade-in 0.8s ease forwards;
        }
      `}</style>
    </section>
  )
}
