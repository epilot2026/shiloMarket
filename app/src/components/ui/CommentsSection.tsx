import { useState } from 'react'
import { MessageSquare, MoreHorizontal, Heart, Reply } from 'lucide-react'
import { CommentInput } from './CommentInput'
import { formatCount } from '../../lib/format'
import { useAuth } from '../../context/AuthContext'

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  text: string
  likes: number
  createdAt: string
  replies?: Comment[]
}

interface Props {
  comments: Comment[]
  onAddComment: (text: string) => void
  onLikeComment?: (commentId: string) => void
  onReplyComment?: (commentId: string, text: string) => void
}

export function CommentsSection({ comments, onAddComment, onLikeComment, onReplyComment }: Props) {
  const { user } = useAuth()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  function handleReply(text: string) {
    if (replyingTo && onReplyComment) {
      onReplyComment(replyingTo, text)
      setReplyingTo(null)
    }
  }

  return (
    <section className="border-t border-line">
      <div className="px-4 py-3">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare size={18} />
          {formatCount(comments.length)} commentaire{comments.length !== 1 ? 's' : ''}
        </h3>
      </div>

      <div className="space-y-1">
        {comments.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted text-sm">
            Aucun commentaire pour le moment
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onLike={onLikeComment}
              onReply={() => setReplyingTo(comment.id)}
              isReplying={replyingTo === comment.id}
              onCancelReply={() => setReplyingTo(null)}
              onSendReply={handleReply}
            />
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-line">
        <CommentInput onSend={onAddComment} />
      </div>
    </section>
  )
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onReply,
  isReplying,
  onCancelReply,
  onSendReply,
}: {
  comment: Comment
  currentUserId?: string
  onLike?: (id: string) => void
  onReply?: () => void
  isReplying?: boolean
  onCancelReply?: () => void
  onSendReply?: (text: string) => void
}) {
  return (
    <div className="px-4 py-2 hover:bg-soft/50 transition">
      <div className="flex gap-3">
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          loading="lazy"
          className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.userName}</span>
            <span className="text-xs text-muted">{comment.createdAt}</span>
          </div>
          <p className="mt-0.5 text-sm text-ink/90">{comment.text}</p>

          <div className="mt-1.5 flex items-center gap-4 text-xs text-muted">
            <button
              onClick={() => onLike?.(comment.id)}
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <Heart size={14} /> {formatCount(comment.likes)}
            </button>
            <button
              onClick={onReply}
              className="hover:text-ink transition"
            >
              Répondre
            </button>
          </div>

          {isReplying && (
            <div className="mt-2">
              <CommentInput
                placeholder="Répondre…"
                onSend={onSendReply!}
              />
              <button
                onClick={onCancelReply}
                className="mt-1 text-xs text-muted hover:text-ink"
              >
                Annuler
              </button>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2 border-l-2 border-line pl-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <img
                    src={reply.userAvatar}
                    alt={reply.userName}
                    loading="lazy"
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs">{reply.userName}</span>
                      <span className="text-[10px] text-muted">{reply.createdAt}</span>
                    </div>
                    <p className="text-xs text-ink/90">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
