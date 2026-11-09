'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Pagination } from '@/components/layout/Pagination'

interface PracticeStep {
  id: string
  slug: string
  name: string
  explanation: string
}

const PAGE_SIZE = 8

export function LearningPathSteps({ steps }: { steps: PracticeStep[] }) {
  const [page, setPage] = useState(1)
  const heading = useRef<HTMLParagraphElement>(null)
  const pageCount = Math.max(1, Math.ceil(steps.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * PAGE_SIZE

  function changePage(nextPage: number) {
    setPage(nextPage)
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted">Practice in this order, from lower difficulty to higher difficulty, then by recommended rank. These are options, not mandatory tasks.</p>
      <p ref={heading} tabIndex={-1} role="status" aria-live="polite" className="scroll-mt-24 text-sm tabular-nums text-muted">Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, steps.length)} of {steps.length} ready to learn</p>
      <ol id="learning-path-results" start={startIndex + 1} className="space-y-4">
        {steps.slice(startIndex, startIndex + PAGE_SIZE).map((step, index) => (
          <li key={step.id} className="rl-card flex gap-4 p-5 sm:p-6">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">{startIndex + index + 1}</span>
            <div className="min-w-0 space-y-2">
              <h2 className="text-lg font-semibold"><Link href={`/mechanics/${step.slug}`} className="hover:underline">{step.name}</Link></h2>
              <p className="text-sm leading-relaxed text-muted">{step.explanation}</p>
              <Link href={`/mechanics/${step.slug}`} className="inline-block text-sm font-semibold text-accent hover:underline">Open practice details →</Link>
            </div>
          </li>
        ))}
      </ol>
      <Pagination page={currentPage} pageCount={pageCount} label="Learning path pages" controls="learning-path-results" onPageChange={changePage} />
    </div>
  )
}
