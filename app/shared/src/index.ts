/**
 * Types et schémas partagés entre client et serveur.
 */

import { z } from "zod";

// ============================================
// AUTH
// ============================================

import { AUTH_CONFIG, PAGINATION_CONFIG, USER_ROLES } from "./constants";

// ============================================
// AUTH
// ============================================

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// USER
// ============================================

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER]),
});

export type User = z.infer<typeof userSchema>;

// ============================================
// COMMON
// ============================================

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(PAGINATION_CONFIG.DEFAULT_PAGE),
    limit: z.coerce.number().min(1).max(PAGINATION_CONFIG.MAX_LIMIT).default(PAGINATION_CONFIG.DEFAULT_LIMIT),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============================================
// EXPORTS
// ============================================

export * from "./constants";
export * from "./permissions";

