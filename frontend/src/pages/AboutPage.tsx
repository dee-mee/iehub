import { Link } from 'react-router-dom'
import { PartnersStrip } from '@/components/public/PartnersStrip'
import {
  missionVision,
  coreValues,
  leadershipTeam,
  regionalHubs,
  impactStats,
  ourHistory,
} from '@/data/mockContent'

const RED = '#d9534f'

export function AboutPage() {
  return (
    <div className="bg-white">
      {/* ── 1. TOP UTILITY BAR (Decorative/Info) ── */}
      <div className="bg-gray-100 py-2 border-b border-gray-200 hidden md:block">
        <div className="container-page flex justify-between items-center text-xs font-semibold text-gray-600">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <span className="text-blue-600">📞</span> +254 700 000000
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-blue-600">✉️</span> info@iehub.africa
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
            <Link to="/login" className="hover:text-blue-600">Member Portal</Link>
          </div>
        </div>
      </div>

      {/* ── 2. HERO SECTION ── */}
      <section className="relative h-[450px] md:h-[550px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1600&q=80"
            alt="Collaboration for disability inclusion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        </div>

        <div className="container-page relative z-10 text-white">
          <div className="max-w-2xl">
            <span className="inline-block bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 rounded">
              Established 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Empowering Persons with Disabilities
            </h1>
            <p className="mt-6 text-lg md:text-xl text-blue-50/90 leading-relaxed font-medium">
              IE Hub is a national leader in promoting disability rights and 
              inclusive education across Africa through rehabilitation, advocacy, and economic empowerment.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/donate" 
                className="px-8 py-3.5 rounded-md font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: RED }}>
                Donate Now
              </Link>
              <Link to="/register" 
                className="px-8 py-3.5 rounded-md font-bold text-white border-2 border-white hover:bg-white/10 transition-colors">
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. WHO WE ARE ── */}
      <section className="oxygen-section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Who We Are</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                A National Pillar for Disability Inclusion
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Inclusive Education Hub for Africa (IE Hub) is a non-governmental organisation 
                  dedicated to improving the quality of life for persons with disabilities (PWDs). 
                  Our work is rooted in the belief that disability rights are human rights.
                </p>
                <p>
                  Through a robust network of partners and regional hubs, we provide a 
                  comprehensive range of services including medical rehabilitation, 
                  access to assistive technology, and evidence-based advocacy.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50">
                  <p className="text-xs font-bold text-blue-900 uppercase">Focus Area</p>
                  <p className="text-sm font-semibold text-gray-700">Rehabilitation</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50/50">
                  <p className="text-xs font-bold text-orange-900 uppercase">Focus Area</p>
                  <p className="text-sm font-semibold text-gray-700">Economic Empowerment</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80" 
                  alt="Inclusive community" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden md:block">
                <p className="text-3xl font-bold text-blue-600">54</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Countries Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MISSION, VISION & WHY WE DO IT ── */}
      <section className="oxygen-section oxygen-section--alt">
        <div className="container-page">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Mission */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-blue-600">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-2xl">🎯</div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {missionVision.mission}
              </p>
            </div>
            {/* Vision */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-orange-500">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 text-2xl">👁️</div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Our Vision</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {missionVision.vision}
              </p>
            </div>
            {/* Why We Do It */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-green-500">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6 text-2xl">🤝</div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Why We Do It</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                We believe in a society where persons with disabilities have equal opportunities 
                to participate in social, economic, and political life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. IMPACT STATS ── */}
      <div className="bg-blue-900 text-white py-16 border-y-2 border-[#2d2d2d]">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-3">Our Impact</h2>
            <h3 className="text-3xl font-bold">Making a Measurable Difference</h3>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Custom impact stats styling for AboutPage */}
            {impactStats.map(stat => (
              <div key={stat.id} className="text-center">
                <p className="text-5xl font-extrabold text-orange-400 mb-2">{stat.value}</p>
                <p className="text-lg font-bold text-blue-100 mb-1">{stat.label}</p>
                <p className="text-sm text-blue-200/70">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. OUR HISTORY (Timeline) ── */}
      <section className="oxygen-section overflow-hidden">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Our History</h2>
            <h3 className="text-3xl font-bold text-slate-900">Our Journey So Far</h3>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12 relative">
              {ourHistory.map((item, index) => (
                <div key={item.year} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 text-center md:text-right">
                    {index % 2 === 0 ? (
                      <div>
                        <span className="text-4xl font-extrabold text-blue-100">{item.year}</span>
                        <h4 className="text-xl font-bold text-slate-900 mt-2">{item.title}</h4>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed max-w-md ml-auto">
                          {item.description}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white shadow-md z-10 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    {index % 2 !== 0 ? (
                      <div>
                        <span className="text-4xl font-extrabold text-blue-100">{item.year}</span>
                        <h4 className="text-xl font-bold text-slate-900 mt-2">{item.title}</h4>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed max-w-md mr-auto">
                          {item.description}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. OUR CORE VALUES ── */}
      <section className="oxygen-section bg-slate-900 text-white border-[#2d2d2d]">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Our Core Values</h2>
            <p className="text-slate-400">
              The principles that guide our work and define our commitment to disability inclusion.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                  <span className="text-2xl text-blue-400 font-bold">{value.title[0]}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. REGIONAL BRANCHES & GOVERNANCE ── */}
      <section className="oxygen-section oxygen-section--alt">
        <div className="container-page">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Branches */}
            <div className="lg:col-span-7">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Our Network</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Regional Hubs & Branches</h3>
              <div className="space-y-4">
                {regionalHubs.map(hub => (
                  <div key={hub.name} className="flex gap-4 p-5 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold">
                      📍
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{hub.name}</h4>
                      <p className="text-xs font-bold text-blue-600 mb-2">{hub.location}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{hub.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white p-10 rounded-2xl sticky top-24 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Governance</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  IE Hub is governed by a diverse 13-member Steering Committee composed of experts 
                  from ministries, disability organisations, and international partners. 
                  Our governance model ensures transparency, technical excellence, and 
                  sustainability across all our continental operations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <p className="text-sm font-semibold">Strategic Oversight</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <p className="text-sm font-semibold">Technical Excellence</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <p className="text-sm font-semibold">Financial Accountability</p>
                  </div>
                </div>
                <div className="mt-10">
                  <Link to="/contact" className="inline-block text-orange-400 font-bold text-sm hover:underline">
                    View Governance Charter →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. LEADERSHIP TEAM ── */}
      <section className="oxygen-section oxygen-section--alt">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Our Leadership</h2>
            <h3 className="text-3xl font-bold text-slate-900">Board of Directors & Management</h3>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {leadershipTeam.map((member) => (
              <div key={member.name} className="group">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 shadow-md bg-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs font-bold text-blue-600 uppercase mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. PARTNERS STRIP ── */}
      <PartnersStrip />

      {/* ── 9. FINAL CTA ── */}
      <section className="oxygen-section">
        <div className="container-page">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Support Our Mission
              </h2>
              <p className="text-blue-100 text-lg">
                Your partnership and support allow us to continue providing life-changing 
                rehabilitation and advocacy for persons with disabilities.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/donate" 
                className="px-10 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-xl hover:bg-blue-50 transition-colors">
                Donate Now
              </Link>
              <Link to="/contact" 
                className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
