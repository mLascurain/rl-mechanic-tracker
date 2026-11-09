'use client'

import { useState } from 'react'
import { getYouTubeEmbedUrl } from '@/lib/resources'
import type { MechanicResourceItem } from '@/lib/data/mechanics'
import {
  Copy,
  Check,
  ExternalLink,
  Video,
  Target,
} from 'lucide-react'

interface ResourceEmbedsProps {
  resources: MechanicResourceItem[]
  mechanicName: string
}

export function ResourceEmbeds({ resources, mechanicName }: ResourceEmbedsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const videos = resources.filter((r) => r.type === 'video' && getYouTubeEmbedUrl(r.video_url))
  const trainingPacks = resources.filter((r) => r.type === 'map_code' && r.map_code)

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current))
      }, 2500)
    } catch {
      // Fallback for older browsers or permission denials
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedCode(code)
      setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current))
      }, 2500)
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
                        onClick={() => pack.map_code && handleCopyCode(pack.map_code)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-[#FF8A1E] text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                        aria-label={`Copy code ${pack.map_code}`}
                      >
                        {isCopied ? (
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
                      <iframe
                        src={embedUrl}
                        title={title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
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
