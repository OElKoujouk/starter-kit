import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { apiFetch } from "@/lib/api";
import { AUTH_CONFIG, API_ENDPOINTS } from "@starter-kit/shared";

/**
 * Client API exclusif au serveur (React Server Components).
 * Gère automatiquement l'injection du token depuis les cookies.
 */

const API_URL = process.env.API_URL || "http://api:4000/api";

type ServerRequestOptions = RequestInit & {
    requiresAuth?: boolean;
};

/**
 * Version cachée pour récupérer l'utilisateur courant.
 * Évite les requêtes dupliquées dans un même cycle de rendu.
 */
export const getServerUser = cache(async () => {
    try {
        // Pour /me, on ne veut pas de redirection forcée si non connecté,
        // on veut juste récupérer null pour gérer l'affichage.
        return await fetchServer(API_ENDPOINTS.AUTH.ME, { requiresAuth: false });
    } catch (error) {
        return null;
    }
});

/**
 * Fonction de fetch pour le serveur.
 */
export async function fetchServer<T>(path: string, options: ServerRequestOptions = {}): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONFIG.TOKEN_NAME)?.value;

    const requiresAuth = options.requiresAuth ?? true;

    if (requiresAuth && !token) {
        redirect("/login");
    }

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const endpoint = path.startsWith("/") ? path : `/${path}`;
    const url = `${API_URL}${endpoint}`;

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers,
        });
    } catch (error) {
        console.error(`[Server Fetch] Network Error on ${path}:`, error);
        throw error;
    }

    // Gérer le 401 en dehors du bloc try/catch pour éviter l'erreur NEXT_REDIRECT
    if (response.status === 401 && requiresAuth) {
        redirect("/login");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur serveur (${response.status})`);
    }

    return response.json();
}
