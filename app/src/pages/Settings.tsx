import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Lock,
  Globe,
  Moon,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Trash2,
  Download,
  Smartphone,
  Volume2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-primary' : 'bg-line'}`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h2 className="mb-1.5 px-4 text-xs font-bold uppercase tracking-wide text-muted">{title}</h2>
      <div className="divide-y divide-line bg-white">{children}</div>
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  value,
  onClick,
  toggle,
  danger,
}: {
  icon: typeof Bell
  label: string
  value?: string
  onClick?: () => void
  toggle?: { on: boolean; onChange: () => void }
  danger?: boolean
}) {
  const content = (
    <>
      <Icon size={20} className={danger ? 'text-live' : 'text-ink'} />
      <span className="flex-1 font-medium">{label}</span>
      {value && <span className="text-sm text-muted">{value}</span>}
      {toggle && <Toggle on={toggle.on} onChange={toggle.onChange} />}
      {!toggle && !value && <ChevronRight size={18} className="text-muted" />}
    </>
  )

  if (toggle) {
    return (
      <div className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        {content}
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-soft ${danger ? 'text-live' : ''}`}
    >
      {content}
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { show } = useToast()

  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)
  const [smsNotif, setSmsNotif] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sound, setSound] = useState(true)
  const [language, setLanguage] = useState('Français')

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleClearCache() {
    show('Cache et données locales effacés')
  }

  function handleExport() {
    show('Export des données en cours…')
  }

  function handleDelete() {
    show('Demande de suppression envoyée')
  }

  return (
    <div className="mx-auto h-full w-full max-w-content overflow-y-auto pb-20 xl:pb-4">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-ink" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-extrabold text-primary">Paramètres</h1>
      </header>

      <Section title="Notifications">
        <Row
          icon={Bell}
          label="Notifications push"
          toggle={{ on: pushNotif, onChange: () => setPushNotif((v) => !v) }}
        />
        <Row
          icon={FileText}
          label="Notifications email"
          toggle={{ on: emailNotif, onChange: () => setEmailNotif((v) => !v) }}
        />
        <Row
          icon={Smartphone}
          label="Alertes SMS"
          toggle={{ on: smsNotif, onChange: () => setSmsNotif((v) => !v) }}
        />
        <Row
          icon={Volume2}
          label="Sons et vibrations"
          toggle={{ on: sound, onChange: () => setSound((v) => !v) }}
        />
      </Section>

      <Section title="Préférences">
        <Row
          icon={Globe}
          label="Langue"
          value={language}
          onClick={() => {
            const next = language === 'Français' ? 'English' : 'Français'
            setLanguage(next)
            show(`Langue : ${next}`)
          }}
        />
        <Row
          icon={Moon}
          label="Mode sombre"
          toggle={{ on: darkMode, onChange: () => { setDarkMode((v) => !v); show('Mode sombre bientôt disponible') } }}
        />
      </Section>

      <Section title="Confidentialité & Sécurité">
        <Row icon={Lock} label="Mot de passe" onClick={() => show('Fonctionnalité à venir')} />
        <Row icon={Shield} label="Confidentialité des données" onClick={() => show('Fonctionnalité à venir')} />
        <Row icon={Download} label="Exporter mes données" onClick={handleExport} />
        <Row icon={Trash2} label="Effacer le cache" onClick={handleClearCache} />
      </Section>

      <Section title="Support">
        <Row icon={HelpCircle} label="Aide & support" onClick={() => show('Fonctionnalité à venir')} />
        <Row icon={FileText} label="Conditions d'utilisation" onClick={() => show('Fonctionnalité à venir')} />
        <Row icon={Shield} label="Politique de confidentialité" onClick={() => show('Fonctionnalité à venir')} />
      </Section>

      <Section title="Compte">
        <Row icon={LogOut} label="Déconnexion" onClick={handleLogout} danger />
        <Row icon={Trash2} label="Supprimer mon compte" onClick={handleDelete} danger />
      </Section>

      <p className="mt-6 px-4 text-center text-xs text-muted">
        ShiloMarket v1.0.0 · Fait avec ❤️ à Brazzaville
      </p>
    </div>
  )
}
