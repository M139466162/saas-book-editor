'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Edit3, Save, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CanvaPageEditor } from '@/components/CanvaPageEditor'
import { useBooksStore } from '@/lib/store'
import { Book } from '@/lib/types'
import { PageLayout, designTokens } from '@/components/ui/DesignSystem'

export default function BookEditorPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const { books, updateBook } = useBooksStore()
  const [book, setBook] = useState<Book | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')

  // Load book
  useEffect(() => {
    const foundBook = books.find(b => b.id === bookId)
    if (foundBook) {
      setBook(foundBook)
      setTempTitle(foundBook.title)
    } else {
      router.push('/')
    }
  }, [bookId, books, router])

  const handleTitleSave = () => {
    if (book && tempTitle.trim()) {
      updateBook(book.id, { title: tempTitle.trim() })
      setIsEditingTitle(false)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave()
    if (e.key === 'Escape') {
      setTempTitle(book?.title || '')
      setIsEditingTitle(false)
    }
  }

  if (!book) {
    return (
      <PageLayout className="flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className={`w-12 h-12 border-3 ${designTokens.colors.accent} border-t-transparent ${designTokens.rounded.full} mx-auto mb-4`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className={`${designTokens.colors.textMuted} ${designTokens.typography.body}`}>
            Chargement du livre...
          </p>
        </motion.div>
      </PageLayout>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Modern Header with Canva-style design */}
      <motion.header 
  className="bg-surface border-b border-border px-6 py-4 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <motion.button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </motion.button>
            
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              
              <AnimatePresence mode="wait">
                {isEditingTitle ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={handleTitleKeyDown}
                      className="text-xl font-semibold bg-blue-50 border-2 border-blue-300 rounded-lg px-3 py-2 min-w-[300px] focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                    <motion.button
                      onClick={handleTitleSave}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Save className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 group cursor-pointer"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h1>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Edit3 className="w-4 h-4 text-blue-500" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Modification en cours
              </div>
            </motion.div>
            
            <Button
              variant="ghost" 
              size="sm"
              className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Canva-style Page Editor with enhanced loading animation */}
      <motion.div 
        className="flex-1 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <CanvaPageEditor bookId={bookId} />
      </motion.div>
    </div>
  )
}