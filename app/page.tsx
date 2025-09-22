'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, BookOpen, Command, Sparkles, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBooksStore } from '@/lib/store'
import { generateUUID } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BookCard } from '@/components/BookCard'
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette'
import { QuickBookGenerator } from '@/components/QuickBookGenerator'
import { PageLayout, AppHeader, ContentContainer, StyledCard, ModernButton, designTokens } from '@/components/ui/DesignSystem'
import { ABTestCTAButtons, ABTestFeatureCards } from '@/components/ABTesting'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuickGenerator, setShowQuickGenerator] = useState(false)
  
  const { books, addBook } = useBooksStore()
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette()

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const EmptyState = () => (
    <motion.div
      {...designTokens.animations.fadeIn}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Animated Gradient Icon */}
      <motion.div
        className="relative mb-8"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-3 h-3 text-yellow-800" />
        </motion.div>
      </motion.div>

      <h2 className={`${designTokens.typography.h1} ${designTokens.colors.textPrimary} mb-4 text-center`}>
        Créez votre premier livre
      </h2>
      <p className={`${designTokens.colors.textSecondary} ${designTokens.typography.body} mb-8 text-center max-w-md leading-relaxed`}>
        Commencez votre parcours d'écriture avec MindScribe Pro. Créez des plans, rédigez des chapitres et donnez vie à vos idées.
      </p>

      {/* Tests A/B pour les boutons CTA */}
      <ABTestCTAButtons onButtonClick={(variant) => {
        console.log('CTA clicked:', variant)
        // Rediriger vers la création de livre ou les templates
        if (variant.includes('primary')) {
          setShowQuickGenerator(true)
        } else {
          router.push('/templates')
        }
      }} />

      {/* Tests A/B pour les cartes de fonctionnalités */}
      <ABTestFeatureCards />
    </motion.div>
  )

  return (
    <PageLayout>
      {/* Modern Header */}
      <AppHeader
        title="MindScribe Pro"
        subtitle={`${books.length} livre${books.length !== 1 ? 's' : ''} créé${books.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link 
                href="/templates" 
                className={`${designTokens.colors.textSecondary} hover:${designTokens.colors.textPrimary} transition-colors font-medium`}
              >
                Modèles
              </Link>
              <Link 
                href="/ab-testing" 
                className={`${designTokens.colors.textSecondary} hover:${designTokens.colors.textPrimary} transition-colors font-medium`}
              >
                A/B Testing
              </Link>
              <Link 
                href="/settings" 
                className={`${designTokens.colors.textSecondary} hover:${designTokens.colors.textPrimary} transition-colors font-medium`}
              >
                Paramètres
              </Link>
            </nav>
            
            <ModernButton
              variant="ghost"
              size="sm"
              icon={<Command className="w-4 h-4" />}
              onClick={() => setCommandPaletteOpen(true)}
            >
              <span className="hidden sm:inline">⌘K</span>
            </ModernButton>
            <ModernButton 
              variant="primary"
              icon={<BookOpen className="w-4 h-4" />}
              onClick={() => setShowQuickGenerator(true)}
            >
              <span className="hidden sm:inline">Nouveau livre</span>
            </ModernButton>
          </>
        }
      />

      {/* Main Content */}
      <ContentContainer>
        {books.length === 0 && !searchQuery ? (
          <EmptyState />
        ) : (
          <>
            {/* Modern Search Bar */}
            <motion.div 
              className="relative mb-8 max-w-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className={`h-4 w-4 ${designTokens.colors.textMuted}`} />
              </div>
              <Input
                placeholder="Rechercher vos livres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${designTokens.colors.surface} ${designTokens.colors.border} border focus:border-blue-300 focus:ring-2 focus:ring-blue-100`}
              />
            </motion.div>

            {/* Books Grid with improved animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <BookCard
                      book={book}
                      onClick={() => {
                        router.push(`/book/${book.id}`)
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Enhanced No Results State */}
            {filteredBooks.length === 0 && searchQuery && (
              <motion.div 
                className="text-center py-16"
                {...designTokens.animations.fadeIn}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className={`${designTokens.typography.h3} ${designTokens.colors.textPrimary} mb-2`}>
                  Aucun livre trouvé
                </h3>
                <p className={`${designTokens.colors.textMuted} ${designTokens.typography.body} mb-6`}>
                  Aucun livre ne correspond à "{searchQuery}"
                </p>
                <ModernButton 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Effacer la recherche
                </ModernButton>
              </motion.div>
            )}
          </>
        )}
      </ContentContainer>

      {/* Command Palette */}
      <CommandPalette 
        open={commandPaletteOpen} 
        onOpenChange={setCommandPaletteOpen} 
      />

      {/* Quick Book Generator */}
      {showQuickGenerator && (
        <QuickBookGenerator 
          onClose={() => setShowQuickGenerator(false)}
        />
      )}
    </PageLayout>
  )
}