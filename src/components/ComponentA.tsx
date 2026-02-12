import { useEffect } from 'react'
import { useMyMutations } from '../hooks/useMyMutations'

// ComponentA crée l'INSTANCE A de useMyMutations
// Complètement isolée de l'Instance B dans useFeature
export const ComponentA = () => {
  const { isLoading } = useMyMutations('ComponentA') // ← Instance A

  useEffect(() => {
    // ❌ Ce useEffect ne se déclenche JAMAIS après le 1er render
    // car isLoading de l'Instance A ne change jamais
    console.log('[ComponentA] useEffect isLoading =', isLoading)
  }, [isLoading])

  console.log('[ComponentA] render isLoading =', isLoading)

  return (
    <div className="rounded-xl border-2 border-blue-400 bg-blue-50 p-6">
      <h2 className="text-lg font-bold text-blue-700 mb-1">
        🔵 Component A — Observateur
      </h2>
      <p className="text-xs text-blue-500 mb-4 font-mono">Instance A de useMyMutations()</p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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

    </div>
  )
}
