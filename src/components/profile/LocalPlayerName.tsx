'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { parsePlayerName, playerNameFallback } from '@/lib/profile'

const localNameEvent = 'rlmt:player-name-changed'
const serverSnapshot = () => null

function usePlayerName(userId: string, fallback?: string | null) {
  const key = `rlmt:player-name:v1:${userId}`
  const subscribe = useCallback((onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) onChange()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(localNameEvent, onChange)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(localNameEvent, onChange)
    }
  }, [key])
  const getSnapshot = useCallback(() => {
    try { return window.localStorage.getItem(key) } catch { return null }
  }, [key])
  const stored = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot)
  const name = parsePlayerName(stored) ?? playerNameFallback(fallback)

  function save(value: string): boolean {
    try {
      window.localStorage.setItem(key, value)
      window.dispatchEvent(new Event(localNameEvent))
      return true
    } catch { return false }
  }

  return { name, save }
}

interface PlayerNameProps {
  userId: string
  fallback?: string | null
  className?: string
}

/** Read-only alias shared by the navbar, progress header and profile. */
export function LocalPlayerName({ userId, fallback, className }: PlayerNameProps) {
  const { name } = usePlayerName(userId, fallback)
  return <span className={className}>{name}</span>
}

export function EditablePlayerName({ userId, fallback }: PlayerNameProps) {
  const { name, save } = usePlayerName(userId, fallback)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const editButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (editing) { input.current?.focus(); input.current?.select() }
  }, [editing])

  function finishEditing() {
    setEditing(false)
    setError('')
    requestAnimationFrame(() => editButton.current?.focus())
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = parsePlayerName(draft)
    if (!parsed) {
      setError('Use 2–32 letters, numbers, spaces, dots, hyphens or underscores.')
      return
    }
    if (!save(parsed)) {
      setError('This browser could not save your name. Check its storage settings and try again.')
      return
    }
    setFeedback('Display name saved on this browser.')
    finishEditing()
  }

  return (
    <div className="mt-3">
      {editing ? (
        <form onSubmit={submit} className="max-w-md space-y-2" onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); finishEditing() }
        }}>
          <label htmlFor="player-display-name" className="sr-only">Display name</label>
          <div className="flex items-center gap-2">
            <input ref={input} id="player-display-name" value={draft} onChange={event => { setDraft(event.target.value); setError('') }} required minLength={2} maxLength={32} autoComplete="nickname" aria-invalid={error ? true : undefined} aria-describedby="player-name-help player-name-error" className="rl-input min-w-0 flex-1" />
            <button type="submit" aria-label="Save display name" title="Save display name" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-success hover:bg-surface-raised"><Check size={18} aria-hidden="true" /></button>
            <button type="button" onClick={finishEditing} aria-label="Cancel editing name" title="Cancel" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted hover:bg-surface-raised"><X size={18} aria-hidden="true" /></button>
          </div>
          <p id="player-name-help" className="text-xs text-muted">Only on this browser. 2–32 characters.</p>
          <p id="player-name-error" role="alert" className="text-xs text-secondary">{error}</p>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h2>
          <button ref={editButton} type="button" onClick={() => { setDraft(name); setFeedback(''); setEditing(true) }} aria-label="Edit display name" title="Edit display name" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-raised hover:text-foreground"><Pencil size={15} aria-hidden="true" /></button>
        </div>
      )}
      <p role="status" aria-live="polite" className="text-xs text-muted">{feedback}</p>
    </div>
  )
}
