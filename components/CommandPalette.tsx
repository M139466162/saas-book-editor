'use client'

import { useState, useEffect } from 'react'
import { Command, Search, BookOpen, Settings, Palette } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const commands = [
    {
      id: 'new-book',
      label: 'New Book',
      description: 'Create a new book',
      icon: BookOpen,
      shortcut: 'Ctrl+N',
      action: () => {
        // TODO: Implement new book creation
        console.log('Creating new book...')
        onOpenChange(false)
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings',
      icon: Settings,
      shortcut: 'Ctrl+,',
      action: () => {
        // TODO: Navigate to settings
        console.log('Opening settings...')
        onOpenChange(false)
      }
    },
    {
      id: 'templates',
      label: 'Templates',
      description: 'Browse templates',
      icon: Palette,
      shortcut: 'Ctrl+T',
      action: () => {
        // TODO: Navigate to templates
        console.log('Opening templates...')
        onOpenChange(false)
      }
    }
  ]

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(search.toLowerCase()) ||
    command.description.toLowerCase().includes(search.toLowerCase())
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in" onClick={() => onOpenChange(false)}>
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 animate-in slide-in-from-bottom-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-text-muted" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-panel px-1.5 font-mono text-[10px] font-medium text-text-muted opacity-100">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {filteredCommands.length === 0 && (
              <div className="py-6 text-center text-sm text-text-muted">No results found.</div>
            )}
            {filteredCommands.map((command) => {
              const Icon = command.icon
              return (
                <div
                  key={command.id}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm cursor-pointer hover:bg-panel',
                    'transition-colors duration-160'
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    command.action()
                  }}
                >
                  <Icon className="mr-3 h-4 w-4 text-text-muted" />
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    <div className="text-xs text-text-muted">{command.description}</div>
                  </div>
                  {command.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-text-muted">
                      {command.shortcut}
                    </kbd>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for using command palette
export function useCommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  
  return {
    open: commandPaletteOpen,
    setOpen: setCommandPaletteOpen
  }
}