import { Link } from 'react-router-dom'
import { MemberPageShell } from '@/components/member/MemberPageShell'

const FAQ = [
  {
    q: 'How do I get approved for the members forum?',
    a: 'After registering and verifying your email, a steering committee member reviews your application. You will receive a notification when approved.',
  },
  {
    q: 'Why can’t I see some discussion categories?',
    a: 'Expert-only categories are limited to members whose expertise areas match that section. Update your profile expertise tags if needed.',
  },
  {
    q: 'How do I report inappropriate content?',
    a: 'Open the thread, use the flag option on a post, or contact moderators via the Moderation dashboard (admins).',
  },
  {
    q: 'How do private messages work?',
    a: 'Approved members can message each other from the Messages section. Only inbox and sent mail for your account are shown.',
  },
]

export function MemberHelpPage() {
  return (
    <MemberPageShell title="Help & Support">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="member-panel">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Frequently asked questions</h2>
          <dl className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-gray-900 text-sm">{item.q}</dt>
                <dd className="text-sm text-gray-600 mt-1">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="member-panel">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Contact support</h2>
          <p className="text-sm text-gray-600 mb-4">
            For account issues, accessibility needs, or community guidelines questions:
          </p>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>
              Email:{' '}
              <a href="mailto:info@iehub.africa" className="text-[#00a170] underline">
                info@iehub.africa
              </a>
            </li>
            <li>
              <Link to="/profile" className="text-[#00a170] underline">
                Update your profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="text-[#00a170] underline">
                Account settings
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </MemberPageShell>
  )
}
