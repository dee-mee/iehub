import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { AuthUser } from '@/api/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export function MemberDetailPage() {
  const { id } = useParams()

  const { data: member, isLoading, error } = useQuery<AuthUser>({
    queryKey: ['member', id],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const response = await fetch(`${API_BASE_URL}/directory/${id}/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch member details')
      return response.json()
    },
    enabled: !!id
  })

  if (isLoading) return <LoadingSpinner label="Loading profile..." />
  
  if (error || !member) {
    return (
      <div className="container-page py-12 text-center">
        <div className="card max-w-lg mx-auto py-12">
          <h2 className="text-xl font-bold text-red-600 mb-2">Profile Not Found</h2>
          <p className="text-muted mb-6">This member profile may be private or no longer exists.</p>
          <Link to="/members" className="btn-primary">Back to Directory</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-primary-800 text-white py-12">
        <div className="container-page flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 text-4xl font-bold border-4 border-white/20">
            {member.first_name[0]}{member.last_name[0]}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{member.first_name} {member.last_name}</h1>
            <p className="text-xl text-primary-100 mt-1">{member.professional_title}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {member.organization}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {member.country}
              </span>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-auto">
            <Link to="/contact" className="btn-primary bg-accent-500 hover:bg-accent-600 text-ink">
              Send Message
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <section className="card">
              <h2 className="text-xl font-bold text-ink mb-4 border-b pb-2">About</h2>
              <p className="text-muted leading-relaxed whitespace-pre-wrap">
                {member.bio || "No professional summary provided."}
              </p>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold text-ink mb-4 border-b pb-2">Expertise Areas</h2>
              <div className="flex flex-wrap gap-2">
                {member.profile?.expertise_areas.length ? (
                  member.profile.expertise_areas.map(area => (
                    <span key={area.id} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-100">
                      {area.name}
                    </span>
                  ))
                ) : (
                  <p className="text-muted text-sm italic">No expertise areas listed.</p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="card">
              <h2 className="font-bold text-ink mb-4 uppercase text-xs tracking-wider">Connect</h2>
              <div className="space-y-4">
                {member.profile?.linkedin_url && (
                  <a href={member.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted hover:text-primary-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn Profile
                  </a>
                )}
                {member.profile?.website_url && (
                  <a href={member.profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted hover:text-primary-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                    Personal Website
                  </a>
                )}
                {!member.profile?.linkedin_url && !member.profile?.website_url && (
                  <p className="text-muted text-sm italic">No social links provided.</p>
                )}
              </div>
            </section>

            <section className="card">
              <h2 className="font-bold text-ink mb-4 uppercase text-xs tracking-wider">Affiliation</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted block">Organization Type</span>
                  <span className="font-medium text-ink">{member.organization_type?.replace('_', ' ') || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-muted block">Joined</span>
                  <span className="font-medium text-ink">June 2026</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
