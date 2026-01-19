#!/bin/bash
# Script de démarrage en développement
# Usage: ./infra/scripts/dev.sh

set -e

echo "🚀 Démarrage de l'environnement de développement..."

# Vérifier si Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Démarrer la base de données
echo "📦 Démarrage de PostgreSQL..."
docker-compose -f infra/docker/docker-compose.dev.yml up -d db

# Attendre que la DB soit prête
echo "⏳ Attente de la base de données..."
sleep 3

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
cd app/api
npx prisma generate

# Appliquer les migrations
echo "📊 Application des migrations..."
npx prisma migrate dev --name init 2>/dev/null || npx prisma migrate dev

cd ../..

echo "✅ Environnement prêt !"
echo ""
echo "Pour démarrer le projet : npm run dev"
