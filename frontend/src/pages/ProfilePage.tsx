import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { useAuth } from '@/context/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type ExpertiseTag = {
  id: number
  name: string
  slug: string
}

export function ProfilePage() {
  const { user, updateProfile, loading: authLoading } = useAuth()
  
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { data: expertiseTags } = useQuery<ExpertiseTag[]>({
    queryKey: ['expertise-tags'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/expertise-tags/`)
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    }
  })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    professionalTitle: '',
    bio: '',
    profile: {
      linkedin_url: '',
      twitter_url: '',
      website_url: '',
      is_visible_in_directory: true,
      expertise_area_ids: [] as number[]
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name ?? '',
        lastName: user.last_name ?? '',
        organization: user.organization ?? '',
        professionalTitle: user.professional_title ?? '',
        bio: user.bio ?? '',
        profile: {
          linkedin_url: user.profile?.linkedin_url ?? '',
          twitter_url: user.profile?.twitter_url ?? '',
          website_url: user.profile?.website_url ?? '',
          is_visible_in_directory: user.profile?.is_visible_in_directory ?? true,
          expertise_area_ids: user.profile?.expertise_areas.map(a => a.id) ?? []
        }
      })
    }
  }, [user])

  if (authLoading) {
    return (
      <MemberPageShell title="My Profile">
        <LoadingSpinner label="Loading profile..." />
      </MemberPageShell>
    )
  }
  if (!user) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('profile.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if (name.startsWith('profile.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [field]: checked }
      }))
    }
  }

  const handleExpertiseToggle = (tagId: number) => {
    setFormData(prev => {
      const current = prev.profile.expertise_area_ids
      const next = current.includes(tagId)
        ? current.filter(id => id !== tagId)
        : [...current, tagId]
      return {
        ...prev,
        profile: { ...prev.profile, expertise_area_ids: next }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization: formData.organization,
        professional_title: formData.professionalTitle,
        bio: formData.bio,
        profile: formData.profile
      } as any)
      setSuccess(true)
      setEditing(false)
      window.scrollTo(0, 0)
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MemberPageShell title="My Profile">
      <p className="text-sm text-gray-600 mb-6">
        Manage your professional information, expertise areas, and directory visibility.
      </p>
        <div className="max-w-4xl">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <div className="card text-center">
                <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-primary-50">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
                <h2 className="mt-4 text-xl font-bold text-ink">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-sm text-muted">{user.professional_title}</p>
                <div className="mt-4 inline-block px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-full uppercase tracking-widest border border-primary-100">
                  {user.role.replace('_', ' ')}
                </div>
              </div>

              <div className="card">
                <h3 className="font-bold text-ink mb-4 text-sm uppercase tracking-wider">Account Status</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-muted">
                    <span className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>Email Verified</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted">
                    <span className={`w-2 h-2 rounded-full ${user.is_approved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span>Admin Approved</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted">
                    <span className={`w-2 h-2 rounded-full ${user.profile?.is_visible_in_directory ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Visible in Directory</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="card">
                <div className="flex justify-between items-center mb-8 border-b border-primary-50 pb-4">
                  <h3 className="text-xl font-bold text-ink">Professional Profile</h3>
                  {!editing && (
                    <button 
                      onClick={() => setEditing(true)} 
                      className="text-primary-700 font-bold text-sm hover:underline flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="label">First Name</label>
                        <input 
                          type="text" 
                          name="firstName" 
                          className="input" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName" 
                          className="input" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="label">Professional Title</label>
                        <input 
                          type="text" 
                          name="professionalTitle" 
                          className="input" 
                          value={formData.professionalTitle} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div>
                        <label className="label">Organization</label>
                        <input 
                          type="text" 
                          name="organization" 
                          className="input" 
                          value={formData.organization} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Professional Bio</label>
                      <textarea 
                        name="bio" 
                        rows={4} 
                        className="input py-2" 
                        placeholder="Tell the community about your work in inclusive education..."
                        value={formData.bio} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div>
                      <label className="label mb-3">Expertise Areas</label>
                      <div className="flex flex-wrap gap-2">
                        {expertiseTags?.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleExpertiseToggle(tag.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              formData.profile.expertise_area_ids.includes(tag.id)
                                ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                : 'bg-white border-primary-200 text-muted hover:border-primary-400'
                            }`}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted italic">Select all that apply to help others find you in the directory.</p>
                    </div>

                    <div className="border-t border-primary-50 pt-8 space-y-6">
                      <h4 className="font-bold text-ink flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.242m-4.242 4.242l-2.474 2.474m12.426-2.474l2.474-2.474m-1.359-1.359L15.412 8.59m-4.403 4.412l2.474-2.474" />
                        </svg>
                        Online Presence
                      </h4>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="label">LinkedIn Profile URL</label>
                          <input 
                            type="url" 
                            name="profile.linkedin_url" 
                            className="input" 
                            placeholder="https://linkedin.com/in/username"
                            value={formData.profile.linkedin_url} 
                            onChange={handleChange} 
                          />
                        </div>
                        <div>
                          <label className="label">Website or Portfolio URL</label>
                          <input 
                            type="url" 
                            name="profile.website_url" 
                            className="input" 
                            placeholder="https://example.com"
                            value={formData.profile.website_url} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-primary-50 pt-8">
                      <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="profile.is_visible_in_directory" 
                            className="w-5 h-5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                            checked={formData.profile.is_visible_in_directory}
                            onChange={handleCheckboxChange}
                          />
                          <div>
                            <span className="text-ink font-bold block text-sm">Visible in Member Directory</span>
                            <span className="text-xs text-muted">Allow other members to find your profile and connect with you.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setEditing(false)} 
                        className="btn-secondary flex-1"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn-primary flex-1"
                        disabled={submitting}
                      >
                        {submitting ? 'Saving changes...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-10">
                    <section>
                      <h4 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-3">Professional Bio</h4>
                      <p className="text-ink leading-relaxed whitespace-pre-wrap">
                        {user.bio || 'No professional bio provided. Click edit to add one and help the community get to know you.'}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-4">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.profile?.expertise_areas.length ? (
                          user.profile.expertise_areas.map(area => (
                            <span key={area.id} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">
                              {area.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted italic">No expertise areas selected yet.</p>
                        )}
                      </div>
                    </section>

                    <div className="grid gap-8 sm:grid-cols-2 pt-4">
                      <section>
                        <h4 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-2">Current Organization</h4>
                        <p className="text-ink font-medium">{user.organization || 'Not specified'}</p>
                      </section>
                      <section>
                        <h4 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-2">Location</h4>
                        <div className="flex items-center gap-1.5 text-ink font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {user.country}
                        </div>
                      </section>
                    </div>

                    {(user.profile?.linkedin_url || user.profile?.website_url) && (
                      <section className="pt-4">
                        <h4 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-4">Connect</h4>
                        <div className="flex flex-wrap gap-4">
                          {user.profile.linkedin_url && (
                            <a href={user.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                              LinkedIn
                            </a>
                          )}
                          {user.profile.website_url && (
                            <a href={user.profile.website_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                              Personal Website
                            </a>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </MemberPageShell>
  )
}
