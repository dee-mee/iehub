import { Outlet } from 'react-router-dom'
import { SkipToContent } from '@/components/layout/SkipToContent'
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget'
import { MemberSidebar } from './MemberSidebar'

export function MemberLayout() {
  return (
    <>
      <SkipToContent />
      <AccessibilityWidget />
      <div className="site-member flex min-h-screen">
        <MemberSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col min-h-0 outline-none bg-[#f0f0f0]">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
