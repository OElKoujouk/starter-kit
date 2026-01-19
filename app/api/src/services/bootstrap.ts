/**
 * Service de bootstrap.
 * Initialise les données essentielles au démarrage (super-admin).
 */

import bcrypt from "bcryptjs";
import { prisma, env, logger } from "../config";

export async function bootstrap() {
    logger.info("🚀 Bootstrap: Vérification des données initiales...");

    // Créer le super-admin s'il n'existe pas
    const existingAdmin = await prisma.user.findUnique({
        where: { email: env.SUPER_ADMIN_EMAIL },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10);

        await prisma.user.create({
            data: {
                email: env.SUPER_ADMIN_EMAIL,
                name: env.SUPER_ADMIN_USERNAME,
                password: hashedPassword,
                role: "ADMIN",
                active: true,
            },
        });

        logger.info(`✅ Super-admin créé: ${env.SUPER_ADMIN_EMAIL}`);
    } else {
        logger.info("✅ Super-admin déjà existant");
    }

    logger.info("🎉 Bootstrap terminé");
}
