'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pageCount: number
  label: string
  controls: string
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, label, controls, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
      <button type="button" disabled={page <= 1} aria-controls={controls} onClick={() => onPageChange(page - 1)} className="rl-btn-ghost text-sm">
        <ChevronLeft size={16} aria-hidden="true" />Previous
      </button>
      <p role="status" aria-live="polite" className="text-sm tabular-nums text-muted">Page {page} of {pageCount}</p>
      <button type="button" disabled={page >= pageCount} aria-controls={controls} onClick={() => onPageChange(page + 1)} className="rl-btn-ghost text-sm">
        Next<ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  )
}
