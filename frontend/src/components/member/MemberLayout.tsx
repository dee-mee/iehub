import { Outlet } from 'react-router-dom'
import { SkipToContent } from '@/components/layout/SkipToContent'
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget'
import { useTheme } from '@/context/ThemeContext'
import { MemberSidebar } from './MemberSidebar'

export function MemberLayout() {
  const { theme } = useTheme()

  return (
    <>
      <SkipToContent />
      <AccessibilityWidget />
      <div className={`${theme === 'dark' ? 'dark' : ''} flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors`}>
        <MemberSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col min-h-0 outline-none">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
