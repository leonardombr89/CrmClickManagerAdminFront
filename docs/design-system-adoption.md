# Programa de adoção do Code2YouLabs Design System

Este programa mantém o `clickmanager-admin` no repositório pessoal e adota o
Design System de forma incremental. O controle operacional e as evidências de
cada etapa vivem em `.agents/design-system-adoption/`.

## Processo

Cada etapa tem três papéis independentes: planejador, implementador e revisor.
O implementador corrige os achados do revisor até a aprovação ou o bloqueio
após três ciclos. O orquestrador apenas controla estados, dependências e
evidências; não escolhe soluções técnicas.

## Etapas

| Etapa | Objetivo | Dependência |
| --- | --- | --- |
| DS-0 | Criar e validar o controle de agentes | — |
| DS-1 | Documentar consumo seguro de pacotes privados | DS-0 |
| DS-2 | Validar compatibilidade Angular, Node e dependências | DS-1 |
| DS-3 | Integrar Tailwind, PostCSS e estilos globais | DS-2 |
| DS-4 | Adicionar suporte a Angular Forms | DS-3 |
| DS-5 | Oferecer upgrade/diff assistido para Angular | DS-3, DS-4 |
| DS-6 | Publicar exemplo Angular 22 de migração incremental | DS-1 a DS-5 |
| DS-7 | Publicar uma release estável do Design System | DS-6 |
| APP-1 a APP-9 | Autenticação, upgrades Angular e migração gradual do ClickManager | DS-7 em diante |

## Entregas concluídas

- **DS-0:** estrutura de orquestração, registros de transição e validador local
  concluídos e aprovados.
- **DS-1:** documentação e fixture de consumo privado implementadas e aprovadas
  no PR [Code2YouLabs/design-system#15](https://github.com/Code2YouLabs/design-system/pull/15).
  A entrega cobre `.npmrc` parametrizado, GitHub Actions, Docker BuildKit e
  detecção de vazamento de token.
- **DS-2:** preflight de compatibilidade Angular/Node concluído e entregue no PR
  [Code2YouLabs/design-system#16](https://github.com/Code2YouLabs/design-system/pull/16).
- **DS-3:** integração de Tailwind, PostCSS, estilos globais e `init` do workspace
  concluída no PR
  [Code2YouLabs/design-system#17](https://github.com/Code2YouLabs/design-system/pull/17).
- **DS-4:** componentes compatíveis com Reactive Forms e CVA concluídos no PR
  [Code2YouLabs/design-system#18](https://github.com/Code2YouLabs/design-system/pull/18).
- **DS-5:** upgrade e diff assistidos de templates Angular concluídos no PR
  [Code2YouLabs/design-system#19](https://github.com/Code2YouLabs/design-system/pull/19).
- **DS-6:** exemplo Angular 22 com Material, SCSS, Reactive Forms e migração
  incremental concluído no PR
  [Code2YouLabs/design-system#20](https://github.com/Code2YouLabs/design-system/pull/20).
- **DS-7:** release `0.3.0` dos cinco pacotes publicada pelo workflow protegido
  [31265373524](https://github.com/Code2YouLabs/design-system/actions/runs/31265373524)
  a partir do commit `ac083ac` e da tag `v0.3.0`.

## Próxima etapa

**APP-1** configurará o consumo autenticado dos pacotes `0.3.0` no ClickManager,
sem versionar tokens ou alterar ainda os componentes da aplicação.
