/**
 * Accessibility toolbar — APDK-style stepped controls (3 levels per effect).
 */

import { useEffect, useReducer, useRef, useState } from 'react'

type Level = 0 | 1 | 2

interface A11yState {
  textSize: Level
  contrast: Level
  saturation: Level
  spacing: Level
  lineHeight: Level
  links: Level
  cursor: Level
  readableFont: Level
  reduceMotion: Level
}

type A11yAction =
  | { type: 'SET'; key: keyof A11yState; value: Level }
  | { type: 'RESET' }

const DEFAULT_STATE: A11yState = {
  textSize: 0,
  contrast: 0,
  saturation: 0,
  spacing: 0,
  lineHeight: 0,
  links: 0,
  cursor: 0,
  readableFont: 0,
  reduceMotion: 0,
}

const STORAGE_KEY = 'iehub-a11y-prefs-v2'

const LEVEL_PREFIX: Record<keyof A11yState, string> = {
  textSize: 'iehub-a11y-text',
  contrast: 'iehub-a11y-contrast',
  saturation: 'iehub-a11y-sat',
  spacing: 'iehub-a11y-spacing',
  lineHeight: 'iehub-a11y-line',
  links: 'iehub-a11y-links',
  cursor: 'iehub-a11y-cursor',
  readableFont: 'iehub-a11y-font',
  reduceMotion: 'iehub-a11y-motion',
}

function loadState(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<A11yState>
      const merged = { ...DEFAULT_STATE, ...parsed }
      for (const key of Object.keys(DEFAULT_STATE) as (keyof A11yState)[]) {
        const v = merged[key]
        if (v !== 0 && v !== 1 && v !== 2) merged[key] = 0
      }
      return merged
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_STATE }
}

function reducer(state: A11yState, action: A11yAction): A11yState {
  if (action.type === 'RESET') return { ...DEFAULT_STATE }
  return { ...state, [action.key]: action.value }
}

function clearLevelClasses(html: HTMLElement, prefix: string) {
  html.classList.remove(`${prefix}-1`, `${prefix}-2`)
}

function applyState(state: A11yState) {
  const html = document.documentElement
  for (const key of Object.keys(LEVEL_PREFIX) as (keyof A11yState)[]) {
    const prefix = LEVEL_PREFIX[key]
    clearLevelClasses(html, prefix)
    const level = state[key]
    if (level > 0) html.classList.add(`${prefix}-${level}`)
  }
}

const CONTROLS: {
  key: keyof A11yState
  label: string
  levels: [string, string, string]
}[] = [
  { key: 'textSize', label: 'Text Size', levels: ['Default', 'Large', 'Largest'] },
  { key: 'contrast', label: 'Contrast', levels: ['Default', 'High', 'Invert'] },
  { key: 'saturation', label: 'Saturation', levels: ['Full', 'Low', 'Grey'] },
  { key: 'spacing', label: 'Letter Spacing', levels: ['Normal', 'Medium', 'Wide'] },
  { key: 'lineHeight', label: 'Line Height', levels: ['Normal', 'Relaxed', 'Loose'] },
  { key: 'links', label: 'Highlight Links', levels: ['Off', 'Underline', 'Highlight'] },
  { key: 'cursor', label: 'Cursor', levels: ['Default', 'Large', 'Extra Large'] },
  { key: 'readableFont', label: 'Readable Font', levels: ['Default', 'Clear', 'Dyslexia'] },
  { key: 'reduceMotion', label: 'Reduce Motion', levels: ['Off', 'Less', 'None'] },
]

export function AccessibilityWidget() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    applyState(state)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

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

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const activeCount = Object.values(state).filter((v) => v > 0).length

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close accessibility menu' : 'Open accessibility menu'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="a11y-trigger"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: 0,
          backgroundColor: '#d4921f',
          border: '3px solid #1a1a1a',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '4px 4px 0 #1a1a1a',
          cursor: 'pointer',
        }}
      >
        <A11yPersonIcon />
        {activeCount > 0 && (
          <span
            aria-label={`${activeCount} adjustments active`}
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#003d2e',
              color: '#fff',
              border: '2px solid #1a1a1a',
              minWidth: '1.25rem',
              height: '1.25rem',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility settings"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: '5.25rem',
            right: '1.25rem',
            zIndex: 9998,
            width: '22rem',
            maxHeight: 'calc(100vh - 7rem)',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '3px solid #1a1a1a',
            boxShadow: '6px 6px 0 #1a1a1a',
          }}
        >
          <div
            style={{
              background: '#003d2e',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderBottom: '3px solid #1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <strong style={{ fontSize: '0.9rem', letterSpacing: '0.04em' }}>Accessibility Menu</strong>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                triggerRef.current?.focus()
              }}
              aria-label="Close accessibility menu"
              style={{
                background: '#fff',
                border: '2px solid #1a1a1a',
                color: '#1a1a1a',
                width: '2rem',
                height: '2rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ margin: 0, padding: '0.65rem 1rem', fontSize: '0.72rem', background: '#f4f4f4', borderBottom: '2px solid #ccc' }}>
            Each tool has three levels. Tap 1, 2, or 3 — tap again to step down to default.
          </p>

          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {CONTROLS.map((ctrl) => (
              <LevelControl
                key={ctrl.key}
                label={ctrl.label}
                levelLabels={ctrl.levels}
                value={state[ctrl.key]}
                onChange={(value) => dispatch({ type: 'SET', key: ctrl.key, value })}
              />
            ))}
          </div>

          <div style={{ padding: '0.75rem', borderTop: '2px solid #ccc' }}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              style={{
                width: '100%',
                padding: '0.65rem',
                border: '2px solid #1a1a1a',
                background: '#fff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 #1a1a1a',
              }}
            >
              Reset all settings
            </button>
            <a
              href="/accessibility"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#333',
                textDecoration: 'underline',
              }}
            >
              Accessibility statement
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function LevelControl({
  label,
  levelLabels,
  value,
  onChange,
}: {
  label: string
  levelLabels: [string, string, string]
  value: Level
  onChange: (v: Level) => void
}) {
  return (
    <div
      style={{
        border: value > 0 ? '2px solid #003d2e' : '2px solid #b8b8b8',
        background: value > 0 ? '#eef7f4' : '#fff',
        padding: '0.5rem 0.65rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a' }}>{label}</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#555' }}>{levelLabels[value]}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
        {([0, 1, 2] as Level[]).map((step) => (
          <button
            key={step}
            type="button"
            aria-label={`${label}: ${levelLabels[step]}`}
            aria-pressed={value === step}
            onClick={() => {
              if (step === 0) onChange(0)
              else if (value === step) onChange((step - 1) as Level)
              else onChange(step)
            }}
            style={{
              border: value === step ? '2px solid #003d2e' : '2px solid #999',
              background: value === step ? '#003d2e' : '#fff',
              color: value === step ? '#fff' : '#333',
              fontWeight: 800,
              fontSize: '0.75rem',
              padding: '0.35rem 0',
              cursor: 'pointer',
            }}
          >
            {step === 0 ? '—' : step}
          </button>
        ))}
      </div>
    </div>
  )
}

function A11yPersonIcon() {
  return (
    <svg aria-hidden width={26} height={26} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4" r="2" />
      <path d="M19 13h-4l-1.5-3H14a1 1 0 000-2H10a1 1 0 000 2h.75L9 13H5a1 1 0 000 2h3.5L7 19.5a1 1 0 001.8.86L11 16h2l2.2 4.36a1 1 0 001.8-.86L15.5 15H19a1 1 0 000-2z" />
    </svg>
  )
}
