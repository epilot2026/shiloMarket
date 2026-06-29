import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  onSend: (text: string) => void
  placeholder?: string
}

export function CommentInput({ onSend, placeholder = 'Écrire un commentaire…' }: Props) {
  const [text, setText] = useState('')

  function send() {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-line bg-soft px-3 py-2 text-sm outline-none focus:border-primary/50"
      />
      <button
        onClick={send}
        disabled={!text.trim()}
        className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Envoyer"
      >
        <Send size={16} />
      </button>
    </div>
  )
}
