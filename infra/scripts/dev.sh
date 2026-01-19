#!/bin/bash
# Script de démarrage en développement
# Usage: ./infra/scripts/dev.sh [--fresh] [--migrations]

set -Eeuo pipefail

# ---------- CONFIG ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="infra/docker/docker-compose.dev.yml"
ENV_FILE=".env.dev"

# ---------- COULEURS ----------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
ok() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err() { echo -e "${RED}❌ $1${NC}"; }

# ---------- FLAGS ----------
DO_FRESH=0
DO_MIGRATIONS=0

for arg in "$@"; do
  case "$arg" in
    --fresh) DO_FRESH=1 ;;
    --migrations) DO_MIGRATIONS=1 ;;
    *)
      err "Argument inconnu: $arg"
      echo "Usage: $0 [--fresh] [--migrations]"
      exit 1
      ;;
  esac
done

# ---------- VÉRIFICATIONS ----------
if ! command -v docker &> /dev/null; then
  err "Docker n'est pas installé"
  exit 1
fi

cd "$PROJECT_DIR"

if [ ! -f "$ENV_FILE" ]; then
  warn "Fichier $ENV_FILE manquant, copie de .env.example..."
  cp .env.example "$ENV_FILE"
fi

echo ""
echo "� Démarrage de l'environnement de DÉVELOPPEMENT..."
echo ""

# ---------- NETTOYAGE SI --fresh ----------
if [ "$DO_FRESH" -eq 1 ]; then
  info "Nettoyage complet demandé..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --remove-orphans
fi

# ---------- DÉMARRAGE DB ----------
info "Démarrage de PostgreSQL..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d db

# Attendre que la DB soit prête
info "Attente de la base de données..."
sleep 3

# Vérifier que la DB est healthy
until docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T db pg_isready -U postgres > /dev/null 2>&1; do
  echo -n "."
  sleep 1
done
echo ""
ok "Base de données prête"

# ---------- BUILD & START SERVICES ----------
info "Build et démarrage des services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build api client

# Attendre que l'API soit prête
info "Attente de l'API..."
sleep 5

# ---------- MIGRATIONS ----------
info "Exécution des migrations Prisma..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T api npx prisma migrate deploy || {
  warn "Migrations deploy échouées, tentative avec migrate dev..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T api npx prisma migrate dev --name init
}

# ---------- PRISMA GENERATE ----------
info "Génération du client Prisma..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T api npx prisma generate > /dev/null

# ---------- STATUS MIGRATIONS ----------
if [ "$DO_MIGRATIONS" -eq 1 ]; then
  info "Status des migrations:"
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T api npx prisma migrate status || true
fi

echo ""
ok "Environnement prêt !"
echo ""
echo "------------------------------------------------"
echo "🌐 Client : http://localhost:3000"
echo "🔌 API    : http://localhost:4000/api"
echo "------------------------------------------------"
echo ""
echo "💡 Commandes utiles:"
echo "   Logs API    : docker compose -f $COMPOSE_FILE logs -f api"
echo "   Logs Client : docker compose -f $COMPOSE_FILE logs -f client"
echo "   Prisma Studio: docker compose -f $COMPOSE_FILE exec api npx prisma studio"
echo "   Arrêter     : docker compose -f $COMPOSE_FILE down"
