# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 - deps: instala tudo (dev incluso) e gera o Prisma Client
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# openssl -> exigido pelo Prisma
# python3/make/g++ -> compilacao do bcrypt quando nao ha binario pre-compilado
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci

# URL falsa apenas para o generate - nenhuma conexao e aberta aqui
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
RUN npx prisma generate

# ---------------------------------------------------------------------------
# Stage 2 - build: compila o TypeScript e enxuga o node_modules
# ---------------------------------------------------------------------------
FROM deps AS build
WORKDIR /app

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# nest build compila src/ E prisma/seed.ts -> dist/src/main.js e dist/prisma/seed.js
RUN npm run build

# Fora as devDependencies (nest cli, jest, eslint, typescript, ts-node...). O que a imagem
# final ainda precisa em runtime - prisma (migrate deploy) e dotenv (prisma.config.ts e o
# seed) - esta em "dependencies" no package.json, entao sobrevive ao prune.
# O generate roda de novo porque o prune pode levar node_modules/.prisma junto.
RUN npm prune --omit=dev \
    && npx prisma generate \
    && npm cache clean --force

# ---------------------------------------------------------------------------
# Stage 3 - runtime: imagem final
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/prisma.config.ts ./prisma.config.ts
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 3000

# Migrations: npx prisma migrate deploy   |   Seed: node dist/prisma/seed.js
CMD ["node", "dist/src/main"]
