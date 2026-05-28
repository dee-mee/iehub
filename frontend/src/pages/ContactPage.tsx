import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { submitContactMessage } from '@/api/public'
import { PageHeader } from '@/components/ui/PageHeader'

export function ContactPage() {
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const submitMutation = useMutation({
    mutationFn: submitContactMessage,
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await submitMutation.mutateAsync({
        fullName: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        organization: String(formData.get('organization') ?? ''),
        subject: String(formData.get('subject') ?? ''),
        message: String(formData.get('message') ?? ''),
      })
      setSent(true)
      form.reset()
    } catch {
      setError('Could not send message right now. Please try again.')
    }
  }

  return (
    <>
      <PageHeader
        title="Contact us"
        description="Get in touch with the IE Hub team or register your interest in joining the Community of Practice."
      />

      <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
        <section aria-labelledby="contact-details">
          <h2 id="contact-details" className="text-xl font-bold text-primary-800">
            Office & support
          </h2>
          <address className="mt-4 space-y-3 text-muted not-italic">
            <p>
              <strong className="text-ink">Email:</strong>{' '}
              <a href="mailto:info@iehub.africa" className="text-primary-700 underline">
                info@iehub.africa
              </a>
            </p>
            <p>
              <strong className="text-ink">Phone:</strong>{' '}
              <a href="tel:+254700000000" className="text-primary-700 underline">
                +254 700 000 000
              </a>
            </p>
            <p>
              <strong className="text-ink">Hours:</strong> Monday–Friday, 9:00–17:30 EAT
            </p>
            <p>LM International · Nairobi, Kenya</p>
          </address>
        </section>

        <section id="join" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="text-xl font-bold text-primary-800">
            Send a message
          </h2>
          {sent ? (
            <p className="mt-4 rounded-lg bg-primary-50 p-4 text-primary-800" role="status">
              Thank you. Your message has been received. We will respond within 2 business days.
            </p>
          ) : (
            <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full name <span className="text-red-700">*</span>
                </label>
                <input id="name" name="name" type="text" required autoComplete="name" className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email <span className="text-red-700">*</span>
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3" />
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium">
                  Organisation
                </label>
                <input id="organization" name="organization" type="text" className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject <span className="text-red-700">*</span>
                </label>
                <select id="subject" name="subject" required className="mt-1 w-full min-h-11 rounded-lg border border-primary-200 px-3">
                  <option value="">Select a subject</option>
                  <option value="general">General enquiry</option>
                  <option value="membership">Membership / join CoP</option>
                  <option value="resources">Submit a resource</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  Message <span className="text-red-700">*</span>
                </label>
                <textarea id="message" name="message" required rows={5} className="mt-1 w-full rounded-lg border border-primary-200 px-3 py-2" />
              </div>
              <button type="submit" className="btn-primary" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? 'Sending...' : 'Send message'}
              </button>
              {error && (
                <p className="text-sm text-red-700" role="status">
                  {error}
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </>
  )
}
