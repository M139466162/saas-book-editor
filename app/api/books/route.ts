import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/lib/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readBooks, writeBooks } from '@/lib/book-store';

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const list = await readBooks((session.user as any).id)
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id as string
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

    const list = await readBooks(userId)
    list.push(newBook)
    await writeBooks(userId, list)
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}