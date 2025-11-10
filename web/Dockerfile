# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application with production mode
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096
# Clean any existing build artifacts to prevent hash mismatches
RUN rm -rf .output .nitro
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy built application (Nitro outputs to .output)
COPY --from=builder /app/.output ./.output

# Install server dependencies
WORKDIR /app/.output/server
RUN npm install --production

# Set environment variables
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_PORT=8080
ENV NITRO_HOST=0.0.0.0

# Expose port
EXPOSE 8080

# Start the Nitro server
CMD ["node", ".output/server/index.mjs"]
