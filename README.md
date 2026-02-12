# 🐛 TanStack Query Trap: Pourquoi votre spinner ne tourne JAMAIS ?
----

```
useMutation({ isPending }) → true dans le hook
Component → isLoading: false (useEffect jamais déclenché)
```

# 🚨 Le piège classique : plusieurs appels à un custom hook = instances séparées

```
ComponentA → useMyMutations() → isLoading A (false)
ComponentB → useMyMutations() → mutationB.mutate() → isLoading B (true/false)
```

Demo complète React + TS + Tailwind

Solutions : useIsMutating, parent commun, context

#tanstack #react #usemutation #debugging
