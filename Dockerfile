FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies
RUN npm ci

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]