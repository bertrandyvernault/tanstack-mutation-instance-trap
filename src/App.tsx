import { ComponentA } from './components/ComponentA'
import { ComponentB } from './components/ComponentB'

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

      </div>
    </div>
  )
}
