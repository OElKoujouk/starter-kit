/**
 * Proxy pour la protection des routes (Next.js 16+).
 * Centralise la logique d'authentification et de redirection.
 */

import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "@starter-kit/shared";

// Routes qui nécessitent une authentification (ex: ["/profile", "/settings"])
const protectedRoutes: string[] = [];

// Routes publiques (redirige vers l'accueil si déjà connecté pour éviter de se re-connecter)
const authRoutes = ["/login", "/register"];

export const config = {
    matcher: [
        // Exclure les fichiers statiques et API
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
    ],
};

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_CONFIG.TOKEN_NAME)?.value;
    const isAuthenticated = !!token;

    // Protection des routes privées
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirection si déjà connecté sur les pages auth (login/register)
    const isAuthRoute = authRoutes.some((route) => pathname === route);

    if (isAuthRoute && isAuthenticated) {
        // Redirige vers la home si déjà connecté
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}
