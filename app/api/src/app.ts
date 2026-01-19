/**
 * Configuration de l'application Express.
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/auth";
import { xssMiddleware } from "./middleware/xss";
import { errorHandler } from "./middleware/error-handler";
import { apiRouter } from "./routes";
import { env, logger } from "./config";

export const app = express();

// Trust proxy pour le rate limiting derrière Nginx
app.set("trust proxy", 1);

// Middlewares de base
app.use(express.json());
app.use(cookieParser());
app.use(xssMiddleware);
app.use(helmet());

// Configuration CORS
const corsOrigin = env.CORS_ORIGIN as string | string[];
const allowedOrigins = Array.isArray(corsOrigin) ? corsOrigin : [corsOrigin];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Requêtes sans Origin (server-to-server) autorisées
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn({ origin, allowedOrigins }, "CORS: Origine non autorisée");
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting pour le login
const loginLimiter = rateLimit({
    windowMs: 60_000,
    max: env.NODE_ENV === "development" ? 1000 : 10,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/auth/login", loginLimiter);

// Rate limiting global
const globalLimiter = rateLimit({
    windowMs: 5 * 60_000,
    max: env.NODE_ENV === "development" ? 100000 : 500,
    message: { message: "Trop de requêtes, veuillez patienter", code: "RATE_LIMIT_EXCEEDED" },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.NODE_ENV === "development",
});
app.use("/api", globalLimiter);

// Routes API
app.use("/api", apiRouter(authMiddleware));

// 404 Handler
app.use("/api", (_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ message: "Route introuvable", code: "NOT_FOUND" });
});

// Error Handler (doit être en dernier)
app.use(errorHandler);
