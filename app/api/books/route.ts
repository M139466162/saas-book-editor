import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/lib/types';

// In-memory storage for MVP (replace with proper database in production)
const books: Book[] = [];

export async function GET() {
  try {
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookData = await request.json();
    
    const newBook: Book = {
      id: crypto.randomUUID(),
      title: bookData.title || 'Untitled Book',
      subtitle: bookData.subtitle,
      author: bookData.author,
      language: bookData.language || 'fr',
      audience: bookData.audience || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    books.push(newBook);
    
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}