# Initialiser et vérifier le projet

```bash
npm install
```

# Workflow
## Branch

Chaque développeur devra respecter la convention de nommage suivante lors de la création de ses branches pour faciliter le suivi :

```bash
<numero-de-la-branche>/<nom-de-la-branche>
```
Exemple : `1.1/monorepo-et-typescript-strict`


## Vérification avant commit

Le contrôle des types TypeScript se lance avec :

```bash
npm run typecheck
```
Le développeur devra également mettre à jour son .md avec les mises à jour apportées à son code pour l'expliquer aux autres développeurs.

## Review

Chaque développeur devra faire une revue de code des autres branches afin d'assurer une bonne compréhension de l'ensemble du projet en vue de la soutenance.
Les développeurs devront donc utiliser l'interface de review sur GitHub pour y déposer des commentaires s'il a des remarques, des questions ou des suggestions sur le travail effectué.
Si la PR est validé, alors le développeur devra approuver la PR.

## Merge

Lorsque la PR est validée et approuvée par tous les développeurs, le développeur qui a créé la PR peut alors fusionner sa branche dans la branche principale (main).