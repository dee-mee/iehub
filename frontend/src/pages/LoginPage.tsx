import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const data = new FormData(event.currentTarget)

    try {
      await login(String(data.get('email') ?? ''), String(data.get('password') ?? ''))
      navigate('/')
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
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <p className="text-sm text-red-700" role="status">{error}</p>}
          <p className="text-sm text-muted">
            New here? <Link to="/register" className="text-primary-700 underline">Create account</Link>
          </p>
          <p className="text-sm text-muted">
            <Link to="/forgot-password" className="text-primary-700 underline">Forgot password?</Link>
          </p>
        </form>
      </div>
    </>
  )
}
