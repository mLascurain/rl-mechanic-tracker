'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/auth/actions'
import { getRankVisuals } from '@/lib/ranks'
import { RankIcon } from '@/components/profile/RankBadge'
import { LocalPlayerName } from '@/components/profile/LocalPlayerName'
import {
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Compass,
  Activity,
  Sparkles,
} from 'lucide-react'

interface NavbarClientProps {
  user: {
    id: string
    email?: string
  } | null
  userRank: {
    name: string
    sort_order: number
  } | null
  username: string | null
}

export function NavbarClient({ user, userRank, username }: NavbarClientProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const rankVisuals = getRankVisuals(userRank?.name)

  const navLinks = [
    { href: '/mechanics', label: 'Mechanics', icon: Compass },
    { href: '/progress', label: 'My Progress', icon: Activity },
    { href: '/recommendations', label: 'Recommended Path', icon: Sparkles },
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-semibold tracking-tight text-base sm:text-lg">
              <span className="text-accent">
                RL MECHANIC TRACKER
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-accent border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Status Section (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Rank Badge */}
              <Link
                href="/profile"
                className="rank-badge rounded-full px-2.5 py-1 font-bold uppercase tracking-wider transition-all hover:brightness-110"
                style={{ '--rank-color': rankVisuals.color } as React.CSSProperties}
                title={`Current Rank: ${rankVisuals.label} (Click to change)`}
              >
                <RankIcon rankName={userRank?.name} size={20} />
                <span>{rankVisuals.label}</span>
              </Link>

              {/* Profile Link */}
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  pathname === '/profile'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-accent" />
                <LocalPlayerName userId={user.id} fallback={username ?? 'Player'} className="max-w-[110px] truncate" />
              </Link>

              {/* Sign Out Action Button */}
              <form action={signOutAction}>
                <button
                  type="submit"
                  title="Sign out of Tracker"
                  aria-label="Sign out"
                  className="flex items-center justify-center p-2 rounded-lg bg-slate-900/80 hover:bg-secondary/10 border border-slate-800 hover:border-secondary/40 text-slate-400 hover:text-secondary transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rl-btn-cyan text-xs !py-2 !px-4"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          {user && (
            <Link
              href="/profile"
              className="rank-badge rounded-full px-2 py-0.5 text-xs font-bold uppercase"
              style={{ '--rank-color': rankVisuals.color } as React.CSSProperties}
              title={`Current Rank: ${rankVisuals.label} (Click to change)`}
            >
              <RankIcon rankName={userRank?.name} size={16} />
              <span className="max-w-[80px] truncate">{rankVisuals.label}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-slate-800 text-accent border border-primary/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    <span>Player Profile (<LocalPlayerName userId={user.id} fallback={username ?? 'Player'} />)</span>
                  </div>
                  <span
                    className="rank-badge rounded px-2 py-0.5 text-xs font-bold uppercase"
                    style={{ '--rank-color': rankVisuals.color } as React.CSSProperties}
                  >
                    <RankIcon rankName={userRank?.name} size={18} />
                    {rankVisuals.label}
                  </span>
                </Link>

                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary/10 hover:bg-secondary/10 border border-secondary/50 text-secondary text-xs font-semibold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rl-btn-cyan text-xs w-full py-2.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rl-btn-ghost text-xs w-full py-2"
                >
                  <span>Register Account</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
