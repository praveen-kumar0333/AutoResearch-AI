FROM node:20

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything
COPY . .

# Move files out of subfolder if they are trapped
RUN if [ -d "Attached-Assets" ]; then cp -r Attached-Assets/* . && rm -rf Attached-Assets; fi

# Install all dependencies
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Permissions
RUN chmod -R 777 /app

# Expose port
EXPOSE 7860

# THE FIX: Tell pnpm exactly which project to run
# We use --filter to target your main UI project
CMD ["pnpm", "--filter", "autoresearch", "dev", "--host", "0.0.0.0", "--port", "7860"]