import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary-fallback">
          <h2>Oops, something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Reload Page</button>
          <style>{`
            .error-boundary-fallback {
              padding: 2rem;
              text-align: center;
              color: white;
              background: #0A0E27;
              border-radius: 12px;
              margin: 2rem;
              border: 1px solid rgba(255, 0, 110, 0.3);
            }
            .error-boundary-fallback h2 {
              margin-bottom: 1rem;
              color: #FF006E;
            }
            .error-boundary-fallback button {
              padding: 0.5rem 1rem;
              background: #00D9FF;
              border: none;
              border-radius: 4px;
              color: #0A0E27;
              font-weight: bold;
              cursor: pointer;
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
