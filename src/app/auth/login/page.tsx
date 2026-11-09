import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | RL Mechanic Tracker',
  description: 'Sign in to track your Rocket League mechanics and climb the ranks.',
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 rl-bg-grid">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto rl-card p-8 border-slate-800 text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Loading sign in form...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
