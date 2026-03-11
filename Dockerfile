FROM node:20-alpine

WORKDIR /app

# Install dependencies first to maximize Docker layer cache hits.
COPY package*.json ./
RUN npm install 

COPY . .

EXPOSE 5173

# Bind to 0.0.0.0 so Vite is reachable outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]