# BeSerene

Application web d'accompagnement de parentalité consciente pour parents de bébés de **0 à 24 mois**, centrée sur la réflexologie émotionnelle bébé et la régulation parentale.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- Stripe (abonnements)
- Resend (emails)
- Déploiement : Vercel

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local   # puis remplir les vraies clés
npm run dev
```

L'app tourne ensuite sur http://localhost:3000.

## Contexte projet

Toutes les conventions, le schéma de base de données et les règles éditoriales sont dans :

- [`CLAUDE.md`](./CLAUDE.md) — contexte projet global
- [`skills/`](./skills) — règles éditoriales et techniques détaillées
