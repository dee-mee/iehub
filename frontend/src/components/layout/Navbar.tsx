import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-100 text-primary-800'
      : 'text-ink hover:bg-primary-50 hover:text-primary-800',
  ].join(' ')

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ]

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  const changeLanguage = (code: string) => {
    void i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  // Ensure dir is correct on load
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted hover:text-primary-700 transition-colors">
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white shadow-xl border border-primary-100 rounded-xl overflow-hidden min-w-[140px] z-50">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors flex items-center gap-3 ${
              i18n.language === lang.code ? 'text-primary-700 font-bold bg-primary-50/50' : 'text-ink'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function NotificationBell() {
  const { data } = useQuery<{ count: number }>({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      if (!tokens.access) return { count: 0 }
      const response = await fetch(`${API_BASE_URL}/auth/notifications/unread_count/`, {
        headers: { 'Authorization': `Bearer ${tokens.access}` }
      })
      if (!response.ok) return { count: 0 }
      return response.json()
    },
    refetchInterval: 60000,
  })

  return (
    <Link to="/notifications" className="relative p-2 text-muted hover:text-primary-700 transition-colors">
      <span className="sr-only">Notifications</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {data && data.count > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {data.count > 9 ? '9+' : data.count}
        </span>
      )}
    </Link>
  )
}

export function Navbar() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const baseLinks = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/about', label: t('nav.about') },
    { to: '/resources', label: t('nav.resources') },
    { to: '/news', label: t('nav.news') },
  ]

  const authLinks = [
    { to: '/forum', label: t('nav.forum') },
    { to: '/members', label: t('nav.members') },
  ]

  const desktopLinks = [...baseLinks, ...(isAuthenticated ? authLinks : []), { to: '/contact', label: t('nav.contact') }]
  const mobileLinks = [...desktopLinks, { to: '/accessibility', label: t('nav.accessibility') }]

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-white/95 backdrop-blur">
      <div className="border-b border-primary-50 bg-primary-900 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <p className="font-medium">
            <span className="text-accent-400">IE Hub</span> — {t('tagline')}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:info@iehub.africa"
              className="underline-offset-2 hover:underline focus-visible:outline-white"
            >
              info@iehub.africa
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <nav className="container-page" aria-label="Main navigation">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-offset-4"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-600 text-lg font-bold text-white"
              aria-hidden="true"
            >
              IE
            </span>
            <span className="hidden flex-col sm:flex">
              <span className="text-sm font-bold text-primary-800">{t('siteShort')}</span>
              <span className="text-xs text-muted">Africa</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {desktopLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/contact" className="btn-secondary text-sm">
              {t('nav.donate')}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <div className="h-8 w-px bg-primary-100 mx-1" />
                <Link to="/profile" className="text-sm font-medium text-primary-850 hover:underline">
                  {user?.first_name || user?.username}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  {t('nav.join')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-primary-200 p-2"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-primary-100 pb-4 lg:hidden">
            <ul className="flex flex-col gap-1 pt-2">
              {mobileLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={navLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="text-sm font-medium px-3 py-1" onClick={() => setMenuOpen(false)}>
                      {t('nav.profile')} ({user?.first_name || user?.username})
                    </Link>
                    <button onClick={handleLogout} className="btn-secondary w-full text-center py-2">
                      {t('nav.signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setMenuOpen(false)}>
                      {t('nav.signIn')}
                    </Link>
                    <Link to="/register" className="btn-primary w-full text-center" onClick={() => setMenuOpen(false)}>
                      {t('nav.join')}
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
