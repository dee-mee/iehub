import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { MemberLayout } from '@/components/member/MemberLayout'
import { RequireMember } from '@/components/auth/RequireMember'
import { RequireRole } from '@/components/auth/RequireRole'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { ResourceDetailPage } from '@/pages/ResourceDetailPage'
import { NewsPage } from '@/pages/NewsPage'
import { NewsDetailPage } from '@/pages/NewsDetailPage'
import { ContactPage } from '@/pages/ContactPage'
import { ProgramsPage } from '@/pages/ProgramsPage'
import { ELearningPage } from '@/pages/ELearningPage'
import { AccessibilityPage } from '@/pages/AccessibilityPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
// import { VerifyEmailPage } from '@/pages/VerifyEmailPage'
import { PendingApprovalPage } from '@/pages/PendingApprovalPage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { DonatePage } from '@/pages/DonatePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MembersPage } from '@/pages/MembersPage'
import { MemberDetailPage } from '@/pages/MemberDetailPage'
import { AccessibilityPreferencesPage } from '@/pages/AccessibilityPreferencesPage'
import { ForumPage } from '@/pages/ForumPage'
import { ForumCategoryPage } from '@/pages/ForumCategoryPage'
import { ForumThreadPage } from '@/pages/ForumThreadPage'
import { ForumCreateThreadPage } from '@/pages/ForumCreateThreadPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { AnalyticsDashboard } from '@/pages/AnalyticsDashboard'
import { MessagesPage } from '@/pages/member/MessagesPage'
import { MemberEventsPage } from '@/pages/member/MemberEventsPage'
import { MemberAnnouncementsPage } from '@/pages/member/MemberAnnouncementsPage'
import { MemberResourcesPage } from '@/pages/member/MemberResourcesPage'
import { MemberResourceDetailPage } from '@/pages/member/MemberResourceDetailPage'
import { MemberHelpPage } from '@/pages/member/MemberHelpPage'
import { MemberSettingsPage } from '@/pages/member/MemberSettingsPage'
import { ForumSearchPage } from '@/pages/member/ForumSearchPage'
import { ModerationPage } from '@/pages/member/ModerationPage'

const ADMIN_ROLES = ['SUPER_ADMIN', 'STEERING_COMMITTEE', 'REGIONAL_ADMIN']

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'resources/:id', element: <ResourceDetailPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:slug', element: <NewsDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'programmes', element: <ProgramsPage /> },
      { path: 'elearning', element: <ELearningPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'donate', element: <DonatePage /> },
      { path: 'register', element: <RegisterPage /> },
      // { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'pending-approval', element: <PendingApprovalPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <RequireMember>
        <MemberLayout />
      </RequireMember>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'forum', element: <ForumPage /> },
      { path: 'forum/search', element: <ForumSearchPage /> },
      { path: 'forum/c/:slug', element: <ForumCategoryPage /> },
      { path: 'forum/c/:slug/new', element: <ForumCreateThreadPage /> },
      { path: 'forum/t/:slug', element: <ForumThreadPage /> },
      { path: 'announcements', element: <MemberAnnouncementsPage /> },
      { path: 'member-resources', element: <MemberResourcesPage /> },
      { path: 'member-resources/:id', element: <MemberResourceDetailPage /> },
      { path: 'events', element: <MemberEventsPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'members/:id', element: <MemberDetailPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/accessibility', element: <AccessibilityPreferencesPage /> },
      { path: 'settings', element: <MemberSettingsPage /> },
      { path: 'help', element: <MemberHelpPage /> },
      {
        path: 'moderation',
        element: (
          <RequireRole roles={ADMIN_ROLES}>
            <ModerationPage />
          </RequireRole>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RequireRole roles={ADMIN_ROLES}>
            <AnalyticsDashboard />
          </RequireRole>
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
