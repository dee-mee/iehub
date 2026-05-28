import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <footer className="border-t border-primary-200 bg-primary-900 text-white" role="contentinfo">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-accent-400">{t('siteShort')}</p>
          <p className="mt-2 text-sm text-primary-100">{t('tagline')}</p>
          <p className="mt-4 text-sm text-primary-200">
            Hosted from Nairobi, Kenya · Continental reach across Africa
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            {t('footer.quickLinks')}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="hover:underline focus-visible:outline-white" to="/resources">
                {t('nav.resources')}
              </Link>
            </li>
            <li>
              <Link className="hover:underline focus-visible:outline-white" to="/news">
                {t('nav.news')}
              </Link>
            </li>
            <li>
              <Link className="hover:underline focus-visible:outline-white" to="/about">
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link className="hover:underline focus-visible:outline-white" to="/accessibility">
                {t('nav.accessibility')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            {t('footer.contact')}
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-primary-100">
            <p>
              <span className="font-medium text-white">Email:</span>{' '}
              <a href="mailto:info@iehub.africa" className="underline-offset-2 hover:underline">
                info@iehub.africa
              </a>
            </p>
            <p>
              <span className="font-medium text-white">Phone:</span>{' '}
              <a href="tel:+254700000000" className="underline-offset-2 hover:underline">
                +254 700 000 000
              </a>
            </p>
            <p>LM International · Nairobi, Kenya</p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            {t('footer.newsletterTitle')}
          </h2>
          <p className="mt-2 text-sm text-primary-100">{t('footer.newsletterDesc')}</p>
          {submitted ? (
            <p className="mt-4 rounded-lg bg-primary-800 p-3 text-sm" role="status">
              Thank you for subscribing. You will receive a confirmation email shortly.
            </p>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={handleNewsletter} noValidate>
              <div>
                <label htmlFor="newsletter-name" className="sr-only">
                  Name
                </label>
                <input
                  id="newsletter-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full min-h-11 rounded-lg border border-primary-600 bg-primary-800 px-3 text-white placeholder:text-primary-300"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full min-h-11 rounded-lg border border-primary-600 bg-primary-800 px-3 text-white placeholder:text-primary-300"
                  placeholder="Email address"
                />
              </div>
              <div className="flex items-start gap-2">
                <input
                  id="newsletter-consent"
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 h-5 w-5 rounded border-primary-400"
                />
                <label htmlFor="newsletter-consent" className="text-xs text-primary-100">
                  {t('footer.consent')}
                </label>
              </div>
              <button type="submit" className="btn-primary w-full bg-accent-500 hover:bg-accent-600">
                {t('footer.subscribe')}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-primary-700">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-primary-300 sm:flex-row sm:text-start">
          <p>{t('footer.copyright', { year })}</p>
          <p>WCAG 2.2 AA · Built for accessibility from day one</p>
        </div>
      </div>
    </footer>
  )
}
