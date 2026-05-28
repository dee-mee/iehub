import { Link } from 'react-router-dom'

export function AccessibilityPreferencesPage() {
  return (
    <div className="container-page py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Accessibility Preferences</h1>
      <p className="text-muted mb-8">This feature is currently being enhanced. Please check back soon.</p>
      <Link to="/dashboard" className="btn-primary">Return to Dashboard</Link>
    </div>
  )
}
