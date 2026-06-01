/**
 * Accessibility toolbar — Redesigned icon grid with expanded features.
 */

import { useEffect, useReducer, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Level = 0 | 1 | 2 | 3 | 4

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
  hideImages: Level
  textAlign: Level
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
  hideImages: 0,
  textAlign: 0,
}

const STORAGE_KEY = 'iehub-a11y-prefs-v3'

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
  hideImages: 'iehub-a11y-hideimg',
  textAlign: 'iehub-a11y-align',
}

function loadState(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<A11yState>
      return { ...DEFAULT_STATE, ...parsed }
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE }
}

function reducer(state: A11yState, action: A11yAction): A11yState {
  if (action.type === 'RESET') return { ...DEFAULT_STATE }
  return { ...state, [action.key]: action.value }
}

function clearLevelClasses(html: HTMLElement, prefix: string) {
  html.classList.remove(`${prefix}-1`, `${prefix}-2`, `${prefix}-3`, `${prefix}-4`)
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
  icon: ReactNode
  maxLevels: number
}[] = [
  { key: 'textSize', label: 'Bigger Text', icon: <TextIcon />, maxLevels: 4 },
  { key: 'contrast', label: 'Contrast', icon: <ContrastIcon />, maxLevels: 2 },
  { key: 'saturation', label: 'Saturation', icon: <SaturationIcon />, maxLevels: 2 },
  { key: 'spacing', label: 'Text Spacing', icon: <SpacingIcon />, maxLevels: 3 },
  { key: 'lineHeight', label: 'Line Height', icon: <LineHeightIcon />, maxLevels: 2 },
  { key: 'links', label: 'Links', icon: <LinkIcon />, maxLevels: 2 },
  { key: 'cursor', label: 'Cursor', icon: <CursorIcon />, maxLevels: 3 },
  { key: 'readableFont', label: 'Dyslexia', icon: <FontIcon />, maxLevels: 2 },
  { key: 'reduceMotion', label: 'Motion', icon: <MotionIcon />, maxLevels: 1 },
  { key: 'hideImages', label: 'Hide Images', icon: <HideImageIcon />, maxLevels: 1 },
  { key: 'textAlign', label: 'Text Align', icon: <TextAlignIcon />, maxLevels: 4 },
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
    } catch { /* ignore */ }
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
        className="a11y-trigger transition-all hover:scale-105 active:scale-95"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: '#00a170',
          border: 'none',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        <A11yPersonIcon />
        {activeCount > 0 && (
          <span
            aria-label={`${activeCount} adjustments active`}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: '#ed559e',
              color: '#fff',
              borderRadius: '50%',
              minWidth: '1.25rem',
              height: '1.25rem',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          className="animate-in fade-in zoom-in-95"
          style={{
            position: 'fixed',
            bottom: '5.25rem',
            right: '1.25rem',
            zIndex: 9998,
            width: '22rem',
            maxHeight: 'calc(100vh - 7rem)',
            overflowY: 'auto',
            backgroundColor: '#fff',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #eee',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <strong style={{ fontSize: '1rem', color: '#1a1a1a' }}>Accessibility Menu</strong>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                triggerRef.current?.focus()
              }}
              aria-label="Close"
              style={{
                background: '#f5f5f5',
                border: 'none',
                color: '#666',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {CONTROLS.map((ctrl) => (
              <IconControl
                key={ctrl.key}
                label={ctrl.label}
                icon={ctrl.icon}
                value={state[ctrl.key]}
                maxLevels={ctrl.maxLevels}
                onClick={() => {
                  const current = state[ctrl.key]
                  let next: Level = 0
                  if (ctrl.maxLevels === 1) {
                    next = current === 0 ? 1 : 0 // Toggle to level 1
                  } else {
                    next = ((current + 1) % (ctrl.maxLevels + 1)) as Level
                  }
                  dispatch({ type: 'SET', key: ctrl.key, value: next })
                }}
              />
            ))}
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid #f0f0f0' }}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: 'none',
                background: '#00a170',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Reset All Settings
            </button>
            <a
              href="/accessibility"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#666',
                textDecoration: 'none',
              }}
            >
              Accessibility Statement
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function IconControl({
  label,
  icon,
  value,
  maxLevels,
  onClick,
}: {
  label: string
  icon: ReactNode
  value: Level
  maxLevels: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={value > 0}
      className="group transition-all"
      style={{
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        borderRadius: '1rem',
        border: '1px solid',
        borderColor: value > 0 ? '#00a170' : '#f0f0f0',
        background: value > 0 ? '#e6f5f0' : '#fff',
        cursor: 'pointer',
        padding: '0.5rem',
      }}
    >
      <div style={{ color: value > 0 ? '#00a170' : '#444' }}>
        {icon}
      </div>
      <span style={{ 
        fontSize: '0.625rem', 
        fontWeight: 700, 
        color: value > 0 ? '#00a170' : '#666',
        textAlign: 'center',
        lineHeight: '1',
      }}>
        {label}
      </span>
      {value > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '2px',
          marginTop: '2px'
        }}>
          {maxLevels === 1 ? (
            <div style={{ width: '26px', height: '3px', borderRadius: '2px', background: '#00a170' }} />
          ) : (
            Array.from({ length: maxLevels }).map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  width: `${Math.floor(30 / maxLevels)}px`, 
                  height: '3px', 
                  borderRadius: '2px',
                  background: value > i ? '#00a170' : '#b3dfd0' 
                }} 
              />
            ))
          )}
        </div>
      )}
    </button>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function TextIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  )
}

function ContrastIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 18a6 6 0 100-12v12z" fill="currentColor" />
    </svg>
  )
}

function SaturationIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )
}

function SpacingIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M18 7l4 5-4 5M6 17l-4-5 4-5M12 4v16" />
    </svg>
  )
}

function LineHeightIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M7 21l-4-4 4-4M17 3l4 4-4 4M3 7h18M3 12h18M3 17h18" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  )
}

function CursorIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6" />
    </svg>
  )
}

function FontIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M12 4.5l-2.5 5h5l-2.5-5zM12 4.5V2M12 22v-2.5M4.5 12h-2.5M22 12h-2.5M17.3 17.3l-1.8-1.8M8.5 8.5L6.7 6.7M17.3 6.7l-1.8 1.8M8.5 15.5l-1.8 1.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function MotionIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
    </svg>
  )
}

function HideImageIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

function TextAlignIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function A11yPersonIcon() {
  return (
    <svg aria-hidden width={30} height={30} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4" r="2" />
      <path d="M19 13h-4l-1.5-3H14a1 1 0 000-2H10a1 1 0 000 2h.75L9 13H5a1 1 0 000 2h3.5L7 19.5a1 1 0 001.8.86L11 16h2l2.2 4.36a1 1 0 001.8-.86L15.5 15H19a1 1 0 000-2z" />
    </svg>
  )
}
