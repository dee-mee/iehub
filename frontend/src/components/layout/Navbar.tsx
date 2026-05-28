import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-100 text-primary-800'
      : 'text-ink hover:bg-primary-50 hover:text-primary-800',
  ].join(' ')

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

  const links: { to: string; label: string; end?: boolean }[] = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/about', label: t('nav.about') },
    { to: '/resources', label: t('nav.resources') },
    { to: '/news', label: t('nav.news') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/accessibility', label: t('nav.accessibility') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-white/95 backdrop-blur">
      <div className="border-b border-primary-50 bg-primary-900 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <p className="font-medium">
            <span className="text-accent-400">IE Hub</span> — {t('tagline')}
          </p>
          <a
            href="mailto:info@iehub.africa"
            className="underline-offset-2 hover:underline focus-visible:outline-white"
          >
            info@iehub.africa
          </a>
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
            {links.map((link) => (
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
              <>
                <span className="text-sm font-medium text-primary-850">
                  Hi, {user?.first_name || user?.username}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  {t('nav.join')}
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-primary-200 p-2 lg:hidden"
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

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-primary-100 pb-4 lg:hidden">
            <ul className="flex flex-col gap-1 pt-2">
              {links.map((link) => (
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
                    <span className="text-sm font-medium px-3 py-1">
                      Hi, {user?.first_name || user?.username}
                    </span>
                    <button onClick={handleLogout} className="btn-secondary w-full">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setMenuOpen(false)}>
                      Sign in
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
