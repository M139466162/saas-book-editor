'use client'

import { useState } from 'react'
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Book, Chapter, Section } from '@/lib/types'
import { generatePreviewHTML, exportToPDF } from '@/lib/export'
import { motion } from 'framer-motion'

interface BookPreviewProps {
  book: Book
  chapters: Chapter[]
  sections: Section[]
  onClose: () => void
}

export function BookPreview({ book, chapters, sections, onClose }: BookPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [isExporting, setIsExporting] = useState(false)
  
  const previewHTML = generatePreviewHTML({ book, chapters, sections })
  
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF({ book, chapters, sections })
    } catch (error) {
      console.error('Export failed:', error)
      // You could show an error message here
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleZoomIn = () => {
    if (zoom < 150) setZoom(zoom + 10)
  }
  
  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
  <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Preview: {book.title}
          </h2>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 w-12 text-center">
              {zoom}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface shadow-lg"
            style={{
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <iframe
              srcDoc={previewHTML}
              className="w-full h-full border-none"
              style={{ minHeight: '297mm' }}
              title="Book Preview"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}