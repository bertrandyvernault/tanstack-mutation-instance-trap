import { ComponentA } from './components/ComponentA'
import { ComponentB } from './components/ComponentB'
import { Solution1 } from './components/Solution1'
import { Solution2 } from './components/Solution2'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* ===== PARTIE 1 : LE PROBLÈME ===== */}
        <section>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              TanStack Query — Piège des instances multiples de{' '}
              <code className="bg-gray-200 px-1 rounded text-xl">useMutation</code>
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Chaque appel à{' '}
              <code className="bg-gray-200 px-1 rounded">useMyMutations()</code>{' '}
              crée des instances <strong>totalement isolées</strong>
            </p>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              ❌ Partie 1 — Le problème
            </span>
            <div className="flex-1 border-t border-red-200" />
          </div>

          {/* Schéma */}
          <div className="mb-4 bg-white rounded-xl border border-gray-200 p-4 font-mono text-sm leading-6">
            <p className="text-gray-400 mb-1 text-xs">// Deux appels = deux instances indépendantes</p>
            <p>
              <span className="text-blue-600 font-bold">ComponentA</span>
              <span className="text-gray-400"> → </span>
              <span className="text-purple-600">useMyMutations()</span>
              <span className="text-gray-400"> → </span>
              <span className="text-blue-400">mutation1A, mutation2A, mutation3A</span>
            </p>
            <p>
              <span className="text-red-600 font-bold">ComponentB</span>
              <span className="text-gray-400"> → </span>
              <span className="text-orange-600">useFeature()</span>
              <span className="text-gray-400"> → </span>
              <span className="text-purple-600">useMyMutations()</span>
              <span className="text-gray-400"> → </span>
              <span className="text-red-400">mutation1B, mutation2B, mutation3B</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <ComponentA />
            <ComponentB />
          </div>
        </section>

        {/* ===== PARTIE 2 : LES SOLUTIONS ===== */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              ✅ Partie 2 — Les solutions
            </span>
            <div className="flex-1 border-t border-green-200" />
          </div>

          <div className="mb-8">
            <h2 className="text-base font-bold text-gray-700 mb-3">
              Solution 1 —{' '}
              <code className="bg-gray-100 px-1 rounded">mutationKey</code>
              {' '}+{' '}
              <code className="bg-gray-100 px-1 rounded">useIsMutating</code>
              <span className="text-green-600 text-xs font-normal ml-2">⭐ recommandée</span>
            </h2>
            <Solution1 />
          </div>

          <div className="mb-8">
            <h2 className="text-base font-bold text-gray-700 mb-3">
              Solution 2 — Instance partagée (parent commun)
            </h2>
            <Solution2 />
          </div>
        </section>

      </div>
    </div>
  )
}
