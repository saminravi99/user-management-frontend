################################################################################
# FRONTEND DOCKERFILE FOR USER MANAGEMENT APPLICATION (NEXT.JS + REACT)
#
# WHY: Next.js apps can be huge if not optimized properly (500MB+)
#      We use multi-stage build with Next.js standalone mode to create
#      a minimal production image
#
# WHAT: This creates a production-ready Next.js container that:
#       - Installs dependencies in isolation (better caching)
#       - Builds optimized production bundle
#       - Uses standalone mode (only copies files needed at runtime)
#       - Runs as non-root user for security
#
# HOW: Uses 3-stage Docker build:
#      Stage 1 (deps): Install node_modules
#      Stage 2 (builder): Build Next.js app with standalone output
#      Stage 3 (runner): Copy minimal files, run production server
#
# WHERE: This runs as a Docker container, receives requests from Nginx
#        Serves React pages and API routes (Next.js can do both)
#
# WHEN: Built during CI/CD pipeline, deployed alongside backend and Nginx
#
# SIZE COMPARISON:
# Without standalone: ~800MB (includes all node_modules)
# With standalone: ~200MB (only runtime dependencies)
################################################################################

################################################################################
# STAGE 1: DEPS - Install dependencies in isolation
################################################################################
FROM node:20-alpine AS deps
# Explanation: Dedicated stage just for installing node_modules
# Why separate stage:
# - Better Docker caching (if package.json doesn't change, reuse this layer)
# - Faster builds when only code changes (skip reinstalling deps)
# - Clean separation of concerns

################################################################################
# Install compatibility library
################################################################################
RUN apk add --no-cache libc6-compat
# Explanation: Install GNU C Library compatibility layer
# "apk add" = Alpine's package manager
# "--no-cache" = don't save package index (saves ~5MB)
# "libc6-compat" = compatibility library
#
# Why needed:
# Some npm packages are compiled for GNU libc (standard Linux C library)
# Alpine uses musl libc (lighter, but incompatible)
# libc6-compat bridges the gap
#
# Packages that might need this:
# - sharp (image processing)
# - bcrypt (password hashing, if used in frontend)
# - node-sass (if using Sass, though you should use Dart Sass)
# - sqlite3, better-sqlite3 (database drivers)
#
# Without this, you might see errors like:
# "Error loading shared library ld-linux-x86-64.so.2"

WORKDIR /app
# All commands run from /app directory

################################################################################
# Copy package files
################################################################################
COPY package*.json ./
# Copy package.json and package-lock.json
# Separating this from copying source code improves caching
# If only source code changes, Docker reuses cached deps layer

################################################################################
# Install dependencies
################################################################################
RUN npm ci
# "npm ci" (clean install) installs exact versions from package-lock.json
# Installs both dependencies and devDependencies
# (devDependencies needed for building, will be removed later)
#
# What gets installed:
# - next, react, react-dom (core framework)
# - TypeScript compiler (@types/*, typescript)
# - UI libraries (shadcn, tailwindcss, etc.)
# - Build tools (postcss, autoprefixer)
# - Dev tools (eslint, prettier)

################################################################################
# STAGE 2: BUILDER - Build the Next.js application
################################################################################
FROM node:20-alpine AS builder
# Fresh Node.js image for building
# Keeps builder stage clean and reproducible

WORKDIR /app

################################################################################
# Copy dependencies from deps stage
################################################################################
COPY --from=deps /app/node_modules ./node_modules
# Copy node_modules from deps stage instead of reinstalling
# "--from=deps" pulls from the "deps" stage we built earlier
# This is faster than running npm ci again

################################################################################
# Copy application source code
################################################################################
COPY . .
# Copy everything from your project directory
# Includes:
# - app/ (Next.js App Router pages and layouts)
# - components/ (React components)
# - lib/ (utility functions, server actions)
# - public/ (static assets: images, fonts, favicon)
# - next.config.mjs (Next.js configuration)
# - tailwind.config.ts (Tailwind CSS configuration)
# - tsconfig.json (TypeScript configuration)
#
# Excluded (via .dockerignore):
# - node_modules/ (already copied from deps stage)
# - .next/ (build output, will be created by npm run build)
# - .env (secrets, provided at runtime)

