import { CheckCircle2, Flame, Circle, Trophy } from 'lucide-react'

interface ProgressKpiGridProps {
  kpi: {
    totalMechanics: number
    masteredCount: number
    learningCount: number
    unstartedCount: number
    completionPercentage: number
  }
}

export function ProgressKpiGrid({ kpi }: ProgressKpiGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Done KPI */}
      <div className="rl-card p-5 border-slate-800 bg-slate-900/60 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider">Done</span>
          <div className="p-1.5 rounded-lg bg-success/10 border border-success/40 text-success">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{kpi.masteredCount}</span>
            <span className="text-xs text-slate-500 font-medium">/ {kpi.totalMechanics}</span>
          </div>
          <p className="text-xs text-success/90 mt-1 font-medium">
            {kpi.completionPercentage}% of mechanic tree
          </p>
        </div>
      </div>

      {/* 2. Currently Learning KPI */}
      <div className="rl-card p-5 border-slate-800 bg-slate-900/60 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider">Learning</span>
          <div className="p-1.5 rounded-lg bg-progress/10 border border-progress/40 text-progress">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{kpi.learningCount}</span>
            <span className="text-xs text-slate-500 font-medium">active</span>
          </div>
          <p className="text-xs text-progress/90 mt-1 font-medium">
            Currently practicing
          </p>
        </div>
      </div>

      {/* 3. Unstarted KPI */}
      <div className="rl-card p-5 border-slate-800 bg-slate-900/60 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider">Unstarted</span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400">
            <Circle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{kpi.unstartedCount}</span>
            <span className="text-xs text-slate-500 font-medium">remaining</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Yet to be added to training
          </p>
        </div>
      </div>

      {/* 4. Total Completion KPI */}
      <div className="rl-card p-5 border-slate-800 bg-slate-900/60 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider">Arsenal Mastery</span>
          <div className="p-1.5 rounded-lg bg-accent/60 border border-primary/40 text-accent">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-accent">{kpi.completionPercentage}%</span>
            <span className="text-xs text-slate-400 font-medium">complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${kpi.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
