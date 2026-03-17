# Stage 1: build Angular
FROM node:20-alpine AS build

WORKDIR /app

# copiar package.json e package-lock.json
COPY package*.json ./

# instalar dependências (usando lockfile)
RUN npm ci --legacy-peer-deps

# copiar o resto do código
COPY . .

# build de produção
RUN npm run build:prod

# Stage 2: Nginx servindo o build
FROM nginx:alpine

# remove qualquer arquivo padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# copie o build Angular para a rota pública do admin
COPY --from=build /app/dist/CrmClickManagerAdminFront/browser /usr/share/nginx/html/painel-admin

# Copia config SPA customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
