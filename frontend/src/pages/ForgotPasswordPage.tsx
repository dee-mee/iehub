import type { FormEvent } from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHeader title="Forgot password" description="Request a password reset link." />
      <div className="container-page max-w-xl py-12">
        <form className="card space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" required className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3" />
          </div>
          <button type="submit" className="btn-primary">Send reset link</button>
          {sent && (
            <p className="text-sm text-primary-700" role="status">
              If the email exists, a reset link will be sent shortly.
            </p>
          )}
        </form>
      </div>
    </>
  )
}
