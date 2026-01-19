import { Request, Response, NextFunction } from "express";
import { filterXSS } from "xss";

/**
 * Middleware pour nettoyer récursivement les données d'entrée contre les attaques XSS.
 * Protège req.body, req.query et req.params.
 */
export const xssMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query as any);
    }
    if (req.params) {
        req.params = sanitize(req.params as any);
    }
    next();
};

function sanitize(data: any): any {
    if (typeof data === "string") {
        return filterXSS(data);
    }
    if (Array.isArray(data)) {
        return data.map((item) => sanitize(item));
    }
    if (typeof data === "object" && data !== null) {
        const clean: any = {};
        for (const key in data) {
            clean[key] = sanitize(data[key]);
        }
        return clean;
    }
    return data;
}
