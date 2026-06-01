import { PageHeader } from '@/components/ui/PageHeader'

export function ELearningPage() {
  return (
    <>
      <PageHeader 
        title="eLearning Portal" 
        description="Access our specialized courses and training modules on inclusive education."
      />
      <div className="bg-white py-20">
        <div className="container-page text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.083 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-ink tracking-tight">Coming Soon!</h2>
            <p className="text-xl text-muted leading-relaxed">
              We are currently developing a comprehensive library of online courses 
              for teachers, policymakers, and community advocates. 
              Our eLearning platform will feature interactive modules, certification, and peer-to-peer learning.
            </p>
            <div className="p-8 border-2 border-dashed border-[#2d2d2d] bg-slate-50 rounded-2xl">
              <p className="font-bold text-ink">Want to be notified when we launch?</p>
              <p className="text-sm text-muted mb-4">Stay tuned to our news and announcements section.</p>
              <a href="/news" className="btn-primary inline-block">Visit News Section</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
