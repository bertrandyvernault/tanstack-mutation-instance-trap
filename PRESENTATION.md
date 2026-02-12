# TanStack Query — Piège des instances multiples de `useMutation`

---

## 🧠 Le concept fondamental à comprendre

En React, **chaque appel à un hook crée une instance indépendante**.

Ce n'est pas spécifique à TanStack Query — c'est le comportement de base de React. Mais avec `useMutation`, ça crée un piège subtil que même des développeurs expérimentés ne voient pas venir.

---

## ❌ Le problème

### La situation

Tu as un custom hook `useMyMutations` qui regroupe plusieurs mutations :

```ts
// hooks/useMyMutations.ts
export const useMyMutations = () => {
  const mutation1 = useMutation({ mutationFn: ... })
  const mutation2 = useMutation({ mutationFn: ... })
  const mutation3 = useMutation({ mutationFn: ... })

  const isLoading = mutation1.isPending || mutation2.isPending || mutation3.isPending

  return { mutation1, mutation2, mutation3, isLoading }
}
```

Et un hook `useFeature` qui l'utilise en interne :

```ts
// hooks/useFeature.ts
export const useFeature = () => {
  const { mutation1, isLoading } = useMyMutations() // ← appel #1

  return {
    triggerMutation1: () => mutation1.mutate(),
    isLoading,
  }
}
```

Dans l'UI, deux composants :

```tsx
// ComponentA : veut observer isLoading
const ComponentA = () => {
  const { isLoading } = useMyMutations() // ← appel #2

  useEffect(() => {
    console.log('isLoading changed:', isLoading) // jamais déclenché ?!
  }, [isLoading])
}

// ComponentB : déclenche les mutations
const ComponentB = () => {
  const { triggerMutation1 } = useFeature()
  // ...
}
```

### Ce qui se passe réellement

```
ComponentA → useMyMutations() → mutation1A, mutation2A, mutation3A  (Instance A)
useFeature → useMyMutations() → mutation1B, mutation2B, mutation3B  (Instance B)
```

Ce sont **deux familles d'objets mutation totalement différentes**. Elles ne partagent aucun état.

Quand `ComponentB` clique et déclenche `triggerMutation1` :

| Qui ? | Que se passe-t-il ? |
|---|---|
| Instance B (`useFeature`) | `mutation1B.isPending = true` → `isLoading = true` ✅ |
| Instance A (`ComponentA`) | `mutation1A.isPending = false` (inchangé) → `isLoading = false` ❌ |

**`ComponentA` ne voit absolument rien.** Son `isLoading` n'a jamais changé. Son `useEffect` ne se déclenche jamais.

### Pourquoi c'est trompeur

Le hook s'appelle `useMyMutations` — le nom suggère qu'il accède aux "mêmes" mutations. En réalité, il crée de **nouvelles** instances à chaque appel.

C'est différent de `useQuery` où la `queryKey` permet de partager le cache entre instances. `useMutation` **n'a pas de cache partagé par défaut**.

### Les logs qui trahissent le bug

```
// Clic sur "Mutation 1" dans ComponentB

[useMyMutations] caller="useFeature"  isLoading=true   ← Instance B change
[useMyMutations] caller="useFeature"  isLoading=false  ← Instance B revient

← ComponentA : silence total                           ← Instance A jamais touchée
```

---

## ✅ Solution 1 — `mutationKey` + `useIsMutating` ⭐ recommandée

### Principe

TanStack Query maintient en interne un **registre global de toutes les mutations en cours**. Par défaut, `useMutation` n'y est pas identifiable. Avec une `mutationKey`, chaque mutation s'enregistre dans ce registre.

`useIsMutating` permet de lire ce registre depuis n'importe quel composant — **sans créer de nouvelle instance**.

### Le changement

```ts
// hooks/useMyMutationsSolution1.ts
export const useMyMutationsSolution1 = () => {
  const mutation1 = useMutation({
    mutationKey: ['myFeature', 'mutation1'], // ← clé d'identification globale
    mutationFn: ...
  })
  // ...
}
```

```tsx
// Dans l'Observateur — plus besoin d'appeler useMyMutations()
const { isLoading } = {
  isLoading: useIsMutating({ mutationKey: ['myFeature'] }) > 0
}
```

### Ce qui se passe maintenant

```
useFeatureSolution1 → useMyMutationsSolution1() → mutation1B (mutationKey: ['myFeature'])

Clic → mutation1B.mutate()
     → Registre global TQ : { ['myFeature']: 1 mutation en cours }

ObserverA → useIsMutating({ mutationKey: ['myFeature'] })
          → lit le registre global → 1 → isLoading = true ✅
```

### Pourquoi c'est la solution recommandée

- **Zéro refactoring** de l'architecture : `useFeature` continue d'exister tel quel
- **Pas de prop drilling** : l'observateur n'a pas besoin d'être dans le même arbre
- **Natif TanStack Query** : c'est exactement le cas d'usage pour lequel `useIsMutating` existe
- **Granularité** : on peut observer toutes les mutations `['myFeature']` ou une seule `['myFeature', 'mutation1']`