################################################################################
# Set build-time environment variables
################################################################################
ENV NEXT_TELEMETRY_DISABLED=1
# Explanation: Disable Next.js telemetry (anonymous usage data)
# Next.js collects data: build times, feature usage, errors
# NEXT_TELEMETRY_DISABLED=1 opts out
#
# Why disable:
# - Slightly faster builds (no telemetry processing)
# - Privacy (some companies prefer no data collection)
# - Not needed in CI/CD environments

ENV NODE_ENV=production
# Explanation: Tell Node.js this is a production build
# NODE_ENV=production triggers optimizations:
# - React runs in production mode (no dev warnings, smaller bundle)
# - Minification and tree-shaking enabled
# - Source maps may be disabled
# - Slower development features disabled (Fast Refresh, etc.)

################################################################################
# Build Next.js application
################################################################################
RUN npm run build
# Explanation: Run build script from package.json
# Typically: "build": "next build"
#
# What happens:
# 1. Next.js compiles all pages and components
# 2. Optimizes JavaScript bundles (minification, code splitting)
# 3. Pre-renders pages (Static Site Generation)
# 4. Generates optimized images
# 5. Creates standalone output (because of next.config output: 'standalone')
#
# Build output in .next/:
# - .next/standalone/ - Minimal server with only runtime dependencies
# - .next/static/ - Static assets (JS, CSS, images)
# - .next/server/ - Server-side code
# - .next/cache/ - Build cache (not needed in final image)
#
# Standalone mode magic:
# Next.js analyzes which dependencies are actually used at runtime
# Copies only those dependencies to .next/standalone/node_modules
# Result: Instead of 400MB node_modules, you get ~50MB
#
# For standalone to work, next.config must include:
# module.exports = {
#   output: 'standalone',
# }

################################################################################
# STAGE 3: RUNNER - Minimal production runtime
################################################################################
FROM node:20-alpine AS runner
# Clean Node.js image for running the app
# Doesn't include build tools, source code, or full node_modules
# Only contains what's needed to run the compiled Next.js server

################################################################################
# Install wget for health checks
################################################################################
RUN apk add --no-cache wget
# Same as backend Dockerfile
# Used in HEALTHCHECK to verify app is responding

WORKDIR /app

################################################################################
# Create non-root user for security
################################################################################
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
# Explanation: Create nextjs user and nodejs group
# Same security principle as backend Dockerfile
#
# User naming:
# "nextjs" instead of "nodejs" to distinguish from backend
# Makes logs clearer when debugging
#
# Why non-root:
# If attacker exploits your Next.js app (XSS, SSRF, etc.):
# - As root: Full container access, can modify system files
# - As nextjs: Limited to /app, can't escalate privileges

################################################################################
# Set runtime environment variables
################################################################################
ENV NODE_ENV=production
# Run in production mode (no dev features, better performance)

ENV NEXT_TELEMETRY_DISABLED=1
# Keep telemetry disabled in runtime (was disabled in build too)

