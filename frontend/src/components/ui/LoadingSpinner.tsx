interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-live="polite">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"
        aria-hidden="true"
      />
      <span className="text-sm text-muted">{label}</span>
    </div>
  )
}
