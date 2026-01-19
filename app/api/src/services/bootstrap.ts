/**
 * Service de bootstrap.
 * Initialise les données essentielles au démarrage (super-admin).
 */

import bcrypt from "bcryptjs";
import { env, logger } from "../config";
import { userRepository } from "../repositories/user.repository";
import { USER_ROLES } from "@starter-kit/shared";

export async function bootstrap() {
    logger.info("🚀 Bootstrap: Vérification des données initiales...");

    // Vérifier si le super-admin existe déjà via le repository
    const existingAdmin = await userRepository.findByEmail(env.SUPER_ADMIN_EMAIL);

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10);

        await userRepository.create({
            email: env.SUPER_ADMIN_EMAIL,
            name: env.SUPER_ADMIN_USERNAME,
            password: hashedPassword,
            role: USER_ROLES.ADMIN,
        });

        logger.info(`✅ Super-admin créé: ${env.SUPER_ADMIN_EMAIL}`);
    } else {
        logger.info("✅ Super-admin déjà existant");
    }

    logger.info("🎉 Bootstrap terminé");
}
