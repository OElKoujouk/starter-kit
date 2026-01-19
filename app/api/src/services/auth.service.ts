/**
 * Service d'authentification.
 * Gère login, logout, refresh token et profil utilisateur.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env, logger } from "../config";
import { AppError } from "../middleware/error-handler";
import { userRepository as userRepo } from "../repositories/user.repository";
import { refreshTokenRepository as refreshRepo } from "../repositories/refresh-token.repository";

const JWT_SECRET = env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";

// Types
export interface LoginResponse {
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export interface UserProfileResponse {
    id: string;
    name: string;
    email: string;
    role: string;
}

export class AuthService {
    constructor(
        private userRepository = userRepo,
        private refreshTokenRepository = refreshRepo
    ) { }

    /**
     * Authentifie un utilisateur et génère les tokens
     */
    async login(
        email: string,
        password: string,
        userAgent?: string,
        ipAddress?: string,
    ): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(email.trim().toLowerCase());

        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.warn({ email, ip: ipAddress }, "ECHEC AUTH: Identifiants invalides");
            throw new AppError(401, "Identifiants invalides");
        }

        if (!user.active) {
            throw new AppError(403, "Compte désactivé");
        }

        // Générer l'access token
        const accessToken = jwt.sign(
            { sub: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY },
        );

        // Générer le refresh token
        const refreshTokenData = await this.refreshTokenRepository.create(user.id, userAgent, ipAddress);

        return {
            token: accessToken,
            refreshToken: refreshTokenData.token,
            expiresIn: 15 * 60,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    /**
     * Renouvelle l'access token via un refresh token valide
     */
    async refresh(token: string, userAgent?: string, ipAddress?: string): Promise<LoginResponse> {
        const tokenData = await this.refreshTokenRepository.findValidToken(token);

        if (!tokenData) {
            throw new AppError(401, "Refresh token invalide ou expiré");
        }

        if (!tokenData.user.active) {
            await this.refreshTokenRepository.revoke(token);
            throw new AppError(403, "Compte désactivé");
        }

        // Rotation du Refresh Token
        await this.refreshTokenRepository.revoke(token);

        const accessToken = jwt.sign(
            { sub: tokenData.user.id, role: tokenData.user.role },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY },
        );

        const newRefreshToken = await this.refreshTokenRepository.create(
            tokenData.user.id,
            userAgent,
            ipAddress,
        );

        return {
            token: accessToken,
            refreshToken: newRefreshToken.token,
            expiresIn: 15 * 60,
            user: {
                id: tokenData.user.id,
                email: tokenData.user.email,
                name: tokenData.user.name,
                role: tokenData.user.role,
            },
        };
    }

    /**
     * Déconnecte l'utilisateur (révoque le token)
     */
    async logout(refreshToken?: string): Promise<void> {
        if (refreshToken) {
            await this.refreshTokenRepository.revoke(refreshToken);
        }
    }

    /**
     * Déconnecte toutes les sessions de l'utilisateur
     */
    async logoutAll(userId: string): Promise<void> {
        await this.refreshTokenRepository.revokeAllForUser(userId);
    }

    /**
     * Récupère le profil de l'utilisateur authentifié
     */
    async getMe(userId: string): Promise<UserProfileResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(404, "Utilisateur introuvable");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}

export const authService = new AuthService();
