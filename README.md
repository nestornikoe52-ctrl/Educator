# Éducation Togo

Application de révision pour le collège togolais (6e à 3e), en Mathématiques, PCT et SVT, selon l'Approche Par Compétences.

Créée par M. Nikoe Nestor, professeur de SVT, de Mathématiques et de PCT.

## Structure

```
apps/api       API NestJS (port 3001, préfixe /api)
apps/web       Application Next.js + Tailwind (port 3000)
apps/mobile    Application Expo / React Native
packages/shared  Niveaux, matières et types partagés
```

## Prérequis

- Node.js 20 ou plus récent
- pnpm 10 (`corepack enable`, puis `corepack prepare pnpm@10.15.1 --activate`)
- PostgreSQL et Redis. En local : `pnpm db:up` démarre PostgreSQL dans `.data`. Avec Docker : `docker compose up -d`.

## Lancer

```bash
pnpm install
pnpm dev:web
pnpm dev:api
pnpm dev:mobile
```

```bash
pnpm db:up
pnpm --filter @education-togo/api db:migrate
pnpm --filter @education-togo/api db:seed
```

`apps/api/.env` contient déjà l’adresse locale `postgresql://education:education@localhost:5432/education_togo`.
