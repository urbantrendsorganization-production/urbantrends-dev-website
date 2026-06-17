# UrbanTrends Next.js frontend — multi-stage build producing a small runtime
# image from Next.js standalone output (see output: "standalone" in next.config.ts).

# ---- Builder ----------------------------------------------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies from the lockfile for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci

# Rewrites in next.config.ts are baked into routes-manifest.json at build time,
# so BACKEND_URL must be a build arg. NEXT_PUBLIC_SITE_URL is also inlined into
# the client bundle at build time.
ARG NEXT_PUBLIC_SITE_URL
ARG BACKEND_URL=http://backend:8000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV BACKEND_URL=${BACKEND_URL}

COPY . .
RUN npm run build

# ---- Runner -----------------------------------------------------------------
FROM node:22-slim AS runner

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
