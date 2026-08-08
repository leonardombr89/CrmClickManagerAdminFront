# DS-6 — Exemplo Angular 22 com Material, SCSS e migração incremental

Planejar a resolução de
[Code2YouLabs/design-system#11](https://github.com/Code2YouLabs/design-system/issues/11),
publicando no monorepo do Design System um exemplo Angular 22 executável que
parta de Angular Material + SCSS e migre uma tela para os componentes locais
gerados pela CLI.

## Resultado esperado

Um consumidor pode clonar o repositório, instalar dependências e executar um
exemplo isolado que demonstra, de forma verificável, a coexistência entre
Angular Material e o Design System: estilos em ordem correta, autenticação sem
segredo versionado, Reactive Forms com um CVA, tema claro/escuro, navegação por
teclado e mensagens de validação.

## Limites

- Alterar somente `Code2YouLabs/design-system`; estes registros locais são
  evidências da orquestração e não entram no PR.
- Criar um exemplo Angular independente; não alterar o ClickManager nem
  migrar uma aplicação consumidora real.
- Usar as fundações existentes da DS-2, DS-3, DS-4 e DS-5, sem reimplementar
  `doctor`, `init`, `add`, CVAs ou o mecanismo de upgrade.
- Não remover Angular Material nem fingir que componentes Material sem
  equivalente já foram substituídos.
- Não versionar token, `.npmrc` autenticado, artefato de pacote privado,
  credenciais de CI ou configurações específicas de máquina.

## Critérios de aceite

- O workspace do exemplo usa Angular 22, Tailwind CSS v4, PostCSS, SCSS,
  Angular Material e Reactive Forms.
- A tela piloto usa `field`, `input` e `button`, além de pelo menos um dos
  controles CVA (`select`, `checkbox`, `radio-group` ou `switch`), preservando
  um componente Material em uso legítimo.
- `angular.json` carrega o SCSS/tema Material antes de `company.css`, sem
  duplicação, e o exemplo documenta explicitamente essa coexistência.
- Tema claro/escuro, foco por teclado, estado disabled/loading e erros de
  validação são demonstrados e cobertos de forma automatizada quando possível.
- CI executa instalação imutável, testes, checagem, acessibilidade e build do
  exemplo sem acessar nem registrar uma credencial real.
