"use client"
import { useParams } from 'next/navigation'

export default function CoverEditorPage() {
  const { id } = useParams()
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Couverture du livre</h1>
      <p className="text-text-secondary">Éditeur de couverture pour le livre #{id}. À implémenter: modèles, génération d'image (Sunra), typographie.</p>
    </div>
  )
}
