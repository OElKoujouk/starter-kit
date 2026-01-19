/**
 * Configuration du logger Pino.
 * En développement: format lisible avec pino-pretty.
 * En production: JSON structuré pour les outils de monitoring.
 */

import pino from "pino";
import { env } from "./env";

const isDev = env.NODE_ENV === "development";

export const logger = pino({
    level: env.LOG_LEVEL,
    transport: isDev
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname",
            },
        }
        : undefined,
});
