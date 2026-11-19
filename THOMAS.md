# Thomas

## PR1.5 — Compilation des motifs de routes

Branche : `1.5/compilation-des-motifs`

### Modifications

- Ajout de `packages/framework/src/routing/pattern.ts`.
- `compilePattern(path)` découpe un chemin en segments typés :
  - `static` pour un littéral, y compris `:id` qui n'est pas une syntaxe de paramètre ;
  - `param` pour `{nom}` et `{nom}.json`, avec le suffixe fixe conservé ;
  - `rest` pour `{chemin*}`, accepté uniquement en dernière position.
- Les paramètres dupliqués, vides ou mal formés lèvent une `RouteError` citant le chemin complet.
- Les segments vides sont ignorés, ce qui rend `/users/{id}/` équivalent à `/users/{id}`.
- Export public depuis `packages/framework/src/index.ts`.

### Vérifications

- `npm run typecheck`
- Vérification ad hoc avec `npx tsx` : formes valides, littéraux `:id`, paramètres avec suffixe, fin de chemin et erreurs attendues.
- Les tests Vitest seront ajoutés lorsque l'infrastructure `SET-03` sera disponible.

## PR1.9 — Arbre de résolution, 404 et 405

Branche : `1.9/arbre-de-resolution-404-405`

### Modifications

- Ajout de `packages/framework/src/routing/tree.ts` :
  - `RouteDefinition` associe une méthode, un chemin et un handler générique ;
  - `createRouteTree()` et `insertRoute()` construisent un arbre par segment ;
  - les routes statiques sont stockées dans une `Map`, les paramètres et la fin de chemin sont séparés ;
  - les doublons de méthode sur un même chemin et les paramètres incompatibles lèvent une `RouteError`.
- Ajout de `packages/framework/src/routing/resolve.ts` :
  - les littéraux sont essayés avant les paramètres, puis la fin de chemin ;
  - les paramètres sont décodés après découpage, donc `%2F` reste dans un seul segment ;
  - un encodage invalide retourne `bad-request`, destiné à devenir une réponse 400 ;
  - le résultat est une union `found`, `method-not-allowed`, `not-found` ou `bad-request` ;
  - `HEAD` retombe sur la route `GET` et `Allow` inclut `HEAD` lorsque `GET` est disponible.
- Les types et fonctions publiques sont exportés depuis `packages/framework/src/index.ts`.

### Vérifications

- `npm run typecheck`
- Vérification ad hoc avec `npx tsx` : priorité statique, paramètres décodés, fin de chemin, 404, 405 avec `Allow`, `HEAD`, encodage invalide et doublon de route.
- Les tests Vitest seront ajoutés lorsque l'infrastructure `SET-03` sera disponible.
