/**
 * Repository pour les Refresh Tokens.
 * Gère la création, validation et révocation des tokens de rafraîchissement.
 */

import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const refreshTokenRepository = {
    /**
     * Crée un nouveau refresh token pour un utilisateur
     */
    async create(userId: string, userAgent?: string, ipAddress?: string) {
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

        return prisma.refreshToken.create({
            data: {
                token,
                userId,
                userAgent,
                ipAddress,
                expiresAt,
            },
        });
    },

    /**
     * Trouve un token valide (non révoqué et non expiré)
     */
    async findValidToken(token: string) {
        return prisma.refreshToken.findFirst({
            where: {
                token,
                revoked: false,
                expiresAt: { gt: new Date() },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        active: true,
                    },
                },
            },
        });
    },

    /**
     * Révoque un token spécifique
     */
    async revoke(token: string) {
        return prisma.refreshToken.updateMany({
            where: { token },
            data: { revoked: true },
        });
    },

    /**
     * Révoque tous les tokens d'un utilisateur (logout all)
     */
    async revokeAllForUser(userId: string) {
        return prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });
    },

    /**
     * Nettoie les tokens expirés (pour un cron job)
     */
    async cleanupExpired() {
        return prisma.refreshToken.deleteMany({
            where: {
                OR: [{ expiresAt: { lt: new Date() } }, { revoked: true }],
            },
        });
    },
};
