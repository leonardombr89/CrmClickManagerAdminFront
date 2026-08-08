# DS-2 — Compatibilidade Angular e Node

Planejar e entregar o preflight de compatibilidade para a CLI
`@code2youlabs/angular`, referente à
[Code2YouLabs/design-system#10](https://github.com/Code2YouLabs/design-system/issues/10).

## Resultado esperado

Antes de `init` ou `add`, a CLI deve diagnosticar, sem alterar o projeto, se o
consumidor é compatível com Angular 22, Node.js, TypeScript, Angular CDK,
Tailwind CSS 4 e Spartan. O comando `doctor` expõe o mesmo diagnóstico e nunca
escreve arquivos, instala dependências, executa o gerenciador de pacotes ou faz
requisições de registry adicionais além do preflight de pacotes privados já
existente.

## Limites

- A etapa altera apenas o repositório `Code2YouLabs/design-system`; este
  diretório é evidência de orquestração local e não deve ser incluído no PR.
- Não ampliar o suporte para Angular anterior a 22 nem substituir a etapa DS-3,
  responsável por integração Tailwind/PostCSS.
- Preservar o preflight atual de Tailwind e GitHub Packages e seus contratos de
  saída sem expor `NODE_AUTH_TOKEN`.

## Critérios de aceite

- Um diagnóstico estruturado distingue versão resolvida, declaração e ausência
  para cada dependência verificada.
- Incompatibilidades bloqueiam `init` e `add` antes de qualquer escrita;
  dependências que `init` instalará são informativas apenas nesse comando.
- `doctor` é comprovadamente somente leitura, inclusive com lockfiles ausentes,
  inválidos ou de gerenciadores diferentes.
- A documentação informa versões suportadas, comandos, bloqueios e como
  corrigir cada categoria de incompatibilidade.
