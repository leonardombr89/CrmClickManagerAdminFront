# CrmClickManagerAdminFront

Frontend administrativo do ecossistema ClickManager.

Desenvolvimento local: `npm start` sobe em `http://localhost:4300`.

## Domínio

O frontend administrativo deve ser servido na raiz do domínio:

- produção: `https://admin.clickmanager.com.br/`
- login: `https://admin.clickmanager.com.br/login`
- rotas internas: `https://admin.clickmanager.com.br/empresas`, `https://admin.clickmanager.com.br/configuracoes`

A aplicação usa `<base href="/">` em `src/index.html` e é servida diretamente na raiz do domínio admin.

As chamadas ao backend continuam relativas em produção:

- autenticação admin: `/admin/auth/`
- APIs da plataforma: `/api/`

O proxy/reverse proxy externo deve encaminhar esses caminhos para o backend. O frontend não precisa de configuração de CORS.

## Build e teste

- desenvolvimento local: `npm start`
- build de produção: `npm run build:prod`
- build da imagem Docker: `docker build -t clickmanager-admin-frontend .`
- teste local da imagem: `docker run --rm -p 8081:80 clickmanager-admin-frontend`

Com a imagem local em execução, valide:

- `http://localhost:8081/`
- `http://localhost:8081/login`
- `http://localhost:8081/empresas`
- refresh direto em rotas Angular, sem HTTP 404

## Produção

Este projeto publica uma imagem Docker própria via GitHub Actions:

- workflow de build: `.github/workflows/build-frontend.yml`
- workflow de deploy: `.github/workflows/deploy-frontend.yml`
- imagem publicada: `ghcr.io/<owner>/clickmanager-admin-frontend:latest`

Para o deploy remoto funcionar, configure no repositório:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- variável opcional `CLICKMANAGER_ADMIN_DEPLOY_PATH`

O deploy remoto executa `docker compose pull admin-frontend` e `docker compose up -d admin-frontend` no diretório configurado.

O container Nginx interno serve o build em `/usr/share/nginx/html/` com fallback SPA para `/index.html`.
