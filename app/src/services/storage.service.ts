import { supabase } from '../lib/supabase'

export type StorageBucket = 'avatars' | 'covers' | 'annonces' | 'shorts' | 'chat' | 'documents'

const MAX_WEBP_SIZE = 120 * 1024
const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp']

function isImage(file: File): boolean {
  return IMAGE_MIME_TYPES.includes(file.type)
}

async function compressToWebP(file: File, maxQuality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file)
  let { width, height } = bitmap

  const MAX_DIM = 1600
  if (width > MAX_DIM || height > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)

  let quality = maxQuality
  let blob: Blob | null = null

  while (quality > 0.3) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', quality),
    )
    if (blob && blob.size <= MAX_WEBP_SIZE) break
    quality -= 0.1
  }

  if (!blob) return file

  const originalName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${originalName}.webp`, { type: 'image/webp' })
}

export const storageService = {
  async upload(bucket: StorageBucket, file: File, path?: string): Promise<string> {
    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) throw new Error('Authentification requise')

    let fileToUpload = file
    if (isImage(file)) {
      try {
        fileToUpload = await compressToWebP(file)
      } catch {
        fileToUpload = file
      }
    }

    const filePath = path || `${session.session.user.id}/${Date.now()}-${fileToUpload.name}`

    const { error } = await supabase.storage.from(bucket).upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw new Error(error.message)

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return publicUrl.publicUrl
  },

  async uploadMultiple(bucket: StorageBucket, files: File[]): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      const url = await this.upload(bucket, file)
      urls.push(url)
    }
    return urls
  },

  async remove(bucket: StorageBucket, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw new Error(error.message)
  },

  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },
}
