import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('IE Hub render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-page py-16" role="alert">
          <h1 className="section-heading">Something went wrong</h1>
          <p className="mt-4 text-muted">
            Please refresh the page or return to the{' '}
            <a href="/" className="font-semibold text-primary-700 underline">
              home page
            </a>
            .
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
