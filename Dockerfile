# ----------------------------
# --- Install dependencies ---
# ----------------------------

FROM node:14-slim AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN apt-get update && apt-get install -y git
RUN yarn install --frozen-lockfile

# -------------------------
# --- Build source code ---
# -------------------------

FROM node:14-slim AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# ----------------------------------------
# --- Copy into final production image ---
# ----------------------------------------

FROM node:14-slim AS runner

WORKDIR /app
ENV NODE_ENV production

RUN addgroup --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create a special writable directory for rendered images
RUN mkdir -p ./public/images
RUN chown nextjs:nodejs ./public/images
RUN chmod -R 755 ./public/images

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
