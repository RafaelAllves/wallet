# Stage 1 - the build process
FROM node:latest as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM node:latest
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --production

EXPOSE 3000