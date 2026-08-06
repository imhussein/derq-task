# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable

# Install dependencies first (cached layer)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# Clean up build cache to keep image small
RUN rm -rf .next/cache

# Stage 2: Run
FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable

# Add a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy only production artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
USER nextjs
CMD ["yarn", "start"]
