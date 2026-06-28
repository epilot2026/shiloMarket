import { PenSquare } from 'lucide-react'

export function Fab({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Publier"
      className="fixed bottom-20 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-fab lg:hidden"
    >
      <PenSquare size={24} />
    </button>
  )
}
