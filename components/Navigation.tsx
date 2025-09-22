import Link from 'next/link'
import { Book, Library, Settings, Home } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
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
              href="/settings" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-panel transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}