import { useEffect } from 'react'
import { MutationProvider, useMutationContext } from '../context/MutationContext'

const ObserverA = () => {
  const { isLoading } = useMutationContext()

  useEffect(() => {
    console.log('[Solution3 - ObserverA] useEffect isLoading =', isLoading)
  }, [isLoading])

  console.log('[Solution3 - ObserverA] render isLoading =', isLoading)

  return (
    <div className="rounded-xl border-2 border-orange-400 bg-orange-50 p-6">
      <h3 className="text-base font-bold text-orange-700 mb-1">
        🟠 Observateur A
      </h3>
      <p className="text-xs text-orange-500 mb-4 font-mono">
        useMutationContext()
      </p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
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

      <div className="bg-orange-100 rounded-lg p-3 text-xs font-mono space-y-1">
        <p className="text-orange-700 font-bold">✅ Spinner tourne !</p>
        <p className="text-orange-700">✅ useEffect déclenché</p>
        <p className="text-orange-600 mt-1">→ Consomme l'instance du Provider</p>
        <p className="text-orange-600">→ Pas de prop drilling</p>
      </div>
    </div>
  )
}

const ActorB = () => {
  const { mutation1, mutation2, mutation3, isLoading } = useMutationContext()

  return (
    <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6">
      <h3 className="text-base font-bold text-amber-700 mb-1">
        🟠 Actionneur B
      </h3>
      <p className="text-xs text-amber-500 mb-4 font-mono">
        useMutationContext()
      </p>

      <div className="flex items-center gap-3 mb-4">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
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
        {([mutation1, mutation2, mutation3] as const).map((mut, i) => (
          <button
            key={i}
            onClick={() => mut.mutate()}
            disabled={isLoading}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium text-sm"
          >
            Déclencher Mutation {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export const Solution3 = () => (
  <MutationProvider>
    <div>
      <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4 font-mono text-sm leading-6">
        <p className="text-gray-400 mb-1 text-xs">// La clé : MutationProvider crée l'instance unique et la distribue via Context</p>
        <p>
          <span className="text-orange-600 font-bold">{'<MutationProvider>'}</span>
          <span className="text-gray-400"> → </span>
          <span className="text-purple-600">useMyMutations()</span>
          <span className="text-gray-400"> → </span>
          <span className="text-orange-400">instance unique dans le Context</span>
        </p>
        <p className="mt-1">
          <span className="text-orange-600">ObserverA</span>
          <span className="text-gray-400"> + </span>
          <span className="text-amber-600">ActorB</span>
          <span className="text-gray-400"> → </span>
          <span className="text-orange-600 font-bold">useMutationContext()</span>
          <span className="text-gray-400"> → même instance ✅</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ObserverA />
        <ActorB />
      </div>
    </div>
  </MutationProvider>
)
