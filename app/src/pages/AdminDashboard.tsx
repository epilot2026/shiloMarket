import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Users, FileText, Building2, BarChart3, Trash2, BadgeCheck, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { adminService, type AdminStats, type AdminUserRow, type AdminAnnonceRow, type AdminPageRow } from '../services/admin.service'
import { formatCount } from '../lib/format'

type Tab = 'stats' | 'users' | 'annonces' | 'pages'

const TABS: { key: Tab; label: string; icon: typeof Users }[] = [
  { key: 'stats', label: 'Statistiques', icon: BarChart3 },
  { key: 'users', label: 'Utilisateurs', icon: Users },
  { key: 'annonces', label: 'Annonces', icon: FileText },
  { key: 'pages', label: 'Pages', icon: Building2 },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const { show } = useToast()
  const [tab, setTab] = useState<Tab>('stats')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [annonces, setAnnonces] = useState<AdminAnnonceRow[]>([])
  const [pages, setPages] = useState<AdminPageRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadData()
  }, [isAdmin, navigate])

  async function loadData() {
    setLoading(true)
    try {
      const [s, u, a, p] = await Promise.all([
        adminService.getStats(),
        adminService.listUsers(),
        adminService.listAnnonces(),
        adminService.listPages(),
      ])
      setStats(s)
      setUsers(u)
      setAnnonces(a)
      setPages(p)
    } catch (err) {
      console.error('Admin load error:', err)
      show('Erreur lors du chargement des données admin')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleRole(u: AdminUserRow) {
    const newRole = u.role === 'super_admin' ? 'user' : 'super_admin'
    await adminService.updateUserRole(u.id, newRole)
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)))
    show(`${u.fullName} est maintenant ${newRole === 'super_admin' ? 'super admin' : 'utilisateur'}`)
  }

  async function handleVerifyUser(u: AdminUserRow) {
    await adminService.verifyUser(u.id, !u.verified)
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, verified: !x.verified } : x)))
    show(`${u.fullName} ${u.verified ? 'non vérifié' : 'vérifié'}`)
  }

  async function handleDeleteUser(u: AdminUserRow) {
    if (!confirm(`Supprimer définitivement ${u.fullName} ?`)) return
    await adminService.deleteUser(u.id)
    setUsers((prev) => prev.filter((x) => x.id !== u.id))
    show('Utilisateur supprimé')
  }

  async function handleCertifyAnnonce(a: AdminAnnonceRow) {
    await adminService.certifyAnnonce(a.id, !a.certified)
    setAnnonces((prev) => prev.map((x) => (x.id === a.id ? { ...x, certified: !x.certified } : x)))
    show(`Annonce ${a.certified ? 'décertifiée' : 'certifiée'}`)
  }

  async function handleDeleteAnnonce(a: AdminAnnonceRow) {
    if (!confirm(`Supprimer l'annonce "${a.title}" ?`)) return
    await adminService.deleteAnnonce(a.id)
    setAnnonces((prev) => prev.filter((x) => x.id !== a.id))
    show('Annonce supprimée')
  }

  async function handleVerifyPage(p: AdminPageRow) {
    await adminService.verifyPage(p.id, !p.verified)
    setPages((prev) => prev.map((x) => (x.id === p.id ? { ...x, verified: !x.verified } : x)))
    show(`Page ${p.verified ? 'non vérifiée' : 'vérifiée'}`)
  }

  async function handleDeletePage(p: AdminPageRow) {
    if (!confirm(`Supprimer la page "${p.name}" ?`)) return
    await adminService.deletePage(p.id)
    setPages((prev) => prev.filter((x) => x.id !== p.id))
    show('Page supprimée')
  }

  if (!isAdmin) return null

  return (
    <div className="h-full overflow-y-auto pb-16 xl:pb-8">
      <header className="safe-top sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-ink" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Shield size={18} className="text-primary" />
          Dashboard Admin
        </span>
        <span className="ml-auto text-xs text-muted">{user?.fullName}</span>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === key ? 'bg-primary text-white' : 'bg-soft text-ink hover:bg-line'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted">Chargement…</div>
        ) : (
          <>
            {tab === 'stats' && stats && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Utilisateurs" value={stats.totalUsers} icon={Users} />
                <StatCard label="Annonces" value={stats.totalAnnonces} icon={FileText} />
                <StatCard label="Pages" value={stats.totalPages} icon={Building2} />
                <StatCard label="Shorts" value={stats.totalShorts} icon={BarChart3} />
                <StatCard label="Commentaires" value={stats.totalComments} icon={FileText} />
                <StatCard label="Messages" value={stats.totalMessages} icon={FileText} />
                <StatCard label="Annonces certifiées" value={stats.certifiedAnnonces} icon={BadgeCheck} />
                <StatCard label="Pages vérifiées" value={stats.verifiedPages} icon={BadgeCheck} />
              </div>
            )}

            {tab === 'users' && (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                    <img
                      src={`https://i.pravatar.cc/100?u=${u.id}`}
                      alt={u.fullName}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold">{u.fullName}</span>
                        {u.verified && <BadgeCheck size={15} className="text-primary" />}
                        {u.role === 'super_admin' && (
                          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">ADMIN</span>
                        )}
                      </div>
                      <div className="text-xs text-muted">{u.phone} · {u.accountType} · {u.location || '—'}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleVerifyUser(u)} aria-label="Vérifier" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-line">
                        <BadgeCheck size={16} className={u.verified ? 'text-primary' : 'text-muted'} />
                      </button>
                      <button onClick={() => handleToggleRole(u)} aria-label="Rôle" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-line">
                        <Shield size={16} className={u.role === 'super_admin' ? 'text-primary' : 'text-muted'} />
                      </button>
                      <button onClick={() => handleDeleteUser(u)} aria-label="Supprimer" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-live/10">
                        <Trash2 size={16} className="text-live" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'annonces' && (
              <div className="space-y-2">
                {annonces.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold">{a.title}</span>
                        {a.certified && <BadgeCheck size={15} className="text-primary" />}
                      </div>
                      <div className="text-xs text-muted">
                        {a.authorName} · {a.category} · {a.transaction} · {formatCount(a.price)} FCFA · {a.status}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleCertifyAnnonce(a)} aria-label="Certifier" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-line">
                        <BadgeCheck size={16} className={a.certified ? 'text-primary' : 'text-muted'} />
                      </button>
                      <button onClick={() => handleDeleteAnnonce(a)} aria-label="Supprimer" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-live/10">
                        <Trash2 size={16} className="text-live" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'pages' && (
              <div className="space-y-2">
                {pages.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold">{p.name}</span>
                        {p.verified && <BadgeCheck size={15} className="text-primary" />}
                      </div>
                      <div className="text-xs text-muted">
                        {p.ownerName} · {p.type} · {formatCount(p.followers)} abonnés · {p.location || '—'}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleVerifyPage(p)} aria-label="Vérifier" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-line">
                        <BadgeCheck size={16} className={p.verified ? 'text-primary' : 'text-muted'} />
                      </button>
                      <button onClick={() => handleDeletePage(p)} aria-label="Supprimer" className="grid h-8 w-8 place-items-center rounded-lg bg-soft hover:bg-live/10">
                        <Trash2 size={16} className="text-live" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="card flex flex-col items-center gap-1 p-4 text-center">
      <Icon size={24} className="text-primary" />
      <span className="text-2xl font-extrabold">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
