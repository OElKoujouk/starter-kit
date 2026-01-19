# 🛠️ Guide : Ajouter une nouvelle Feature

Ce guide vous accompagne dans l'ajout d'une fonctionnalité complète (ex: Gestion de Projets) dans le Starter Kit.

---

## Étape 1 : Définir le Contrat (`app/shared`)

Tout commence par les données. Créez un schéma Zod et les types associés.

```typescript
// app/shared/src/index.ts
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  userId: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

---

## Étape 2 : Le Backend (`app/api`)

1.  **Repository** : Ajoutez la méthode d'accès à la DB.
2.  **Service** : Créez la logique (ex: `checkIfProjectNameExists`).
3.  **Controller** : Appelez le service.
4.  **Route** : Enregistrez le point d'entrée dans `routes/index.ts`.

---

## Étape 3 : Le Frontend (`app/client`)

1.  **Dossier Feature** : Créez `src/features/projects`.
2.  **Query** : Créez `queries/get-projects.ts` en utilisant `fetchServer`.
3.  **Action** : Créez `actions/create-project.ts` pour les mutations.
4.  **Component** : Créez votre UI dans `components/ProjectList.tsx`.
5.  **Index** : Exportez tout proprement dans `index.ts`.

---

## Étape 4 : La Page (`app/client/src/app`)

Créez la route Next.js (ex: `app/dashboard/projects/page.tsx`) et utilisez vos composants de feature.

```tsx
import { ProjectList } from "@/features/projects";

export default async function ProjectsPage() {
  return <ProjectList />;
}
```

---

## 💡 Astuces
*   Utilisez toujours les composants de `src/components/ui` pour rester cohérent avec le design.
*   Utilisez `apiFetch` côté client (Client Components) et `fetchServer` côté serveur (Server Components).
