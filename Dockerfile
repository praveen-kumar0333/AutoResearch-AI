# Use a full node image instead of slim to ensure all build tools are present
FROM node:20

# Set the working directory
WORKDIR /app

# Enable corepack to handle pnpm automatically
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the dependency files first (this helps with caching)
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Copy the rest of the application
COPY . .

# Install dependencies (ignoring scripts to prevent build-time errors)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Hugging Face runs with user ID 1000, so we need to ensure permissions are open
RUN chmod -R 777 /app

# Expose the correct Hugging Face port
EXPOSE 7860

# Start the dev server
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "7860"]