import { PageHeader } from '@/components/ui/PageHeader'
import { Link } from 'react-router-dom'

export function AccessibilityPage() {
  return (
    <>
      <PageHeader
        title="Accessibility Statement"
        description="IE Hub is committed to WCAG 2.2 Level AA conformance for all public content."
      />

      <div className="container-page max-w-3xl space-y-8 py-12 text-muted">
        <section aria-labelledby="commitment">
          <h2 id="commitment" className="text-xl font-bold text-ink">
            Our commitment
          </h2>
          <p className="mt-3">
            Inclusive Education Hub for Africa is built for everyone — including people who use
            assistive technologies, keyboard-only navigation, screen readers, or high-contrast
            settings. Accessibility is a requirement from the first line of code, not an afterthought.
          </p>
        </section>

        <section aria-labelledby="conformance">
          <h2 id="conformance" className="text-xl font-bold text-ink">
            Conformance status
          </h2>
          <p className="mt-3">
            We target <strong className="text-ink">WCAG 2.2 Level AA</strong> for all public pages.
            The platform integrates the{' '}
            <a
              href="https://userway.org/"
              className="text-primary-700 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              UserWay accessibility widget
            </a>{' '}
            for additional adjustments (text size, contrast, dyslexia-friendly font, and more).
          </p>
        </section>

        <section aria-labelledby="features">
          <h2 id="features" className="text-xl font-bold text-ink">
            Built-in accessibility features
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6">
            <li>Skip to main content link on every page</li>
            <li>Semantic HTML landmarks (header, nav, main, footer)</li>
            <li>Visible focus indicators on all interactive elements</li>
            <li>Minimum 44×44px touch targets on buttons and links</li>
            <li>Form labels and accessible error messaging</li>
            <li>Colour contrast meeting 4.5:1 for body text</li>
            <li>Support for RTL layout when Arabic is enabled (full platform phase)</li>
          </ul>
        </section>

        <section aria-labelledby="feedback">
          <h2 id="feedback" className="text-xl font-bold text-ink">
            Feedback and known issues
          </h2>
          <p className="mt-3">
            If you encounter a barrier on this site, please contact us at{' '}
            <a href="mailto:accessibility@iehub.africa" className="text-primary-700 underline">
              accessibility@iehub.africa
            </a>
            . We aim to respond within 5 business days.
          </p>
          <p className="mt-3">
            <strong className="text-ink">Known limitations (website preview):</strong> Some dynamic
            content uses placeholder data until the Django API is connected. Video captions will be
            required for all hosted media at full launch.
          </p>
        </section>

        <section aria-labelledby="testing">
          <h2 id="testing" className="text-xl font-bold text-ink">
            Testing approach
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6">
            <li>Automated testing with Axe DevTools in CI</li>
            <li>Keyboard navigation review on every page</li>
            <li>Screen reader testing with NVDA and VoiceOver</li>
            <li>User testing with persons with disabilities before full launch</li>
          </ul>
        </section>

        <p>
          <Link to="/" className="font-semibold text-primary-700 hover:underline">
            Return to home
          </Link>
        </p>
      </div>
    </>
  )
}
