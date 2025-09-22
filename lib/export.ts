import { Book, Chapter, Section } from '@/lib/types'

interface ExportData {
  book: Book
  chapters: Chapter[]
  sections: Section[]
}

export async function exportToPDF(data: ExportData) {
  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    // Download the PDF file
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.book.title}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Export error:', error)
    throw error
  }
}

export function generatePreviewHTML(data: ExportData): string {
  const { book, chapters, sections } = data
  
  const sortedChapters = chapters.sort((a, b) => a.order - b.order)
  
  let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${book.title}</title>
      <style>
        body {
          font-family: Georgia, serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #333;
        }
        .cover {
          text-align: center;
          margin-bottom: 60px;
          page-break-after: always;
        }
        .cover h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .cover h2 {
          font-size: 1.2em;
          color: #7f8c8d;
          font-weight: normal;
          margin-bottom: 30px;
        }
        .cover .author {
          font-size: 1.1em;
          color: #34495e;
        }
        .toc {
          margin-bottom: 60px;
          page-break-after: always;
        }
        .toc h2 {
          font-size: 1.8em;
          margin-bottom: 30px;
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        .toc ul {
          list-style: none;
          padding: 0;
        }
        .toc li {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px dotted #bdc3c7;
        }
        .toc a {
          text-decoration: none;
          color: #2c3e50;
          font-weight: 500;
        }
        .chapter {
          margin-bottom: 50px;
          page-break-before: always;
        }
        .chapter h1 {
          font-size: 2em;
          color: #2c3e50;
          margin-bottom: 30px;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }
        .chapter-content {
          font-size: 1.1em;
          line-height: 1.8;
        }
        .chapter-content p {
          margin-bottom: 20px;
          text-align: justify;
        }
        @media print {
          body { padding: 20px; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="cover">
        <h1>${book.title}</h1>
        ${book.subtitle ? `<h2>${book.subtitle}</h2>` : ''}
        <div class="author">par ${book.author || 'Auteur'}</div>
      </div>

      <!-- Table of Contents -->
      <div class="toc">
        <h2>Table des matières</h2>
        <ul>
  `
  
  sortedChapters.forEach((chapter, index) => {
    html += `
          <li>
            <a href="#chapter-${chapter.id}">
              ${index + 1}. ${chapter.title}
            </a>
          </li>
    `
  })
  
  html += `
        </ul>
      </div>

      <!-- Chapters -->
  `
  
  sortedChapters.forEach((chapter, index) => {
    const chapterSections = sections
      .filter(s => s.chapterId === chapter.id)
      .sort((a, b) => a.order - b.order)
    
    html += `
      <div class="chapter" id="chapter-${chapter.id}">
        <h1>Chapitre ${index + 1}: ${chapter.title}</h1>
        <div class="chapter-content">
    `
    
    chapterSections.forEach(section => {
      if (section.bodyMd) {
        // Convert basic Markdown to HTML
        const content = section.bodyMd
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>')
        
        html += `<p>${content}</p>`
      }
    })
    
    if (chapterSections.length === 0) {
      html += `<p><em>Contenu à venir...</em></p>`
    }
    
    html += `
        </div>
      </div>
    `
  })
  
  html += `
    </body>
    </html>
  `
  
  return html
}