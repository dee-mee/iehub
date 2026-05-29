import { Outlet } from 'react-router-dom'
import { SkipToContent } from './SkipToContent'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { UserWay } from '@/components/accessibility/UserWay'
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget'

export function PublicLayout() {
  return (
    <>
      <SkipToContent />
      {/* Built-in accessibility widget — always visible, no API key required */}
      <AccessibilityWidget />
      {/* UserWay — optional SaaS enhancement, only loads when VITE_USERWAY_KEY is set */}
      <UserWay />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
