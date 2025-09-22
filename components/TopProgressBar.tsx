"use client"
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Simple CSS-based top progress bar on route changes
export default function TopProgressBar() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    // Trigger a short progress animation on route change
    const el = document.getElementById('top-progress-bar')
    if (!el) return
    el.classList.remove('w-0')
    el.classList.remove('opacity-0')
    el.classList.add('w-2/3')
    const t = setTimeout(() => {
      el.classList.add('w-full')
      const t2 = setTimeout(() => {
        el.classList.add('opacity-0')
        el.classList.remove('w-full')
        el.classList.add('w-0')
      }, 250)
      return () => clearTimeout(t2)
    }, 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search?.toString()])

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-0.5">
      <div
        id="top-progress-bar"
        className="h-0.5 w-0 bg-accent transition-all duration-300 ease-out opacity-0"
      />
    </div>
  )
}
