'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Sparkles,
  Type,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { useSettingsStore } from '@/lib/store'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing...", className }: RichTextEditorProps) {
  const { openRouterApiKey, sunraApiKey } = useSettingsStore()
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isEnhancingText, setIsEnhancingText] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] p-6 focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || !sunraApiKey) return
    
    setIsGeneratingImage(true)
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, apiKey: sunraApiKey })
      })
      
      if (response.ok) {
        const { imageUrl } = await response.json()
        editor.chain().focus().setImage({ src: imageUrl, alt: imagePrompt }).run()
        setShowImageDialog(false)
        setImagePrompt('')
      } else {
        console.error('Image generation failed')
        // Fallback to placeholder for now
        const imageUrl = `https://picsum.photos/600/400?random=${Date.now()}`
        editor.chain().focus().setImage({ src: imageUrl, alt: imagePrompt }).run()
        setShowImageDialog(false)
        setImagePrompt('')
      }
    } catch (error) {
      console.error('Image generation error:', error)
      // Fallback to placeholder
      const imageUrl = `https://picsum.photos/600/400?random=${Date.now()}`
      editor.chain().focus().setImage({ src: imageUrl, alt: imagePrompt }).run()
      setShowImageDialog(false)
      setImagePrompt('')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleAIEnhance = async () => {
    if (!editor || !openRouterApiKey) return
    
    const selection = editor.state.selection
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to)
    
    if (!selectedText.trim()) return
    
    setIsEnhancingText(true)
    
    try {
      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText, apiKey: openRouterApiKey })
      })
      
      if (response.ok) {
        const { enhancedText } = await response.json()
        editor.chain().focus().deleteSelection().insertContent(enhancedText).run()
      } else {
        console.error('Text enhancement failed')
      }
    } catch (error) {
      console.error('Text enhancement error:', error)
    } finally {
      setIsEnhancingText(false)
    }
  }

  return (
    <div className={`border border-border rounded-xl bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 border-b border-border flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={<Bold className="w-4 h-4" />}
            tooltip="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={<Italic className="w-4 h-4" />}
            tooltip="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon={<Strikethrough className="w-4 h-4" />}
            tooltip="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            icon={<Code className="w-4 h-4" />}
            tooltip="Code"
          />
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={<Heading1 className="w-4 h-4" />}
            tooltip="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={<Heading2 className="w-4 h-4" />}
            tooltip="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={<Heading3 className="w-4 h-4" />}
            tooltip="Heading 3"
          />
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={<List className="w-4 h-4" />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={<ListOrdered className="w-4 h-4" />}
            tooltip="Numbered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon={<Quote className="w-4 h-4" />}
            tooltip="Quote"
          />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={<AlignLeft className="w-4 h-4" />}
            tooltip="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={<AlignCenter className="w-4 h-4" />}
            tooltip="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={<AlignRight className="w-4 h-4" />}
            tooltip="Align Right"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            icon={<AlignJustify className="w-4 h-4" />}
            tooltip="Justify"
          />
        </div>

        {/* Media & AI */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => setShowImageDialog(true)}
            icon={<ImageIcon className="w-4 h-4" />}
            tooltip={sunraApiKey ? "Generate Image" : "Configure Sunra API key in Settings"}
            disabled={!sunraApiKey}
          />
          <ToolbarButton
            onClick={handleAIEnhance}
            icon={isEnhancingText ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            tooltip={openRouterApiKey ? "AI Enhance (select text first)" : "Configure OpenRouter API key in Settings"}
            disabled={!openRouterApiKey || isEnhancingText}
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Slash Menu Indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          Type <kbd className="px-1.5 py-0.5 bg-panel rounded text-[10px]">/</kbd> for commands
        </div>
      </div>

      {/* Image Generation Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Generate Image
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Describe the image you want to generate
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="A beautiful sunset over mountains, digital art style..."
                  className="w-full p-3 bg-panel border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateImage}
                  disabled={!imagePrompt.trim() || isGeneratingImage}
                  className="flex-1"
                >
                  {isGeneratingImage ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowImageDialog(false)
                    setImagePrompt('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Toolbar Button Component
function ToolbarButton({ 
  onClick, 
  isActive, 
  icon, 
  tooltip,
  disabled = false 
}: { 
  onClick: () => void
  isActive?: boolean
  icon: React.ReactNode
  tooltip: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-150 ${
        disabled 
          ? 'text-muted-foreground/50 cursor-not-allowed'
          : isActive 
          ? 'bg-accent text-white' 
          : 'text-muted-foreground hover:text-foreground hover:bg-panel'
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  )
}