'use client'

import { useEffect, useRef, useState } from 'react'
import { getYouTubeEmbedUrl } from '@/lib/resources'
import type { MechanicResourceItem } from '@/lib/data/mechanics'
import {
  Copy,
  Check,
  ExternalLink,
  Video,
  Loader2,
  Target,
} from 'lucide-react'

interface ResourceEmbedsProps {
  resources: MechanicResourceItem[]
  mechanicName: string
}

function VideoPreview({ embedUrl, title }: { embedUrl: string; title: string }) {
  const [started, setStarted] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!started) {
    return (
      <button type="button" onClick={() => setStarted(true)} className="absolute inset-0 flex w-full flex-col items-center justify-center gap-3 p-4 text-accent hover:bg-slate-900 transition-colors" aria-label={`Load video: ${title}`}>
        <Video className="h-9 w-9" aria-hidden="true" />
        <span className="text-sm font-semibold">Load tutorial</span>
        <span className="text-xs text-slate-400">YouTube player loads when selected</span>
      </button>
    )
  }

  return (
    <>
      {!loaded && <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-slate-400"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />Loading video...</div>}
      <iframe src={embedUrl} title={title} onLoad={() => setLoaded(true)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className={`absolute inset-0 w-full h-full border-0 ${loaded ? '' : 'opacity-0'}`} />
    </>
  )
}

export function ResourceEmbeds({ resources, mechanicName }: ResourceEmbedsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [copyingCode, setCopyingCode] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current) }, [])

  const videos = resources.filter((r) => r.type === 'video' && getYouTubeEmbedUrl(r.video_url))
  const trainingPacks = resources.filter((r) => r.type === 'map_code' && r.map_code)

  const handleCopyCode = async (code: string) => {
    if (copyingCode) return
    setCopyingCode(code)
    setCopyError(null)
    setCopiedCode(null)
    if (copyTimer.current) clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
    } catch {
      setCopyError('Could not copy automatically. Select the code above and copy it manually.')
    } finally {
      setCopyingCode(null)
      copyTimer.current = setTimeout(() => setCopiedCode(null), 2500)
    }
  }

  const hasAnyResources = videos.length > 0 || trainingPacks.length > 0

  if (!hasAnyResources) {
    return (
      <div className="rl-card p-8 border-slate-800 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-[#AEB6FF]">
          <Target className="w-7 h-7" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold uppercase tracking-tight text-white">
            Free Play Practice
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            No verified training pack codes or community tutorials are registered for {mechanicName} yet.
            Warm up your car control and repetitions in standard Free Play mode!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 1. Custom Training Packs Section */}
      {trainingPacks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                Custom Training Packs ({trainingPacks.length})
              </h3>
              <p className="text-xs text-slate-400">
                Load these in-game to practice scenarios calibrated specifically for this mechanic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingPacks.map((pack) => {
              const isCopied = copiedCode === pack.map_code
              return (
                <div
                  key={pack.id}
                  className="rl-card p-5 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                        {pack.title || `${mechanicName} Training`}
                      </h4>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-[#AEB6FF] border border-cyan-500/40">
                        In-Game Pack
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-4">
                      Community practice pack. Use the code in Custom Training for
                      practice repetitions.
                    </p>

                    {/* Monospace Code Display Box */}
                    <div className="relative flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm tracking-wider text-[#AEB6FF]">
                      <span className="font-bold select-all">{pack.map_code}</span>

                      <button
                        type="button"
                        disabled={copyingCode !== null}
                        aria-busy={copyingCode === pack.map_code}
                        onClick={() => pack.map_code && handleCopyCode(pack.map_code)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-[#FF8A1E] text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                        aria-label={`Copy code ${pack.map_code}`}
                      >
                        {copyingCode === pack.map_code ? <><Loader2 className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" /><span>Copying...</span></> : isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Instruction Helper */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="text-[#AEB6FF] font-semibold">How to load:</span>
                    <span>In Rocket League: Play → Custom Training → Enter Code</span>
                  </div>
                </div>
              )
            })}
          </div>
          <p role="status" aria-live="polite" className={`min-h-5 text-xs ${copyError ? 'text-secondary' : 'text-success'}`}>{copyError || (copiedCode ? 'Training code copied.' : '')}</p>
        </section>
      )}

      {/* 2. YouTube Video Tutorials Section */}
      {videos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                Video Tutorials & Breakdowns ({videos.length})
              </h3>
              <p className="text-xs text-slate-400">
                Community tutorials for this mechanic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => {
              const embedUrl = getYouTubeEmbedUrl(vid.video_url)
              const title = vid.title || `${mechanicName} Tutorial`

              return (
                <div
                  key={vid.id}
                  className="rl-card p-4 sm:p-5 border-slate-800/90 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Video Embed */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                    {embedUrl ? (
                      <VideoPreview embedUrl={embedUrl} title={title} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4 text-center">
                        <Video className="w-8 h-8 mb-2" />
                        <span className="text-xs">Preview unavailable</span>
                      </div>
                    )}
                  </div>

                  {/* Video Title & External Link */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {title}
                    </h4>

                    {vid.video_url && (
                      <a
                        href={vid.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#AEB6FF] hover:text-[#AEB6FF] font-semibold shrink-0 transition-colors"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
