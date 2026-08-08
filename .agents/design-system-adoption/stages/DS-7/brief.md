# DS-7 — Publicar uma release estável do Design System

Planejar a primeira release estável consumível do `Code2YouLabs/design-system`
depois da conclusão de DS-1 a DS-6.

## Resultado esperado

Um consumidor externo consegue instalar uma versão estável de
`@code2youlabs/tokens`, `@code2youlabs/styles`, `@code2youlabs/icons`,
`@code2youlabs/react` e `@code2youlabs/angular` pelo GitHub Packages, seguindo a documentação de
autenticação e os requisitos de Angular, Node, Tailwind e TypeScript.

## Limites

- Alterar somente o repositório `Code2YouLabs/design-system` durante a execução.
- Não adicionar token, `.npmrc` autenticado, pacote privado ou credencial a este
  repositório.
- Não iniciar APP-1 nem atualizar o Angular do ClickManager nesta etapa.
- A publicação e a promoção da release continuam sendo ações humanas explícitas.

## Critérios de aceite

- CI da `main` passa para workspaces, documentação, preflight, exemplo Angular e
  verificações de acessibilidade/build previstas.
- A versão estável e o changelog registram os requisitos de runtime, peer
  dependencies, Tailwind e autenticação no GitHub Packages.
- Os cinco pacotes são publicados com versões compatíveis e dependências
  resolvidas na ordem necessária.
- Um consumidor limpo instala os pacotes com Yarn ou npm usando apenas
  `NODE_AUTH_TOKEN` fornecido pelo ambiente.
- As versões publicadas, o commit de origem e a evidência de instalação ficam
  registrados antes da transição para `complete`.
