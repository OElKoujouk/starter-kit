/**
 * Validation et typage des variables d'environnement.
 * Assure que toutes les variables requises sont présentes au démarrage.
 */

import { z } from "zod";

const envSchema = z.object({
    // Base de données
    DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),

    // Sécurité JWT
    JWT_SECRET: z.string().min(32, "JWT_SECRET doit faire au moins 32 caractères pour être sécurisé"),

    // CORS - Peut être une string simple ou plusieurs valeurs séparées par des virgules
    CORS_ORIGIN: z
        .string()
        .default("http://localhost:3000")
        .transform((val) => {
            if (val.includes(",")) {
                return val
                    .split(",")
                    .map((origin) => origin.trim())
                    .filter(Boolean);
            }
            return val.trim();
        }),

    // Serveur
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // Logging
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

    // URLs
    FRONTEND_URL: z.string().default("http://localhost:3000"),

    // Super-admin (requis pour le bootstrap initial)
    SUPER_ADMIN_EMAIL: z.string().min(1, "SUPER_ADMIN_EMAIL est requis"),
    SUPER_ADMIN_USERNAME: z.string().min(1, "SUPER_ADMIN_USERNAME est requis"),
    SUPER_ADMIN_PASSWORD: z.string().min(1, "SUPER_ADMIN_PASSWORD est requis"),

    // Email Config
    EMAIL_FROM: z.string().email().default("noreply@example.com"),
    EMAIL_PROVIDER: z.enum(["smtp", "resend", "console"]).default("console"),

    // SMTP (si EMAIL_PROVIDER=smtp)
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    // Resend (si EMAIL_PROVIDER=resend)
    RESEND_API_KEY: z.string().optional(),

    // Storage Config
    STORAGE_PROVIDER: z.enum(["local", "s3"]).default("local"),
    UPLOAD_DIR: z.string().default("uploads"),

    // S3 Config (si STORAGE_PROVIDER=s3)
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ACCESS_KEY: z.string().optional(),
    S3_SECRET_KEY: z.string().optional(),
    S3_ENDPOINT: z.string().optional(), // Pour Minio/DigitalOcean
});

// Parse et valide les variables d'environnement au démarrage
function validateEnv() {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error("❌ Configuration des variables d'environnement invalide:");
        console.error(result.error.flatten().fieldErrors);
        process.exit(1);
    }

    return result.data;
}

export const env = validateEnv();

// Type pour l'autocomplétion
export type Env = z.infer<typeof envSchema>;
