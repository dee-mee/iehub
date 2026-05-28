import { Outlet } from 'react-router-dom'
import { SkipToContent } from './SkipToContent'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { UserWay } from '@/components/accessibility/UserWay'

export function PublicLayout() {
  return (
    <>
      <SkipToContent />
      <UserWay />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
