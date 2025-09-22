"use client"
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminPage() {
  const { data, mutate } = useSWR('/api/admin/users', fetcher)
  const [busy, setBusy] = useState(false)

  const toggleActive = async (id: string) => {
    setBusy(true)
    await fetch('/api/admin/users', { method: 'PUT', body: JSON.stringify({ id, op: 'toggleActive' }) })
    setBusy(false)
    mutate()
  }

  const toggleRole = async (id: string) => {
    setBusy(true)
    await fetch('/api/admin/users', { method: 'PUT', body: JSON.stringify({ id, op: 'toggleRole' }) })
    setBusy(false)
    mutate()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Admin — Utilisateurs</h1>
      {!data ? (
        <p>Chargement…</p>
      ) : (
        <div className="space-y-3">
          {data.users.map((u: any) => (
            <div key={u.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name} <span className="text-text-muted">({u.email})</span></div>
                <div className="text-sm text-text-secondary">Role: {u.role} • {u.active ? 'actif' : 'inactif'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={busy} className="btn-secondary rounded-xl px-3 py-2" onClick={() => toggleActive(u.id)}>
                  {u.active ? 'Désactiver' : 'Activer'}
                </button>
                <button disabled={busy} className="btn-primary rounded-xl px-3 py-2" onClick={() => toggleRole(u.id)}>
                  Basculer rôle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
