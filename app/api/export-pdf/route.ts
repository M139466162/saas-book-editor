import { NextRequest, NextResponse } from 'next/server'
import { generatePreviewHTML } from '@/lib/export'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { book, chapters, sections } = data
    
    // Generate HTML content
    const html = generatePreviewHTML({ book, chapters, sections })
    
    // For now, we'll return the HTML content
    // In a production environment, you might want to use a service like Puppeteer
    // to generate actual PDF files
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${book.title}.html"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export book' },
      { status: 500 }
    )
  }
}