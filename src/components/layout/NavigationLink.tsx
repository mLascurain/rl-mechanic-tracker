'use client'

import Link, { useLinkStatus } from 'next/link'
import { createPortal } from 'react-dom'
import type { ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'

function NavigationFeedback() {
  const { pending } = useLinkStatus()
  if (!pending) return null

  // A portal keeps the indicator outside card overflow and transform contexts.
  return createPortal(
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex justify-center px-4">
      <span className="inline-flex items-center gap-3 rounded-full border border-accent/40 bg-slate-950 px-5 py-3 text-sm font-semibold text-accent shadow-xl">
        <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
        Loading page…
      </span>
    </div>,
    document.body,
  )
}

/** Native Next navigation semantics, including cancellation and modified clicks. */
export default function NavigationLink({ children, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props}>{children}<NavigationFeedback /></Link>
}
