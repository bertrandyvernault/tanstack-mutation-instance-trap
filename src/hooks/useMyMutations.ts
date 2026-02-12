import { useMutation } from '@tanstack/react-query'

// ⚠️ Chaque appel à ce hook crée 3 NOUVELLES instances de useMutation
// Ces instances ne partagent RIEN avec celles créées ailleurs
export const useMyMutations = (callerLabel: string) => {
  const mutation1 = useMutation({
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 2000))
      return { success: true }
    },
  })

  const mutation2 = useMutation({
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 2000))
      return { success: true }
    },
  })

  const mutation3 = useMutation({
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 2000))
      return { success: true }
    },
  })

  const isLoading =
    mutation1.isPending || mutation2.isPending || mutation3.isPending

  console.log(`[useMyMutations] caller="${callerLabel}" isLoading=${isLoading}`)

  return { mutation1, mutation2, mutation3, isLoading }
}
