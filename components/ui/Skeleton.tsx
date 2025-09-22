import { cn } from '@/lib/utils'
import * as React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Skeleton({ className, rounded = 'md', ...props }: SkeletonProps) {
  const radius = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      className={cn(
        'animate-pulse bg-panel/70 relative overflow-hidden',
        radius,
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 && 'w-2/3')} />
      ))}
    </div>
  )
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return <Skeleton rounded="full" style={{ width: size, height: size }} />
}

// Tailwind keyframes via globals.css define `@keyframes shimmer`
