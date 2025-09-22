import fs from 'fs/promises'
import path from 'path'

export interface StoredUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  active: boolean
  password?: string // plaintext for MVP demo or bcrypt hash
}

const dataDir = path.join(process.cwd(), '.data')
const usersFile = path.join(dataDir, 'users.json')

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const buf = await fs.readFile(usersFile, 'utf8')
    return JSON.parse(buf)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
    await fs.writeFile(usersFile, '[]', 'utf8')
    return []
  }
}

export async function writeUsers(users: StoredUser[]) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8')
}
