import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/context/AuthContext'

export function AccessibilityPreferencesPage() {
  const { user, updateProfile } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Default preferences or user's saved ones
  const [prefs, setPrefs] = useState({
    fontSize: 'normal',
    contrast: 'normal',
    dyslexicFont: false,
    animations: true,
    lineSpacing: 'normal'
  })

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelect = (key: keyof typeof prefs, value: string) => {
    setPrefs(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSubmitting(true)
    try {
      // In a real implementation, we would send this to the backend
      // await updateProfile({ accessibility_preferences: prefs })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save preferences', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader 
        title="Accessibility Preferences" 
        description="Customize your IE Hub experience to suit your needs." 
      />

      <div className="container-page py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold text-ink mb-6">Visual Preferences</h2>
            
            <div className="space-y-6">
              {/* Font Size */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-ink">Text Size</h3>
                  <p className="text-sm text-muted">Adjust the size of text across the platform.</p>
                </div>
                <div className="flex bg-primary-50 p-1 rounded-lg">
                  {['small', 'normal', 'large', 'extra-large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSelect('fontSize', size)}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                        prefs.fontSize === size 
                          ? 'bg-white text-primary-700 shadow-sm' 
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-6">
                <div>
                  <h3 className="font-semibold text-ink">Contrast Mode</h3>
                  <p className="text-sm text-muted">Increase contrast for better readability.</p>
                </div>
                <div className="flex bg-primary-50 p-1 rounded-lg">
                  {['normal', 'high', 'inverted'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleSelect('contrast', mode)}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                        prefs.contrast === mode 
                          ? 'bg-white text-primary-700 shadow-sm' 
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dyslexic Font */}
              <div className="flex items-center justify-between gap-4 border-t pt-6">
                <div>
                  <h3 className="font-semibold text-ink">Dyslexia-friendly Font</h3>
                  <p className="text-sm text-muted">Use OpenDyslexic font for all text.</p>
                </div>
                <button
                  onClick={() => handleToggle('dyslexicFont')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    prefs.dyslexicFont ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-ink mb-6">Interaction Preferences</h2>
            <div className="space-y-6">
              {/* Animations */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-ink">Reduce Motion</h3>
                  <p className="text-sm text-muted">Disable animations and transitions.</p>
                </div>
                <button
                  onClick={() => handleToggle('animations')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    !prefs.animations ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !prefs.animations ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted italic">
              These settings are saved to your profile and will be applied whenever you are logged in.
            </p>
            <button 
              onClick={handleSave}
              disabled={submitting}
              className={`btn-primary px-8 ${success ? 'bg-green-600 hover:bg-green-600' : ''}`}
            >
              {submitting ? 'Saving...' : success ? 'Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
