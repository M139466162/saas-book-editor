"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Call /api/signup when implemented
    setTimeout(() => {
      setLoading(false)
      router.push('/login')
    }, 500)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm card">
        <h1 className="text-2xl font-semibold mb-6 text-text-primary">Créer un compte</h1>
        <label className="block text-sm mb-2 text-text-secondary">Nom</label>
        <input className="input w-full mb-4" value={name} onChange={(e)=>setName(e.target.value)} required />
        <label className="block text-sm mb-2 text-text-secondary">Email</label>
        <input className="input w-full mb-4" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <label className="block text-sm mb-2 text-text-secondary">Mot de passe</label>
        <input className="input w-full mb-6" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full btn-primary rounded-xl py-3">
          {loading ? 'Création…' : 'Créer le compte'}
        </button>
        <p className="text-sm text-text-muted mt-4">
          Déjà un compte ? <a href="/login" className="text-accent">Se connecter</a>
        </p>
      </form>
    </div>
  )
}
