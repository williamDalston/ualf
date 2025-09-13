FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install
COPY apps/web ./apps/web
RUN pnpm -C apps/web build

FROM node:20-alpine AS run
WORKDIR /app/apps/web
ENV PORT=3001
ENV HOST=0.0.0.0
RUN corepack enable
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json
EXPOSE 3001
CMD ["pnpm","start","-p","3001"]
