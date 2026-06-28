import { useState } from 'react'

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const count = images.length

  return (
    <div className="relative overflow-hidden rounded-xl bg-soft">
      {count > 1 && (
        <div className="absolute left-2 right-2 top-2 z-10 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}

      <img
        src={images[index]}
        alt={alt}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
      />

      {count > 1 && (
        <>
          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {index + 1}/{count}
          </span>
          <button
            aria-label="Précédent"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute left-0 top-0 h-full w-1/3"
          />
          <button
            aria-label="Suivant"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-0 top-0 h-full w-1/3"
          />
        </>
      )}
    </div>
  )
}
