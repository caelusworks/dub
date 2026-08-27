# syntax=docker/dockerfile:1
# ---- Dub web app container (pnpm + Turborepo monorepo) ----
FROM node:24-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# must match "packageManager" in package.json, or corepack re-downloads on every build
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

# ---- deps: install the full monorepo dependency graph ----
FROM base AS deps
WORKDIR /app
# fetch keys on the lockfile alone, so editing package source cannot invalidate it
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm/store pnpm fetch
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ packages/
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline

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
ARG NEXT_PUBLIC_AUTH_METHODS
ARG NEXT_PUBLIC_BILLING_ENABLED
ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_APP_DOMAIN=$NEXT_PUBLIC_APP_DOMAIN \
    NEXT_PUBLIC_APP_SHORT_DOMAIN=$NEXT_PUBLIC_APP_SHORT_DOMAIN \
    NEXT_PUBLIC_AUTH_METHODS=$NEXT_PUBLIC_AUTH_METHODS \
    NEXT_PUBLIC_BILLING_ENABLED=$NEXT_PUBLIC_BILLING_ENABLED
ENV NODE_OPTIONS=--max-old-space-size=6144

# cache mount persists on a long-lived build host, so webpack recompiles incrementally.
# It is empty on GitHub Actions: buildx creates a fresh builder per job and cache mounts
# are not exported by cache-to. Layer caching is what helps there.
RUN --mount=type=cache,target=/app/apps/web/.next/cache \
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

# ---- runner-standalone: experimental, build with --target runner-standalone ----
# Ships only what Next traced as reachable instead of the whole 2.4GB node_modules.
# Verify the Prisma query engine is present before trusting it in prod.
FROM base AS runner-standalone
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
WORKDIR /app/apps/web
EXPOSE 3000
# standalone binds localhost by default, which is unreachable from outside the container
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
