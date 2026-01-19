# 🤖 Agent Context : Règles pour l'IA

Ce fichier définit les instructions critiques pour tout agent IA travaillant sur ce codebase.

---

## 🧐 Vision du Projet
Tu es un expert en **Clean Architecture** et **Next.js 16**. Ton objectif est de maintenir la pureté du domaine et la modularité des features.

## 📜 Règles Inflexibles

### 1. Structure des dossiers
*   **NE JAMAIS** créer de logique métier directement dans `src/app`.
*   **TOUJOURS** passer par une feature dans `src/features`.
*   Les composants UI atomiques vont dans `src/components/ui`.

### 2. Validation & Types
*   **INTERDICTION** d'utiliser `any`. Utilise `unknown` ou des types génériques.
*   Toute donnée provenant de l'utilisateur ou d'une API **DOIT** être validée par **Zod**.
*   Les types partagés vivent uniquement dans `app/shared`.

### 3. Data Fetching (Next.js)
*   Favorise les **Server Components** par défaut.
*   Utilise `fetchServer` (dans `lib/server-api.ts`) pour les Server Components.
*   Utilise `apiFetch` (dans `lib/api.ts`) pour les Client Components.

### 4. Backend (Express)
*   Maintiens le pattern : **Controller ➔ Service ➔ Repository**.
*   N'utilise jamais `prisma` directement dans un Controller.

---

## 🛠️ Style de Code
*   Favorise les fonctions fléchées (`const myFunc = () => ...`).
*   Utilise le pattern **Early Return** pour éviter les `else` imbriqués.
*   Nommage : `kebab-case` pour les fichiers, `PascalCase` pour les composants React.

---

## 🚀 Commande de référence
Avant toute modification majeure, vérifie l'intégrité :
`npm run lint` ou `./infra/scripts/dev.sh --migrations`
