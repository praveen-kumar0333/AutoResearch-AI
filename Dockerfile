# Use Node.js for the frontend and backend build
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip git

# Copy the specific code from your subfolder
COPY . .

# Install dependencies for the main project
RUN npm install -g pnpm
RUN pnpm install

# Build the project (if needed)
RUN pnpm build

# Expose the port your app runs on (usually 5173 or 3000)
EXPOSE 5173

# Start the application
CMD ["pnpm", "dev", "--host"]