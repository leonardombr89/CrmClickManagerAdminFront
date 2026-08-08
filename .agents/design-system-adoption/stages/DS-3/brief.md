# DS-3 — Tailwind CSS v4, PostCSS e estilos globais Angular

Planejar a correção de
[Code2YouLabs/design-system#14](https://github.com/Code2YouLabs/design-system/issues/14)
na CLI `@code2youlabs/angular`.

## Resultado esperado

`company-angular init` deve preparar de forma atômica um workspace Angular
compatível para consumir o Design System: dependências Tailwind CSS v4/PostCSS,
um arquivo `src/styles/company.css`, configuração PostCSS preservando plugins
existentes e o registro desse stylesheet após os estilos legados no alvo de
`angular.json`.

## Limites

- A etapa altera somente `Code2YouLabs/design-system`; estes registros locais
  são evidências da orquestração e não entram no PR.
- DS-2 ainda está em revisão. DS-3 fica em `planning` e não pode ir para
  `ready` ou iniciar implementação até DS-2 estar `complete`.
- Suporte é para npm e Yarn; pnpm permanece fora do escopo definido para DS-2.
- Não migrar componentes Angular Material, alterar templates de componentes ou
  implementar Reactive Forms (DS-4).

## Critérios de aceite

- Detectar workspaces com um ou múltiplos projetos Angular e exigir uma escolha
  explícita do alvo quando houver ambiguidade.
- Criar ou atualizar PostCSS sem apagar plugins existentes.
- Registrar `company.css` depois dos estilos legados, inclusive em projeto SCSS
  que usa Angular Material, sem duplicar entradas em novas execuções.
- `--skip-install`, falhas de preflight, seleção inválida e conflito de arquivo
  não deixam arquivos parcialmente alterados.
- Cobertura automatizada prova idempotência, seleção de projeto e o cenário
  Angular + SCSS + Material.
