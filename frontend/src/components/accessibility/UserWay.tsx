import { useEffect } from 'react'

declare global {
  interface Window {
    UserWay?: { accountApiKey?: string }
  }
}

const USERWAY_KEY = import.meta.env.VITE_USERWAY_KEY as string | undefined

/**
 * Optional: loads the UserWay SaaS widget ONLY when VITE_USERWAY_KEY is set.
 * The built-in AccessibilityWidget is always loaded regardless.
 * @see https://userway.org/
 */
export function UserWay() {
  useEffect(() => {
    if (!USERWAY_KEY) return

    window.UserWay = window.UserWay || {}
    window.UserWay.accountApiKey = USERWAY_KEY

    const existing = document.querySelector('script[data-userway]')
    if (existing) return

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://cdn.userway.org/widget.js'
    script.setAttribute('data-userway', 'true')
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
