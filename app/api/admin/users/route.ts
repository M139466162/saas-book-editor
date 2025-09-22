import { NextResponse } from 'next/server'
import { readUsers, writeUsers } from '@/lib/user-store'
import { ensureDefaultUsers } from '@/lib/auth'

export async function GET() {
  await ensureDefaultUsers()
  const users = await readUsers()
  return NextResponse.json({ users })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (body.op === 'toggleActive') users[idx].active = !users[idx].active
  if (body.op === 'toggleRole') users[idx].role = users[idx].role === 'admin' ? 'user' : 'admin'
  await writeUsers(users)
  return NextResponse.json({ ok: true })
}
