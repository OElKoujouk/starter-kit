import { User, Role } from "@starter-kit/shared";

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
}
