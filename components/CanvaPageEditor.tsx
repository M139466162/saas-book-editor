'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Download, 
  Plus, 
  Settings,
  Type,
  ImageIcon,
  Quote,
  List,
  Minus,
  Edit3
} from 'lucide-react'
import { useChaptersStore } from '@/lib/store'
import { useSectionsStore } from '@/lib/store'
import { useBooksStore } from '@/lib/store'
import { BookPreview } from '@/components/BookPreview'
import { NotificationContainer, useNotifications } from '@/components/NotificationSystem'
import { Chapter } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface CanvaPageEditorProps {
  bookId: string
}

export function CanvaPageEditor({ bookId }: CanvaPageEditorProps) {
  const { chapters, createChapter } = useChaptersStore()
  const { sections } = useSectionsStore()
  const { books } = useBooksStore()
  const { addNotification } = useNotifications()
  
  const [bookChapters, setBookChapters] = useState<Chapter[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [showPreview, setShowPreview] = useState(false)
  
  const book = books.find(b => b.id === bookId)

  useEffect(() => {
    const bookChapters = chapters.filter(c => c.bookId === bookId).sort((a, b) => a.order - b.order)
    setBookChapters(bookChapters)
  }, [bookId, chapters])

  const currentChapter = bookChapters[currentPageIndex]

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPageIndex < bookChapters.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(Math.min(200, zoom + 10))
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(Math.max(50, zoom - 10))
  }

  const handleExportPDF = async () => {
    if (!book) return
    
    addNotification({
      type: 'info',
      title: 'Export en cours...',
      message: 'Génération du PDF en cours...',
      duration: 2000
    })

    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          bookId,
          title: book.title,
          chapters: bookChapters,
          sections: sections.filter(s => bookChapters.some(c => c.id === s.chapterId))
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${book.title}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        addNotification({
          type: 'success',
          title: 'Export réussi !',
          message: `${book.title}.html a été téléchargé`,
          duration: 3000
        })
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export failed:', error)
      addNotification({
        type: 'error',
        title: 'Échec de l\'export',
        message: 'Une erreur est survenue lors de la génération du PDF',
        duration: 5000
      })
    }
  }

  const handleAddPage = () => {
    const newChapter = createChapter({
      bookId,
      title: `Page ${bookChapters.length + 1}`,
      order: bookChapters.length,
    })
    setCurrentPageIndex(bookChapters.length) // Go to the new page
    
    addNotification({
      type: 'success',
      title: 'Nouvelle page créée',
      message: `Page ${bookChapters.length + 1} ajoutée au livre`,
      duration: 2000
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Page Navigation Group */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="h-8 w-8 p-0 disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all"
                title="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Page</span>
                <span className="text-sm font-semibold text-blue-600 min-w-[20px] text-center">
                  {currentPageIndex + 1}
                </span>
                <span className="text-sm text-gray-400">sur</span>
                <span className="text-sm text-gray-600 min-w-[20px] text-center">
                  {bookChapters.length}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPageIndex === bookChapters.length - 1}
                className="h-8 w-8 p-0 disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all"
                title="Page suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Content Tools Group */}
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-white hover:shadow-sm transition-all" 
                title="Ajouter du texte"
              >
                <Type className="w-4 h-4" />
                <span className="ml-1 text-xs hidden sm:inline">Texte</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-white hover:shadow-sm transition-all" 
                title="Ajouter une image"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="ml-1 text-xs hidden sm:inline">Image</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-white hover:shadow-sm transition-all" 
                title="Ajouter une citation"
              >
                <Quote className="w-4 h-4" />
                <span className="ml-1 text-xs hidden sm:inline">Citation</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-white hover:shadow-sm transition-all" 
                title="Ajouter une liste"
              >
                <List className="w-4 h-4" />
                <span className="ml-1 text-xs hidden sm:inline">Liste</span>
              </Button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-white hover:shadow-sm transition-all" 
                title="Ajouter un séparateur"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom Controls Group */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-8 w-8 p-0 disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all"
                title="Zoom arrière"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium text-gray-700 min-w-[45px] text-center bg-white px-2 py-1 rounded border">
                {zoom}%
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="h-8 w-8 p-0 disabled:opacity-30 hover:bg-white hover:shadow-sm transition-all"
                title="Zoom avant"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExportPDF}
                className="px-4 py-2 hover:bg-green-50 hover:text-green-600 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-all"
                title="Paramètres"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Canvas Area */}
      <motion.div 
        className="flex-1 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Page Thumbnails Sidebar */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col shadow-inner">
          <div className="p-4 bg-white border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Pages du livre</h3>
            <p className="text-xs text-gray-500">{bookChapters.length} page{bookChapters.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {bookChapters.map((chapter, index) => (
              <PageThumbnail
                key={chapter.id}
                chapter={chapter}
                index={index}
                isSelected={index === currentPageIndex}
                onClick={() => setCurrentPageIndex(index)}
              />
            ))}
            
            {/* Add Page Button */}
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPage}
                className="w-full h-28 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
              >
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium">
                  Nouvelle page
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <div className="flex justify-center">
            <motion.div
              className="bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{
                width: `${(210 * zoom) / 100}mm`, // A4 width
                minHeight: `${(297 * zoom) / 100}mm`, // A4 height
              }}
              animate={{ scale: zoom / 100 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Page Shadow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-200/20 pointer-events-none rounded-lg"></div>
              
              {currentChapter ? (
                <EditablePage chapter={currentChapter} />
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune page sélectionnée</h3>
                    <p className="text-gray-500 mb-4">Sélectionnez une page ou créez-en une nouvelle</p>
                    <Button onClick={handleAddPage} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une page
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      {showPreview && book && (
        <BookPreview
          book={book}
          chapters={bookChapters}
          sections={sections.filter(s => bookChapters.some(c => c.id === s.chapterId))}
          onClose={() => setShowPreview(false)}
        />
      )}
      
      {/* Notification System */}
      <NotificationContainer />
    </div>
  )
}

// Page Thumbnail Component
function PageThumbnail({ 
  chapter, 
  index, 
  isSelected, 
  onClick 
}: {
  chapter: Chapter
  index: number
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'scale-105' 
          : 'hover:scale-102'
      }`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`p-3 rounded-xl transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-50 border-2 border-blue-200 shadow-lg shadow-blue-100' 
          : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}>
        {/* Page Preview */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm aspect-[210/297] p-3 mb-3 relative overflow-hidden">
          {/* Page Number Badge */}
          <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {index + 1}
          </div>
          
          {/* Content Preview */}
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-sm w-3/4"></div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 rounded-sm w-full"></div>
              <div className="h-1 bg-gray-300 rounded-sm w-5/6"></div>
              <div className="h-1 bg-gray-300 rounded-sm w-4/5"></div>
            </div>
          </div>
        </div>
        
        {/* Page Info */}
        <div className="space-y-1">
          <h4 className={`text-xs font-semibold truncate ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {chapter.title}
          </h4>
          <p className="text-xs text-gray-500">
            Page {index + 1}
          </p>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r"></div>
        )}
      </div>
    </motion.div>
  )
}

// Editable Page Component
function EditablePage({ chapter }: { chapter: Chapter }) {
  const { sections } = useSectionsStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [focusedElement, setFocusedElement] = useState<string | null>(null)

  const chapterSections = sections.filter(s => s.chapterId === chapter.id)

  return (
    <div className="h-full p-8 relative">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <motion.div
          className={`group relative ${isEditingTitle ? 'editing' : ''}`}
          whileHover={{ y: -1 }}
        >
          <h1 
            className={`text-3xl font-bold text-gray-900 cursor-text transition-all duration-200 ${
              isEditingTitle 
                ? 'bg-blue-50 border-2 border-blue-300 rounded-lg p-3 shadow-sm' 
                : 'hover:bg-gray-50 rounded-lg p-3 border-2 border-transparent hover:border-gray-200'
            }`}
            contentEditable
            suppressContentEditableWarning={true}
            onFocus={() => {
              setIsEditingTitle(true)
              setFocusedElement('title')
            }}
            onBlur={() => {
              setIsEditingTitle(false)
              setFocusedElement(null)
            }}
            data-placeholder="Titre du chapitre..."
          >
            {chapter.title}
          </h1>
          
          {/* Edit Indicator */}
          <AnimatePresence>
            {!isEditingTitle && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg">
                  Cliquer pour modifier
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chapter Content */}
      <div className="space-y-6">
        {chapterSections.map((section) => (
          <motion.div 
            key={section.id}
            className="group relative"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div 
              className={`text-gray-800 leading-relaxed cursor-text transition-all duration-200 relative ${
                focusedElement === section.id 
                  ? 'bg-blue-50 border-2 border-blue-300 rounded-lg p-4 shadow-sm' 
                  : 'hover:bg-gray-50 rounded-lg p-4 border-2 border-transparent hover:border-gray-200'
              }`}
              contentEditable
              suppressContentEditableWarning={true}
              onFocus={() => setFocusedElement(section.id)}
              onBlur={() => setFocusedElement(null)}
              data-placeholder="Commencez à écrire..."
            >
              {section.bodyMd}
            </div>

            {/* Floating Toolbar */}
            <AnimatePresence>
              {focusedElement === section.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1"
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Gras">
                    <strong className="text-xs">B</strong>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Italique">
                    <em className="text-xs">I</em>
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Citation">
                    <Quote className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Liste">
                    <List className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Add Content Button */}
        {chapterSections.length === 0 && (
          <motion.div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-100 transition-colors">
              <Type className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2 group-hover:text-blue-600">
              Commencez à écrire
            </h3>
            <p className="text-gray-500 group-hover:text-blue-500">
              Cliquez pour ajouter du contenu à cette page
            </p>
          </motion.div>
        )}
      </div>

      {/* Page Number */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
        Page {chapter.order + 1}
      </div>
    </div>
  )
}