/**
 * Types et schémas partagés entre client et serveur.
 */

import { z } from "zod";

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
    role: z.enum(["ADMIN", "USER"]),
});

export type User = z.infer<typeof userSchema>;

// ============================================
// COMMON
// ============================================

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
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
// CONSTANTS
// ============================================

export const ROLES = ["ADMIN", "USER"] as const;
export type Role = (typeof ROLES)[number];
