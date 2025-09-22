import type { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { readUsers, writeUsers, type StoredUser } from './user-store'
import { compare } from 'bcryptjs'

export type AppUser = StoredUser

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const users = await readUsers()
        const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase())
        if (!user || !user.active) return null
        // For MVP, password stored as plaintext or bcrypt depending on seed
        if (user.password?.startsWith('$2')) {
          const ok = await compare(credentials.password, user.password)
          if (!ok) return null
        } else if (user.password !== credentials.password) {
          return null
        }
        const result: NextAuthUser & { role: string } = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
        return result
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user'
        token.uid = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).id = token.uid
      }
      return session
    },
  },
}

export const ensureDefaultUsers = async () => {
  const users = await readUsers()
  if (users.length === 0) {
    users.push(
      { id: '1', name: 'Admin', email: 'admin@demo.com', role: 'admin', active: true, password: 'admin' },
      { id: '2', name: 'User', email: 'user@demo.com', role: 'user', active: true, password: 'user' },
    )
    await writeUsers(users)
  }
}
