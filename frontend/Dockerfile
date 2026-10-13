FROM node:20-alpine AS dependencies

WORKDIR /app
RUN apk add --no-cache openssl

# package-lock.json is currently not committed to this repository.
# Support both situations: reproducible npm ci when present, npm install otherwise.
COPY package*.json ./
COPY prisma ./prisma
ENV DATABASE_URL=postgresql://unused:unused@localhost:5432/unused
ENV HUSKY=0
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_DJANGO_HOST_URL=http://localhost:8000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_DJANGO_HOST_URL=$NEXT_PUBLIC_DJANGO_HOST_URL
ENV DATABASE_URL=postgresql://unused:unused@localhost:5432/unused
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/next.config.js ./next.config.js
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["npm", "start"]
