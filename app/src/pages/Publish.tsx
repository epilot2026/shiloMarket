import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { CATEGORIES } from '../constants'
import type { Category, Transaction } from '../types'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { MediaUploader } from '../components/publish/MediaUploader'

interface Errors {
  title?: string
  category?: string
  price?: string
  location?: string
  description?: string
}

export default function Publish() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addAnnonce } = useData()
  const { show } = useToast()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [transaction, setTransaction] = useState<Transaction>('louer')
  const [price, setPrice] = useState('')
  const [priceSuffix, setPriceSuffix] = useState('mois')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <h1 className="text-xl font-bold">Connectez-vous pour publier</h1>
        <p className="mt-2 text-muted">Créez un compte gratuit pour déposer une annonce.</p>
        <button onClick={() => navigate('/connexion')} className="btn-primary mt-6 px-8">
          Se connecter
        </button>
      </div>
    )
  }

  function validate(): Errors {
    const e: Errors = {}
    if (title.trim().length < 5) e.title = 'Le titre doit faire au moins 5 caractères.'
    if (!category) e.category = 'Choisissez une catégorie.'
    if (transaction !== 'devis') {
      const priceNum = Number(price)
      if (!price || Number.isNaN(priceNum) || priceNum <= 0)
        e.price = 'Indiquez un prix valide (nombre positif).'
    }
    if (location.trim().length < 3) e.location = 'Indiquez une localisation.'
    if (description.trim().length < 10)
      e.description = 'La description doit faire au moins 10 caractères.'
    return e
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)

    const created = await addAnnonce({
      title: title.trim(),
      description: description.trim(),
      category: category as Category,
      transaction,
      price: transaction === 'devis' ? 0 : Number(price),
      priceSuffix: transaction === 'louer' ? priceSuffix : transaction === 'devis' ? 'devis' : undefined,
      location: location.trim(),
      images,
      videos,
      documents: [],
    })

    setSubmitting(false)
    show('Annonce publiée !')
    navigate(`/annonce/${created.id}`)
  }

  return (
    <div className="h-full overflow-y-auto pb-16">
      <header className="safe-top sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-3 py-2">
        <button onClick={() => navigate(-1)} className="btn-ghost text-ink" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-bold">Publier une annonce</h1>
      </header>

      <form onSubmit={onSubmit} noValidate className="mx-auto max-w-lg space-y-3 p-3">
        {/* Titre */}
        <div>
          <label className="mb-1 block font-semibold">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Maison meublée 4 pièces à louer"
            className="w-full rounded-xl bg-soft px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.title && <p className="mt-1 text-sm text-live">{errors.title}</p>}
        </div>

        {/* Catégorie */}
        <div>
          <label className="mb-1 block font-semibold">Catégorie</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                type="button"
                key={key}
                onClick={() => setCategory(key)}
                className={`chip ${category === key ? 'chip-active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          {errors.category && <p className="mt-1 text-sm text-live">{errors.category}</p>}
        </div>

        {/* Transaction */}
        <div>
          <label className="mb-1 block font-semibold">Type d'offre</label>
          <div className="inline-flex flex-wrap rounded-xl bg-soft p-1">
            {(['louer', 'vendre', 'devis'] as Transaction[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTransaction(t)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
                  transaction === t ? 'bg-primary text-white' : 'text-ink'
                }`}
              >
                {t === 'louer' ? 'À louer' : t === 'vendre' ? 'À vendre' : 'Sur devis'}
              </button>
            ))}
          </div>
        </div>

        {/* Prix (masqué si devis) */}
        {transaction !== 'devis' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block font-semibold">Prix (FCFA)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="numeric"
              placeholder="350000"
              className="w-full rounded-xl bg-soft px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.price && <p className="mt-1 text-sm text-live">{errors.price}</p>}
          </div>
          {transaction === 'louer' && (
            <div className="w-32">
              <label className="mb-1 block font-semibold">Par</label>
              <select
                value={priceSuffix}
                onChange={(e) => setPriceSuffix(e.target.value)}
                className="w-full rounded-xl bg-soft px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="mois">mois</option>
                <option value="jour">jour</option>
                <option value="semaine">semaine</option>
              </select>
            </div>
          )}
        </div>
        )}

        {/* Localisation */}
        <div>
          <label className="mb-1 block font-semibold">Localisation</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex. Moungali, Brazzaville"
            className="w-full rounded-xl bg-soft px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.location && <p className="mt-1 text-sm text-live">{errors.location}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Décrivez le bien : état, équipements, conditions…"
            className="w-full resize-none rounded-xl bg-soft px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.description && <p className="mt-1 text-sm text-live">{errors.description}</p>}
        </div>

        {/* Médias : photos + vidéo */}
        <MediaUploader
          images={images}
          onImagesChange={setImages}
          videos={videos}
          onVideosChange={setVideos}
        />

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Publication…' : "Publier l'annonce"}
        </button>
      </form>
    </div>
  )
}
