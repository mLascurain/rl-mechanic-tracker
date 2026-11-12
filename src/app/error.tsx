'use client'

import Link from 'next/link'
import { useTransition } from 'react'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [pending, startTransition] = useTransition()
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <section className="rl-card space-y-4 p-6 sm:p-8" aria-busy={pending}>
        <h1 className="text-2xl font-semibold">We couldn’t load this page</h1>
        <p role="alert" className="text-muted">Please check your connection and try again. Your saved progress has not been changed.</p>
        <div className="flex flex-wrap gap-3">
          <button className="rl-btn-cyan" disabled={pending} onClick={() => startTransition(() => reset())}>{pending ? 'Retrying…' : 'Try again'}</button>
          <Link href="/" className="rl-btn-ghost">Back to home</Link>
        </div>
      </section>
    </div>
  )
}
