'use client'

import { useState, useEffect } from 'react'
import { useSectionsStore } from '@/lib/store'
import { Chapter } from '@/lib/types'
import { ContentBlock } from '@/lib/block-types'
import { CanvaChapterEditor } from '@/components/CanvaChapterEditor'

interface CanvaChapterCanvasProps {
  chapter: Chapter
}

export function CanvaChapterCanvas({ chapter }: CanvaChapterCanvasProps) {
  const { sections, createSection, updateSection, deleteSection, getSectionsByChapter } = useSectionsStore()
  const [blocks, setBlocks] = useState<ContentBlock[]>([])

  const chapterSections = getSectionsByChapter(chapter.id)

  // Convert sections to blocks on component mount
  useEffect(() => {
    if (chapterSections.length === 0) {
      // Create default text block if no sections exist
      const defaultBlocks: ContentBlock[] = [{
        id: crypto.randomUUID(),
        type: 'text',
        order: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 60,
        content: {
          text: 'Start writing your chapter content here...',
          style: {
            fontSize: 16,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left',
            color: '#ffffff',
            lineHeight: 1.6
          }
        }
      }]
      setBlocks(defaultBlocks)
      
      // Save the default block as a section
      createSection({
        chapterId: chapter.id,
        heading: '',
        bodyMd: 'Start writing your chapter content here...',
        order: 0
      })
    } else {
      // Convert existing sections to blocks
      const convertedBlocks: ContentBlock[] = chapterSections.map((section, index) => {
        // Try to parse existing content as block data, fallback to text block
        let blockData: ContentBlock
        
        try {
          // Check if content is stored as JSON block data
          const parsedContent = JSON.parse(section.bodyMd || '{}')
          if (parsedContent.type && parsedContent.content) {
            blockData = {
              id: section.id,
              type: parsedContent.type,
              order: index,
              x: parsedContent.x || 0,
              y: parsedContent.y || 0,
              width: parsedContent.width || 100,
              height: parsedContent.height || 60,
              content: parsedContent.content
            }
          } else {
            throw new Error('Not block data')
          }
        } catch {
          // Fallback to text block
          blockData = {
            id: section.id,
            type: 'text',
            order: index,
            x: 0,
            y: 0,
            width: 100,
            height: 60,
            content: {
              text: section.bodyMd || 'Empty section...',
              style: {
                fontSize: 16,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textAlign: 'left',
                color: '#ffffff',
                lineHeight: 1.6
              }
            }
          }
        }
        
        return blockData
      })
      setBlocks(convertedBlocks)
    }
  }, [chapterSections, chapter.id, createSection])

  const handleBlocksChange = (updatedBlocks: ContentBlock[]) => {
    setBlocks(updatedBlocks)
    
    // Get current section IDs
    const currentSectionIds = chapterSections.map(s => s.id)
    const updatedBlockIds = updatedBlocks.map(b => b.id)
    
    // Save blocks as sections
    updatedBlocks.forEach((block, index) => {
      const existingSection = sections.find(s => s.id === block.id)
      
      // Prepare content based on block type
      let bodyContent: string
      if (block.type === 'text') {
        bodyContent = block.content.text
      } else {
        // Store full block data as JSON for non-text blocks
        bodyContent = JSON.stringify({
          type: block.type,
          x: block.x,
          y: block.y,
          width: block.width,
          height: block.height,
          content: block.content
        })
      }
      
      if (existingSection) {
        // Update existing section
        updateSection(block.id, {
          heading: block.type === 'heading' ? block.content.text : undefined,
          bodyMd: bodyContent,
          order: index
        })
      } else {
        // Create new section
        createSection({
          chapterId: chapter.id,
          heading: block.type === 'heading' ? block.content.text : undefined,
          bodyMd: bodyContent,
          order: index
        })
      }
    })

    // Remove sections that no longer exist in blocks
    currentSectionIds.forEach(sectionId => {
      if (!updatedBlockIds.includes(sectionId)) {
        deleteSection(sectionId)
      }
    })
  }

  return (
    <CanvaChapterEditor
      chapterId={chapter.id}
      title={chapter.title}
      blocks={blocks}
      onBlocksChange={handleBlocksChange}
    />
  )
}