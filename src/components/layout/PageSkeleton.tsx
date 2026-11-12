export function PageSkeleton({ label = 'Loading page' }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <span className="sr-only">{label}…</span>
      <div aria-hidden="true" className="space-y-8 motion-safe:animate-pulse">
        <div className="rl-card space-y-5 p-6 sm:p-8">
          <div className="h-4 w-36 rounded bg-surface-raised" />
          <div className="h-10 w-3/4 rounded bg-surface-raised" />
          <div className="h-5 w-full max-w-xl rounded bg-surface-raised" />
        </div>
        <div className="h-12 rounded-lg border border-border bg-surface-raised" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rl-card h-52 space-y-5 p-6">
              <div className="h-5 w-2/3 rounded bg-surface-raised" />
              <div className="h-4 rounded bg-surface-raised" />
              <div className="h-4 w-3/4 rounded bg-surface-raised" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
