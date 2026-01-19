"use server";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";
import { AUTH_CONFIG, API_ENDPOINTS, LoginInput } from "@starter-kit/shared";
import { LoginResponse } from "../types";

/**
 * Action pour connecter un utilisateur.
 */
export async function loginAction(data: LoginInput) {
    try {
        const response = await apiFetch<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            method: "POST",
            body: JSON.stringify(data),
        });

        const cookieStore = await cookies();

        // Stocker l'Access Token (court terme)
        cookieStore.set(AUTH_CONFIG.TOKEN_NAME, response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15, // 15 mins
            path: "/",
        });

        // Stocker le Refresh Token (long terme)
        cookieStore.set(AUTH_CONFIG.REFRESH_TOKEN_NAME, response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true, user: response.user };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
        };
    }
}

/**
 * Action pour déconnecter un utilisateur.
 */
export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_CONFIG.TOKEN_NAME);
    cookieStore.delete(AUTH_CONFIG.REFRESH_TOKEN_NAME);
    return { success: true };
}

/**
 * Action interne pour rafraîchir le token.
 */
export async function refreshTokenAction() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get(AUTH_CONFIG.REFRESH_TOKEN_NAME)?.value;

        if (!refreshToken) throw new Error("No refresh token");

        const response = await apiFetch<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH, {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        });

        // Mettre à jour les deux cookies
        cookieStore.set(AUTH_CONFIG.TOKEN_NAME, response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });

        cookieStore.set(AUTH_CONFIG.REFRESH_TOKEN_NAME, response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return { success: true, token: response.token };
    } catch (error) {
        return { success: false };
    }
}
