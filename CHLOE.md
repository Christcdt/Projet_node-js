# Chloé

## Travail réalisé le 11 novembre 2026

J’ai préparé les fondations techniques du projet :

- J’ai organisé le dépôt en monorepo npm : le framework est dans `packages/framework` et l’API dans `apps/api`. Un monorepo permet de garder plusieurs paquets dans le même dépôt.
- J’ai relié l’API au framework avec npm workspaces. L’API peut ainsi utiliser la version locale du framework.
- J’ai créé le point d’entrée du framework (`packages/framework/src/index.ts`).
- J’ai activé TypeScript strict et ajouté `npm run typecheck`. Cette commande vérifie les types.
- J’ai ajouté une CI GitHub Actions qui installe les dépendances et lance le typecheck sur les pull requests et les pushs vers `main`.
- J’ai complété le `.gitignore` pour éviter d’ajouter à Git les dépendances locales, les fichiers `.env`, le dossier `dist` et les fichiers d’IDE.

Le typecheck passe actuellement. Le framework contient encore seulement un point d’entrée vide, et l’API n’a pas encore de code TypeScript : le contrôle vérifiera davantage de code quand ces fichiers seront ajoutés.