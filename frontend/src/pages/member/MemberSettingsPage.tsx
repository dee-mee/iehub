import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'
import { useAuth } from '@/context/AuthContext'

export function MemberSettingsPage() {
  const { user } = useAuth()

  return (
    <MemberPageShell title="Settings">
      <div className="grid gap-4 max-w-2xl">
        <section className="member-panel">
          <h2 className="font-bold text-gray-900 mb-2">Account</h2>
          <p className="text-sm text-gray-600 mb-4">
            Role: <strong>{user?.role}</strong> · Approved:{' '}
            <strong>{user?.is_approved ? 'Yes' : 'Pending'}</strong>
          </p>
          <Link to="/profile" className="btn-primary inline-block text-sm">
            Edit profile & expertise
          </Link>
        </section>
        <section className="member-panel">
          <h2 className="font-bold text-gray-900 mb-2">Accessibility</h2>
          <p className="text-sm text-gray-600 mb-4">
            Customize contrast, text size, and motion preferences for the member portal.
          </p>
          <Link to="/profile/accessibility" className="text-sm font-semibold text-[#00a170] hover:underline">
            Accessibility preferences →
          </Link>
        </section>
        <section className="member-panel">
          <h2 className="font-bold text-gray-900 mb-2">Notifications</h2>
          <p className="text-sm text-gray-600 mb-4">
            Forum replies, mentions, and system alerts appear in your notifications inbox.
          </p>
          <Link to="/notifications" className="text-sm font-semibold text-[#00a170] hover:underline">
            Manage notifications →
          </Link>
        </section>
      </div>
    </MemberPageShell>
  )
}
