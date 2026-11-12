'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { chooseHighlight } from '@/lib/highlights'

export function PracticeHighlight() {
  const video = useRef<HTMLVideoElement>(null)
  const section = useRef<HTMLElement>(null)
  const manualPause = useRef(false)
  const [clip, setClip] = useState<ReturnType<typeof chooseHighlight> | null>(null)
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const target = section.current
    if (!target) return
    let chosen: ReturnType<typeof chooseHighlight> | null = null
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (!entry.isIntersecting || chosen) return
      let previous = null
      try { previous = sessionStorage.getItem('rl:last-highlight') } catch { /* Storage may be disabled. */ }
      chosen = chooseHighlight(previous)
      try { sessionStorage.setItem('rl:last-highlight', chosen.video) } catch { /* Random selection still works. */ }
      setClip(chosen)
    }, { threshold: 0.1 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = video.current
    if (!media || !clip) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (preference.matches || manualPause.current || !visible || document.hidden) media.pause()
      else void media.play().catch(() => {})
    }
    update()
    preference.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      preference.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      media.pause()
    }
  }, [clip, visible])

  return (
    <section ref={section} className="practice-highlight" aria-labelledby="highlight-heading">
      <div className="practice-highlight-media" aria-hidden="true">
        <video ref={video} src={clip?.video} muted loop playsInline preload="none" poster={clip?.video.replace(/\.mp4$/, '.jpg')} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      </div>
      <div className="practice-highlight-shade" />
      <div className="practice-highlight-copy">
        <p className="rl-eyebrow text-accent mb-5">Inspired by the play. Built through practice.</p>
        <h2 id="highlight-heading" className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">That impossible shot?<br /><span className="text-accent">Start with one mechanic.</span></h2>
        <p className="mt-6 max-w-md text-base sm:text-lg text-slate-200 leading-relaxed">The control. The timing. The final touch. Every highlight is built on foundations you can practice. Find yours, put in the reps, and build toward your next breakthrough.</p>
        <Link href="/recommendations" className="rl-btn-cyan mt-8">Build my learning path <ArrowRight size={16} aria-hidden="true" /></Link>
        <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted"><span>CAR CONTROL</span><span aria-hidden="true">/</span><span>AERIALS</span><span aria-hidden="true">/</span><span>PINCHES</span></div>
      </div>
      <div className="practice-highlight-controls">
        {clip ? <a href={clip.source} target="_blank" rel="noreferrer" className="text-xs underline underline-offset-4">Gameplay source · Tenor</a> : null}
        <button type="button" disabled={!clip} className="rl-btn-ghost" onClick={() => {
          const media = video.current
          if (!media) return
          manualPause.current = !media.paused
          if (media.paused) void media.play().catch(() => {})
          else media.pause()
        }} aria-label={playing ? 'Pause gameplay' : 'Play gameplay'}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      </div>
    </section>
  )
}
