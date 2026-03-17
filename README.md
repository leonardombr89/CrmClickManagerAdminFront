# CrmClickManagerAdminFront

Frontend administrativo do ecossistema ClickManager.

Desenvolvimento local: `npm start` sobe em `http://localhost:4300`.

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
