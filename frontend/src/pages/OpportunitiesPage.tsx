import { MemberPageShell } from '@/components/member/MemberPageShell'

export function OpportunitiesPage() {
  const jobs = [
    { title: "Inclusive Education Specialist", org: "Humanity & Inclusion (HI)", type: "Consultancy", location: "Nairobi / Remote" },
    { title: "Disability Advocacy Officer", org: "Light for the World", type: "Full-time", location: "Kampala" },
    { title: "Accessibility Consultant", org: "World Bank / Ministry of Education", type: "Short-term", location: "Juba" }
  ]

  return (
    <MemberPageShell title="Employment Pipeline">
      <div className="mb-8">
        <p className="text-sm text-gray-600 leading-relaxed">
          A dedicated space mapping employment opportunities, internships, and consultancies specifically geared toward persons with disabilities and inclusive education experts within the humanitarian and development sectors.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map((job, i) => (
          <div key={i} className="member-panel hover:border-primary-500 transition-colors cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-ink group-hover:text-primary-600">{job.title}</h3>
                <p className="text-xs text-muted mt-1">{job.org} • {job.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider">
                  {job.type}
                </span>
                <button className="member-btn-primary py-1.5 px-4 text-xs">Apply Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800">
        <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-2">Institutional Matchmaking</h3>
        <p className="text-sm text-primary-800 dark:text-primary-200">
          Looking for a partner for a joint call for proposals? Our secretariat can help you identify organizations with specific thematic expertise.
        </p>
        <button className="mt-4 text-xs font-bold text-primary-700 dark:text-primary-300 hover:underline">
          Contact the Secretariat →
        </button>
      </div>
    </MemberPageShell>
  )
}
