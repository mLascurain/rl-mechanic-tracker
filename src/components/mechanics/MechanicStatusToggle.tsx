'use client'

import { useState, useTransition } from 'react'
import { updateMechanicStatus, type MechanicStatus } from '@/actions/mechanics'
import { Flame, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface MechanicStatusToggleProps {
  mechanicId: string
  initialStatus: MechanicStatus | null
  pathSlug?: string
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
  onStatusChange?: (newStatus: MechanicStatus | null) => void
}

export function MechanicStatusToggle({
  mechanicId,
  initialStatus,
  pathSlug,
  compact = false,
  size = 'md',
  onStatusChange,
}: MechanicStatusToggleProps) {
  const [status, setStatus] = useState<MechanicStatus | null>(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [pendingTarget, setPendingTarget] = useState<MechanicStatus | 'not_started' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleToggle = (
    e: React.MouseEvent,
    targetStatus: MechanicStatus | null
  ) => {
    // Prevent bubbling if inside a parent card link
    e.stopPropagation()
    e.preventDefault()

    if (isPending) return

    // If clicking current status, toggle to null (not started)
    const newStatus = status === targetStatus ? null : targetStatus
    const previousStatus = status

    // Optimistic UI update
    setStatus(newStatus)
    setPendingTarget(targetStatus === null ? 'not_started' : targetStatus)
    setErrorMessage(null)

    if (onStatusChange) {
      onStatusChange(newStatus)
    }

    startTransition(async () => {
      try {
        const result = await updateMechanicStatus(mechanicId, newStatus, pathSlug)
        if (result.error) {
          // Revert optimistic update
          setStatus(previousStatus)
          if (onStatusChange) onStatusChange(previousStatus)
          if (result.error === 'Unauthorized') {
            setErrorMessage('Log in to track your mastery')
          } else {
            setErrorMessage(result.error)
          }
        }
      } catch (err: unknown) {
        setStatus(previousStatus)
        if (onStatusChange) onStatusChange(previousStatus)
        setErrorMessage(err instanceof Error ? err.message : 'Failed to update status')
      } finally {
        setPendingTarget(null)
      }
    })
  }

  // COMPACT MODE: Perfect for Catalog Cards & dense lists
  if (compact) {
    return (
      <div className="relative inline-flex flex-col items-start gap-1">
        <div
          role="group"
          aria-label="Mechanic mastery status"
          className="inline-flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          {/* Not Started Button */}
          <button
            type="button"
            onClick={(e) => handleToggle(e, null)}
            disabled={isPending}
            aria-pressed={status === null}
            title={status === null ? 'Not started (Active)' : 'Mark as Not Started'}
            className={`relative px-2 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              status === null
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {isPending && pendingTarget === 'not_started' ? (
              <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
            <span className="text-xs">Todo</span>
          </button>

          {/* Learning Button */}
          <button
            type="button"
            onClick={(e) => handleToggle(e, 'learning')}
            disabled={isPending}
            aria-pressed={status === 'learning'}
            title={status === 'learning' ? 'Learning (Active)' : 'Mark as Learning'}
            className={`relative px-2 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              status === 'learning'
                ? 'bg-progress/10 text-progress border border-progress/70 font-bold'
                : 'text-slate-400 hover:text-progress hover:bg-progress/10'
            }`}
          >
            {isPending && pendingTarget === 'learning' ? (
              <Loader2 className="w-3 h-3 animate-spin text-progress" />
            ) : (
              <Flame className="w-3 h-3 text-progress" />
            )}
            <span className="text-xs">Learning</span>
          </button>

          {/* Done Button */}
          <button
            type="button"
            onClick={(e) => handleToggle(e, 'mastered')}
            disabled={isPending}
            aria-pressed={status === 'mastered'}
            title={status === 'mastered' ? 'Done (Active)' : 'Mark as Done'}
            className={`relative px-2 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              status === 'mastered'
                ? 'bg-success/10 text-success border border-success/70 font-bold'
                : 'text-slate-400 hover:text-success hover:bg-success/10'
            }`}
          >
            {isPending && pendingTarget === 'mastered' ? (
              <Loader2 className="w-3 h-3 animate-spin text-success" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-success" />
            )}
            <span className="text-xs">Done</span>
          </button>
        </div>

        {errorMessage && (
          <div role="status" className="flex items-center gap-1 text-xs text-progress mt-0.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errorMessage.includes('Log in') ? (
              <Link href="/auth/login" className="underline hover:text-progress">
                Log in to save
              </Link>
            ) : (
              <span>{errorMessage}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  // FULL SIZE MODE: For Detail Hero and prominent actions
  const sizeClasses =
    size === 'lg'
      ? 'px-4 py-2.5 text-sm gap-2'
      : size === 'sm'
      ? 'px-2.5 py-1.5 text-xs gap-1.5'
      : 'px-3.5 py-2 text-xs sm:text-sm gap-2'

  return (
    <div className="space-y-2 w-full sm:w-auto">
      <div
        role="group"
        aria-label="Mechanic mastery status toggle"
        className="grid grid-cols-3 sm:flex sm:items-center p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1"
      >
        {/* Not Started Button */}
        <button
          type="button"
          onClick={(e) => handleToggle(e, null)}
          aria-pressed={status === null}
          disabled={isPending}
          className={`relative rounded-lg font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ${sizeClasses} ${
            status === null
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {isPending && pendingTarget === 'not_started' ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <Circle className="w-4 h-4 text-slate-400" />
          )}
          <span>Not Started</span>
        </button>

        {/* Learning Button */}
        <button
          type="button"
          onClick={(e) => handleToggle(e, 'learning')}
          aria-pressed={status === 'learning'}
          disabled={isPending}
          className={`relative rounded-lg font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ${sizeClasses} ${
            status === 'learning'
              ? 'bg-progress/10 text-progress border border-progress/70'
              : 'text-slate-400 hover:text-progress hover:bg-progress/10'
          }`}
        >
          {isPending && pendingTarget === 'learning' ? (
            <Loader2 className="w-4 h-4 animate-spin text-progress" />
          ) : (
            <Flame className="w-4 h-4 text-progress" />
          )}
          <span>Learning</span>
        </button>

        {/* Done Button */}
        <button
          type="button"
          onClick={(e) => handleToggle(e, 'mastered')}
          aria-pressed={status === 'mastered'}
          disabled={isPending}
          className={`relative rounded-lg font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ${sizeClasses} ${
            status === 'mastered'
              ? 'bg-success/10 text-success border border-success/70'
              : 'text-slate-400 hover:text-success hover:bg-success/10'
          }`}
        >
          {isPending && pendingTarget === 'mastered' ? (
            <Loader2 className="w-4 h-4 animate-spin text-success" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-success" />
          )}
          <span>Done</span>
        </button>
      </div>

      {errorMessage && (
        <div role="status" className="flex items-center gap-1.5 text-xs text-progress px-1 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMessage.includes('Log in') ? (
            <span>
              <Link href="/auth/login" className="underline font-semibold hover:text-progress">
                Log in
              </Link>{' '}
              to track your mechanic mastery.
            </span>
          ) : (
            <span>{errorMessage}</span>
          )}
        </div>
      )}
    </div>
  )
}
