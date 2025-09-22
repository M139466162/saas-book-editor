'use client'

import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  GripVertical, 
  Trash2, 
  Edit3, 
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ContentBlock, AnyBlock } from '@/lib/block-types'
import { motion } from 'framer-motion'

interface BlockEditorProps {
  block: ContentBlock
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<ContentBlock>) => void
  onDelete: () => void
}

export function BlockEditor({ block, isSelected, onSelect, onUpdate, onDelete }: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showStylePanel, setShowStylePanel] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleContentUpdate = (newContent: any) => {
    onUpdate({ content: newContent })
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockContent block={block as any} onUpdate={handleContentUpdate} isEditing={isEditing} />
      case 'heading':
        return <HeadingBlockContent block={block as any} onUpdate={handleContentUpdate} isEditing={isEditing} />
      case 'image':
        return <ImageBlockContent block={block as any} onUpdate={handleContentUpdate} isEditing={isEditing} />
      case 'quote':
        return <QuoteBlockContent block={block as any} onUpdate={handleContentUpdate} isEditing={isEditing} />
      case 'list':
        return <ListBlockContent block={block as any} onUpdate={handleContentUpdate} isEditing={isEditing} />
      case 'divider':
        return <DividerBlockContent block={block as any} onUpdate={handleContentUpdate} />
      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative ${isDragging ? 'z-50' : ''}`}
      onClick={onSelect}
    >
      <Card className={`transition-all duration-200 ${
        isSelected ? 'ring-2 ring-accent shadow-lg' : 'hover:shadow-md'
      } ${isDragging ? 'shadow-2xl rotate-2' : ''}`}>
        
        {/* Block Toolbar */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 left-0 flex items-center gap-1 bg-surface border border-border rounded-lg p-1 shadow-lg z-10"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 cursor-grab"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowStylePanel(!showStylePanel)}
            >
              <Palette className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
              onClick={onDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </motion.div>
        )}

        {/* Block Content */}
        <div className="p-6">
          {renderBlockContent()}
        </div>

        {/* Style Panel */}
        {showStylePanel && isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-full left-0 mt-2 p-4 bg-surface border border-border rounded-lg shadow-lg z-20 min-w-[300px]"
          >
            <StylePanel block={block} onUpdate={onUpdate} />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

// Individual block content components
function TextBlockContent({ block, onUpdate, isEditing }: any) {
  if (isEditing) {
    return (
      <textarea
        value={block.content.text}
        onChange={(e) => onUpdate({ ...block.content, text: e.target.value })}
        className="w-full min-h-[120px] bg-transparent border-none resize-none focus:outline-none text-foreground"
        style={{
          fontSize: block.content.style.fontSize,
          fontWeight: block.content.style.fontWeight,
          fontStyle: block.content.style.fontStyle,
          textAlign: block.content.style.textAlign,
          color: block.content.style.color,
          lineHeight: block.content.style.lineHeight
        }}
        autoFocus
      />
    )
  }

  return (
    <div
      className="whitespace-pre-wrap"
      style={{
        fontSize: block.content.style.fontSize,
        fontWeight: block.content.style.fontWeight,
        fontStyle: block.content.style.fontStyle,
        textAlign: block.content.style.textAlign,
        color: block.content.style.color,
        lineHeight: block.content.style.lineHeight
      }}
    >
      {block.content.text}
    </div>
  )
}

function HeadingBlockContent({ block, onUpdate, isEditing }: any) {
  const HeadingTag = `h${block.content.level}` as keyof JSX.IntrinsicElements

  if (isEditing) {
    return (
      <input
        value={block.content.text}
        onChange={(e) => onUpdate({ ...block.content, text: e.target.value })}
        className="w-full bg-transparent border-none focus:outline-none text-foreground text-2xl font-semibold"
        style={{
          textAlign: block.content.style.textAlign,
          color: block.content.style.color
        }}
        autoFocus
      />
    )
  }

  return (
    <HeadingTag
      className="m-0"
      style={{
        textAlign: block.content.style.textAlign,
        color: block.content.style.color
      }}
    >
      {block.content.text}
    </HeadingTag>
  )
}

function ImageBlockContent({ block, onUpdate, isEditing }: any) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <Input
          value={block.content.src}
          onChange={(e) => onUpdate({ ...block.content, src: e.target.value })}
          placeholder="Image URL"
        />
        <Input
          value={block.content.alt}
          onChange={(e) => onUpdate({ ...block.content, alt: e.target.value })}
          placeholder="Alt text"
        />
        <Input
          value={block.content.caption || ''}
          onChange={(e) => onUpdate({ ...block.content, caption: e.target.value })}
          placeholder="Caption (optional)"
        />
      </div>
    )
  }

  return (
    <div className="text-center">
      <img
        src={block.content.src}
        alt={block.content.alt}
        className="max-w-full h-auto mx-auto"
        style={{
          objectFit: block.content.style.objectFit,
          borderRadius: block.content.style.borderRadius
        }}
      />
      {block.content.caption && (
        <p className="mt-2 text-sm text-muted-foreground">{block.content.caption}</p>
      )}
    </div>
  )
}

function QuoteBlockContent({ block, onUpdate, isEditing }: any) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <textarea
          value={block.content.text}
          onChange={(e) => onUpdate({ ...block.content, text: e.target.value })}
          className="w-full min-h-[80px] bg-transparent border-none resize-none focus:outline-none"
          placeholder="Quote text"
        />
        <Input
          value={block.content.author || ''}
          onChange={(e) => onUpdate({ ...block.content, author: e.target.value })}
          placeholder="Author (optional)"
        />
      </div>
    )
  }

  return (
    <blockquote
      className="border-l-4 pl-4 italic"
      style={{
        borderColor: block.content.style.borderColor,
        textAlign: block.content.style.textAlign,
        color: block.content.style.color
      }}
    >
      <p className="mb-2">{block.content.text}</p>
      {block.content.author && (
        <cite className="text-sm opacity-75">— {block.content.author}</cite>
      )}
    </blockquote>
  )
}

function ListBlockContent({ block, onUpdate, isEditing }: any) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={block.content.ordered ? 'outline' : 'default'}
            size="sm"
            onClick={() => onUpdate({ ...block.content, ordered: false })}
          >
            Bulleted
          </Button>
          <Button
            variant={block.content.ordered ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdate({ ...block.content, ordered: true })}
          >
            Numbered
          </Button>
        </div>
        {block.content.items.map((item: string, index: number) => (
          <Input
            key={index}
            value={item}
            onChange={(e) => {
              const newItems = [...block.content.items]
              newItems[index] = e.target.value
              onUpdate({ ...block.content, items: newItems })
            }}
            placeholder={`Item ${index + 1}`}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate({ 
            ...block.content, 
            items: [...block.content.items, 'New item'] 
          })}
        >
          Add Item
        </Button>
      </div>
    )
  }

  const ListTag = block.content.ordered ? 'ol' : 'ul'
  
  return (
    <ListTag style={{ color: block.content.style.color }}>
      {block.content.items.map((item: string, index: number) => (
        <li key={index} className="mb-1">{item}</li>
      ))}
    </ListTag>
  )
}

function DividerBlockContent({ block, onUpdate }: any) {
  return (
    <hr
      className="border-0 mx-auto"
      style={{
        height: block.content.style.thickness,
        backgroundColor: block.content.style.color,
        width: '100%'
      }}
    />
  )
}

function StylePanel({ block, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Style Options</h4>
      
      {block.type === 'text' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={block.content.style.fontWeight === 'bold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({
                content: {
                  ...block.content,
                  style: {
                    ...block.content.style,
                    fontWeight: block.content.style.fontWeight === 'bold' ? 'normal' : 'bold'
                  }
                }
              })}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={block.content.style.fontStyle === 'italic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({
                content: {
                  ...block.content,
                  style: {
                    ...block.content.style,
                    fontStyle: block.content.style.fontStyle === 'italic' ? 'normal' : 'italic'
                  }
                }
              })}
            >
              <Italic className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((align) => (
              <Button
                key={align}
                variant={block.content.style.textAlign === align ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({
                  content: {
                    ...block.content,
                    style: {
                      ...block.content.style,
                      textAlign: align
                    }
                  }
                })}
              >
                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                {align === 'right' && <AlignRight className="w-4 h-4" />}
              </Button>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Font Size</label>
            <input
              type="range"
              min="12"
              max="32"
              value={block.content.style.fontSize}
              onChange={(e) => onUpdate({
                content: {
                  ...block.content,
                  style: {
                    ...block.content.style,
                    fontSize: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{block.content.style.fontSize}px</span>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Color</label>
        <input
          type="color"
          value={block.content.style?.color || '#ffffff'}
          onChange={(e) => onUpdate({
            content: {
              ...block.content,
              style: {
                ...block.content.style,
                color: e.target.value
              }
            }
          })}
          className="w-full h-10 rounded border border-border"
        />
      </div>
    </div>
  )
}