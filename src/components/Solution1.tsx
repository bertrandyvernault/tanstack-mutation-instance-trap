import { useEffect } from 'react'
import { useIsMutating } from '@tanstack/react-query'
import { useFeatureSolution1 } from '../hooks/useFeatureSolution1'

// Observateur : useIsMutating lit le registre global TanStack Query
// Pas de nouvelle instance de useMutation créée ici
const ObserverA = () => {
  const isMutatingCount = useIsMutating({ mutationKey: ['myFeature'] })
  const isLoading = isMutatingCount > 0

  useEffect(() => {
    // ✅ Ce useEffect SE DÉCLENCHE maintenant
    console.log('[Solution1 - ObserverA] useEffect isLoading =', isLoading)
  }, [isLoading])

  console.log('[Solution1 - ObserverA] render isLoading =', isLoading)

  return (
    <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6">
      <h3 className="text-base font-bold text-green-700 mb-1">
        🟢 Observateur A
      </h3>
      <p className="text-xs text-green-500 mb-4 font-mono">
        useIsMutating({'({ mutationKey: [\'myFeature\'] })'})
      </p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        ) : (
          <div className="h-6 w-6 rounded-full border-4 border-gray-300" />
        )}
        <span className="font-mono text-sm">
          isLoading:{' '}
          <span className={isLoading ? 'text-green-600 font-bold' : 'text-gray-500'}>
            {String(isLoading)}
          </span>
        </span>
      </div>

      <div className="bg-green-100 rounded-lg p-3 text-xs font-mono space-y-1">
        <p className="text-green-700 font-bold">✅ Spinner tourne !</p>
        <p className="text-green-700">✅ useEffect déclenché</p>
        <p className="text-green-600 mt-1">→ Lit le registre global TQ</p>
        <p className="text-green-600">→ Aucune nouvelle instance créée</p>
      </div>
    </div>
  )
}

// Actionneur : même pattern qu'avant mais avec mutationKey
const ActorB = () => {
  const { triggerMutation1, triggerMutation2, triggerMutation3 } = useFeatureSolution1()
  const isLoading = useIsMutating({ mutationKey: ['myFeature'] }) > 0

  return (
    <div className="rounded-xl border-2 border-teal-400 bg-teal-50 p-6">
      <h3 className="text-base font-bold text-teal-700 mb-1">
        🟢 Actionneur B
      </h3>
      <p className="text-xs text-teal-500 mb-4 font-mono">
        useFeatureSolution1() — mutations avec mutationKey
      </p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        ) : (
          <div className="h-6 w-6 rounded-full border-4 border-gray-300" />
        )}
        <span className="font-mono text-sm">
          isLoading:{' '}
          <span className={isLoading ? 'text-green-600 font-bold' : 'text-gray-500'}>
            {String(isLoading)}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={triggerMutation1}
          disabled={isLoading}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation 1
        </button>
        <button
          onClick={triggerMutation2}
          disabled={isLoading}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation 2
        </button>
        <button
          onClick={triggerMutation3}
          disabled={isLoading}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation 3
        </button>
      </div>
    </div>
  )
}

export const Solution1 = () => (
  <div>
    <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4 font-mono text-sm leading-6">
      <p className="text-gray-400 mb-1 text-xs">// La clé : mutationKey enregistre les mutations dans le registre global TQ</p>
      <p>
        <span className="text-teal-600 font-bold">useFeatureSolution1</span>
        <span className="text-gray-400"> → </span>
        <span className="text-purple-600">useMyMutationsSolution1()</span>
        <span className="text-gray-400"> → mutation avec </span>
        <span className="text-green-600 font-bold">mutationKey: ['myFeature']</span>
      </p>
      <p className="mt-1">
        <span className="text-green-600 font-bold">ObserverA</span>
        <span className="text-gray-400"> → </span>
        <span className="text-green-600">useIsMutating({'({ mutationKey: [\'myFeature\'] })'})</span>
        <span className="text-gray-400"> → lit le registre global ✅</span>
      </p>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <ObserverA />
      <ActorB />
    </div>
  </div>
)
