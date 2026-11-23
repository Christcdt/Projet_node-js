# Thomas

## Travail réalisé le 23 novembre 2026 — 1.5

Sur la branche `1.5/compilation-des-motifs`, j’ai implémenté la compilation des motifs de routes :

- J’ai ajouté `compilePattern(path)` dans `packages/framework/src/routing/pattern.ts`, qui découpe un chemin en segments typés : `static` pour les littéraux (y compris `:id`, qui n’est pas une syntaxe de paramètre), `param` pour `{nom}` et `{nom}.json` avec le suffixe conservé, et `rest` pour `{chemin*}` accepté uniquement en dernière position.
- J’ai fait lever une `RouteError` citant le chemin complet pour les paramètres dupliqués, vides ou mal formés.
- J’ai ignoré les segments vides, ce qui rend `/users/{id}/` équivalent à `/users/{id}`.
- J’ai exporté la fonction, le type `Segment` et `RouteError` depuis `packages/framework/src/index.ts`.

## Travail réalisé le 23 novembre 2026 — 1.9

Sur la branche `1.9/arbre-de-resolution-404-405`, j’ai construit l’arbre de résolution des routes avec les réponses 404 et 405 :

- J’ai ajouté `packages/framework/src/routing/tree.ts` : `RouteDefinition` associe une méthode, un chemin et un handler générique ; `createRouteTree()` et `insertRoute()` construisent un arbre par segment, avec les routes statiques dans une `Map` et les paramètres ainsi que la fin de chemin séparés. Les doublons de méthode sur un même chemin et les paramètres incompatibles lèvent une `RouteError`.
- J’ai ajouté `packages/framework/src/routing/resolve.ts` : les littéraux sont essayés avant les paramètres, puis la fin de chemin ; les paramètres sont décodés après découpage, donc `%2F` reste dans un seul segment ; un encodage invalide retourne `bad-request`, destiné à devenir une réponse 400 ; le résultat est une union `found`, `method-not-allowed`, `not-found` ou `bad-request` ; `HEAD` retombe sur la route `GET` et `Allow` inclut `HEAD` lorsque `GET` est disponible.
- J’ai exporté les types et fonctions publiques depuis `packages/framework/src/index.ts`.

Le typecheck passe avec `npm run typecheck`. J’ai aussi vérifié le comportement avec `npx tsx` : priorité statique, paramètres décodés, fin de chemin, 404, 405 avec `Allow`, `HEAD`, encodage invalide et doublon de route. Les tests Vitest seront ajoutés quand l’infrastructure `SET-03` sera disponible.

```bash
npm ci
npm run typecheck
npm test # commande actuellement factice, à remplacer par le ticket Vitest prévu dans le planning
```
