import { UserRole, USER_ROLES } from "./constants";

export type Role = UserRole;

export type Permission =
    | "manage_users"
    | "manage_settings"
    | "view_dashboard"
    | "create_content";

const PERMISSIONS_BY_ROLE: Record<Role, Permission[]> = {
    [USER_ROLES.ADMIN]: ["manage_users", "manage_settings", "view_dashboard", "create_content"],
    [USER_ROLES.USER]: ["view_dashboard", "create_content"],
};

/**
 * Vérifie si un rôle possède une permission spécifique.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    return PERMISSIONS_BY_ROLE[role]?.includes(permission) ?? false;
}

/**
 * Récupère toutes les permissions pour un rôle.
 */
export function getPermissionsForRole(role: Role): Permission[] {
    return PERMISSIONS_BY_ROLE[role] ?? [];
}
