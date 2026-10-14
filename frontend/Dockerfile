# Etapa 1: compila el CSS de Tailwind a partir de las clases usadas en public/
FROM node:20-alpine AS css

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY tailwind.config.js ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build:css

# Etapa 2: sirve el sitio estático con nginx
FROM nginx:alpine

COPY public/ /usr/share/nginx/html/
COPY --from=css /build/public/css/styles.css /usr/share/nginx/html/css/styles.css
