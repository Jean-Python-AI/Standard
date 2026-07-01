---
description: Clean the code
agent: plan
---

Analyse le fichier $1 en profondeur.

**Contexte (lecture seule, ne pas reviewer) :**
Avant l'analyse, identifie et lis :
- les fichiers importés directement par $1
- les fichiers du projet qui importent $1

Ce contexte sert uniquement à comprendre comment $1 est utilisé et avec quoi il interagit (props attendues, contrat d'API, conventions du projet).

**Cible de l'analyse :** Identifie les failles, anti-patterns et opportunités d'amélioration de ce fichier, en t'appuyant sur le contexte ci-dessus quand c'est pertinent (ex: une constante locale n'est "vraiment locale" que si elle n'apparaît dans aucun des fichiers liés ni ailleurs dans le projet).

**Règles obligatoires pour considérer un fichier comme "propre" :**

- Pas de **magic numbers** ni **magic strings**. Utiliser les constantes de `@/constants/` via l’index. Constantes locales uniquement si vraiment spécifiques au fichier.
- **Nommage excellent** : clair, précis et intentionnel.
- Code **auto-documenté** : très peu de commentaires explicatifs.
- **Séparation stricte** entre logique métier (services, hooks, utilities) et couche présentation (UI/JSX).
- **Tests unitaires** : les fonctions importantes de logique métier doivent avoir des tests correspondants.
- Respect strict des règles des hooks React (ordre, dépendances, etc.).

---

### Anti-Patterns à détecter systématiquement :

1. God Component / God File
2. Logique métier mélangée dans les composants ou dans `useEffect`
3. Props Drilling excessif
4. Magic Numbers & Magic Strings
5. Nommage pauvre ou ambigu
6. Duplication de code / logique
7. Fat Hooks (hooks qui font trop de choses)
8. Mauvaise séparation des préoccupations
9. Utilisation excessive de `any` en TypeScript
10. Absence de tests pour la logique métier critique
11. `console.log` oubliés en production
12. Mutations directes d’état ou d’objets
13. Re-renders inutiles (manque de memoization)

---

### Bonnes pratiques à vérifier et encourager :

- TypeScript strict et types explicites
- Composition de petits composants réutilisables
- Custom Hooks bien nommés et focalisés
- Gestion robuste des erreurs avec feedback utilisateur
- Utilisation judicieuse de `useMemo`, `useCallback`, `React.memo`
- Fonctions inline évitées dans le render (surtout dans les listes)
- `key` correctes dans les listes
- Imports organisés par catégorie
- Utilisation cohérente et appropriée d’un state manager

---

### Section Performance (React Native) :

L’agent doit activement rechercher et proposer des optimisations sur :

- Re-renders excessifs (`useMemo` / `useCallback` / `React.memo`)
- Optimisation des listes (`FlatList` / `FlashList`, `getItemLayout`, `windowSize`, etc.)
- Gestion des images (optimisation ou `react-native-fast-image`)
- Calculs lourds déplacés hors du render
- Appels API (caching, debouncing, cancellation)
- Fuites mémoire (`useEffect` cleanup)
- Bundle size (imports dynamiques quand pertinent)
- Animations (`Reanimated` worklets)
- Confirmation que **Hermes** est activé
- Utilisation raisonnée des librairies (éviter les lourdes inutiles)

**Priorisation des retours :**
1. Bugs et anti-patterns graves (sécurité, crashes)
2. Problèmes de maintenabilité et architecture
3. Problèmes de performance
4. Améliorations de style / bonnes pratiques

Pour chaque problème détecté :
- Explique clairement pourquoi c’est un problème.
- Propose une solution concrète.
- Donne un exemple **avant / après** quand c’est pertinent.
- N’hésite pas à suggérer la création ou le déplacement de fichiers.