import { useMyMutations } from './useMyMutations'

// Ce hook appelle useMyMutations() → crée l'INSTANCE B
// Complètement indépendante de celle créée dans ComponentA (Instance A)
export const useFeature = () => {
  const { mutation1, mutation2, mutation3, isLoading } =
    useMyMutations('useFeature') // ← Instance B

  return {
    triggerMutation1: () => mutation1.mutate(),
    triggerMutation2: () => mutation2.mutate(),
    triggerMutation3: () => mutation3.mutate(),
    isLoading,
  }
}
