import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-light text-primary">
        <Compass size={40} />
      </span>
      <h1 className="text-3xl font-extrabold">404</h1>
      <p className="max-w-sm text-muted">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <button onClick={() => navigate('/')} className="btn-primary px-8">
        Retour à l'accueil
      </button>
    </div>
  )
}
