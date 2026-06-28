import { PenSquare } from 'lucide-react'

export function Fab({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Publier"
      className="fixed bottom-20 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-fab transition hover:bg-primary-dark xl:bottom-6 xl:right-6"
    >
      <PenSquare size={24} />
    </button>
  )
}
