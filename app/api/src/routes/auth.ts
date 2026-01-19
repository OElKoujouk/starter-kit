import { Router } from "express";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/error-handler";
import { loginSchema, refreshSchema, logoutSchema } from "../validators/auth.validator";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Authentifie un utilisateur
 */
authRouter.post(
    "/login",
    validate({ body: loginSchema }),
    asyncHandler(authController.login),
);

/**
 * POST /api/auth/refresh
 * Renouvelle l'access token
 */
authRouter.post(
    "/refresh",
    validate({ body: refreshSchema }),
    asyncHandler(authController.refresh),
);

/**
 * POST /api/auth/logout
 * Déconnecte l'utilisateur
 */
authRouter.post(
    "/logout",
    validate({ body: logoutSchema }),
    asyncHandler(authController.logout),
);

/**
 * GET /api/auth/me
 * Récupère le profil de l'utilisateur connecté
 */
authRouter.get(
    "/me",
    authMiddleware,
    asyncHandler(authController.getMe),
);

/**
 * POST /api/auth/logout-all
 * Déconnecte toutes les sessions de l'utilisateur
 */
authRouter.post(
    "/logout-all",
    authMiddleware,
    asyncHandler(authController.logoutAll),
);