### Limitation

`useIsMutating` retourne un **nombre** (les mutations en cours), pas un booléen — d'où le `> 0`. Ça permet de gérer des scénarios avec plusieurs mutations en parallèle.

---

## ✅ Solution 2 — Instance partagée (parent commun)

### Principe

Ne pas appeler `useMyMutations()` deux fois. L'appeler **une seule fois** dans un composant parent et **passer le résultat en props** aux enfants.

```tsx
// App ou un composant parent
const Parent = () => {
  const { mutation1, mutation2, mutation3, isLoading } = useMyMutations() // ← UNE SEULE instance

  return (
    <>
      <ObserverChild isLoading={isLoading} />           {/* reçoit isLoading en prop */}
      <ActorChild
        onMutation1={() => mutation1.mutate()}           {/* reçoit les triggers en prop */}
        isLoading={isLoading}
      />
    </>
  )
}
```

### Ce qui se passe

```
Parent → useMyMutations() → instance unique

mutation1.mutate()
  → instance unique : isPending = true
  → isLoading = true
  → prop vers ObserverChild : isLoading = true ✅
  → prop vers ActorChild    : isLoading = true ✅
```

### Avantages / Inconvénients

| ✅ Avantages | ⚠️ Inconvénients |
|---|---|
| Simple à comprendre | Prop drilling si l'arbre est profond |
| Pas de dépendance supplémentaire | Le parent doit connaître tous les consommateurs |
| Comportement React standard | Difficile à scaler si beaucoup de composants consomment |

### Quand l'utiliser

Quand les composants qui partagent les mutations sont **proches dans l'arbre** (frères ou parent/enfant direct). Au-delà de 2-3 niveaux, la Solution 3 devient plus adaptée.

---

## ✅ Solution 3 — Context global

### Principe

Même logique que la Solution 2 (une seule instance), mais au lieu de passer les valeurs en props, on les distribue via un **Context React**.

```tsx
// context/MutationContext.tsx
export const MutationProvider = ({ children }) => {
  const mutations = useMyMutations() // ← instance unique dans le Provider

  return (
    <MutationContext.Provider value={mutations}>
      {children}
    </MutationContext.Provider>
  )
}

export const useMutationContext = () => useContext(MutationContext)
```

```tsx
// N'importe où dans l'arbre sous MutationProvider
const ObserverA = () => {
  const { isLoading } = useMutationContext() // ← consomme l'instance unique
}

const ActorB = () => {
  const { mutation1 } = useMutationContext() // ← même instance
}
```

### Avantages / Inconvénients

| ✅ Avantages | ⚠️ Inconvénients |
|---|---|
| Pas de prop drilling | Plus de boilerplate (Provider, hook) |
| Accessible depuis n'importe quel niveau | Re-render de tous les consommateurs si `isLoading` change |
| Scalable | Peut masquer les dépendances (moins explicite) |

### Quand l'utiliser

Quand les mutations sont utilisées dans des composants **éloignés dans l'arbre** ou dans des contextes où le prop drilling serait lourd (modals, drawers, nested forms).

---

## 📊 Comparatif des 3 solutions

| | Solution 1 | Solution 2 | Solution 3 |
|---|---|---|---|
| **Approche** | Registre global TQ | Props | Context |
| **Refactoring** | Minimal (ajouter `mutationKey`) | Moyen (remonter l'état) | Moyen (créer Provider) |
| **Prop drilling** | Aucun | Oui | Non |
| **Couplage** | Faible | Fort | Moyen |
| **Lisibilité** | TQ-specific | Explicite | Abstraite |
| **Recommandée si** | Toujours | Arbre plat | Arbre profond |

---

## 🔑 La leçon à retenir

> **`useMutation` ne partage pas d'état entre instances, contrairement à `useQuery`.**

Avec `useQuery`, deux composants qui appellent le même hook avec la même `queryKey` partagent le même cache — c'est intentionnel et documenté.

Avec `useMutation`, il n'y a pas de cache. Chaque appel crée un état local et indépendant. C'est également intentionnel : une mutation représente une **action**, pas une **donnée**.

Le piège vient du fait qu'on s'attend au même comportement que `useQuery` — et ce n'est pas le cas.

---

## 💬 Questions pour animer la discussion

- *"Pourquoi `useQuery` partage son état et pas `useMutation` ?"*
  → Parce que `useQuery` modélise une **donnée** (cacheable, partageable), `useMutation` modélise une **action** (impérative, ponctuelle).

- *"Dans quel cas réel est-ce qu'on tombe dans ce piège ?"*
  → Un composant de navigation qui affiche un spinner global pendant qu'un formulaire dans une autre partie de la page soumet une requête.

- *"Quelle solution choisir dans votre codebase ?"*
  → Dépend du contexte, mais Solution 1 est la plus légère si on peut tagguer les mutations avec des clés.
