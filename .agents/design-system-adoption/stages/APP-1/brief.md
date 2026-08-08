# APP-1 — Configurar autenticação de pacotes privados

Preparar o ClickManager para consumir os pacotes `@code2youlabs/*` publicados no
GitHub Packages sem versionar credenciais ou alterar ainda as dependências da
aplicação.

## Resultado esperado

O repositório contém uma configuração parametrizada do registry, documentação
reproduzível para desenvolvimento/CI e proteção contra vazamento no contexto
Docker. O token existe somente como secret ou variável de ambiente.

## Limites

- Usar npm, conforme `package-lock.json` e `npm ci` no Dockerfile atual.
- Não adicionar pacotes privados nesta etapa.
- Não alterar a versão do Angular, componentes Material ou bundles.
- Não adicionar token literal, `.npmrc` autenticado ou secret ao Git.

## Critérios de aceite

- `.npmrc.example` aponta o escopo para `https://npm.pkg.github.com` e usa
  `${NODE_AUTH_TOKEN}`.
- A documentação cobre desenvolvimento, CI e a futura instalação Docker com
  BuildKit secret.
- `.npmrc` está excluído do contexto Docker e não aparece no Git.
- A instalação pública e o build atual continuam funcionando.
