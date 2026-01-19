# ================================
# STAGE: Development
# ================================
FROM node:20-alpine AS development

WORKDIR /workspace

# Installer les dépendances système
RUN apk add --no-cache openssl

# Copier les fichiers de dépendances
COPY package*.json ./
COPY app/api/package*.json ./app/api/
COPY app/shared/package*.json ./app/shared/

# Installer les dépendances
RUN npm install --workspace=app/api --workspace=app/shared

# Copier le code source
COPY app/api ./app/api
COPY app/shared ./app/shared

WORKDIR /workspace/app/api

# Générer le client Prisma
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]

# ================================
# STAGE: Production Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /workspace

COPY package*.json ./
COPY app/api/package*.json ./app/api/
COPY app/shared/package*.json ./app/shared/

RUN npm ci --workspace=app/api --workspace=app/shared

COPY app/api ./app/api
COPY app/shared ./app/shared

WORKDIR /workspace/app/api

RUN npx prisma generate
RUN npm run build

# ================================
# STAGE: Production
# ================================
FROM node:20-alpine AS production

WORKDIR /workspace/app/api

RUN apk add --no-cache openssl

COPY --from=builder /workspace/app/api/dist ./dist
COPY --from=builder /workspace/app/api/package*.json ./
COPY --from=builder /workspace/app/api/prisma ./prisma
COPY --from=builder /workspace/app/api/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "start"]
