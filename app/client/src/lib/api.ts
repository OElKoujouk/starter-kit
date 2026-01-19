/**
 * Utilitaires pour les appels API.
 * Gère les appels HTTP avec typage fort et gestion d'erreurs robuste.
 */

// ============================================
// TYPES
// ============================================

export interface ApiError {
    message: string;
    code?: string;
    status: number;
}

export class ApiRequestError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = "ApiRequestError";
    }
}

// ============================================
// CONFIG
// ============================================

const getBaseUrl = () => {
    // Si on est côté serveur (Server Actions / Server Components)
    if (typeof window === "undefined") {
        return process.env.API_URL || "http://api:4000/api";
    }
    // Si on est côté client (Browser), on passe par notre proxy BFF local
    return "/api";
};

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// ============================================
// HELPERS
// ============================================

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(status: number): boolean {
    // Retry sur erreurs réseau (0) ou serveur temporaires (502, 503, 504)
    return status === 0 || status === 502 || status === 503 || status === 504;
}

// ============================================
// MAIN FETCH FUNCTION
// ============================================

import { refreshTokenAction } from "@/features/auth/actions/auth.actions";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = MAX_RETRIES
): Promise<T> {
    const baseUrl = getBaseUrl();
    const url = endpoint.startsWith("/") ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;

    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // 1. Gérer le rafraîchissement du token si 401 (Unauthorized)
        // On ne refresh pas si on est déjà sur les routes d'auth
        if (response.status === 401 && !endpoint.includes("/auth/")) {
            const refreshResult = await refreshTokenAction();
            if (refreshResult.success && refreshResult.token) {
                // Remplacer le token dans les headers et réessayer
                headers.set("Authorization", `Bearer ${refreshResult.token}`);
                return apiFetch<T>(endpoint, { ...options, headers }, retries);
            }
        }

        // 2. Retry sur erreurs serveur temporaires
        if (isRetryableError(response.status) && retries > 0) {
            await delay(RETRY_DELAY);
            return apiFetch<T>(endpoint, options, retries - 1);
        }

        // 3. Parse la réponse
        const responseText = await response.text();
        let data: unknown;

        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch {
            throw new ApiRequestError(
                `Réponse non-JSON du serveur (${response.status})`,
                response.status,
                "PARSE_ERROR"
            );
        }

        // 4. Gestion des erreurs HTTP
        if (!response.ok) {
            const errorData = data as { message?: string; code?: string };
            throw new ApiRequestError(
                errorData.message || `Erreur serveur (${response.status})`,
                response.status,
                errorData.code
            );
        }

        return data as T;
    } catch (error) {
        // Erreur réseau (fetch failed)
        if (error instanceof TypeError && retries > 0) {
            await delay(RETRY_DELAY);
            return apiFetch<T>(endpoint, options, retries - 1);
        }

        // Re-throw ApiRequestError
        if (error instanceof ApiRequestError) {
            throw error;
        }

        // Erreur inconnue
        throw new ApiRequestError(
            error instanceof Error ? error.message : "Erreur de connexion au serveur",
            0,
            "NETWORK_ERROR"
        );
    }
}

// ============================================
// TYPED HELPERS
// ============================================

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
