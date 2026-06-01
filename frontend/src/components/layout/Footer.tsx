import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const { isAuthenticated } = useAuth()

  const quickLinks = [
    { to: '/resources',   label: t('nav.resources') },
    { to: '/news',        label: t('nav.news') },
    { to: '/news?category=BLOG', label: t('nav.newsDropdown.blog') },
    { to: '/about',       label: t('nav.about') },
    { to: '/programmes',  label: t('nav.programmes') },
    { to: '/accessibility', label: t('nav.accessibility') },
  ]

  if (isAuthenticated) {
    quickLinks.push({ to: '/members', label: t('nav.members') })
  }

  return (
    <footer className="border-t-4 border-[#2d2d2d] bg-gray-900 text-white" role="contentinfo">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 border-x-2 border-[#2d2d2d]">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="IE Hub Logo" className="h-10 w-auto object-contain" />
            <span className="text-lg font-extrabold" style={{ color: '#00a170' }}>IE Hub</span>
          </div>
          <p className="text-sm text-gray-400">{t('tagline')}</p>
          <p className="mt-3 text-sm text-gray-500">{t('footer.hostedFrom')}</p>
          <div className="mt-5 flex gap-3">
            {['twitter', 'facebook', 'linkedin', 'youtube'].map(s => (
              <a key={s} href="#" aria-label={s}
                className="flex h-8 w-8 items-center justify-center border-2 border-gray-600 bg-gray-800 text-gray-400 hover:bg-[#00a170] hover:text-white hover:border-white transition-colors text-xs font-bold uppercase">
                {s.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: '#00a170' }}>
            {t('footer.quickLinks')}
          </h2>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-gray-400 hover:text-white transition-colors hover:underline underline-offset-2">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: '#00a170' }}>
            {t('footer.contact')}
          </h2>
          <address className="space-y-2.5 text-sm not-italic text-gray-400">
            <p>
              <span className="font-semibold text-white">Email: </span>
              <a href="mailto:info@iehub.africa" className="hover:text-white transition-colors hover:underline">info@iehub.africa</a>
            </p>
            <p>
              <span className="font-semibold text-white">Phone: </span>
              <a href="tel:+254700000000" className="hover:text-white transition-colors hover:underline">+254 700 000 000</a>
            </p>
            <p>Nairobi, Kenya</p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#00a170' }}>
            {t('footer.newsletterTitle')}
          </h2>
          <p className="mb-4 text-sm text-gray-400">{t('footer.newsletterDesc')}</p>
          {submitted ? (
            <p className="border-2 border-gray-600 bg-gray-800 p-3 text-sm text-gray-300" role="status">
              {t('footer.thankYou')}
            </p>
          ) : (
            <form className="space-y-3" onSubmit={handleNewsletter} noValidate>
              <input
                name="name" type="text" required autoComplete="name"
                placeholder={t('footer.yourName')}
                className="w-full min-h-10 border-2 border-gray-600 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-500 focus:border-[#00a170] focus:outline-none"
              />
              <input
                name="email" type="email" required autoComplete="email"
                placeholder={t('footer.emailAddress')}
                className="w-full min-h-10 border-2 border-gray-600 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-500 focus:border-[#00a170] focus:outline-none"
              />
              <div className="flex items-start gap-2">
                <input id="newsletter-consent" name="consent" type="checkbox" required
                  className="mt-1 h-4 w-4 rounded border-gray-500 accent-[#00a170]" />
                <label htmlFor="newsletter-consent" className="text-xs text-gray-500">
                  {t('footer.consent')}
                </label>
              </div>
              <button type="submit"
                className="w-full border-2 border-[#1a1a1a] py-2.5 text-sm font-bold text-white hover:opacity-95"
                style={{ background: '#00a170', boxShadow: '3px 3px 0 #000' }}>
                {t('footer.subscribe')}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t-2 border-gray-700">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-gray-500 sm:flex-row">
          <p>{t('footer.copyright', { year })}</p>
          <Link to="/privacy-policy" className="hover:text-white transition-colors underline underline-offset-2">
            {t('footer.privacyPolicy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
