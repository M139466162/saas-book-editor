'use client'

import { useState, useCallback } from 'react'
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core'
import { 
  SortableContext, 
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Quote, 
  List, 
  Minus,
  Palette,
  Move,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ContentBlock, BlockType, AnyBlock } from '@/lib/block-types'
import { BlockEditor } from '@/components/BlockEditor'
import { motion, AnimatePresence } from 'framer-motion'

interface CanvaChapterEditorProps {
  chapterId: string
  title: string
  blocks: ContentBlock[]
  onBlocksChange: (blocks: ContentBlock[]) => void
}

export function CanvaChapterEditor({ chapterId, title, blocks, onBlocksChange }: CanvaChapterEditorProps) {
  const [activeBlock, setActiveBlock] = useState<ContentBlock | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event: any) => {
    const { active } = event
    setActiveBlock(blocks.find(block => block.id === active.id) || null)
  }, [blocks])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveBlock(null)

    if (!over) return

    if (active.id !== over.id) {
      const activeIndex = blocks.findIndex(block => block.id === active.id)
      const overIndex = blocks.findIndex(block => block.id === over.id)

      const newBlocks = [...blocks]
      const [reorderedBlock] = newBlocks.splice(activeIndex, 1)
      newBlocks.splice(overIndex, 0, reorderedBlock)

      // Update order
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index
      }))

      onBlocksChange(updatedBlocks)
    }
  }, [blocks, onBlocksChange])

  const createBlock = (type: BlockType): ContentBlock => {
    const baseBlock = {
      id: crypto.randomUUID(),
      type,
      order: blocks.length,
      x: 0,
      y: 0,
      width: 100,
      height: 60,
    }

    switch (type) {
      case 'text':
        return {
          ...baseBlock,
          content: {
            text: 'Start typing your content here...',
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
      case 'heading':
        return {
          ...baseBlock,
          content: {
            text: 'Your heading here',
            level: 2,
            style: {
              textAlign: 'left',
              color: '#ffffff'
            }
          }
        }
      case 'image':
        return {
          ...baseBlock,
          content: {
            src: 'https://picsum.photos/600/400',
            alt: 'Image',
            caption: '',
            style: {
              objectFit: 'cover',
              borderRadius: 8
            }
          }
        }
      case 'quote':
        return {
          ...baseBlock,
          content: {
            text: 'Your inspiring quote goes here...',
            author: '',
            style: {
              textAlign: 'left',
              color: '#ffffff',
              borderColor: '#6366f1'
            }
          }
        }
      case 'list':
        return {
          ...baseBlock,
          content: {
            items: ['First item', 'Second item', 'Third item'],
            ordered: false,
            style: {
              color: '#ffffff'
            }
          }
        }
      case 'divider':
        return {
          ...baseBlock,
          height: 20,
          content: {
            style: {
              color: '#4b5563',
              thickness: 2
            }
          }
        }
      default:
        throw new Error(`Unknown block type: ${type}`)
    }
  }

  const addBlock = (type: BlockType) => {
    const newBlock = createBlock(type)
    onBlocksChange([...blocks, newBlock])
    setShowBlockMenu(false)
  }

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    )
    onBlocksChange(updatedBlocks)
  }

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }))
    onBlocksChange(updatedBlocks)
    setSelectedBlockId(null)
  }

  const blockTypes = [
    { type: 'text' as BlockType, icon: Type, label: 'Text', description: 'Add a paragraph of text' },
    { type: 'heading' as BlockType, icon: Type, label: 'Heading', description: 'Add a section heading' },
    { type: 'image' as BlockType, icon: ImageIcon, label: 'Image', description: 'Add an image' },
    { type: 'quote' as BlockType, icon: Quote, label: 'Quote', description: 'Add a quote or callout' },
    { type: 'list' as BlockType, icon: List, label: 'List', description: 'Add a bulleted or numbered list' },
    { type: 'divider' as BlockType, icon: Minus, label: 'Divider', description: 'Add a horizontal line' },
  ]

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-surface/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Palette className="w-4 h-4" />
              Style
            </Button>
            <Button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Block
            </Button>
          </div>
        </div>

        {/* Block Menu */}
        <AnimatePresence>
          {showBlockMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-panel rounded-lg border border-border"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {blockTypes.map(({ type, icon: Icon, label, description }) => (
                  <Button
                    key={type}
                    variant="ghost"
                    onClick={() => addBlock(type)}
                    className="h-auto p-3 flex flex-col items-start gap-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{description}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map(block => block.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="max-w-4xl mx-auto space-y-4">
              {blocks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    Start creating your chapter
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add blocks to build your content visually
                  </p>
                  <Button onClick={() => addBlock('text')} className="gap-2">
                    <Type className="w-4 h-4" />
                    Add Text Block
                  </Button>
                </div>
              ) : (
                blocks.map((block) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))
              )}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeBlock ? (
              <Card className="p-4 opacity-80 rotate-2 shadow-2xl">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4" />
                  <span className="font-medium capitalize">{activeBlock.type} Block</span>
                </div>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}