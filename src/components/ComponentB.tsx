import { useFeature } from '../hooks/useFeature'

// ComponentB utilise useFeature, qui appelle useMyMutations() en interne
// → Crée l'Instance B, différente de l'Instance A dans ComponentA
export const ComponentB = () => {
  const { triggerMutation1, triggerMutation2, triggerMutation3, isLoading } =
    useFeature() // ← Instance B (via useFeature → useMyMutations)

  return (
    <div className="rounded-xl border-2 border-red-400 bg-red-50 p-6">
      <h2 className="text-lg font-bold text-red-700 mb-1">
        🔴 Component B — Actionneur
      </h2>
      <p className="text-xs text-red-500 mb-4 font-mono">Instance B via useFeature()</p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
        ) : (
          <div className="h-6 w-6 rounded-full border-4 border-gray-300" />
        )}
        <span className="font-mono text-sm">
          isLoading:{' '}
          <span className={isLoading ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
            {String(isLoading)}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={triggerMutation1}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation 1
        </button>
        <button
          onClick={triggerMutation2}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation 2
        </button>
        <button
          onClick={triggerMutation3}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation 3
        </button>
      </div>

      {/*<div className="bg-red-100 rounded-lg p-3 text-xs font-mono space-y-1">
        <p className="text-green-700">✅ isLoading change ici (Instance B)</p>
        <p className="text-red-700">→ mais ComponentA ne le voit pas</p>
      </div>*/}
    </div>
  )
}
