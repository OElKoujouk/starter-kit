/**
 * Routes d'authentification.
 */

import { Router } from "express";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/error-handler";
import { loginSchema, refreshSchema, logoutSchema } from "../validators/auth.validator";
import { authService } from "../services/auth.service";

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Authentifie un utilisateur
 */
authRouter.post(
    "/login",
    validate({ body: loginSchema }),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const userAgent = req.headers["user-agent"];
        const ipAddress = req.ip;

        const result = await authService.login(email, password, userAgent, ipAddress);
        res.json(result);
    }),
);

/**
 * POST /api/auth/refresh
 * Renouvelle l'access token
 */
authRouter.post(
    "/refresh",
    validate({ body: refreshSchema }),
    asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        const userAgent = req.headers["user-agent"];
        const ipAddress = req.ip;

        const result = await authService.refresh(refreshToken, userAgent, ipAddress);
        res.json(result);
    }),
);

/**
 * POST /api/auth/logout
 * Déconnecte l'utilisateur
 */
authRouter.post(
    "/logout",
    validate({ body: logoutSchema }),
    asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        res.json({ message: "Déconnexion réussie" });
    }),
);

/**
 * GET /api/auth/me
 * Récupère le profil de l'utilisateur connecté
 */
authRouter.get(
    "/me",
    authMiddleware,
    asyncHandler(async (req, res) => {
        const user = await authService.getMe(req.user!.id);
        res.json(user);
    }),
);

/**
 * POST /api/auth/logout-all
 * Déconnecte toutes les sessions de l'utilisateur
 */
authRouter.post(
    "/logout-all",
    authMiddleware,
    asyncHandler(async (req, res) => {
        await authService.logoutAll(req.user!.id);
        res.json({ message: "Toutes les sessions ont été fermées" });
    }),
);
