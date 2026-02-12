import { useMutation } from '@tanstack/react-query'

// ✅ Chaque useMutation est tagué avec une mutationKey
// TanStack Query peut maintenant suivre ces mutations dans son registre global
// peu importe l'instance qui les crée
export const useMyMutationsSolution1 = () => {
  const mutation1 = useMutation({
    mutationKey: ['myFeature', 'mutation1'],
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 2000))
      return { success: true }
    },
  })

  const mutation2 = useMutation({
    mutationKey: ['myFeature', 'mutation2'],
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 2000))
      return { success: true }
    },
  })

  const mutation3 = useMutation({
    mutationKey: ['myFeature', 'mutation3'],
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 2000))
      return { success: true }
    },
  })

  return { mutation1, mutation2, mutation3 }
}
