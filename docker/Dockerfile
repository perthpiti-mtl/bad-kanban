# Multi-stage Dockerfile for SvelteKit application
# Stage 1: Dependencies - Install all dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies needed for node-gyp
RUN apk add --no-cache libc6-compat

# Copy package files and yarn configuration
COPY package.json yarn.lock* .yarnrc.yml ./

# Enable corepack for yarn
RUN corepack enable

# Install dependencies
RUN yarn install --immutable

# Stage 2: Builder - Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies needed for node-gyp
RUN apk add --no-cache libc6-compat

# Enable corepack for yarn
RUN corepack enable

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Stage 3: Runner - Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install dependencies needed for running the app
RUN apk add --no-cache libc6-compat

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs sveltekit

# Enable corepack for yarn
RUN corepack enable

# Copy package files and yarn configuration for production install
COPY package.json yarn.lock* .yarnrc.yml ./

# Install only production dependencies
RUN yarn install --immutable && yarn cache clean

# Copy built application from builder stage
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/static ./static
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json

# Switch to non-root user
USER sveltekit

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Health check configuration
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "build/index.js"]