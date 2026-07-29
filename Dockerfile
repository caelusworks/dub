# syntax=docker/dockerfile:1
# ---- Dub web app container (pnpm + Turborepo monorepo) ----
# Build context must be the repo ROOT (not apps/web) — the app depends on
# workspace packages under packages/* and the root lockfile.

# node 24, not 20: pnpm 11 imports node:sqlite, which only exists from node 22 up
# (and is still flagged experimental there)
FROM node:24-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
# openssl is required by Prisma engines on debian-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# must match "packageManager" in package.json or corepack refuses to run
RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

# ---- deps: install the full monorepo dependency graph ----
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/package.json
# copy every workspace package manifest so pnpm can resolve the graph
COPY packages/ packages/
RUN pnpm install --frozen-lockfile

# ---- builder: bring in full source and build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build-time config arrives as build args, not a .env file — Coolify keeps env
# vars as entries and never writes .env into the build context. dotenv-flow just
# warns when .env is absent, so the real process env below is what gets used:
# prisma generate resolves DATABASE_URL, and NEXT_PUBLIC_* are inlined into the
# client bundle here (setting them at runtime has no effect).
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_DOMAIN
ARG NEXT_PUBLIC_APP_SHORT_DOMAIN
ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_APP_DOMAIN=$NEXT_PUBLIC_APP_DOMAIN \
    NEXT_PUBLIC_APP_SHORT_DOMAIN=$NEXT_PUBLIC_APP_SHORT_DOMAIN

# next build exceeds node's default heap ceiling (~4.2GB in-container) and aborts
# with SIGABRT/134; needs headroom on the build host
ENV NODE_OPTIONS=--max-old-space-size=6144

# workspace packages publish from dist/, which is gitignored — turbo would build
# them via dependsOn ^build, but --filter bypasses that graph, so do it explicitly.
# Serialised: `pnpm -r` fans out to one process per core by default, and each gets
# its own heap.
RUN pnpm -r --workspace-concurrency=1 --filter "./packages/**" build \
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
# next start serves the prebuilt .next; runtime env comes from the compose
# environment: block, which Coolify populates from its env entries
CMD ["pnpm", "start", "--", "--port", "3000"]
