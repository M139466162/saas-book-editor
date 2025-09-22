import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readBooks, writeBooks } from '@/lib/book-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const list = await readBooks((session.user as any).id)
    const book = list.find(b => b.id === params.id);
    
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
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id
    const updates = await request.json();
    const list = await readBooks(userId)
    const idx = list.findIndex(b => b.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() }
    await writeBooks(userId, list)
    return NextResponse.json(list[idx]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session.user as any).id
    const list = await readBooks(userId)
    const idx = list.findIndex(b => b.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    list.splice(idx, 1)
    await writeBooks(userId, list)
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}