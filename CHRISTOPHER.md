# Christopher

## Travail réalisé le 17 novembre 2026

- J'ai crée le dossier validation qui contient `core.ts` et `scalars.ts` à l'emplacement `packages/framework/src/validation`.
- J'ai créé le fichier `core.ts` qui définit les types de base (`Schema`, `Result`, `Issue`) et la fonction utilitaire `schema` pour construire des validateurs.
- J'ai ajouté le fichier `scalars.ts` avec les validateurs concrets pour les types simples : `string`, `int` et `boolean`.
- J'ai ajouté la gestion des erreurs avec un système de `path` et de `code` pour identifier précisément les problèmes (ex: `min`, `max`, `pattern`).
- J'ai ajouté un fichier `test.ts` pour tester la validation.

Le code est prêt pour être utilisé par l'API et respecte le mode strict TypeScript configuré précédemment.


