FROM node:20

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything
COPY . .

# Move files out of subfolder if trapped
RUN if [ -d "Attached-Assets" ]; then cp -r Attached-Assets/* . && rm -rf Attached-Assets; fi

# Install dependencies
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Permissions
RUN chmod -R 777 /app

# --- THE FIX STARTS HERE ---
# Tell the environment that PORT is 7860
ENV PORT=7860
# --- THE FIX ENDS HERE ---

EXPOSE 7860

# Start command
CMD ["pnpm", "--filter", "autoresearch", "dev", "--host", "0.0.0.0", "--port", "7860"]