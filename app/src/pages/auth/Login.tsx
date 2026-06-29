import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { LogoMark } from '../../components/ui/Logo'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (phone.trim().length < 6) {
      setError('Entrez un numéro de téléphone valide.')
      return
    }
    if (password.length < 4) {
      setError('Le mot de passe doit faire au moins 4 caractères.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    await login(phone, password)
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white xl:grid xl:grid-cols-2">
      {/* Branding (desktop) */}
      <div className="hidden xl:flex flex-col justify-center gap-6 bg-gradient-to-br from-primary to-primary-dark p-12 text-white">
        <LogoMark size={64} />
        <h1 className="text-4xl font-extrabold leading-tight">ShiloMarket</h1>
        <p className="text-lg text-white/90">
          Publiez, louez et discutez en toute confiance.
        </p>
      </div>

      {/* Formulaire */}
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-8">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 w-fit text-muted">
          <ArrowLeft size={22} />
        </button>

        <div className="mt-4 flex justify-center xl:hidden">
          <LogoMark size={64} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">Bon retour 👋</h1>
        <p className="mt-1 text-muted">Connectez-vous pour publier, discuter et appeler.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block font-semibold">Numéro de téléphone</label>
            <div className="field">
              <Phone size={20} className="text-muted" />
              <input
                type="tel"
                inputMode="tel"
                placeholder="+242 06 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-semibold">Mot de passe</label>
            <div className="field">
              <Lock size={20} className="text-muted" />
              <input
                type={show ? 'text' : 'password'}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-muted">
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="#" className="text-sm font-semibold text-primary">
                Mot de passe oublié
              </Link>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-live/10 px-3 py-2 text-sm font-medium text-live">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-sm text-muted">
          <span className="h-px flex-1 bg-line" />
          ou
          <span className="h-px flex-1 bg-line" />
        </div>

        <p className="text-center text-muted">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="font-bold text-primary">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
