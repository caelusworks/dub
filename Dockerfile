# syntax=docker/dockerfile:1
# ---- Dub web app container (pnpm 9 + Turborepo monorepo) ----
# Build context must be the repo ROOT (not apps/web) — the app depends on
# workspace packages under packages/* and the root lockfile.

FROM node:20-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
# openssl is required by Prisma engines on debian-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

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
# Prisma client generation + next build. Build reads env via dotenv-flow -e .env,
# so a .env must exist at apps/web/.env at build time (see notes). Public NEXT_PUBLIC_*
# vars are inlined at build, so they must be correct here, not just at runtime.
RUN --mount=type=secret,id=dubenv,target=/app/apps/web/.env \
    pnpm --filter web build

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
# next start serves the prebuilt .next; runtime env comes from compose env_file
CMD ["pnpm", "start", "--", "--port", "3000"]
