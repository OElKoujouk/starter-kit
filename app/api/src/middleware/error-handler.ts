/**
 * Middleware de gestion centralisée des erreurs.
 * Capture toutes les erreurs non gérées et retourne une réponse HTTP appropriée.
 */

import type { Request, Response, NextFunction } from "express";
import { logger } from "../config";

/**
 * Classe d'erreur applicative avec code HTTP.
 * Utilisée pour les erreurs métier prévisibles.
 *
 * @example
 * throw new AppError(404, "Ressource introuvable", "NOT_FOUND");
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string,
    ) {
        super(message);
        this.name = "AppError";
    }
}

/**
 * Erreurs courantes pré-définies.
 */
export const Errors = {
    notFound: (resource: string) => new AppError(404, `${resource} introuvable`, "NOT_FOUND"),
    unauthorized: () => new AppError(401, "Non authentifié", "UNAUTHORIZED"),
    forbidden: (reason?: string) => new AppError(403, reason ?? "Accès refusé", "FORBIDDEN"),
    badRequest: (message: string) => new AppError(400, message, "BAD_REQUEST"),
    conflict: (message: string) => new AppError(409, message, "CONFLICT"),
};

/**
 * Middleware de gestion des erreurs.
 * Doit être enregistré en dernier dans la chaîne de middlewares.
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    // Erreur applicative connue
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
            code: err.code,
        });
        return;
    }

    // Erreur Prisma de contrainte unique
    if (err.name === "PrismaClientKnownRequestError" && (err as unknown as { code: string }).code === "P2002") {
        res.status(409).json({
            message: "Conflit de données",
            code: "UNIQUE_CONSTRAINT",
        });
        return;
    }

    // Erreur inconnue - log et réponse générique
    logger.error({ err, stack: err.stack }, "Erreur non gérée");
    res.status(500).json({
        message: "Erreur serveur interne",
        code: "INTERNAL_ERROR",
    });
}

/**
 * Wrapper pour les handlers async.
 * Capture automatiquement les erreurs et les passe au middleware d'erreur.
 *
 * @example
 * router.get("/", asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
