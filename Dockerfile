# Use Node.js base
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip git

# Copy all files
COPY . .

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# IMPORTANT: We are skipping "RUN pnpm build" to avoid the error
# and going straight to the start command.

# Use the Hugging Face default port
EXPOSE 7860

# Start the app in host mode so it's reachable
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "7860"]