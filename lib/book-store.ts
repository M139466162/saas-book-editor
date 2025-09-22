import fs from 'fs/promises'
import path from 'path'
import { Book } from './types'

const dataDir = path.join(process.cwd(), '.data', 'books')

async function ensure() {
  await fs.mkdir(dataDir, { recursive: true })
}

function fileForUser(userId: string) {
  return path.join(dataDir, `${userId}.json`)
}

export async function readBooks(userId: string): Promise<Book[]> {
  await ensure()
  try {
    const buf = await fs.readFile(fileForUser(userId), 'utf8')
    return JSON.parse(buf)
  } catch {
    return []
  }
}

export async function writeBooks(userId: string, books: Book[]) {
  await ensure()
  await fs.writeFile(fileForUser(userId), JSON.stringify(books, null, 2), 'utf8')
}
