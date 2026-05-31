import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { canAccessMemberArea } from '@/lib/memberNav'
import { me as meApi } from '@/api/auth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const data = new FormData(event.currentTarget)

    try {
      const email = String(data.get('email') ?? '')
      const password = String(data.get('password') ?? '')
      await login(email, password)
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      const user = tokens.access ? await meApi(tokens.access) : null
      if (!user?.is_verified) {
        navigate('/verify-email')
      } else if (!canAccessMemberArea(user)) {
        navigate('/pending-approval')
      } else {
        navigate(from, { replace: true })
      }
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title="Login" description="Access your IE Hub member account." />
      <div className="container-page max-w-xl py-12">
        <form className="card space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" required className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input id="password" name="password" type="password" required className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <p className="text-sm text-red-700 text-center" role="status">{error}</p>}
          <p className="text-sm text-muted text-center pt-2 border-t border-primary-50">
            New here? <Link to="/register" className="text-primary-700 underline font-medium">Create account</Link>
          </p>
          <p className="text-sm text-muted text-center">
            <Link to="/forgot-password" className="text-primary-700 underline font-medium">Forgot password?</Link>
          </p>
        </form>
      </div>
    </>
  )
}
