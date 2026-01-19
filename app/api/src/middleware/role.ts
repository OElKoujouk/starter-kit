/**
 * Middleware de vérification des rôles.
 * Restreint l'accès aux routes selon le rôle de l'utilisateur.
 */

import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";

/**
 * Crée un middleware qui autorise uniquement les rôles spécifiés.
 *
 * @example
 * router.delete("/:id", requireRole("ADMIN"), controller.delete);
 */
export function requireRole(...allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Non authentifié", code: "UNAUTHORIZED" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Accès refusé", code: "FORBIDDEN" });
        }

        next();
    };
}
