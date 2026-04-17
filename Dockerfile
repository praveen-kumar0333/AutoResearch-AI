# Use a full Node image
FROM node:20

# Set working directory
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything first to ensure workspace files are found
COPY . .

# IMPORTANT: If your code is inside a subfolder named 'Attached-Assets', 
# we need to move it to the root so pnpm can find the package.json.
RUN if [ -d "Attached-Assets" ]; then cp -r Attached-Assets/* . && rm -rf Attached-Assets; fi

# Clean install to avoid lockfile conflicts
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Permissions fix
RUN chmod -R 777 /app

# Hugging Face default port
EXPOSE 7860

# Start command
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "7860"]