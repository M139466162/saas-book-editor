import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface BookDTO {
  id: string
  title: string
  subtitle?: string
  author?: string
  language: string
  audience: string
  coverUrl?: string
  createdAt: string
  updatedAt: string
}

export function useBooks() {
  return useQuery<BookDTO[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('/api/books')
      if (!res.ok) throw new Error('Failed to load books')
      return res.json()
    },
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<BookDTO, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create book')
      return res.json() as Promise<BookDTO>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
