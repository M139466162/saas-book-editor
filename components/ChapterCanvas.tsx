'use client'

import { useState } from 'react'
import { Plus, FileText, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RichTextEditor } from '@/components/RichTextEditor'
import { useSectionsStore } from '@/lib/store'
import { Section } from '@/lib/types'
import { motion } from 'framer-motion'

interface SectionEditorProps {
  section: Section
  onUpdate: (updates: Partial<Section>) => void
  onDelete: () => void
}

export function SectionEditor({ section, onUpdate, onDelete }: SectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempHeading, setTempHeading] = useState(section.heading || '')

  const handleHeadingUpdate = () => {
    if (tempHeading.trim() !== (section.heading || '')) {
      onUpdate({ heading: tempHeading.trim() || undefined })
    }
    setIsEditing(false)
  }

  const handleContentUpdate = (content: string) => {
    onUpdate({ bodyMd: content })
  }

  return (
    <Card className="group relative">
      {/* Section Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={tempHeading}
              onChange={(e) => setTempHeading(e.target.value)}
              onBlur={handleHeadingUpdate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleHeadingUpdate()
                if (e.key === 'Escape') {
                  setTempHeading(section.heading || '')
                  setIsEditing(false)
                }
              }}
              placeholder="Section heading (optional)"
              className="text-lg font-medium bg-transparent border-none outline-none text-foreground placeholder-muted-foreground flex-1"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-medium text-foreground cursor-pointer hover:text-accent transition-colors flex-1"
              onClick={() => setIsEditing(true)}
            >
              {section.heading || 'Untitled Section'}
            </h3>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="p-0">
        <RichTextEditor
          content={section.bodyMd || ''}
          onChange={handleContentUpdate}
          placeholder="Start writing this section..."
          className="border-none bg-transparent"
        />
      </div>
    </Card>
  )
}

interface ChapterCanvasProps {
  chapter: any // We'll use proper typing later
}

export function ChapterCanvas({ chapter }: ChapterCanvasProps) {
  const { sections, createSection, updateSection, deleteSection, getSectionsByChapter } = useSectionsStore()
  
  const chapterSections = getSectionsByChapter(chapter.id)

  const handleAddSection = () => {
    createSection({
      chapterId: chapter.id,
      heading: '',
      bodyMd: '',
      order: chapterSections.length,
    })
  }

  const handleSectionUpdate = (sectionId: string, updates: Partial<Section>) => {
    updateSection(sectionId, updates)
  }

  const handleSectionDelete = (sectionId: string) => {
    deleteSection(sectionId)
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chapter Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-2">{chapter.title}</h2>
        {chapter.pitch && (
          <p className="text-muted-foreground">{chapter.pitch}</p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {chapterSections.length} {chapterSections.length === 1 ? 'section' : 'sections'}
          </div>
          
          <Button onClick={handleAddSection} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>
      
      {/* Sections */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {chapterSections.length > 0 ? (
          <>
            {chapterSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
              >
                <SectionEditor
                  section={section}
                  onUpdate={(updates) => handleSectionUpdate(section.id, updates)}
                  onDelete={() => handleSectionDelete(section.id)}
                />
              </motion.div>
            ))}
            
            {/* Add Section Button */}
            <Button
              variant="outline"
              onClick={handleAddSection}
              className="w-full h-12 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Section
            </Button>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">
                Ready to write "{chapter.title}"?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Break your chapter into sections to organize your thoughts and make writing easier.
              </p>
              <Button onClick={handleAddSection}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}