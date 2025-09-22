import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import { Navigation } from '@/components/Navigation'

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
    <html lang="fr" className="dark">
      <body className={inter.className}>
        <ReactQueryProvider>
          <Navigation />
          <main>
            {children}
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  )
}