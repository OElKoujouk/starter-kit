/**
 * Middleware d'authentification JWT.
 * Vérifie le token Bearer ou Cookie et attache l'utilisateur à la requête.
 */

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { prisma, env } from "../config";
import type { RequestUser } from "../types";

const JWT_SECRET = env.JWT_SECRET;

type JwtPayload = {
    sub: string;
    role: Role;
};

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined;

    // Récupération du token depuis le header Authorization
    const authorization = req.header("authorization");
    if (authorization) {
        const [scheme, tokenValue] = authorization.split(" ");
        if (scheme?.toLowerCase() === "bearer") {
            token = tokenValue;
        }
    }

    // Fallback: vérifier les cookies si pas de header
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Token requis (Header ou Cookie)" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const dbUser = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, role: true, active: true },
        });

        if (!dbUser) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        if (!dbUser.active) {
            return res.status(403).json({ message: "Compte désactivé" });
        }

        const user: RequestUser = {
            id: dbUser.id,
            role: dbUser.role,
        };

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: "Token invalide" });
    }
}
