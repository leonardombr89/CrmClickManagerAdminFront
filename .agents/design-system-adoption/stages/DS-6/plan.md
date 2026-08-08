# DS-6 plan — Exemplo Angular 22 de migração incremental com Material e SCSS

## Estrutura e contrato do exemplo

1. Criar `apps/angular-example` como workspace Angular 22 privado dentro do
   monorepo, com `@angular/material`, CDK, Reactive Forms, Tailwind CSS v4,
   PostCSS e SCSS. Integrá-lo ao runner raiz de workspaces e às verificações de
   CI, usando Node 22 e instalação imutável como os demais exemplos.
2. Consumir `@code2youlabs/tokens`, `@code2youlabs/styles`, `@code2youlabs/icons`
   e a CLI Angular por referências `workspace:^` no monorepo. Manter um
   `.npmrc.example` com o registry e `${NODE_AUTH_TOKEN}` como placeholder;
   documentação e CI devem usar somente a variável de ambiente, sem token em
   arquivo, comando exibido ou imagem de exemplo.
3. Materializar no exemplo o resultado suportado de `company-angular init` e
   `company-angular add`, mantendo `company-components.json` com `framework:
   "angular"`, o projeto alvo e os componentes locais. Não depender de uma
   execução de CLI durante CI: o exemplo deve ser reproduzível com o código
   versionado e a documentação deve indicar os comandos para um consumidor
   externo.
4. Configurar `src/styles.scss` para o tema e estilos globais Angular Material
   e registrar `src/styles/company.css` depois dele em `angular.json`. O
   `company.css` importa exclusivamente as superfícies públicas necessárias do
   Design System e Tailwind; não copiar tokens nem CSS interno para o exemplo.

## Tela piloto e coexistência

1. Implementar uma única rota/página de formulário de configuração de e-mail
   em componente standalone. Usar `ds-field` + `ds-input` para assunto/endereço
   ou destinatário, `ds-button` para salvar/testar e `ds-switch` como controle
   CVA conectado por `formControlName`. O formulário deve ter campos válidos,
   inválidos, disabled e uma submissão assíncrona simulada que exponha o estado
   loading sem chamar serviço externo.
2. Manter Angular Material visivelmente necessário no mesmo fluxo: utilizar
   `MatDialog` para a confirmação/resultado de teste e um único controle
   material não coberto pelo DS, como `mat-select` para provedor. Não migrar
   esse componente nem introduzir wrapper do DS; o exemplo deve explicar que a
   convivência é intencional durante a adoção incremental.
3. Adicionar alternância clara/escura baseada na classe `.dark` do documento,
   persistida apenas no browser com fallback seguro para SSR/testes. Todo
   controle interativo deve ter rótulo acessível, ordem de tabulação natural,
   foco visível e operação por teclado. A confirmação Material deve devolver o
   foco ao gatilho ao fechar.
4. Apresentar erros de Reactive Forms somente após toque ou submit, associando
   mensagens ao campo por `aria-describedby`; bloquear submissão inválida e
   durante loading. Não alterar a API, templates ou seletores publicados pelos
   componentes gerados pela CLI.

## Testes, acessibilidade e documentação

1. Criar testes unitários/TestBed para o formulário: valores iniciais,
   validação, submit inválido, submit válido/loading, valor e disabled do CVA,
   interação teclado/foco do switch e abertura/fechamento do `MatDialog`.
   Verificar explicitamente que o componente Material selecionado continua
   funcional junto aos componentes DS locais.
2. Incluir uma checagem automatizada de acessibilidade do fluxo piloto com
   `axe-core` em ambiente de teste; falhar para violações graves/criticas e
   cobrir ao menos os estados padrão, inválido e diálogo aberto. Usar APIs de
   teste do Angular, sem navegador/serviço externo obrigatório para o CI.
3. Adicionar scripts `lint`, `test`, `check` e `build` ao workspace do exemplo.
   O build de produção e a suíte do exemplo entram no workflow existente de
   pull request/push, junto à instalação imutável; não criar publicação de
   pacote nem release nesta etapa.
4. Documentar no README do exemplo: pré-requisitos Angular/Node, execução no
   monorepo e após instalação externa, configuração segura do registry, ordem
   SCSS/Material → `company.css`, componentes migrados, componentes Material
   preservados, formulário/CVA, tema e limites da demonstração. Referenciar o
   exemplo no README da CLI Angular e no README raiz.

## Verificação e entrega

1. Executar instalação imutável, build/check/test do pacote Angular, os
   scripts do exemplo, `corepack yarn verify` e `git diff --check`. Registrar
   em `implementation.json` os comandos, resultados, paths modificados,
   commit, branch e limitações; nenhuma branch deve ser publicada antes da
   revisão independente.
2. O revisor deve confirmar que o exemplo não contém segredo, não instala de
   registry privado no CI, compila em Angular 22, preserva a ordem de estilos,
   usa ao menos um CVA real, mantém uma dependência Material útil e exerce
   acessibilidade/teclado/erros. Achados devem seguir o ciclo normal de
   correção, sem alterar o ClickManager.
