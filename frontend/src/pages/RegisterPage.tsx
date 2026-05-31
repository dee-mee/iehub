import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { lmOffices } from '@/data/mockContent'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: '',
    professionalTitle: '',
    organization: '',
    organizationType: '',
    bio: '',
    howHeard: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.username.trim()) return 'Username is required.'
    if (!formData.email.trim()) return 'Email is required.'
    if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters.'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const validateStep2 = () => {
    if (!formData.firstName.trim()) return 'First name is required.'
    if (!formData.lastName.trim()) return 'Last name is required.'
    if (!formData.country) return 'Please select a country.'
    if (!formData.professionalTitle.trim()) return 'Professional title / role is required.'
    return null
  }

  const nextStep = () => {
    setError(null)
    if (step === 1) {
      const err = validateStep1()
      if (err) {
        setError(err)
        return
      }
      setStep(2)
    } else if (step === 2) {
      const err = validateStep2()
      if (err) {
        setError(err)
        return
      }
      setStep(3)
    }
  }

  const prevStep = () => {
    setError(null)
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (step < 3) {
      nextStep()
      return
    }

    if (!formData.organizationType) {
      setError('Please select an organization type.')
      return
    }

    setSubmitting(true)

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        organization: formData.organization,
        organizationType: formData.organizationType,
        professionalTitle: formData.professionalTitle,
        bio: formData.bio,
        howHeard: formData.howHeard,
        country: formData.country,
      })
      navigate('/pending-approval', { state: { registered: true } })
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Check details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title="Register" description="Join the IE Hub Community of Practice." />
      <div className="container-page max-w-xl py-12">
        {/* Step Indicator Progress Bar */}
        <div className="mb-8" aria-label="Registration Progress">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className={step >= 1 ? 'text-primary-700 font-bold' : 'text-muted'}>1. Account</span>
            <span className={step >= 2 ? 'text-primary-700 font-bold' : 'text-muted'}>2. Personal</span>
            <span className={step >= 3 ? 'text-primary-700 font-bold' : 'text-muted'}>3. Organization</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-primary-100 overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={3}
            />
          </div>
        </div>

        <form className="card space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium" role="status">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-ink">Account Setup</h2>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-ink">
                  Username <span className="text-red-600">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
                <span className="text-xs text-muted">Must be at least 8 characters.</span>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-ink">Personal Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-ink">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-ink">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-ink">
                  Country of Residence <span className="text-red-600">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                >
                  <option value="">-- Select Country --</option>
                  {lmOffices.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                  <option value="Other African Country">Other African Country</option>
                </select>
              </div>
              <div>
                <label htmlFor="professionalTitle" className="block text-sm font-medium text-ink">
                  Professional Title / Role <span className="text-red-600">*</span>
                </label>
                <input
                  id="professionalTitle"
                  name="professionalTitle"
                  type="text"
                  placeholder="e.g. Special Needs Education Coordinator"
                  required
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-ink">Professional & Stakeholder Info</h2>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-ink">
                  Organization Name
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
              <div>
                <label htmlFor="organizationType" className="block text-sm font-medium text-ink">
                  Organization Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="organizationType"
                  name="organizationType"
                  required
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                >
                  <option value="">-- Select Type --</option>
                  <option value="OPD">OPD (Organization of Persons with Disabilities)</option>
                  <option value="CSO">CSO (Civil Society Organization)</option>
                  <option value="FBO">FBO (Faith Based Organization)</option>
                  <option value="GOVERNMENT">Government / Policy Maker</option>
                  <option value="ACADEMIC">Academic / Researcher</option>
                  <option value="PRIVATE">Private Sector</option>
                  <option value="INDIVIDUAL">Individual / Educator</option>
                </select>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-ink">
                  Brief Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="Share a short summary of your background in inclusive education."
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-primary-200 px-3 py-2 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
              <div>
                <label htmlFor="howHeard" className="block text-sm font-medium text-ink">
                  How did you hear about IE Hub?
                </label>
                <input
                  id="howHeard"
                  name="howHeard"
                  type="text"
                  value={formData.howHeard}
                  onChange={handleChange}
                  className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3 bg-white text-ink focus-visible:outline focus-visible:outline-2"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary flex-1"
                disabled={submitting}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {step < 3 ? 'Continue' : submitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <p className="text-sm text-muted text-center pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-700 underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
