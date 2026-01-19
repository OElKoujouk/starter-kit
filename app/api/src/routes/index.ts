/**
 * Point d'entrée des routes API.
 */

import type { RequestHandler } from "express";
import { Router } from "express";
import { authRouter } from "./auth";
import { prisma } from "../config";

export function apiRouter(authMiddleware: RequestHandler) {
    const router = Router();

    // Route de healthcheck (accessible sans authentification)
    router.get("/health", async (_req, res) => {
        try {
            await prisma.$queryRaw`SELECT 1`;
            res.status(200).json({
                status: "ok",
                db: "connected",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        } catch (error) {
            res.status(503).json({
                status: "error",
                db: "disconnected",
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    // Routes publiques (auth)
    router.use("/auth", authRouter);

    // ============================================
    // Routes protégées (ajouter les routes ici)
    // ============================================
    router.use(authMiddleware);

    // Exemple: router.use("/users", usersRouter);
    // Exemple: router.use("/products", productsRouter);

    return router;
}
