import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { canAccessMemberArea } from '@/lib/memberNav'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

// ─── Language Switcher (full name, click-only dropdown) ──────────────────────
function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'ar', label: 'العربية' },
  ]
  const current = languages.find(l => l.code === i18n.language) || languages[0]

  useEffect(() => {
    document.documentElement.dir  = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-[#2d2d2d] bg-white hover:border-[#00a170] transition-colors text-gray-700"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {current.label}
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-0 bg-white border-2 border-[#2d2d2d] overflow-hidden min-w-[140px] z-50 shadow-[4px_4px_0_#2d2d2d]">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { void i18n.changeLanguage(lang.code); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition-colors ${i18n.language === lang.code ? 'font-bold text-[#00a170]' : 'text-gray-700'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Dropdown wrapper (click-only) ────────────────────────────────────────────
function NavDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-700 border-2 border-transparent hover:border-[#2d2d2d] transition-colors hover:text-[#00a170]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-0 z-50 min-w-[220px] border-2 border-[#2d2d2d] bg-white py-1 shadow-[4px_4px_0_#2d2d2d]">
          {items.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#00a170] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell() {
  const { data } = useQuery<{ count: number }>({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const tokens = JSON.parse(localStorage.getItem('iehub_tokens') || '{}')
      if (!tokens.access) return { count: 0 }
      const res = await fetch(`${API_BASE_URL}/auth/notifications/unread_count/`, {
        headers: { Authorization: `Bearer ${tokens.access}` },
      })
      if (!res.ok) return { count: 0 }
      return res.json() as Promise<{ count: number }>
    },
    refetchInterval: 60000,
  })

  return (
    <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-[#00a170] transition-colors">
      <span className="sr-only">Notifications</span>
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {data && data.count > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
          style={{ background: '#ed559e' }}>
          {data.count > 9 ? '9+' : data.count}
        </span>
      )}
    </Link>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export function Navbar() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }

  // Dropdowns built from translation keys
  const aboutDropdown = [
    { label: t('nav.aboutDropdown.ourStory'),          href: '/about' },
    { label: t('nav.aboutDropdown.whoWeAre'),          href: '/about#who-we-are' },
    { label: "Commitments Tracker",                    href: '/commitments' },
    { label: t('nav.aboutDropdown.steeringCommittee'), href: '/about#steering-committee' },
    { label: t('nav.aboutDropdown.countryOffices'),    href: '/about#country-offices' },
  ]
  const resourcesDropdown = [
    { label: t('nav.resourcesDropdown.allResources'),  href: '/resources' },
    { label: "Funding & Grant Tracker",                href: '/funding' },
    { label: t('nav.resourcesDropdown.policyAdvocacy'),href: '/resources?topic=policy-advocacy' },
    { label: t('nav.resourcesDropdown.teacherTraining'),href: '/resources?topic=teacher-training' },
    { label: t('nav.resourcesDropdown.assistiveTech'), href: '/resources?topic=assistive-technology' },
    { label: t('nav.resourcesDropdown.research'),      href: '/resources?topic=research-evidence' },
    { label: t('nav.resourcesDropdown.emergencies'),   href: '/resources?topic=education-emergencies' },
  ]
  const programmesDropdown = [
    { label: t('nav.programmesDropdown.overview'),       href: '/programmes' },
    { label: t('nav.programmesDropdown.earlyChildhood'), href: '/programmes#early-childhood' },
    { label: t('nav.programmesDropdown.teacherCapacity'),href: '/programmes#teacher-training' },
    { label: t('nav.programmesDropdown.policyReform'),   href: '/programmes#policy-reform' },
    { label: t('nav.programmesDropdown.community'),      href: '/programmes#community' },
  ]
  const newsDropdown = [
    { label: t('nav.newsDropdown.latestNews'),    href: '/news' },
    { label: t('nav.newsDropdown.events'),        href: '/news#events' },
    { label: t('nav.newsDropdown.announcements'), href: '/news#announcements' },
    { label: t('nav.newsDropdown.blog'),          href: '/news?category=BLOG' },
  ]

  return (
    <header className={`sticky top-0 z-50 bg-white border-b-2 border-[#2d2d2d] ${scrolled ? 'shadow-[0_4px_0_#2d2d2d]' : ''}`}>
      {/* Top bar — contact info + language */}
      <div className="hidden md:block border-b-2 border-[#2d2d2d] bg-[#f0f0f0]">
        <div className="container-page flex items-center justify-between py-2">
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <a href="tel:+25412345678" className="flex items-center gap-1.5 hover:text-[#00a170] transition-colors">
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +254 12 345 678
            </a>
            <a href="mailto:info@iehub.africa" className="flex items-center gap-1.5 hover:text-[#00a170] transition-colors">
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@iehub.africa
            </a>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Waiyaki Way, Nairobi
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main nav */}
      <nav className="container-page border-x-2 border-[#2d2d2d] max-w-[calc(80rem+4px)]" aria-label="Main navigation">
        <div className="flex min-h-[4rem] items-center justify-between gap-4 px-1">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 border-2 border-transparent hover:border-[#2d2d2d] p-1 focus-visible:outline-offset-4 flex-shrink-0">
            <img src="/logo.png" alt="IE Hub Logo" className="h-10 w-auto object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold" style={{ color: '#00a170' }}>IE Hub</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">Africa</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-0.5 lg:flex">
            <NavLink to="/" end
              className={({ isActive }) => `px-3 py-2 text-sm font-bold border-2 transition-colors ${isActive ? 'text-[#00a170] border-[#00a170] bg-[#e6f5f0]' : 'text-gray-700 border-transparent hover:text-[#00a170] hover:border-[#2d2d2d]'}`}>
              {t('nav.home')}
            </NavLink>
            <NavDropdown label={t('nav.about')} items={aboutDropdown} />
            <NavDropdown label={t('nav.resources')} items={resourcesDropdown} />
            <NavDropdown label={t('nav.programmes')} items={programmesDropdown} />
            <NavLink to="/elearning"
              className={({ isActive }) => `px-3 py-2 text-sm font-bold border-2 transition-colors ${isActive ? 'text-[#00a170] border-[#00a170] bg-[#e6f5f0]' : 'text-gray-700 border-transparent hover:text-[#00a170] hover:border-[#2d2d2d]'}`}>
              eLearning
            </NavLink>
            <NavDropdown label={t('nav.news')} items={newsDropdown} />
            <NavLink to="/contact"
              className={({ isActive }) => `px-3 py-2 text-sm font-bold border-2 transition-colors ${isActive ? 'text-[#00a170] border-[#00a170] bg-[#e6f5f0]' : 'text-gray-700 border-transparent hover:text-[#00a170] hover:border-[#2d2d2d]'}`}>
              {t('nav.contact')}
            </NavLink>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {canAccessMemberArea(user) && (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-bold text-white border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]"
                    style={{ background: '#2563eb' }}
                  >
                    Member Dashboard
                  </Link>
                )}
                <NotificationBell />
                <div className="h-6 w-px bg-gray-200" />
                <Link to="/profile" className="text-sm font-semibold text-gray-700 hover:text-[#00a170] transition-colors">
                  {user?.first_name || user?.username}
                </Link>
                <button onClick={handleLogout}
                  className="border-2 border-[#1a1a1a] px-4 py-2 text-sm font-bold transition-colors hover:bg-gray-50 shadow-[2px_2px_0_#1a1a1a]"
                  style={{ color: '#00a170' }}>
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 border-2 border-transparent hover:border-[#2d2d2d] hover:text-[#00a170] transition-colors">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register"
                  className="px-4 py-2 text-sm font-bold text-white border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] hover:opacity-95"
                  style={{ background: '#ed559e' }}>
                  {t('nav.join')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              type="button"
              className="inline-flex min-h-10 min-w-10 items-center justify-center border-2 border-[#2d2d2d] p-2"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t-2 border-[#2d2d2d] pb-4 lg:hidden bg-[#fafafa]" id="mobile-menu">
            <ul className="flex flex-col gap-1 pt-2">
              {[
                { to: '/',          label: t('nav.home'),       end: true },
                { to: '/about',     label: t('nav.about') },
                { to: '/resources', label: t('nav.resources') },
                { to: '/programmes',label: t('nav.programmes') },
                { to: '/elearning', label: 'eLearning' },
                { to: '/news',      label: t('nav.news') },
                { to: '/contact',   label: t('nav.contact') },
              ].map(link => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end}
                    className={({ isActive }) => `block mx-2 px-3 py-2 text-sm font-bold border-2 transition-colors ${isActive ? 'text-[#00a170] border-[#00a170] bg-green-50' : 'text-gray-700 border-transparent hover:text-[#00a170] hover:border-[#2d2d2d]'}`}
                    onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            {/* Mobile contact info */}
            <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2 px-3">
              <a href="tel:+25412345678" className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +254 12 345 678
              </a>
              <a href="mailto:info@iehub.africa" className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@iehub.africa
              </a>
              <div className="pt-1"><LanguageSwitcher /></div>
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
              {isAuthenticated ? (
                <>
                  {canAccessMemberArea(user) && (
                    <Link
                      to="/dashboard"
                      className="mx-3 border-2 border-[#1a1a1a] py-2 text-center text-sm font-bold text-white shadow-[2px_2px_0_#1a1a1a]"
                      style={{ background: '#2563eb' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Member Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="px-3 py-2 text-sm font-semibold text-gray-700" onClick={() => setMenuOpen(false)}>
                    {t('nav.profile')} ({user?.first_name || user?.username})
                  </Link>
                  <button onClick={handleLogout}
                    className="mx-3 border-2 border-[#1a1a1a] py-2 text-sm font-bold shadow-[2px_2px_0_#1a1a1a]"
                    style={{ borderColor: '#00a170', color: '#00a170' }}>
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mx-3 border-2 border-[#1a1a1a] py-2 text-center text-sm font-bold shadow-[2px_2px_0_#1a1a1a]"
                    style={{ borderColor: '#00a170', color: '#00a170' }} onClick={() => setMenuOpen(false)}>
                    {t('nav.signIn')}
                  </Link>
                  <Link to="/register" className="mx-3 border-2 border-[#1a1a1a] py-2 text-center text-sm font-bold text-white shadow-[2px_2px_0_#1a1a1a]"
                    style={{ background: '#ed559e' }} onClick={() => setMenuOpen(false)}>
                    {t('nav.join')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
