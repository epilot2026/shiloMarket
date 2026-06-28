import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

// Filet de sécurité global : capture les erreurs de rendu et affiche un écran
// de repli au lieu d'une page blanche.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En production, on enverrait ceci à un service de monitoring (ex. Sentry).
    console.error('ErrorBoundary a capturé une erreur :', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-soft px-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-live/10 text-live">
            <AlertTriangle size={30} />
          </span>
          <h1 className="text-xl font-bold">Une erreur est survenue</h1>
          <p className="max-w-sm text-muted">
            L'application a rencontré un problème inattendu. Vous pouvez recharger la page.
          </p>
          <button onClick={() => window.location.assign('/')} className="btn-primary px-6">
            Revenir à l'accueil
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
