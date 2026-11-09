import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar, NavbarSkeleton } from '@/components/layout/Navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | RL Mechanic Tracker',
    default: 'RL Mechanic Tracker | Rocket League Mastery & Skill Paths',
  },
  description:
    'Level up your Rocket League game. Interactive mechanic dependency roadmaps, recommended learning paths by rank, and mastery tracker.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-foreground">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <main id="main-content" className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">RL Mechanic Tracker</span>
              <span>•</span>
              <span>Rocket League is a registered trademark of Psyonix LLC.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://rocketleague.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                Psyonix
              </a>
              <span>•</span>
              <Link href="/mechanics" className="hover:text-cyan-400 transition-colors">
                Mechanics Catalog
              </Link>
              <span>•</span>
              <Link href="/profile" className="hover:text-cyan-400 transition-colors">
                Player Profile
              </Link>
              <span>•</span>
              <Link href="https://github.com/mlascurain/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                Made by m<strong className="font-bold">Lascurain</strong>
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
