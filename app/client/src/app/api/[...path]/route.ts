import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@starter-kit/shared";

/**
 * Route Handler générique (Proxy BFF).
 * Permet au client d'appeler l'API sans gérer les tokens (sécurité HttpOnly).
 */

const BACKEND_URL = process.env.API_URL || "http://api:4000/api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, params);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, params);
}

async function proxy(request: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
    try {
        const { path } = await paramsPromise;
        const targetPath = path.join("/");

        const url = new URL(targetPath, BACKEND_URL.endsWith("/") ? BACKEND_URL : `${BACKEND_URL}/`);
        url.search = request.nextUrl.search;

        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_CONFIG.TOKEN_NAME)?.value;

        const headers = new Headers(request.headers);
        headers.delete("host");
        headers.delete("cookie");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        let body: any = null;
        if (!["GET", "HEAD"].includes(request.method)) {
            body = await request.arrayBuffer();
        }

        const response = await fetch(url.toString(), {
            method: request.method,
            headers,
            body,
            cache: "no-store",
        });

        const data = await response.arrayBuffer();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ message: "Erreur de connexion avec l'API" }, { status: 502 });
    }
}
