import { PenSquare } from 'lucide-react'

export function Fab({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Publier"
      className="fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-transparent text-primary backdrop-blur-md transition hover:border-primary/60 active:scale-95 xl:bottom-6 xl:right-6"
    >
      <PenSquare size={24} />
    </button>
  )
}
