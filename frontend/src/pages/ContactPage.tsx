import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'
import { submitContactMessage } from '@/api/public'

export function ContactPage() {
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  })

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      setSuccess(true)
      setFormData({
        fullName: '',
        email: '',
        organization: '',
        subject: '',
        message: '',
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <>
      <PageHeader 
        title={t('footer.contact')} 
        description="Get in touch with the IE Hub team for inquiries, partnerships, or support." 
      />

      <div className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">Send us a message</h2>
            {success ? (
              <div className="card bg-green-50 border-green-200 text-green-800 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you as soon as possible.</p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="btn-primary mt-6 bg-green-600 hover:bg-green-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="label">Full Name</label>
                    <input 
                      id="fullName"
                      name="fullName" 
                      type="text" 
                      required 
                      className="input"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email Address</label>
                    <input 
                      id="email"
                      name="email" 
                      type="email" 
                      required 
                      className="input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="organization" className="label">Organization (Optional)</label>
                  <input 
                    id="organization"
                    name="organization" 
                    type="text" 
                    className="input"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="label">Subject</label>
                  <input 
                    id="subject"
                    name="subject" 
                    type="text" 
                    required 
                    className="input"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="label">Message</label>
                  <textarea 
                    id="message"
                    name="message" 
                    rows={5} 
                    required 
                    className="input py-2"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Sending...' : 'Send Message'}
                </button>
                {mutation.isError && (
                  <p className="text-sm text-red-600 mt-2">Failed to send message. Please try again.</p>
                )}
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">Contact Information</h2>
              <p className="text-muted mb-6">
                Our secretariat is based in Nairobi, Kenya, coordinating efforts across the continent.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">Email</h3>
                    <a href="mailto:info@iehub.africa" className="text-primary-700 hover:underline">info@iehub.africa</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">Office</h3>
                    <p className="text-muted text-sm">Nairobi, Kenya (LM International Regional Office)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-primary-900 text-white border-none">
              <h3 className="text-lg font-bold mb-2">Support IE Hub</h3>
              <p className="text-primary-100 text-sm mb-4">
                Your contributions help us sustain this platform and expand our reach to more inclusive education practitioners.
              </p>
              <a href="/donate" className="btn-primary bg-accent-500 hover:bg-accent-600 text-ink inline-block font-bold">
                Donate Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