################################################################################
# Copy built application from builder
################################################################################
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Explanation: Copy standalone server from builder stage
# "--from=builder" = pull from builder stage
# "--chown=nextjs:nodejs" = set owner to nextjs user (not root)
# Source: /app/.next/standalone (minimal Next.js server created by build)
# Dest: ./ (/app in current container)
#
# What's in .next/standalone:
# - server.js (Next.js production server entry point)
# - node_modules/ (ONLY runtime dependencies, not all packages)
# - .next/ (compiled pages and routes)
# - package.json (minimal, just for reference)
#
# What's NOT included:
# - Build tools (webpack, babel, etc.)
# - Dev dependencies (eslint, prettier, etc.)
# - Unused runtime dependencies (Next.js analyzed and excluded them)
# - Source code (.ts, .tsx files)
#
# Size comparison:
# Full node_modules: ~400MB
# Standalone node_modules: ~50MB

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Explanation: Copy static assets separately
# Why separate COPY:
# .next/standalone doesn't include static files (JS bundles, CSS, images)
# We need to copy them explicitly
#
# What's in .next/static:
# - chunks/ (JavaScript bundles for each page)
# - css/ (Compiled CSS from Tailwind, component styles)
# - media/ (Optimized images, fonts)
# - Each file has content hash in name: app-a1b2c3.js
#
# How it works:
# When user visits your site:
# 1. Server sends HTML
# 2. HTML references /_next/static/chunks/app-a1b2c3.js
# 3. Browser requests that file
# 4. Next.js server serves it from .next/static/
# 5. Nginx caches it (remember our nginx config!)
#
# The --chown flag ensures nextjs user can read these files

################################################################################
# Switch to non-root user
################################################################################
USER nextjs
# From here on, all commands run as nextjs user
# Applies to CMD (the actual Next.js server)

################################################################################
# Document exposed port
################################################################################
EXPOSE 3000
# Next.js default port
# Nginx proxies to frontend:3000
# Actual mapping in docker-compose.yml

################################################################################
# Set network configuration
################################################################################
ENV HOSTNAME="0.0.0.0"
# Explanation: Listen on all network interfaces
# "0.0.0.0" = accept connections from any IP
# Why needed: By default, Next.js might listen on 127.0.0.1 (localhost only)
# In Docker, other containers can't reach 127.0.0.1
# Must listen on 0.0.0.0 to accept connections from Nginx container

ENV PORT=3000
# Explicitly set the port Next.js server listens on
# Could also be set in runtime via docker-compose environment

################################################################################
# Health check - Monitor application health
################################################################################
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1
# Explanation: Periodically check if Next.js is responding
#
# Parameters:
# --interval=30s: Check every 30 seconds
# --timeout=5s: Each check must complete within 5 seconds
# --start-period=30s: Give Next.js 30 seconds to start up
#   Why 30s: Next.js might need time to:
#   - Initialize server
#   - Load cached build data
#   - Connect to backend APIs (if server components fetch data)
# --retries=3: Must fail 3 times before marking unhealthy
#
# Check command:
# wget --quiet --tries=1 --spider http://localhost:3000 || exit 1
# - Hits the root page (/) or you can create a specific /health route
# - Verifies server is responding
#
# Optional: Create a dedicated health endpoint
# In app/api/health/route.ts:
# export async function GET() {
#   return Response.json({ status: 'healthy' });
# }
# Then change health check to: http://localhost:3000/api/health
#
# What happens when unhealthy:
# - Docker Compose: Restarts container
# - Kubernetes: Stops routing traffic, restarts pod
# - Load balancers: Removes from pool

################################################################################
# Start Next.js production server
################################################################################
CMD ["node", "server.js"]
# Explanation: Run the standalone Next.js server
# "node server.js" starts the minimal production server
#
# What server.js does:
# 1. Loads Next.js server runtime
# 2. Serves pre-rendered HTML pages
# 3. Handles API routes (if you have app/api/*)
# 4. Serves static files from .next/static
# 5. Performs Server-Side Rendering (SSR) for dynamic pages
# 6. Runs Server Components (React Server Components)
#
# Why not "npm start":
# - npm adds extra process layer (slower, more memory)
# - npm start might not work with standalone output
# - Direct node command is more reliable in containers
#
# Alternative you might see:
# CMD ["next", "start"] - Requires full Next.js installation (not standalone)
#
# Server behavior:
# - Listens on 0.0.0.0:3000 (set by ENV variables above)
# - Handles requests from Nginx
# - Logs to stdout (visible in docker logs)
# - Graceful shutdown on SIGTERM (Docker stop)
