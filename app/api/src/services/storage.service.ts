import fs from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env, logger } from "../config";

/**
 * Service de stockage universel.
 * Supporte : Local (dev) et S3 (prod).
 */

class StorageService {
    private s3Client: S3Client | null = null;

    constructor() {
        if (env.STORAGE_PROVIDER === "s3") {
            this.s3Client = new S3Client({
                region: env.S3_REGION,
                credentials: {
                    accessKeyId: env.S3_ACCESS_KEY!,
                    secretAccessKey: env.S3_SECRET_KEY!,
                },
                endpoint: env.S3_ENDPOINT, // Facultatif (Minio/DigitalOcean)
            });
            logger.info("StorageService: Initialisé avec S3");
        } else {
            logger.info("StorageService: Initialisé avec Local Storage");
            this.ensureUploadDir();
        }
    }

    private async ensureUploadDir() {
        try {
            await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
        } catch (error) {
            logger.error("Impossible de créer le dossier d'upload:", error);
        }
    }

    /**
     * Upload un fichier
     */
    async uploadFile(file: Express.Multer.File, folder = ""): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(folder, fileName);

        if (this.s3Client) {
            // Upload vers S3
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: env.S3_BUCKET,
                    Key: filePath,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                })
            );
            return filePath; // Retourne la clé S3 ou l'URL complète selon besoin
        } else {
            // Upload local
            const fullPath = path.join(env.UPLOAD_DIR, filePath);
            const dir = path.dirname(fullPath);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(fullPath, file.buffer);
            return filePath;
        }
    }

    /**
     * Supprime un fichier
     */
    async deleteFile(filePath: string): Promise<void> {
        if (this.s3Client) {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: env.S3_BUCKET,
                    Key: filePath,
                })
            );
        } else {
            const fullPath = path.join(env.UPLOAD_DIR, filePath);
            await fs.unlink(fullPath).catch(() => {
                logger.warn(`Fichier non trouvé pour suppression: ${fullPath}`);
            });
        }
    }
}

export const storageService = new StorageService();
