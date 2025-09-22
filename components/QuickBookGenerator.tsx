'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  Book, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useBooksStore, useChaptersStore, useSectionsStore, useSettingsStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

interface QuickBookGeneratorProps {
  onClose: () => void
  templateId?: string
  templateTitle?: string
  templateDescription?: string
}

export function QuickBookGenerator({ 
  onClose, 
  templateId, 
  templateTitle, 
  templateDescription 
}: QuickBookGeneratorProps) {
  const router = useRouter()
  const { createBook } = useBooksStore()
  const { createChapter } = useChaptersStore()
  const { createSection } = useSectionsStore()
  const { openRouterApiKey, sunraApiKey } = useSettingsStore()
  
  const [title, setTitle] = useState(templateTitle || '')
  const [description, setDescription] = useState(templateDescription || '')
  const [generateContent, setGenerateContent] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [generatedBook, setGeneratedBook] = useState<any>(null)

  const handleGenerate = async () => {
    if (!title.trim()) return

    setIsGenerating(true)
    setProgress(0)
    
    try {
      if (!generateContent) {
        // Simple book creation without AI generation
        setCurrentStep('📚 Creating your book...')
        setProgress(50)
        
        const savedBook = createBook({
          title: title.trim(),
          subtitle: description || undefined,
          author: 'Author',
          language: 'fr',
          audience: 'general'
        })
        
        setProgress(100)
        setCurrentStep('✅ Book created successfully!')
        setGeneratedBook(savedBook)
        
        setTimeout(() => {
          router.push(`/book/${savedBook.id}`)
        }, 1500)
        
      } else {
        // AI-powered generation
        if (!openRouterApiKey) return
        
        setCurrentStep('Initializing book generation...')

        // Step 1: Generate complete book
        setProgress(25)
        setCurrentStep('🤖 Generating chapters and content...')
        
        const response = await fetch('/api/generate-book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            template: templateId,
            apiKey: openRouterApiKey,
            sunraApiKey
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.details || errorData.error || 'Failed to generate book')
        }

        const { book } = await response.json()
        setProgress(75)
        setCurrentStep('📚 Saving book structure...')

        // Step 2: Save to store
        const savedBook = createBook({
          title: book.title,
          subtitle: book.subtitle,
          author: book.author,
          language: book.language,
          audience: book.audience,
          coverUrl: book.coverUrl
        })

        // Step 3: Create chapters and sections
        setProgress(90)
        setCurrentStep('📝 Creating chapters and content...')
        
        for (const chapter of book.chapters) {
          const newChapter = createChapter({
            bookId: savedBook.id,
            title: chapter.title,
            order: chapter.order,
            pitch: chapter.pitch
          })

          // Create a section for the chapter content
          createSection({
            chapterId: newChapter.id,
            heading: chapter.title,
            bodyMd: chapter.content,
            order: 1
          })
        }

        setProgress(100)
        setCurrentStep('✅ Book generated successfully!')
        setGeneratedBook(savedBook)

        // Auto redirect after 2 seconds
        setTimeout(() => {
          router.push(`/book/${savedBook.id}`)
        }, 2000)
      }

    } catch (error) {
      console.error('Book creation error:', error)
      setCurrentStep(`❌ ${error instanceof Error ? error.message : 'Creation failed. Please try again.'}`)
    }
  }

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="p-8 w-full max-w-md">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              {progress === 100 ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              )}
            </motion.div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
              {progress === 100 ? 'Book Generated!' : 'Generating Your Book'}
            </h3>

            <p className="text-muted-foreground mb-6 text-sm">
              {currentStep}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-panel rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-accent h-2 rounded-full"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {progress}% complete
            </p>

            {progress === 100 && generatedBook && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
              >
                <p className="text-sm text-green-400">
                  Redirecting to your new book...
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Create Book
              </h3>
              <p className="text-sm text-muted-foreground">
                Create a new book or generate one with AI
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Book Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your book title..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description to guide content generation..."
              className="w-full p-3 bg-panel border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Generation Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Creation Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-panel/50">
                <input
                  type="radio"
                  name="generateContent"
                  checked={!generateContent}
                  onChange={() => setGenerateContent(false)}
                  className="text-accent"
                />
                <div>
                  <div className="font-medium text-foreground">Empty Book</div>
                  <div className="text-sm text-muted-foreground">Create an empty book structure to write yourself</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-panel/50">
                <input
                  type="radio"
                  name="generateContent"
                  checked={generateContent}
                  onChange={() => setGenerateContent(true)}
                  className="text-accent"
                />
                <div>
                  <div className="font-medium text-foreground">AI Generated</div>
                  <div className="text-sm text-muted-foreground">Generate complete book content with AI (2-3 minutes)</div>
                </div>
              </label>
            </div>
          </div>

          {/* API Status */}
          {generateContent && (
            <div className="p-3 bg-panel/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${openRouterApiKey ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-muted-foreground">
                    OpenRouter: {openRouterApiKey ? 'Connected' : 'Not configured'}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <ImageIcon className="w-3 h-3" />
                  <div className={`w-2 h-2 rounded-full ${sunraApiKey ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-muted-foreground">
                    Cover: {sunraApiKey ? 'Auto-generate' : 'Skip'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {generateContent && !openRouterApiKey && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Configure your OpenRouter API key in Paramètres to enable AI generation.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!title.trim() || (generateContent && !openRouterApiKey)}
            className="flex-1 gap-2"
          >
            <Book className="w-4 h-4" />
            {generateContent ? 'Generate Book' : 'Create Book'}
          </Button>
        </div>
      </Card>
    </div>
  )
}