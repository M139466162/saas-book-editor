'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Book, Users, Briefcase, Heart, Zap, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useTemplatesStore, useBooksStore } from '@/lib/store'
import { Template } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout, AppHeader, ContentContainer, StyledCard, ModernButton, designTokens } from '@/components/ui/DesignSystem'

const categoryIcons = {
  'how-to': FileText,
  'business': Briefcase,
  'fiction': Book,
  'memoir': Heart,
  'academic': Users,
  'self-help': Zap,
} as const

const categoryLabels = {
  'how-to': 'How-To & Guides',
  'business': 'Business',
  'fiction': 'Fiction',
  'memoir': 'Memoir & Biography', 
  'academic': 'Academic',
  'self-help': 'Self-Help',
} as const

export default function TemplatesPage() {
  const router = useRouter()
  const { templates, searchTemplates } = useTemplatesStore()
  const { addBook } = useBooksStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Get unique categories from templates
  const categories = Array.from(new Set(templates.map(t => t.category)))

  const handleUseTemplate = (template: Template) => {
    // Create a new book based on the template
    const newBook = {
      id: crypto.randomUUID(),
      title: `My ${template.name}`,
      subtitle: '',
      author: '',
      language: 'en',
      audience: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add the book to the store
    addBook(newBook)
    
    // Close the modal and navigate to the book editor
    setPreviewTemplate(null)
    router.push(`/book/${newBook.id}`)
  }

  return (
    <PageLayout>
      <AppHeader
        title="Modèles de livres"
        subtitle="Commencez avec une structure éprouvée pour votre livre"
        backButton={{
          label: "Accueil",
          onClick: () => router.push('/')
        }}
      />

      <ContentContainer>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${designTokens.colors.textMuted} w-4 h-4`} />
            <Input
              placeholder="Rechercher des modèles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <ModernButton
              variant={selectedCategory === null ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Toutes catégories
            </ModernButton>
            {categories.map(category => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons]
              return (
                <ModernButton
                  key={category}
                  variant={selectedCategory === category ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  icon={Icon && <Icon className="w-4 h-4" />}
                >
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </ModernButton>
              )
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTemplates.map((template, index) => {
              const Icon = categoryIcons[template.category as keyof typeof categoryIcons] || FileText
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                >
                  <Card className="p-6 hover:bg-surface-hover transition-colors cursor-pointer group"
                        onClick={() => setPreviewTemplate(template)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {categoryLabels[template.category as keyof typeof categoryLabels]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{template.estimatedTime}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 rounded text-xs bg-surface text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 2 && (
                          <span className="px-2 py-1 rounded text-xs text-muted-foreground">
                            +{template.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {template.structure.chapters.length} chapters
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory 
                ? "Try adjusting your search or filters to find more templates."
                : "Templates help you get started with proven book structures."}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Template Preview Modal */}
        <AnimatePresence>
          {previewTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-surface rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      {(() => {
                        const Icon = categoryIcons[previewTemplate.category as keyof typeof categoryIcons] || FileText
                        return <Icon className="w-6 h-6 text-accent" />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">
                        {previewTemplate.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {categoryLabels[previewTemplate.category as keyof typeof categoryLabels]} • {previewTemplate.estimatedTime}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewTemplate(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>

                <p className="text-foreground mb-6">
                  {previewTemplate.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {previewTemplate.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-sm bg-panel text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Structure Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">Structure Preview</h3>
                  <div className="space-y-2">
                    {previewTemplate.structure.chapters.map((chapter, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-panel">
                        <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-medium text-accent">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{chapter.title}</h4>
                          {chapter.description && (
                            <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
                          )}
                          {chapter.sections && chapter.sections.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {chapter.sections.map((section, sIndex) => (
                                <div key={sIndex} className="text-sm text-muted-foreground pl-4 border-l border-border">
                                  {section.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleUseTemplate(previewTemplate)}
                    className="flex-1"
                  >
                    Use This Template
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentContainer>
    </PageLayout>
  )
}