# UrbanTrends Next.js frontend — multi-stage build producing a small runtime
# image from Next.js standalone output (see output: "standalone" in next.config.ts).

# ---- Builder ----------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies from the lockfile for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build. BACKEND_URL is only read by next.config.ts rewrites at
# runtime (the standalone server reads process.env at boot), so it isn't needed
# here. NEXT_PUBLIC_SITE_URL, however, is inlined into the client bundle at
# build time, so it must be supplied as a build arg when set.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY . .
RUN npm run build

# ---- Runner -----------------------------------------------------------------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as the unprivileged "node" user that ships with the base image.
USER node

# Standalone output bundles a minimal node_modules and a server.js entrypoint.
# Static assets and the public/ dir must be copied alongside it.
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
