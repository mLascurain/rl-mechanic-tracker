import { createClient } from '@/lib/supabase/server'
import { NavbarClient } from './NavbarClient'

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black uppercase text-base sm:text-lg">
            <span className="text-accent">RL MECHANIC TRACKER</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="w-20 h-8 rounded-lg bg-slate-900 animate-pulse" />
          <div className="w-24 h-8 rounded-lg bg-slate-900 animate-pulse" />
        </div>
      </div>
    </header>
  )
}

export async function Navbar() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRank: { name: string; sort_order: number } | null = null
  let username: string | null = null

  if (user) {
    username = user.email ? user.email.split('@')[0] : 'Player'

    const { data: profile } = await supabase
      .from('profiles')
      .select('username, current_rank_id')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.username) {
      username = profile.username
    }

    if (profile?.current_rank_id) {
      const { data: rank } = await supabase
        .from('ranks')
        .select('name, sort_order')
        .eq('id', profile.current_rank_id)
        .maybeSingle()

      if (rank) {
        userRank = rank
      }
    }
  }

  return (
    <NavbarClient
      user={user ? { id: user.id, email: user.email } : null}
      userRank={userRank}
      username={username}
    />
  )
}
