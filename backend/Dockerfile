FROM node:20-alpine

WORKDIR /app

# Copy package info and install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
