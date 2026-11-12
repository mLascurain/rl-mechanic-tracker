'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { registerWithEmail } from '@/app/auth/actions'
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'

export function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/profile'

  const [state, formAction, isPending] = useActionState(registerWithEmail, null)

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Accent */}
      <div className="relative mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-progress">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
          Create <span className="text-progress">Account</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Start your mechanic progression roadmap and track your rank&nbsp;journey.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="rl-card p-6 sm:p-8 relative overflow-hidden border-slate-800">

        {/* Error Alert */}
        {state?.error && (
          <div role="status" className="mb-6 p-3.5 rounded-lg bg-secondary/10 border border-secondary/40 text-secondary text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {state.error}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {state?.success && state?.message && (
          <div role="status" className="mb-6 p-3.5 rounded-lg bg-progress/10 border border-progress/40 text-progress text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-progress shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {state.message}
            </div>
          </div>
        )}

        {/* Register Form */}
        <p role="status" className="sr-only">{isPending ? 'Creating account...' : ''}</p>
        <form action={formAction} aria-busy={isPending} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label htmlFor="RegisterForm-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 a" />
              <input
                type="email"
                id="RegisterForm-email"
                name="email"
                required
                autoComplete="email"
                placeholder="grandchamp@rocketleague.gg"
                className="rl-input w-full pr-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="RegisterForm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="RegisterForm-password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="rl-input w-full pr-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="RegisterForm-confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="RegisterForm-confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Re-enter password"
                className="rl-input w-full pr-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rl-btn-orange w-full mt-2 py-3 text-sm cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Join Tracker</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            href={`/auth/login${redirectTo !== '/profile' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="text-progress hover:text-progress font-semibold underline underline-offset-4"
          >
            Sign In here
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Free account • Track mechanics • Recommended roadmap</span>
      </div>
    </div>
  )
}
