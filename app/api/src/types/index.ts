/**
 * Types pour les requêtes Express.
 * Étend les types Express pour inclure l'utilisateur authentifié.
 */

import type { Role } from "@prisma/client";

export interface RequestUser {
    id: string;
    role: Role;
}

// Extension des types Express
declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}
