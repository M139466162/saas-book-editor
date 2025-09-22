import { cn } from '@/lib/utils'
import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-160 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      primary: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
      default: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80', // alias for primary
      secondary: 'bg-surface border border-border hover:bg-panel active:bg-surface',
      outline: 'bg-transparent border border-border hover:bg-surface active:bg-surface/50',
      ghost: 'hover:bg-surface/50 active:bg-surface',
      destructive: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg'
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'