# syntax=docker/dockerfile:1
# ---- Dub web app container (pnpm + Turborepo monorepo) ----
FROM node:24-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

# ---- deps: install the full monorepo dependency graph ----
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ packages/
RUN pnpm install --frozen-lockfile

# ---- builder: bring in full source and build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build-time config arrives as build args
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_DOMAIN
ARG NEXT_PUBLIC_APP_SHORT_DOMAIN
ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_APP_DOMAIN=$NEXT_PUBLIC_APP_DOMAIN \
    NEXT_PUBLIC_APP_SHORT_DOMAIN=$NEXT_PUBLIC_APP_SHORT_DOMAIN
ENV NODE_OPTIONS=--max-old-space-size=6144

# cache mounts persist on the build host between builds: webpack recompiles
# incrementally instead of from scratch, which dominates the ~17min build
RUN --mount=type=cache,target=/app/apps/web/.next/cache \
    --mount=type=cache,target=/pnpm/store \
    pnpm -r --workspace-concurrency=1 --filter "./packages/**" build \
    && pnpm --filter web build

# ---- runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# No standalone output configured upstream, so ship the built app + node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/package.json /app/turbo.json /app/pnpm-workspace.yaml ./
WORKDIR /app/apps/web
EXPOSE 3000
# next start reads PORT from the env. Passing `-- --port 3000` through pnpm made
# next treat the bare `--` as the project directory ("no such directory: /--port").
ENV PORT=3000
# next start serves the prebuilt .next; runtime env comes from the compose environment
CMD ["pnpm", "start"]
