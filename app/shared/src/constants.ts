/**
 * Constantes globales partagées entre le Client et l'API.
 * Ce fichier ne doit contenir que des valeurs non-sensibles.
 */

export const APP_CONFIG = {
    NAME: "Starter Kit",
    VERSION: "1.0.0",
};

export const AUTH_CONFIG = {
    TOKEN_NAME: "auth_token",
    REFRESH_TOKEN_NAME: "refresh_token",
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY: "7d",
};

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};

export const USER_ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/auth/me",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
    },
};
