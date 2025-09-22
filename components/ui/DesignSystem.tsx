'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// Design System Colors & Tokens
export const designTokens = {
  colors: {
    // Tokenized Tailwind CSS var colors (works in dark mode)
    background: 'bg-background',
    surface: 'bg-surface',
    surfaceHover: 'hover:bg-surface/80',
    panel: 'bg-panel',

    // Text Colors
    textPrimary: 'text-text-primary',
    textSecondary: 'text-text-secondary',
    textMuted: 'text-text-muted',

    // Borders
    border: 'border-border',
    borderHover: 'hover:border-border/80',

    // Accents
    accent: 'text-accent',
    accentBg: 'bg-accent',
    accentHover: 'hover:bg-accent/90',
    accentLight: 'bg-accent/10',
    accentBorder: 'border-accent/30',

    // Status Colors (using tonal utilities)
    success: 'text-green-500',
    successBg: 'bg-green-500',
    successLight: 'bg-green-500/10',
    error: 'text-red-500',
    errorBg: 'bg-red-500',
    errorLight: 'bg-red-500/10',
    warning: 'text-yellow-500',
    warningBg: 'bg-yellow-500',
    warningLight: 'bg-yellow-500/10',
    info: 'text-blue-500',
    infoBg: 'bg-blue-500',
    infoLight: 'bg-blue-500/10',
  },
  
  typography: {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-medium',
    body: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs',
  },
  
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  },
  
  rounded: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
  
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  
  animations: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    },
    slideUp: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2 }
    }
  }
}

// Standardized Layout Components
interface PageLayoutProps {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className={`min-h-screen ${designTokens.colors.background} ${className}`}>
      {children}
    </div>
  )
}

interface AppHeaderProps {
  title: string
  subtitle?: string
  backButton?: {
    label: string
    onClick: () => void
  }
  actions?: ReactNode
}

export function AppHeader({ title, subtitle, backButton, actions }: AppHeaderProps) {
  return (
    <motion.header 
      className={`${designTokens.colors.surface} border-b ${designTokens.colors.border} px-6 py-4 shadow-sm`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backButton && (
            <motion.button
              onClick={backButton.onClick}
              className={`flex items-center gap-2 px-3 py-2 ${designTokens.colors.textSecondary} hover:${designTokens.colors.textPrimary} ${designTokens.rounded.sm} hover:bg-gray-100 transition-all`}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backButton.label}
            </motion.button>
          )}
          
          <div>
            <h1 className={`${designTokens.typography.h2} ${designTokens.colors.textPrimary}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`${designTokens.colors.textMuted} ${designTokens.typography.small} mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  )
}

interface ContentContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function ContentContainer({ children, maxWidth = 'xl', className = '' }: ContentContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }
  
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  )
}

interface StyledCardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'bordered' | 'minimal'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function StyledCard({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  className = '', 
  onClick 
}: StyledCardProps) {
  const variants = {
    default: `${designTokens.colors.surface} ${designTokens.colors.border} border ${designTokens.shadow.sm}`,
    elevated: `${designTokens.colors.surface} ${designTokens.shadow.md}`,
    bordered: `${designTokens.colors.surface} ${designTokens.colors.border} border-2`,
    minimal: `${designTokens.colors.surface}`
  }
  
  const paddings = {
    sm: designTokens.spacing.sm,
    md: designTokens.spacing.md,
    lg: designTokens.spacing.lg
  }
  
  const Component = onClick ? motion.div : 'div'
  const motionProps = onClick ? {
    whileHover: { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
    whileTap: { scale: 0.98 },
    className: `${variants[variant]} ${designTokens.rounded.md} ${paddings[padding]} ${className} cursor-pointer transition-all duration-200`,
    onClick
  } : {
    className: `${variants[variant]} ${designTokens.rounded.md} ${paddings[padding]} ${className}`
  }
  
  return (
    <Component {...motionProps}>
      {children}
    </Component>
  )
}

// Modern Button Component
interface ModernButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function ModernButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  onClick, 
  disabled = false,
  className = '' 
}: ModernButtonProps) {
  const variants = {
    primary: `${designTokens.colors.accentBg} text-white ${designTokens.colors.accentHover} shadow-sm`,
    secondary: `${designTokens.colors.panel} ${designTokens.colors.textPrimary} hover:bg-gray-200`,
    ghost: `transparent ${designTokens.colors.textSecondary} hover:bg-gray-100 ${designTokens.colors.textPrimary}`,
    outline: `transparent ${designTokens.colors.textPrimary} border-2 ${designTokens.colors.border} ${designTokens.colors.borderHover}`
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <motion.button
      className={`
        inline-flex items-center gap-2 
        ${variants[variant]} 
        ${sizes[size]} 
        ${designTokens.rounded.sm} 
        font-medium transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.button>
  )
}

export default {
  designTokens,
  PageLayout,
  AppHeader,
  ContentContainer,
  StyledCard,
  ModernButton
}