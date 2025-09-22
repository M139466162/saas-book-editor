"use client"
import Link from 'next/link'
import { Book, Library, Settings, Home, Sun, Moon, Palette } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export function Navigation() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
              <Book className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">MindScribe Pro</span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link 
              href="/templates" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors"
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </Link>
            <Link 
              href="/books/coloring" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Coloriage</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="ml-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors"
                title={resolvedTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {resolvedTheme === 'dark' ? (
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    <span className="hidden sm:inline">Clair</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    <span className="hidden sm:inline">Sombre</span>
                  </div>
                )}
              </button>
            )}
            {session ? (
              <>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors">Admin</Link>
                )}
                <button onClick={() => signOut()} className="ml-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors">Se déconnecter</button>
              </>
            ) : (
              <button onClick={() => signIn()} className="ml-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors">Se connecter</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}