'use client'

import { Book } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { Calendar, BookOpen, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface BookCardProps {
  book: Book
  onClick?: () => void
}

export function BookCard({ book, onClick }: BookCardProps) {
  // Mock progress calculation - in real app, get from chapters/sections
  const progress = Math.floor(Math.random() * 100)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        hover 
        className="cursor-pointer group relative overflow-hidden"
        onClick={onClick}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-accent transition-colors">
                  {book.title}
                </h3>
                {book.subtitle && (
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {book.subtitle}
                  </p>
                )}
              </div>
              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
            </div>
            
            {book.author && (
              <p className="text-sm text-text-muted mb-3">par {book.author}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(book.updatedAt)}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {progress}% complete
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">Progress</span>
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-panel rounded-full h-1.5">
              <div 
                className="bg-accent h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {progress === 100 && (
            <div className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded-full">
              Complete
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}