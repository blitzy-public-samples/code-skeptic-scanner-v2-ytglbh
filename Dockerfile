# Use the official Node.js 14 Alpine image as the base
FROM node:14-alpine

# Set the environment variable for production
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY src/ src/

# Copy configuration files
COPY tsconfig.json ./

# Build TypeScript code
RUN npm run build

# Remove development dependencies and source files
RUN npm prune --production && rm -rf src

# Expose application port
EXPOSE 3000

# Set the command to run the application
CMD ["node", "dist/server.js"]

# Human tasks (commented):
# TODO: Regularly update the base Node.js image to the latest LTS version
# TODO: Consider using multi-stage builds to further reduce image size
# TODO: Implement security scanning of the Docker image (e.g., using Trivy)
# TODO: Add health check instructions to the Dockerfile
# TODO: Consider using a non-root user for running the application
# TODO: Optimize the layer caching by reorganizing COPY commands
# TODO: Add labels to the image for better metadata management