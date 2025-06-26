# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY libs ./libs
COPY apps/frontend ./apps/frontend
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter frontend build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/public ./public
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"] 