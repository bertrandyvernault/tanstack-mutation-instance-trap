import { useMyMutationsSolution1 } from './useMyMutationsSolution1'

// Même pattern qu'avant : useFeature crée sa propre instance
// Mais cette fois les mutations ont une mutationKey → observables globalement
export const useFeatureSolution1 = () => {
  const { mutation1, mutation2, mutation3 } = useMyMutationsSolution1()

  return {
    triggerMutation1: () => mutation1.mutate(),
    triggerMutation2: () => mutation2.mutate(),
    triggerMutation3: () => mutation3.mutate(),
  }
}
