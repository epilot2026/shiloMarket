import { useState, useRef, useEffect } from 'react'
import { Mic, Send, Trash2 } from 'lucide-react'
import { EmojiPicker } from './EmojiPicker'
import { AttachmentMenu } from './AttachmentMenu'

interface Props {
  onSendText: (text: string) => void
  onSendVoice: (durationSec: number) => void
  onAttach: (kind: string) => void
}

export function ChatInput({ onSendText, onSendVoice, onAttach }: Props) {
  const [draft, setDraft] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const recordTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (recordTimer.current) clearInterval(recordTimer.current)
    }
  }, [])

  function startRecording() {
    setRecording(true)
    setRecordSeconds(0)
    recordTimer.current = setInterval(() => {
      setRecordSeconds((s) => s + 1)
    }, 1000)
  }

  function cancelRecording() {
    if (recordTimer.current) clearInterval(recordTimer.current)
    setRecording(false)
    setRecordSeconds(0)
  }

  function sendVoiceMessage() {
    if (recordTimer.current) clearInterval(recordTimer.current)
    const duration = recordSeconds
    setRecording(false)
    setRecordSeconds(0)
    if (duration === 0) return
    onSendVoice(duration)
  }

  function addEmoji(emoji: string) {
    setDraft((d) => d + emoji)
    inputRef.current?.focus()
  }

  function send() {
    if (!draft.trim()) return
    onSendText(draft.trim())
    setDraft('')
  }

  if (recording) {
    return (
      <div className="flex items-center gap-3 border-t border-line bg-white p-2 safe-bottom pb-4">
        <button
          onClick={cancelRecording}
          className="grid h-10 w-10 place-items-center rounded-lg bg-soft text-live"
          aria-label="Annuler"
        >
          <Trash2 size={20} />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-soft px-4 py-2.5">
          <span className="h-3 w-3 animate-pulse rounded-full bg-live" />
          <span className="text-sm font-medium text-ink">
            Enregistrement… 0:{String(recordSeconds).padStart(2, '0')}
          </span>
        </div>
        <button
          onClick={sendVoiceMessage}
          className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white"
          aria-label="Envoyer le vocal"
        >
          <Send size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 border-t border-line bg-white p-2 safe-bottom pb-6">
      <AttachmentMenu onAttach={onAttach} />
      <EmojiPicker onPick={addEmoji} />
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder="Écrire un message…"
        className="flex-1 rounded-lg bg-soft px-4 py-2.5 outline-none"
      />
      {draft.trim() ? (
        <button
          onClick={send}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-white"
          aria-label="Envoyer"
        >
          <Send size={18} />
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-soft transition hover:bg-line/50"
          aria-label="Message vocal"
        >
          <Mic size={20} />
        </button>
      )}
    </div>
  )
}
