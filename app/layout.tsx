import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Navigation } from '@/components/Navigation'
import { NotificationContainer } from '@/components/NotificationSystem'
import Providers from '@/components/Providers'
import TopProgressBar from '@/components/TopProgressBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindScribe Pro',
  description: 'AI-powered book planning and writing tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}> 
        <Providers>
          <TopProgressBar />
          <Navigation />
          <div className="relative">
            {/* Subtle gradient + grid background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_-200px,rgba(99,102,241,0.08),transparent)]" />
              <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
            </div>
            <main className="max-w-7xl mx-auto px-6 py-8">
              {children}
            </main>
          </div>
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  )
}