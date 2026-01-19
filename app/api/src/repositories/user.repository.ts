/**
 * Repository pour les opérations User.
 */

import { prisma } from "../config";
import type { Role } from "@prisma/client";

export const userRepository = {
    /**
     * Trouve un utilisateur par son email
     */
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                active: true,
            },
        });
    },

    /**
     * Trouve un utilisateur par son ID
     */
    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true,
            },
        });
    },

    /**
     * Crée un nouvel utilisateur
     */
    async create(data: { email: string; name: string; password: string; role?: Role }) {
        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                role: data.role ?? "USER",
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    },

    /**
     * Met à jour un utilisateur
     */
    async update(id: string, data: Partial<{ email: string; name: string; password: string; active: boolean }>) {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
            },
        });
    },

    /**
     * Vérifie si un email existe déjà
     */
    async emailExists(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        return !!user;
    },
};
