# ================================
# STAGE: Development
# ================================
FROM node:20-alpine AS development

WORKDIR /workspace

# Copier les fichiers de dépendances
COPY package*.json ./
COPY app/client/package*.json ./app/client/
COPY app/shared/package*.json ./app/shared/

# Installer les dépendances
RUN npm install --workspace=app/client --workspace=app/shared

# Copier le code source
COPY app/client ./app/client
COPY app/shared ./app/shared

WORKDIR /workspace/app/client

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ================================
# STAGE: Production Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /workspace

COPY package*.json ./
COPY app/client/package*.json ./app/client/
COPY app/shared/package*.json ./app/shared/

RUN npm ci --workspace=app/client --workspace=app/shared

COPY app/client ./app/client
COPY app/shared ./app/shared

WORKDIR /workspace/app/client

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ================================
# STAGE: Production
# ================================
FROM node:20-alpine AS production

WORKDIR /workspace/app/client

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /workspace/app/client/public ./public
COPY --from=builder --chown=nextjs:nodejs /workspace/app/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/app/client/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
