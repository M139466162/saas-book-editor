"use client"
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { ReactQueryProvider } from './ReactQueryProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
