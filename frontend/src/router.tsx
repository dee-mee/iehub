import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { ResourceDetailPage } from '@/pages/ResourceDetailPage'
import { NewsPage } from '@/pages/NewsPage'
import { NewsDetailPage } from '@/pages/NewsDetailPage'
import { ContactPage } from '@/pages/ContactPage'
import { AccessibilityPage } from '@/pages/AccessibilityPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyEmailPage } from '@/pages/VerifyEmailPage'
import { PendingApprovalPage } from '@/pages/PendingApprovalPage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MembersPage } from '@/pages/MembersPage'
import { MemberDetailPage } from '@/pages/MemberDetailPage'
import { AccessibilityPreferencesPage } from '@/pages/AccessibilityPreferencesPage'
import { ForumPage } from '@/pages/ForumPage'
import { ForumCategoryPage } from '@/pages/ForumCategoryPage'
import { ForumThreadPage } from '@/pages/ForumThreadPage'
import { ForumCreateThreadPage } from '@/pages/ForumCreateThreadPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { DonatePage } from '@/pages/DonatePage'
import { AnalyticsDashboard } from '@/pages/AnalyticsDashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'resources/:id', element: <ResourceDetailPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'donate', element: <DonatePage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'pending-approval', element: <PendingApprovalPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/accessibility', element: <AccessibilityPreferencesPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'members/:id', element: <MemberDetailPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'analytics', element: <AnalyticsDashboard /> },
      
      // Forum routes
      { path: 'forum', element: <ForumPage /> },
      { path: 'forum/c/:slug', element: <ForumCategoryPage /> },
      { path: 'forum/c/:slug/new', element: <ForumCreateThreadPage /> },
      { path: 'forum/t/:slug', element: <ForumThreadPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
