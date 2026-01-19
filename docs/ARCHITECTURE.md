# 🏗️ Architecture & Standards

Ce document explique les principes fondamentaux qui régissent le Starter Kit pour maintenir une base de code saine, testable et scalable.

---

## 1. Principes Fondamentaux

*   **Clean Architecture** : Séparation stricte des préoccupations. Le domaine métier ne doit pas dépendre des détails techniques (HTTP, Base de données).
*   **Single Source of Truth** : Le dossier `app/shared` contient les types et les schémas de validation (Zod) utilisés par le Front et le Back.
*   **Features-First (Frontend)** : Le code est organisé par domaine métier (auth, users, billing) plutôt que par type technique (components, hooks).
*   **Dependency Injection (Backend)** : Les services reçoivent leurs dépendances (repositories) par injection, facilitant les tests unitaires.

---

## 2. Structure Backend (`app/api`)

Flux d'une requête :
`Route` ➔ `Middleware (Validation/Auth)` ➔ `Controller` ➔ `Service` ➔ `Repository` ➔ `Prisma`

*   **Controllers** : Se chargent uniquement de parser la requête HTTP et de renvoyer la réponse. Pas de logique métier ici.
*   **Services** : Le cœur de l'application. Contient la logique métier pure.
*   **Repositories** : Le seul endroit où l'on utilise `prisma`. Abstrait l'accès aux données.
*   **Validators** : Utilise les schémas Zod du dossier `shared` pour garantir l'intégrité des données entrantes.

---

## 3. Structure Frontend (`app/client`)

Le frontend suit l'architecture **Features-First**. Chaque dossier dans `src/features` est une mini-application isolée.

### Anatomie d'une feature :
```
features/my-feature/
├── components/    # Composants React spécifiques à cette feature
├── actions/       # Server Actions (Mutations)
├── queries/       # Fetchers (Server Components data fetching)
├── types/         # Interfaces TS spécifiques
└── index.ts       # Public API de la feature (seul point d'entrée autorisé)
```

**Règle d'or** : Une page dans `src/app` ne doit jamais importer un composant interne d'une feature. Elle doit passer par le `index.ts` de la feature.

---

## 4. Sécurité

*   **Auth** : JWT avec rotation de Refresh Token.
*   **Stockage** : Cookies `HttpOnly`, `Secure`, `SameSite=Strict`.
*   **XSS** : Middleware de sanitization récursif sur toutes les entrées API.
*   **Validation** : Zod obligatoire sur chaque endpoint.
