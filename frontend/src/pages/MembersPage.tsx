import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { apiFetch } from '@/api/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { AuthUser } from '@/api/auth'

type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function MembersPage() {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')

  const { data, isLoading, error } = useQuery<Paginated<AuthUser>>({
    queryKey: ['members', search, country],
    queryFn: async () => {
      const query = new URLSearchParams()
      if (search) query.set('search', search)
      if (country) query.set('country', country)
      return apiFetch<Paginated<AuthUser>>(`/directory/?${query.toString()}`)
    }
  })

  return (
    <MemberPageShell title="Member Directory">
      <p className="text-sm text-gray-600 mb-6">
        Connect with inclusive education practitioners across Africa.
      </p>
      <div>
        {/* Filters */}
        <div className="member-panel mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="label">Search Members</label>
              <input 
                id="search"
                type="text" 
                placeholder="Name, organization, or title..." 
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="country" className="label">Filter by Country</label>
              <select 
                id="country"
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Sudan">Sudan</option>
                <option value="Ethiopia">Ethiopia</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => { setSearch(''); setCountry(''); }}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Finding members..." />
        ) : error ? (
          <div className="card p-8 text-center">
            <div className="text-red-600 font-bold mb-2">Error loading member directory</div>
            <p className="text-sm text-gray-500">
              {error instanceof Error && error.message.includes('401') 
                ? 'Your session has expired. Please log out and log back in.' 
                : 'This directory is restricted to approved members only. Please ensure your account is approved.'}
            </p>
            <div className="mt-6">
              <Link to="/help" className="text-primary-600 hover:underline text-sm font-semibold">
                Contact support if you believe this is an error
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.results.map((member) => (
              <Link key={member.id} to={`/members/${member.id}`} className="card hover:border-primary-400 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-[#2d2d2d] bg-[#e6f5f0] flex items-center justify-center text-[#00a170] font-extrabold shrink-0 group-hover:bg-[#00a170] group-hover:text-white transition-colors">
                    {member.first_name[0]}{member.last_name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink truncate">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-muted truncate">{member.professional_title}</p>
                    <p className="mt-1 text-xs font-medium text-primary-700">{member.organization}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {member.country}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {data?.results.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted">
                No members found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </MemberPageShell>
  )
}
