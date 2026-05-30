FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

EXPOSE 5173

# entrypoint.sh writes .env.local from Docker env vars, then starts Vite
ENTRYPOINT ["/app/entrypoint.sh"]
