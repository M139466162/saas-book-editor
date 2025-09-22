import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/lib/types';

// Mock storage - in production, use proper database
const books: Book[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = books.find(b => b.id === params.id);
    
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const bookIndex = books.findIndex(b => b.id === params.id);
    
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    books[bookIndex] = {
      ...books[bookIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(books[bookIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookIndex = books.findIndex(b => b.id === params.id);
    
    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    books.splice(bookIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}