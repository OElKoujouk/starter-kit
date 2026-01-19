/**
 * Point d'entrée du serveur.
 */

import "dotenv/config";
import { app } from "./app";
import { env, logger, prisma } from "./config";
import { bootstrap } from "./services/bootstrap";

async function main() {
    try {
        // Connexion à la base de données
        await prisma.$connect();
        logger.info("✅ Connexion à la base de données établie");

        // Bootstrap des données initiales
        await bootstrap();

        // Démarrage du serveur
        app.listen(env.PORT, () => {
            logger.info(`🚀 Serveur démarré sur le port ${env.PORT}`);
            logger.info(`📍 Environnement: ${env.NODE_ENV}`);
        });
    } catch (error) {
        logger.error({ error }, "❌ Erreur au démarrage du serveur");
        process.exit(1);
    }
}

// Gestion de l'arrêt propre
process.on("SIGTERM", async () => {
    logger.info("SIGTERM reçu, arrêt du serveur...");
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGINT", async () => {
    logger.info("SIGINT reçu, arrêt du serveur...");
    await prisma.$disconnect();
    process.exit(0);
});

main();
