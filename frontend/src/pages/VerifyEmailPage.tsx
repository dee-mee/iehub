import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided.')
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || 'Your email has been successfully verified!')
          // Redirect to login after 3 seconds
          setTimeout(() => navigate('/login'), 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. The token may be invalid or expired.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('A network error occurred. Please try again later.')
      }
    }

    verifyToken()
  }, [token, navigate])

  return (
    <>
      <PageHeader 
        title="Email Verification" 
        description="Verifying your account to grant access to the Community of Practice." 
      />
      
      <div className="container-page max-w-xl py-12 text-center">
        <div className="card">
          {status === 'loading' && (
            <div className="py-8">
              <LoadingSpinner label="Verifying your email..." />
              <p className="mt-4 text-muted">Please wait while we confirm your registration.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-ink">Success!</h2>
              <p className="text-muted">{message}</p>
              <p className="text-sm">You will be redirected to the login page shortly.</p>
              <Link to="/login" className="btn-primary inline-block mt-4">
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-ink">Verification Failed</h2>
              <p className="text-muted">{message}</p>
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/register" className="btn-primary">
                  Try Registering Again
                </Link>
                <Link to="/contact" className="text-sm text-primary-700 hover:underline">
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
