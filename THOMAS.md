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
