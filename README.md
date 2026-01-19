# Starter Kit - Monorepo

Full-stack starter kit avec Next.js, Express, Prisma et Tailwind CSS.

## 🏗️ Architecture

```
starter-kit/
├── app/
│   ├── api/          # Back-end Express + Prisma
│   ├── client/       # Front-end Next.js + Tailwind
│   └── shared/       # Types et schémas Zod partagés
├── infra/
│   ├── docker/       # Docker Compose
│   └── scripts/      # Scripts utilitaires
└── turbo.json        # Configuration Turborepo
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- npm (inclus avec Node.js)

### Installation

```bash
# 1. Cloner le repo
git clone <url> mon-projet
cd mon-projet

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Démarrer la base de données
docker-compose -f infra/docker/docker-compose.dev.yml up -d db

# 5. Générer le client Prisma et appliquer les migrations
cd app/api
npx prisma generate
npx prisma migrate dev
cd ../..

# 6. Démarrer le projet en dev
npm run dev
```

Le client sera accessible sur http://localhost:3000
L'API sera accessible sur http://localhost:4000/api

## 📦 Stack Technique

### Back-end (`app/api`)
- **Express** - Framework HTTP
- **Prisma** - ORM type-safe
- **Zod** - Validation des entrées
- **JWT** - Authentification
- **Pino** - Logging structuré

### Front-end (`app/client`)
- **Next.js 15** - Framework React full-stack
- **React 19** - UI library
- **Tailwind CSS 4** - Styling utilitaire
- **Lucide React** - Icônes

### Infrastructure
- **Turborepo** - Monorepo tooling
- **Docker** - Conteneurisation
- **PostgreSQL** - Base de données

## 🔒 Authentification

Le starter kit inclut un système d'authentification complet :

- Login / Logout
- Refresh Token avec rotation
- Protection des routes
- Middleware d'autorisation par rôle

## 📁 Structure API

```
app/api/src/
├── config/          # Configuration (env, prisma, logger)
├── middleware/      # Auth, validation, error handler
├── repositories/    # Accès base de données
├── routes/          # Points d'entrée HTTP
├── services/        # Logique métier
├── types/           # Interfaces TypeScript
└── validators/      # Schémas Zod
```

## 🎨 Structure Client

```
app/client/
├── app/             # Pages et layouts (App Router)
├── components/ui/   # Composants réutilisables
├── lib/             # Utilitaires
├── context/         # Contexts React
├── hooks/           # Custom hooks
└── services/        # Appels API
```

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Démarre tous les services en dev

# Build
npm run build        # Build tous les packages

# Lint
npm run lint         # Lint tous les packages

# Format
npm run format       # Formate le code avec Prettier
```

## 📝 Variables d'environnement

Copier `.env.example` vers `.env` et configurer :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/starter_kit"

# JWT
JWT_SECRET="votre-secret-de-32-caracteres-minimum"

# Super Admin
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_USERNAME="Admin"
SUPER_ADMIN_PASSWORD="votre-mot-de-passe-securise"

# URLs
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
```

## 🚢 Déploiement

1. Configurer les variables d'environnement de production
2. Build : `npm run build`
3. Démarrer : `npm run start`

## 📄 License

MIT
