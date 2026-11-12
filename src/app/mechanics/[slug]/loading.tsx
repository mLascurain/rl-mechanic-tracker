export default function Loading() {
  return (
    <div role="status" className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-accent">Loading mechanic…</p>
      <div aria-hidden="true" className="space-y-8 motion-safe:animate-pulse">
        <div className="rl-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <div className="h-6 w-40 rounded bg-surface-raised" />
            <div className="h-12 w-3/4 rounded bg-surface-raised" />
            <div className="h-20 rounded bg-surface-raised" />
            <div className="h-8 w-2/3 rounded bg-surface-raised" />
          </div>
          <div className="h-36 self-center rounded-xl bg-surface-raised" />
        </div>
        {[0, 1].map(section => (
          <div key={section} className="space-y-4">
            <div className="h-6 w-56 rounded bg-surface-raised" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(card => <div key={card} className="rl-card h-36 bg-surface-raised" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
