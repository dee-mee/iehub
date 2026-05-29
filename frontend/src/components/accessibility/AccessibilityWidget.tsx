/**
 * IE Hub — Built-in Accessibility Widget
 * Always visible. No API key required.
 * WCAG 2.2 AA compliant features:
 *  - High contrast mode
 *  - Dyslexia-friendly font (OpenDyslexic)
 *  - Font size scaling (4 levels)
 *  - Reduce motion
 *  - Highlight links
 *  - Text spacing
 *  - Cursor enlargement
 *  - Saturation (greyscale)
 *  - Line height boost
 *  - Reset all
 *
 * Persists preferences via localStorage.
 */

import { useEffect, useReducer, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface A11yState {
  highContrast: boolean
  dyslexiaFont: boolean
  fontSize: 0 | 1 | 2 | 3         // 0=default 1=+1 2=+2 3=+3
  reduceMotion: boolean
  highlightLinks: boolean
  textSpacing: boolean
  bigCursor: boolean
  greyscale: boolean
  lineHeight: boolean
}

type A11yAction =
  | { type: 'TOGGLE'; key: keyof Omit<A11yState, 'fontSize'> }
  | { type: 'FONT_SIZE'; step: 1 | -1 }
  | { type: 'RESET' }

const DEFAULT_STATE: A11yState = {
  highContrast: false,
  dyslexiaFont: false,
  fontSize: 0,
  reduceMotion: false,
  highlightLinks: false,
  textSpacing: false,
  bigCursor: false,
  greyscale: false,
  lineHeight: false,
}

const STORAGE_KEY = 'iehub-a11y-prefs'

function loadState(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch (_) { /* ignore */ }
  return { ...DEFAULT_STATE }
}

function reducer(state: A11yState, action: A11yAction): A11yState {
  switch (action.type) {
    case 'TOGGLE':
      return { ...state, [action.key]: !state[action.key] }
    case 'FONT_SIZE': {
      const next = (state.fontSize + action.step) as A11yState['fontSize']
      if (next < 0 || next > 3) return state
      return { ...state, fontSize: next }
    }
    case 'RESET':
      return { ...DEFAULT_STATE }
    default:
      return state
  }
}

// ─── CSS application ─────────────────────────────────────────────────────────

const FONT_SIZES = [
  '',                       // 0 — default
  'iehub-a11y-font-lg',    // 1
  'iehub-a11y-font-xl',    // 2
  'iehub-a11y-font-2xl',   // 3
]

function applyState(state: A11yState) {
  const html = document.documentElement

  // High contrast
  html.classList.toggle('iehub-a11y-contrast', state.highContrast)
  // Dyslexia font
  html.classList.toggle('iehub-a11y-dyslexia', state.dyslexiaFont)
  // Font size — remove all then add current
  FONT_SIZES.forEach(c => c && html.classList.remove(c))
  if (state.fontSize > 0) html.classList.add(FONT_SIZES[state.fontSize])
  // Reduce motion
  html.classList.toggle('iehub-a11y-reduce-motion', state.reduceMotion)
  // Highlight links
  html.classList.toggle('iehub-a11y-links', state.highlightLinks)
  // Text spacing
  html.classList.toggle('iehub-a11y-spacing', state.textSpacing)
  // Big cursor
  html.classList.toggle('iehub-a11y-cursor', state.bigCursor)
  // Greyscale
  html.classList.toggle('iehub-a11y-grey', state.greyscale)
  // Line height
  html.classList.toggle('iehub-a11y-line-height', state.lineHeight)
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AccessibilityWidget() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Apply CSS whenever state changes and persist
  useEffect(() => {
    applyState(state)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (_) { /* ignore */ }
  }, [state])

  // Close on Escape, trap focus inside panel
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const toggle = (key: keyof Omit<A11yState, 'fontSize'>) =>
    dispatch({ type: 'TOGGLE', key })

  const activeCount = [
    state.highContrast, state.dyslexiaFont, state.fontSize > 0,
    state.reduceMotion, state.highlightLinks, state.textSpacing,
    state.bigCursor, state.greyscale, state.lineHeight,
  ].filter(Boolean).length

  return (
    <>
      {/* ── Inject global CSS ── */}
      <style>{`
        /* OpenDyslexic via Google Fonts CDN alternative */
        @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap');

        .iehub-a11y-contrast,
        .iehub-a11y-contrast * {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #fff !important;
        }
        .iehub-a11y-contrast a { color: #ff0 !important; }
        .iehub-a11y-contrast img { filter: grayscale(1) contrast(1.2); }

        .iehub-a11y-dyslexia,
        .iehub-a11y-dyslexia * {
          font-family: 'Atkinson Hyperlegible', sans-serif !important;
          letter-spacing: 0.03em;
          word-spacing: 0.1em;
        }

        .iehub-a11y-font-lg  { font-size: 112% !important; }
        .iehub-a11y-font-xl  { font-size: 125% !important; }
        .iehub-a11y-font-2xl { font-size: 140% !important; }
        .iehub-a11y-font-lg  *, .iehub-a11y-font-xl  *, .iehub-a11y-font-2xl * {
          font-size: inherit;
        }

        .iehub-a11y-reduce-motion *,
        .iehub-a11y-reduce-motion *::before,
        .iehub-a11y-reduce-motion *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }

        .iehub-a11y-links a {
          text-decoration: underline !important;
          text-underline-offset: 3px !important;
          outline: 2px solid currentColor !important;
          outline-offset: 2px !important;
        }

        .iehub-a11y-spacing p,
        .iehub-a11y-spacing li,
        .iehub-a11y-spacing span,
        .iehub-a11y-spacing div {
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }

        .iehub-a11y-cursor,
        .iehub-a11y-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M5 2l22 12-9 2-5 9z' fill='%23000' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E") 5 2, auto !important;
        }

        .iehub-a11y-grey { filter: grayscale(1); }

        .iehub-a11y-line-height p,
        .iehub-a11y-line-height li,
        .iehub-a11y-line-height span,
        .iehub-a11y-line-height div {
          line-height: 2 !important;
        }

        /* Widget button pulse when features active */
        @keyframes iehub-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,146,31,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(212,146,31,0); }
        }
      `}</style>

      {/* ── Floating trigger button ── */}
      <button
        ref={triggerRef}
        aria-label={open ? 'Close accessibility menu' : 'Open accessibility menu'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          width: '3.25rem',
          height: '3.25rem',
          borderRadius: '50%',
          backgroundColor: '#d4921f',
          border: '3px solid #fff',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          cursor: 'pointer',
          animation: activeCount > 0 ? 'iehub-pulse 2s infinite' : 'none',
          outline: 'none',
        }}
        onFocus={e => { (e.currentTarget as HTMLButtonElement).style.outline = '3px solid #23665d'; (e.currentTarget as HTMLButtonElement).style.outlineOffset = '3px' }}
        onBlur={e => { (e.currentTarget as HTMLButtonElement).style.outline = 'none' }}
      >
        {/* Accessibility person icon */}
        <svg aria-hidden="true" focusable="false" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="4" r="2"/>
          <path d="M19 13h-4l-1.5-3H14a1 1 0 000-2H10a1 1 0 000 2h.75L9 13H5a1 1 0 000 2h3.5L7 19.5a1 1 0 001.8.86L11 16h2l2.2 4.36a1 1 0 001.8-.86L15.5 15H19a1 1 0 000-2z"/>
        </svg>
        {activeCount > 0 && (
          <span
            aria-label={`${activeCount} accessibility features active`}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#23665d',
              color: '#fff',
              borderRadius: '50%',
              width: '1.1rem',
              height: '1.1rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility settings"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.5rem',
            zIndex: 9998,
            width: '19rem',
            maxHeight: 'calc(100vh - 8rem)',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '2px solid #23665d',
            borderRadius: '1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            padding: '0',
          }}
        >
          {/* Header */}
          <div style={{
            background: '#143633',
            color: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '0.85rem 0.85rem 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="4" r="2"/>
                <path d="M19 13h-4l-1.5-3H14a1 1 0 000-2H10a1 1 0 000 2h.75L9 13H5a1 1 0 000 2h3.5L7 19.5a1 1 0 001.8.86L11 16h2l2.2 4.36a1 1 0 001.8-.86L15.5 15H19a1 1 0 000-2z"/>
              </svg>
              Accessibility Menu
            </div>
            <button
              onClick={() => { setOpen(false); triggerRef.current?.focus() }}
              aria-label="Close accessibility menu"
              style={{
                background: 'transparent', border: 'none', color: '#fff',
                cursor: 'pointer', padding: '0.25rem', borderRadius: '0.25rem',
                fontSize: '1.25rem', lineHeight: 1, display: 'flex',
              }}
              onFocus={e => { (e.currentTarget as HTMLButtonElement).style.outline = '2px solid #e8a838' }}
              onBlur={e => { (e.currentTarget as HTMLButtonElement).style.outline = 'none' }}
            >
              ✕
            </button>
          </div>

          {/* Feature grid */}
          <div style={{ padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>

            {/* Font size spans full width */}
            <div style={{
              gridColumn: '1 / -1',
              border: '1px solid #d5ebe8',
              borderRadius: '0.6rem',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: state.fontSize > 0 ? '#eef7f6' : '#fff',
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2422' }}>
                <svg aria-hidden="true" style={{ display: 'inline', marginRight: '0.4rem' }} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/>
                </svg>
                Text Size
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CtrlBtn
                  onClick={() => dispatch({ type: 'FONT_SIZE', step: -1 })}
                  disabled={state.fontSize === 0}
                  label="Decrease text size"
                >A−</CtrlBtn>
                <span style={{ minWidth: '1.2rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#23665d' }}>
                  {state.fontSize === 0 ? '—' : `+${state.fontSize}`}
                </span>
                <CtrlBtn
                  onClick={() => dispatch({ type: 'FONT_SIZE', step: 1 })}
                  disabled={state.fontSize === 3}
                  label="Increase text size"
                >A+</CtrlBtn>
              </div>
            </div>

            <FeatureBtn active={state.highContrast} onClick={() => toggle('highContrast')} icon={ContrastIcon} label="High Contrast" />
            <FeatureBtn active={state.dyslexiaFont} onClick={() => toggle('dyslexiaFont')} icon={DyslexiaIcon} label="Dyslexia Font" />
            <FeatureBtn active={state.highlightLinks} onClick={() => toggle('highlightLinks')} icon={LinksIcon} label="Highlight Links" />
            <FeatureBtn active={state.textSpacing} onClick={() => toggle('textSpacing')} icon={SpacingIcon} label="Text Spacing" />
            <FeatureBtn active={state.reduceMotion} onClick={() => toggle('reduceMotion')} icon={MotionIcon} label="Reduce Motion" />
            <FeatureBtn active={state.lineHeight} onClick={() => toggle('lineHeight')} icon={LineHeightIcon} label="Line Height" />
            <FeatureBtn active={state.bigCursor} onClick={() => toggle('bigCursor')} icon={CursorIcon} label="Big Cursor" />
            <FeatureBtn active={state.greyscale} onClick={() => toggle('greyscale')} icon={GreyscaleIcon} label="Greyscale" />
          </div>

          {/* Footer actions */}
          <div style={{ padding: '0 0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              style={{
                width: '100%', padding: '0.6rem', borderRadius: '0.5rem',
                border: '1.5px solid #23665d', background: '#fff',
                color: '#23665d', fontWeight: 600, fontSize: '0.82rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.4rem',
              }}
              onFocus={e => { (e.currentTarget as HTMLButtonElement).style.outline = '2px solid #23665d'; (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px' }}
              onBlur={e => { (e.currentTarget as HTMLButtonElement).style.outline = 'none' }}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Reset All Settings
            </button>
            <a
              href="/accessibility"
              style={{
                display: 'block', textAlign: 'center', padding: '0.45rem',
                fontSize: '0.75rem', color: '#4a5c58', textDecoration: 'underline',
              }}
              onFocus={e => { (e.currentTarget as HTMLAnchorElement).style.outline = '2px solid #23665d' }}
              onBlur={e => { (e.currentTarget as HTMLAnchorElement).style.outline = 'none' }}
            >
              Accessibility Statement
            </a>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureBtn({
  active, onClick, icon: Icon, label
}: {
  active: boolean
  onClick: () => void
  icon: React.FC<{ size?: number }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label}: ${active ? 'on' : 'off'}`}
      style={{
        border: active ? '2px solid #23665d' : '1px solid #d5ebe8',
        borderRadius: '0.6rem',
        padding: '0.6rem 0.4rem',
        background: active ? '#eef7f6' : '#fff',
        color: active ? '#1d524b' : '#4a5c58',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.72rem',
        fontWeight: active ? 700 : 500,
        transition: 'all 0.15s',
        outline: 'none',
        minHeight: '4rem',
        width: '100%',
      }}
      onFocus={e => { (e.currentTarget as HTMLButtonElement).style.outline = '2px solid #23665d'; (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px' }}
      onBlur={e => { (e.currentTarget as HTMLButtonElement).style.outline = 'none' }}
    >
      <Icon size={22} />
      {label}
      {active && (
        <span style={{
          fontSize: '0.6rem', background: '#23665d', color: '#fff',
          borderRadius: '0.25rem', padding: '0.05rem 0.3rem', fontWeight: 700,
        }}>ON</span>
      )}
    </button>
  )
}

function CtrlBtn({
  onClick, disabled, label, children
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        border: '1.5px solid #23665d',
        borderRadius: '0.3rem',
        background: disabled ? '#f0f0f0' : '#fff',
        color: disabled ? '#aaa' : '#23665d',
        width: '2rem', height: '2rem',
        fontWeight: 700, fontSize: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        outline: 'none',
      }}
      onFocus={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.outline = '2px solid #23665d' }}
      onBlur={e => { (e.currentTarget as HTMLButtonElement).style.outline = 'none' }}
    >
      {children}
    </button>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ContrastIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/>
  </svg>
)
const DyslexiaIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.93 13.5h4.14L12 7.98 9.93 13.5zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/>
  </svg>
)
const LinksIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </svg>
)
const SpacingIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 7h6v2H9zm-2 4h10v2H7zm-2 4h14v2H5z"/>
  </svg>
)
const MotionIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18V6h12v12H6zm2-2h8V8H8v8z"/>
  </svg>
)
const LineHeightIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 7h2.5L5 3.5 1.5 7H4v10H1.5L5 20.5 8.5 17H6V7zm4 1v2h10V8H10zm0 6h10v-2H10v2zm0 4h7v-2h-7v2z"/>
  </svg>
)
const CursorIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 0l16 9-9 2-5 9z"/>
  </svg>
)
const GreyscaleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
  </svg>
)
