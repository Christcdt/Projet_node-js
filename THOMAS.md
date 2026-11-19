# Thomas

## PR1.2 — Contrat Context, Controller, HttpResponse

Branche : `1.2/contrat-context-controller-httpresponse`

### Modifications

- Ajout du contrat HTTP dans `packages/framework/src/http/types.ts` :
  - `HttpMethod` limite les méthodes prises en charge par le framework.
  - `QueryParams` définit l'interface prévue pour la lecture des paramètres de requête.
  - `FrameworkConfig`, `AuthUser`, `StoredFile` et `RouteInfo` fixent les données exposées au contexte.
  - `Serializer` et `ResponseBody` rendent la réponse extensible : JSON, texte, HTML ou flux pourront être branchés sans changer les contrôleurs.
  - `Context<P, B>` expose les données en lecture seule aux contrôleurs et middlewares.
  - `Controller<P, B>` impose une seule voie de traitement : recevoir un contexte et renvoyer une `HttpResponse`, synchronement ou non.
- Ajout des fabriques dans `packages/framework/src/http/responses.ts` :
  - `json(data, status = 200)` sérialise par défaut en JSON UTF-8.
  - `created(data, location)` renvoie `201` avec l'en-tête `location`.
  - `noContent()` renvoie `204` sans corps.
- Export public des types et fabriques depuis `packages/framework/src/index.ts`.
- Chargement explicite de `@types/node` dans `tsconfig.json`, nécessaire pour typer `Buffer` et `Readable`.
- Activation de `noUncheckedIndexedAccess` et `exactOptionalPropertyTypes`, conformément à la configuration stricte attendue.

### Vérifications

- `npm ci`
- `npm run typecheck`
- `npm test` : commande actuellement factice, à remplacer par le ticket Vitest prévu dans le planning.
