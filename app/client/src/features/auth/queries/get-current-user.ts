import { User } from "@starter-kit/shared";
import { getServerUser } from "@/lib/server-api";

/**
 * Récupère l'utilisateur actuellement connecté depuis le token JWT.
 */
export async function getCurrentUser(): Promise<User | null> {
    return getServerUser();
}
