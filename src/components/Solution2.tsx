import { useEffect } from 'react'
import { useMyMutations } from '../hooks/useMyMutations'

// ✅ UNE SEULE instance de useMyMutations() créée dans le parent commun
// isLoading et mutations sont passés en props aux enfants → pas d'instances multiples
export const Solution2 = () => {
  const { mutation1, mutation2, mutation3, isLoading } =
    useMyMutations('Solution2-Parent')

  return (
    <div>
      <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4 font-mono text-sm leading-6">
        <p className="text-gray-400 mb-1 text-xs">// La clé : useMyMutations() appelé UNE SEULE FOIS dans le parent commun</p>
        <p>
          <span className="text-purple-600 font-bold">Solution2 (parent)</span>
          <span className="text-gray-400"> → </span>
          <span className="text-purple-600">useMyMutations()</span>
          <span className="text-gray-400"> → </span>
          <span className="text-purple-400">instance unique</span>
        </p>
        <p className="mt-1">
          <span className="text-purple-600">ObserverChild</span>
          <span className="text-gray-400"> + </span>
          <span className="text-violet-600">ActorChild</span>
          <span className="text-gray-400"> reçoivent </span>
          <span className="text-purple-600 font-bold">isLoading</span>
          <span className="text-gray-400"> en prop ✅</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ObserverChild isLoading={isLoading} />
        <ActorChild
          onMutation1={() => mutation1.mutate()}
          onMutation2={() => mutation2.mutate()}
          onMutation3={() => mutation3.mutate()}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

const ObserverChild = ({ isLoading }: { isLoading: boolean }) => {
  useEffect(() => {
    console.log('[Solution2 - ObserverChild] useEffect isLoading =', isLoading)
  }, [isLoading])

  console.log('[Solution2 - ObserverChild] render isLoading =', isLoading)

  return (
    <div className="rounded-xl border-2 border-purple-400 bg-purple-50 p-6">
      <h3 className="text-base font-bold text-purple-700 mb-1">
        🟣 Observateur A
      </h3>
      <p className="text-xs text-purple-500 mb-4 font-mono">
        isLoading reçu en prop du parent
      </p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
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

      <div className="bg-purple-100 rounded-lg p-3 text-xs font-mono space-y-1">
        <p className="text-purple-700 font-bold">✅ Spinner tourne !</p>
        <p className="text-purple-700">✅ useEffect déclenché</p>
        <p className="text-purple-600 mt-1">→ isLoading vient du parent</p>
        <p className="text-purple-600">→ Pas d'instance locale créée</p>
      </div>
    </div>
  )
}

const ActorChild = ({
  onMutation1, onMutation2, onMutation3, isLoading,
}: {
  onMutation1: () => void
  onMutation2: () => void
  onMutation3: () => void
  isLoading: boolean
}) => (
  <div className="rounded-xl border-2 border-violet-400 bg-violet-50 p-6">
    <h3 className="text-base font-bold text-violet-700 mb-1">
      🟣 Actionneur B
    </h3>
    <p className="text-xs text-violet-500 mb-4 font-mono">
      mutations reçues en props du parent
    </p>

    <div className="flex items-center gap-3 mb-4">
      {isLoading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
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
      {([onMutation1, onMutation2, onMutation3] as const).map((fn, i) => (
        <button
          key={i}
          onClick={fn}
          disabled={isLoading}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50 font-medium text-sm"
        >
          Déclencher Mutation {i + 1}
        </button>
      ))}
    </div>
  </div>
)
