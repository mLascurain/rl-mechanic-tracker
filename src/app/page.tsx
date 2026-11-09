import Link from 'next/link'
import { ArrowRight, Compass, Check, Route, BookOpen, ChartNoAxesCombined } from 'lucide-react'

const steps = [
  { number: '01', title: 'Find your starting point', body: 'Set your competitive rank and mark the mechanics you already know.', icon: Compass },
  { number: '02', title: 'Build a strong foundation', body: 'Follow prerequisites before moving on to more demanding techniques.', icon: BookOpen },
  { number: '03', title: 'Make your practice count', body: 'Keep track of what you are learning and see your next available skills.', icon: ChartNoAxesCombined },
]

export default function HomePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center py-16 sm:py-24">
        <div>
          <p className="rl-eyebrow mb-6 flex items-center gap-3"><span className="h-2 w-2 bg-secondary rounded-full" />A clearer path to better play</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-.055em] leading-[1.04] max-w-2xl">Build your game.<br /><span className="text-accent">One mechanic<br className="hidden sm:block" /> at a time.</span></h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed max-w-lg mt-7">Turn aimless free play into focused practice. Explore Rocket League mechanics, understand the foundations, and find your next challenge.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/mechanics" className="rl-btn-cyan">Explore mechanics <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
            <Link href="/recommendations" className="rl-btn-ghost">Find my learning path</Link>
          </div>
          <p className="text-sm text-muted mt-5">Browse freely. Create an account to save your progress.</p>
        </div>
        <div className="rl-card p-5 sm:p-8 relative">
          <div className="flex justify-between items-center pb-6 border-b border-border"><span className="rl-eyebrow">How progression works</span><Route className="w-5 h-5 text-secondary" aria-hidden="true" /></div>
          <h2 className="text-2xl font-semibold tracking-tight mt-6">Foundation. Practice. Mastery.</h2>
          <p className="text-muted text-sm leading-relaxed mt-2">Every advanced skill starts with something simpler.</p>
          <ol className="mt-7 space-y-3">
            {[
              { title: 'Start with the essentials', description: 'Learn the controls and build consistency.', marker: '01', color: 'text-accent' },
              { title: 'Work on one technique', description: 'Mark it as learning and practice deliberately.', marker: '02', color: 'text-progress' },
              { title: 'Unlock your next challenge', description: 'Master prerequisites to open new options.', marker: '03', color: 'text-secondary' },
            ].map((step) => (
              <li key={step.marker} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background">
                <span className={`font-mono text-xs mt-1 ${step.color}`}>{step.marker}</span>
                <div><h3 className="text-sm font-semibold">{step.title}</h3><p className="text-xs text-muted leading-relaxed mt-1">{step.description}</p></div>
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-2 text-xs text-muted mt-6"><Check className="w-4 h-4 text-progress" aria-hidden="true" />A learning path based on your rank and progress</div>
        </div>
      </section>
      <section className="border-t border-border py-12 sm:py-16" aria-labelledby="training-heading">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8"><h2 id="training-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight">A little structure. Better practice.</h2><Link href="/auth/register" className="text-sm text-accent inline-flex items-center gap-2">Create your profile <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ number, title, body, icon: Icon }) => <article key={number} className="border-t border-border pt-5"><div className="flex items-center justify-between mb-5"><span className="rl-eyebrow">{number}</span><Icon className="w-5 h-5 text-accent" aria-hidden="true" /></div><h3 className="text-lg font-semibold tracking-tight">{title}</h3><p className="text-sm text-muted leading-relaxed mt-2">{body}</p></article>)}
        </div>
      </section>
    </div>
  )
}
