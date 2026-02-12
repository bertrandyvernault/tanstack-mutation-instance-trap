import { createContext, useContext, type ReactNode } from 'react'
import { useMyMutations } from '../hooks/useMyMutations'

type MutationContextType = ReturnType<typeof useMyMutations>

const MutationContext = createContext<MutationContextType | null>(null)

// ✅ UNE SEULE instance de useMyMutations() créée ici
// Tous les enfants du Provider consomment la même instance via useContext
export const MutationProvider = ({ children }: { children: ReactNode }) => {
  const mutations = useMyMutations('MutationProvider')

  return (
    <MutationContext.Provider value={mutations}>
      {children}
    </MutationContext.Provider>
  )
}

export const useMutationContext = () => {
  const context = useContext(MutationContext)
  if (!context) {
    throw new Error('useMutationContext must be used within MutationProvider')
  }
  return context
}
