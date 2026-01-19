# 🛠️ Guide : Ajouter une nouvelle Feature

Ce guide vous accompagne étape par étape pour ajouter une fonctionnalité complète (Vertical Slice) dans le Starter Kit, en respectant la Clean Architecture et le pattern Features-First.

---

## 🏗️ Workflow Général

1.  **Shared** : Définir le contrat de données (Types & Schémas).
2.  **API** : Implémenter la logique backend (Controller/Service/Repo).
3.  **Client (Feature)** : Créer les composants et la logique frontend isolée.
4.  **Client (App)** : Intégrer la feature dans une Page Next.js.

---

## Étape 1 : Le Contrat (`app/shared`)

C'est la Source de Vérité. Le Front et le Back doivent s'accorder ici avant tout code.

**Fichier :** `app/shared/src/index.ts` (ou créez un dossier spécifique ex: `app/shared/src/projects/index.ts` si complexe)

```typescript
import { z } from "zod";

// 1. Schéma de validation (Zod)
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères"),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  createdAt: z.date(),
});

export const CreateProjectSchema = ProjectSchema.pick({ name: true });

// 2. Type TypeScript inféré
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
```

---

## Étape 2 : Le Backend (`app/api`)

Implémentez la logique en couches strictes.

### 1. Repository (`src/repositories`)
Accès direct à Prisma. Créez `project.repository.ts`.

```typescript
import { prisma } from "../lib/prisma";
import { CreateProjectInput } from "@starter/shared";

export const createProject = async (data: CreateProjectInput) => {
  return prisma.project.create({ data });
};
```

### 2. Service (`src/services`)
Logique métier pure. Créez `project.service.ts`.

```typescript
import * as ProjectRepo from "../repositories/project.repository";
import { CreateProjectInput } from "@starter/shared";

export const createNewProject = async (input: CreateProjectInput) => {
  // Règle métier : Vérifierunicité, droits, etc.
  return ProjectRepo.createProject(input);
};
```

### 3. Controller (`src/controllers`)
Point d'entrée HTTP. Créez `project.controller.ts`.

```typescript
import { Request, Response } from "express";
import * as ProjectService from "../services/project.service";

export const create = async (req: Request, res: Response) => {
  const project = await ProjectService.createNewProject(req.body);
  res.status(201).json(project);
};
```

### 4. Route (`src/routes`)
Déclarez la route et liez la validation middleware.

```typescript
import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateProjectSchema } from "@starter/shared";
import * as ProjectController from "../controllers/project.controller";

const router = Router();

router.post("/", validate(CreateProjectSchema), ProjectController.create);

export default router;
```

---

## Étape 3 : Le Frontend - Feature (`app/client/src/features`)

Créez le dossier `src/features/projects`.

### 1. Data Fetching
*   **Queries** (`queries/get-projects.ts`) : Utilisez `fetchServer` (Server Components).
*   **Actions** (`actions/create-project.ts`) : Server Actions pour les mutations.

```typescript
// features/projects/actions/create-project.ts
"use server";

import { apiFetch } from "@/lib/server-api";
import { CreateProjectSchema } from "@starter/shared";

export const createProjectAction = async (data: unknown) => {
  const parsed = CreateProjectSchema.parse(data);
  return apiFetch("/projects", { method: "POST", body: parsed });
};
```

### 2. UI Components
Créez vos composants dans `components/`.
*   Utilisez `src/components/ui` (Button, Input) pour le design.
*   Ne faites pas de fetch directement dans les composants UI si possible (passez les données en props).

### 3. Public API (`index.ts`)
Exportez uniquement ce qui est nécessaire à l'extérieur.

```typescript
// features/projects/index.ts
export * from "./components/ProjectList";
export * from "./components/CreateProjectForm";
```

---

## Étape 4 : Intégration dans l'App (`app/client/src/app`)

Créez la page Next.js. C'est ici que l'assemblage se fait.

**Fichier :** `app/(dashboard)/projects/page.tsx`

```tsx
import { ProjectList } from "@/features/projects";
import { getProjects } from "@/features/projects/queries/get-projects";

export default async function ProjectsPage() {
  const projects = await getProjects(); // Server-side data fetching

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Projets</h1>
      <ProjectList initialData={projects} />
    </div>
  );
}
```

---

## ✅ Checklist Finale

1.  [ ] **Linting** : Lancez `npm run lint` pour vérifier les imports.
2.  [ ] **Types** : Vérifiez que `shared` est bien importé et utilisé.
3.  [ ] **Build** : Testez un `npm run build` rapide.
4.  [ ] **Clean** : Pas de `console.log` oubliés, pas de `any`.
