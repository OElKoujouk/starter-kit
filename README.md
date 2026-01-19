# 🚀 Ultimate Full-Stack Starter Kit

Full-stack starter kit industriel avec Next.js 16, Express, Prisma et Tailwind CSS 4.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind 4](https://img.shields.io/badge/Tailwind-4.0-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-indigo?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

---

## 🏗️ Architecture "High-End"

Le projet utilise une structure **Monorepo** gérée par Turborepo, séparant strictement les responsabilités pour une maintenance et une scalabilité maximale.

```bash
starter-kit/
├── app/
│   ├── api/          # 🟢 Backend Express (Clean Architecture)
│   │   └── src/
│   │       ├── controllers/  # Bridge HTTP <> Service
│   │       ├── services/     # Logique Métier (DI / Pure)
│   │       ├── repositories/ # Accès DB unique via Prisma
│   │       ├── middleware/   # Auth, Validation, Errors
│   │       └── validators/   # Schémas Zod (Validation entrante)
│   ├── client/       # 🔵 Frontend Next.js (Features-First)
│   │   └── src/
│   │       ├── app/          # Routes & Layouts (App Router)
│   │       ├── features/     # Domaines Métiers encapsulés (Auth, i18n...)
│   │       ├── components/ui/# Design System atomique premium
│   │       ├── lib/          # Utils (API Fetch typé, Server Actions)
│   │       └── proxy.ts      # Protection Centralisée (Next 16)
│   └── shared/       # 🟡 Shared Noyau (Constantes, Types & Schémas)
├── infra/
│   ├── docker/       # Orchestration Docker (Dev & Prod)
│   └── scripts/      # Outils d'automatisation (dev.sh)
└── turbo.json        # Pipeline de build ultra-rapide
```

---

## 🚀 Démarrage Rapide

Tout l'environnement est conteneurisé. **Zéro configuration locale requise.**

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/OElKoujouk/starter-kit.git
cd starter-kit

# 2. Configurer les secrets
cp .env.example .env.dev
# Éditer .env.dev avec vos valeurs (JWT_SECRET, etc.)

# 3. Lancer l'environnement
./infra/scripts/dev.sh
```

C'est tout ! Le script s'occupe de :
✅ Démarrer PostgreSQL  
✅ Builder les images Docker  
✅ Exécuter les migrations Prisma  
✅ Lancer l'API et le Client

### Accès
🌐 **Client** : [http://localhost:3000](http://localhost:3000)  
🔌 **API** : [http://localhost:4000/api](http://localhost:4000/api)

---

## 💎 Points Forts & Stack

### 🔒 Sécurité & Authentification
*   **Rotation de Refresh Token** : Session robuste et sécurisée.
*   **Protection des Routes** : Centralisée dans `proxy.ts` (Next.js 16 compatible).
*   **Protection XSS & Sanitization** : Nettoyage récursif automatique de toutes les entrées (`body`, `query`, `params`) contre les injections.
*   **Validation End-to-End** : Contrats de données stricts entre Front & Back via `shared`.

### 🛠️ Developer Experience (DX)
*   **Docker-First** : Environnement de dev identique à la production.
*   **API Fetch Typée** : Gestion automatique des retries et du refresh de token.
*   **Turborepo** : Builds et tests mis en cache pour une vitesse extrême.

### 📦 Stack Technique
*   **Back** : Express, Prisma, Zod, JWT, Pino.
*   **Front** : Next.js 16, React 19, Tailwind CSS 4, Lucide Icons.
*   **Infra** : Docker, PostgreSQL, Turborepo.

---

## 🛠️ Scripts & Commandes

Le script `dev.sh` est votre outil principal :

```bash
./infra/scripts/dev.sh           # Démarrage standard
./infra/scripts/dev.sh --fresh   # Reset complet des conteneurs
./infra/scripts/dev.sh --migrations # Affiche le statut des migrations
```

**Commandes manuelles utiles :**
```bash
docker compose -f infra/docker/docker-compose.dev.yml logs -f api    # Logs API
docker compose -f infra/docker/docker-compose.dev.yml exec api npx prisma studio # DB UI
```

---

## 📝 Configuration (.env.dev)

```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@db:5432/starter_kit"

# JWT
JWT_SECRET="votre-secret-super-long-et-securise"

# Super Admin (Bootstrap automatique)
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_USERNAME="Admin"
SUPER_ADMIN_PASSWORD="password123"

# URLs
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
```

---

## 🚢 Déploiement

Pour la production :
```bash
docker compose -f infra/docker/docker-compose.prod.yml up -d
```

---

## 📄 Licence

Propulsé par **OEK Dev**.  
Licence : **Tous droits réservés** (ou MIT).
