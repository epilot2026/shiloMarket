import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Lock, ArrowLeft } from 'lucide-react'
import { ACCOUNT_TYPES } from '../../constants'
import type { AccountType } from '../../types'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (fullName.trim().length < 3) {
      setError('Indiquez votre nom complet.')
      return
    }
    if (phone.trim().length < 6) {
      setError('Entrez un numéro de téléphone valide.')
      return
    }
    if (password.length < 4) {
      setError('Le mot de passe doit faire au moins 4 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    await register({ fullName, phone, accountType })
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white px-5 py-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-muted">
          <ArrowLeft size={22} />
        </button>
        <span className="text-lg font-bold">Créer un compte</span>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold">Rejoignez ShiloMarket</h1>
      <p className="mt-1 text-muted">Publiez, louez et discutez en toute confiance.</p>

      <form onSubmit={onSubmit} className="mt-7 space-y-3">
        <div className="field">
          <User size={20} className="text-muted" />
          <input
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="field">
          <Phone size={20} className="text-muted" />
          <input
            type="tel"
            inputMode="tel"
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="field">
          <Lock size={20} className="text-muted" />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <Lock size={20} className="text-muted" />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <p className="mb-2 font-semibold">Type de compte</p>
          <div className="flex flex-wrap gap-2">
            {ACCOUNT_TYPES.map(({ key, label, icon: Icon }) => {
              const active = accountType === key
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setAccountType(key)}
                  className={`chip ${active ? 'chip-active' : ''}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-live/10 px-3 py-2 text-sm font-medium text-live">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
          {loading ? 'Création…' : "S'inscrire"}
        </button>
      </form>

      <p className="mt-6 text-center text-muted">
        Déjà inscrit ?{' '}
        <Link to="/connexion" className="font-bold text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
