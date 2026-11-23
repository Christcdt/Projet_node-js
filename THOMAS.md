# Thomas

## Travail réalisé le 23 novembre 2026

Sur la branche `1.5/compilation-des-motifs`, j’ai implémenté la compilation des motifs de routes :

- J’ai ajouté `compilePattern(path)` dans `packages/framework/src/routing/pattern.ts`, qui découpe un chemin en segments typés : `static` pour les littéraux (y compris `:id`, qui n’est pas une syntaxe de paramètre), `param` pour `{nom}` et `{nom}.json` avec le suffixe conservé, et `rest` pour `{chemin*}` accepté uniquement en dernière position.
- J’ai fait lever une `RouteError` citant le chemin complet pour les paramètres dupliqués, vides ou mal formés.
- J’ai ignoré les segments vides, ce qui rend `/users/{id}/` équivalent à `/users/{id}`.
- J’ai exporté la fonction, le type `Segment` et `RouteError` depuis `packages/framework/src/index.ts`.

Le typecheck passe avec `npm run typecheck`. J’ai aussi vérifié le comportement avec `npx tsx` : formes valides, littéraux `:id`, paramètres avec suffixe, segments `rest` et erreurs attendues. Les tests Vitest seront ajoutés quand l’infrastructure `SET-03` sera disponible.

```bash
npm ci
npm run typecheck
npm test # commande actuellement factice, à remplacer par le ticket Vitest prévu dans le planning
```
