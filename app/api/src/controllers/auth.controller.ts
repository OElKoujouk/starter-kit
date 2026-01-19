/**
 * Controller pour l'authentification.
 * Fait le pont entre HTTP et la logique métier (Service).
 */

import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
    /**
     * POST /api/auth/login
     */
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userAgent = req.headers["user-agent"];
        const ipAddress = req.ip;

        const result = await authService.login(email, password, userAgent, ipAddress);
        res.json(result);
    },

    /**
     * POST /api/auth/refresh
     */
    refresh: async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        const userAgent = req.headers["user-agent"];
        const ipAddress = req.ip;

        const result = await authService.refresh(refreshToken, userAgent, ipAddress);
        res.json(result);
    },

    /**
     * POST /api/auth/logout
     */
    logout: async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        res.json({ message: "Déconnexion réussie" });
    },

    /**
     * GET /api/auth/me
     */
    getMe: async (req: Request, res: Response) => {
        const user = await authService.getMe(req.user!.id);
        res.json(user);
    },

    /**
     * POST /api/auth/logout-all
     */
    logoutAll: async (req: Request, res: Response) => {
        await authService.logoutAll(req.user!.id);
        res.json({ message: "Toutes les sessions ont été fermées" });
    },
};
