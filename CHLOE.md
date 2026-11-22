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

## Travail réalisé le 22 novembre 2026

- J’ai ajouté Vitest et un workflow GitHub Actions dédié aux tests. Il installe les dépendances puis lance `npm test` sur les pull requests et les pushs vers `main`.
- `npm test` vérifie que les tests couvrent 100 % du code du framework.
- Chaque test a son dossier temporaire et ses propres réglages. Les requêtes SQL sont simulées.

Vitest trouve les fichiers `*.test.ts` dans `packages/framework/test/`. Il charge `setup.ts`, qui prépare un environnement propre avant chaque test et le nettoie après.

- `setup.ts` remet les routes à zéro quand elles existent, crée un dossier temporaire, prépare une configuration et un faux exécuteur SQL. Après chaque test, il supprime le dossier, rétablit les minuteurs et nettoie les limiteurs s’ils existent.
- `helpers/context.ts` garde le chemin du dossier temporaire courant pour les autres helpers.
- `helpers/config.ts` crée une nouvelle configuration de test et permet d’en remplacer certains réglages.
- `helpers/executor.ts` fournit un faux exécuteur SQL qui enregistre les requêtes et renvoie une réponse vide.
- `setup.test.ts` vérifie que ces outils fonctionnent. Il ne teste pas l’application dans `apps/api/`.

Le typecheck passe et les tests passent avec l’ordre aléatoire activé. La couverture reste à 100 % sur zéro élément tant que le point d’entrée du framework ne contient pas de code exécutable.
