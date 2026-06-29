import { useRef, useState } from 'react'
import { ImagePlus, Video as VideoIcon, Link2, X, Plus } from 'lucide-react'

interface MediaUploaderProps {
  images: string[]
  onImagesChange: (next: string[]) => void
  videos: string[]
  onVideosChange: (next: string[]) => void
}

function revokeIfBlob(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url)
}

export function MediaUploader({
  images,
  onImagesChange,
  videos,
  onVideosChange,
}: MediaUploaderProps) {
  const imageInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  function addImageFiles(files: FileList | null) {
    if (!files) return
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => URL.createObjectURL(f))
    if (urls.length) onImagesChange([...images, ...urls])
  }

  function addImageUrl() {
    const url = imageUrl.trim()
    if (!url) return
    onImagesChange([...images, url])
    setImageUrl('')
  }

  function removeImage(index: number) {
    const target = images[index]
    revokeIfBlob(target)
    onImagesChange(images.filter((_, i) => i !== index))
  }

  function addVideoFiles(files: FileList | null) {
    if (!files) return
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith('video/'))
      .map((f) => URL.createObjectURL(f))
    if (urls.length) onVideosChange([...videos, ...urls])
  }

  function addVideoUrl() {
    const url = videoUrl.trim()
    if (!url) return
    onVideosChange([...videos, url])
    setVideoUrl('')
  }

  function removeVideo(index: number) {
    const target = videos[index]
    revokeIfBlob(target)
    onVideosChange(videos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-5">
      {/* Photos */}
      <div>
        <label className="mb-1.5 block font-semibold">Photos</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-xl bg-soft">
              <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Retirer la photo ${i + 1}`}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X size={14} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Couverture
                </span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => imageInput.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-muted hover:border-primary hover:text-primary"
          >
            <ImagePlus size={22} />
            <span className="text-xs font-medium">Ajouter</span>
          </button>
        </div>
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addImageFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <div className="mt-2 flex gap-2">
          <div className="field h-11 flex-1">
            <Link2 size={18} className="text-muted" />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
              placeholder="Coller l'URL d'une image"
            />
          </div>
          <button type="button" onClick={addImageUrl} className="btn-outline h-11 px-4 text-sm">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">La première photo sert de couverture.</p>
      </div>

      {/* Vidéos */}
      <div>
        <label className="mb-1.5 block font-semibold">Vidéos (optionnel)</label>
        {videos.length > 0 && (
          <div className="mb-2 space-y-2">
            {videos.map((src, i) => (
              <div key={`v-${i}`} className="relative overflow-hidden rounded-xl bg-black">
                <video src={src} controls className="max-h-64 w-full" />
                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  aria-label={`Retirer la vidéo ${i + 1}`}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => videoInput.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line py-5 text-muted hover:border-primary hover:text-primary"
        >
          <VideoIcon size={24} />
          <span className="text-sm font-medium">Ajouter une ou plusieurs vidéos</span>
        </button>
        <input
          ref={videoInput}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addVideoFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <div className="mt-2 flex gap-2">
          <div className="field h-11 flex-1">
            <Link2 size={18} className="text-muted" />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVideoUrl())}
              placeholder="Coller l'URL d'une vidéo (mp4…)"
            />
          </div>
          <button type="button" onClick={addVideoUrl} className="btn-outline h-11 px-4 text-sm">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
