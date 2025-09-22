"use client"
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [callbackUrl, setCallbackUrl] = useState('/')
  // Avoid useSearchParams SSR bailouts by reading from window on client
  useState(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      setCallbackUrl(url.searchParams.get('callbackUrl') || '/')
    }
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) router.push(callbackUrl)
    else alert('Échec de connexion')
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm card">
        <h1 className="text-2xl font-semibold mb-6 text-text-primary">Connexion</h1>
        <label className="block text-sm mb-2 text-text-secondary">Email</label>
        <input 
          className="input w-full mb-4" 
          type="email" value={email} onChange={e => setEmail(e.target.value)} required 
          placeholder="vous@exemple.com"
        />
        <label className="block text-sm mb-2 text-text-secondary">Mot de passe</label>
        <input 
          className="input w-full mb-6" 
          type="password" value={password} onChange={e => setPassword(e.target.value)} required 
          placeholder="••••••••"
        />
        <button disabled={loading} className="w-full btn-primary rounded-xl py-3">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        <p className="text-sm text-text-muted mt-4">
          Démo: admin@demo.com / admin — user@demo.com / user
        </p>
      </form>
    </div>
  )
}
