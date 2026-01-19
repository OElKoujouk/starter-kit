/**
 * Schémas de validation pour l'authentification.
 */

import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token requis"),
});

export const logoutSchema = z.object({
    refreshToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
