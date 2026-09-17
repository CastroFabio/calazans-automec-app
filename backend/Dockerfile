# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 - deps: instala dependencias e gera o Prisma Client
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

# As devDependencies permanecem na imagem final de proposito:
# "prisma migrate deploy" e "prisma db seed" (ts-node) dependem delas.
RUN npm ci

# URL falsa apenas para o generate - nenhuma conexao e aberta aqui
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
RUN npx prisma generate

# ---------------------------------------------------------------------------
# Stage 2 - build: compila o TypeScript (nest build)
# ---------------------------------------------------------------------------
FROM deps AS build
WORKDIR /app

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

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
COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/tsconfig*.json ./


USER node
EXPOSE 3000

CMD ["node", "dist/src/main"]
