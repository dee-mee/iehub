import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'

export function PendingApprovalPage() {
  return (
    <>
      <PageHeader 
        title="Approval Pending" 
        description="Your account is currently under review by our steering committee." 
      />
      
      <div className="container-page max-w-2xl py-12 text-center">
        <div className="card space-y-6 py-12">
          <div className="mx-auto w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ink">Thank you for registering!</h2>
            <p className="text-muted text-lg">
              To maintain the quality of our Community of Practice, all new memberships are manually 
              reviewed by our steering committee.
            </p>
          </div>

          <div className="bg-primary-50 p-6 rounded-xl border border-primary-100 text-left">
            <h3 className="font-semibold text-primary-800 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-primary-900">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>An administrator will review your profile details.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>This process typically takes 1-3 business days.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>You will receive an email once your account is approved.</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted">
            While you wait, you can still browse our public resource library.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resources" className="btn-primary">
              Browse Resources
            </Link>
            <Link to="/" className="btn-secondary">
              Go to Homepage
            </Link>
          </div>
          
          <div className="pt-4">
            <Link to="/contact" className="text-sm text-primary-700 hover:underline">
              Have questions? Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
