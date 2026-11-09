# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && rm -rf .next/cache

# The custom Express/Next server uses tsx at runtime. Install its production
# dependency tree separately instead of shipping the builder's development tools.
FROM node:22-alpine AS runtime-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3006 \
    INTERNAL_API_URL=http://127.0.0.1:3006/api/v1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy dependency, source and static files
COPY --from=runtime-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/start.js ./start.js

USER nextjs
EXPOSE 3006

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "Promise.all(['/api/health','/api/v1/health'].map(p=>fetch('http://127.0.0.1:'+(process.env.PORT||3006)+p,{signal:AbortSignal.timeout(3000)}).then(async r=>{const d=await r.json();if(!r.ok||d.status!=='ok')throw Error('unhealthy')}))).catch(()=>process.exit(1))"

CMD ["node", "start.js"]
