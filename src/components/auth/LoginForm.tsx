'use client'

import { useActionState, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginWithEmail } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/client'
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

export function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo') || '/profile'

  const [state, formAction, isPending] = useActionState(loginWithEmail, null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [oauthError, setOauthError] = useState<string | null>(null)

  const activeError = state?.error || urlError || oauthError

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      setOauthError(null)
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      })
      if (error) {
        setOauthError(error.message)
        setGoogleLoading(false)
      }
    } catch (err: unknown) {
      setOauthError(err instanceof Error ? err.message : 'Failed to connect with Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Accent */}
      <div className="relative mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 text-accent">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
          Sign In to <span className="text-accent">RLMT</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Track mechanics, follow paths & level up your&nbsp;rank.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="rl-card p-6 sm:p-8 relative overflow-hidden border-slate-800">

        {/* Error Alert */}
        {activeError && (
          <div role="status" className="mb-6 p-3.5 rounded-lg bg-secondary/10 border border-secondary/40 text-secondary text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {activeError === 'auth_callback_failed'
                ? 'Social sign-in was cancelled or encountered an error. Please try again.'
                : activeError}
            </div>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isPending}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition-all duration-150 disabled:opacity-60 cursor-pointer hover:border-slate-500"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900/90 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Or continue with email
          </span>
        </div>

        {/* Email / Password Form */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label htmlFor="LoginForm-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="LoginForm-email"
                name="email"
                required
                autoComplete="email"
                placeholder="striker@rocketleague.gg"
                className="rl-input w-full pr-10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="LoginForm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="LoginForm-password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="rl-input w-full pr-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || googleLoading}
            className="rl-btn-cyan w-full mt-2 py-3 text-sm cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Entering Arena...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href={`/auth/register${redirectTo !== '/profile' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="text-accent hover:text-accent font-semibold underline underline-offset-4"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Your progress is saved to your account</span>
      </div>
    </div>
  )
}
