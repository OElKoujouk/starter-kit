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

- Docker & Docker Compose
- Git

### Installation

```bash
# 1. Cloner le repo
git clone <url> mon-projet
cd mon-projet

# 2. Configurer les variables d'environnement
cp .env.example .env.dev
# Éditer .env.dev avec vos valeurs

# 3. Lancer l'environnement de développement
./infra/scripts/dev.sh
```

C'est tout ! Le script s'occupe de :
- ✅ Démarrer PostgreSQL
- ✅ Builder les images Docker
- ✅ Exécuter les migrations Prisma
- ✅ Lancer l'API et le Client

**URLs :**
- 🌐 Client : http://localhost:3000
- 🔌 API : http://localhost:4000/api

## 📦 Stack Technique

### Back-end (`app/api`)
- **Express** - Framework HTTP
- **Prisma** - ORM type-safe
- **Zod** - Validation des entrées
- **JWT** - Authentification
- **Pino** - Logging structuré

### Front-end (`app/client`)
- **Next.js 16** - Framework React full-stack
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
# Démarrage complet (recommandé)
./infra/scripts/dev.sh

# Options du script
./infra/scripts/dev.sh --fresh      # Reset les conteneurs
./infra/scripts/dev.sh --migrations # Affiche le status des migrations

# Commandes Docker manuelles
docker compose -f infra/docker/docker-compose.dev.yml up -d      # Démarrer
docker compose -f infra/docker/docker-compose.dev.yml down       # Arrêter
docker compose -f infra/docker/docker-compose.dev.yml logs -f    # Voir les logs

# Migrations (dans le conteneur)
docker compose -f infra/docker/docker-compose.dev.yml exec api npx prisma migrate dev
docker compose -f infra/docker/docker-compose.dev.yml exec api npx prisma studio
```

## 📝 Variables d'environnement

Copier `.env.example` vers `.env.dev` et configurer :

```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@db:5432/starter_kit"

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

Voir `infra/docker/docker-compose.prod.yml` pour la configuration de production.

## 📄 License

MIT
