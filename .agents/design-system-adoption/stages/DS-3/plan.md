# DS-3 plan — Angular Tailwind CSS v4 / PostCSS workspace integration

## Contrato da CLI

1. Estender somente o comando público `company-angular init` com
   `--project <nome>`; manter `--cwd`, `--skip-install` e `--overwrite`. O
   argumento identifica a chave do projeto em `angular.json`, não um caminho.
   Rejeitar `--project` vazio, desconhecido, repetido ou usado em workspace sem
   `angular.json` pelo caminho normal de erro, antes de qualquer escrita.
2. Ler `angular.json` como fonte de verdade. Considerar um projeto Angular
   elegível quando possuir `architect.build` ou `targets.build` com `options`.
   Com exatamente um elegível, selecioná-lo automaticamente. Com mais de um,
   falhar listando os nomes e pedindo `--project`; com nenhum, falhar sem
   fallback implícito. Projetos fora de `defaultProject` não recebem mudança
   sem essa escolha explícita.
3. Manter `company-components.json` como metadado de uma única instalação no
   workspace e acrescentar `project` e `styles: 'src/styles/company.css'`.
   Se o arquivo existente declarar `framework` diferente de `angular`, ou
   declarar outro `project`, `init` falha e instrui o usuário a escolher o
   mesmo alvo ou remover/reconfigurar conscientemente o metadado; não sobrescreve
   a configuração existente automaticamente.

## Plano e alterações atômicas

1. Após o preflight DS-2 ser aprovado, produzir em memória um plano completo
   antes de escrever: `package.json`, `.postcssrc.json`, `company.css`,
   `angular.json` e `company-components.json`. Validar/serializar todo JSON,
   validar caminhos relativos dentro de `--cwd`, verificar conflitos e calcular
   os conteúdos finais. Não chamar o gerenciador de pacotes enquanto o plano
   não estiver válido.
2. Adicionar `tailwindcss`, `@tailwindcss/postcss` e `postcss` em
   `devDependencies`, preservando as versões compatíveis já declaradas. Manter
   os pacotes do Design System e de Spartan em `dependencies` segundo a
   configuração Angular existente. Uma dependência incompatível continua sendo
   bloqueada pelo preflight DS-2; `--skip-install` pula apenas `yarn install`
   ou `npm install`, nunca essas validações nem os arquivos de configuração.
3. Criar `.postcssrc.json` se não existir com
   `{ "plugins": { "@tailwindcss/postcss": {} } }`. Se existir, aceitar
   somente JSON objeto com `plugins` objeto; preservar todas as chaves,
   valores e ordem já presentes e acrescentar `@tailwindcss/postcss: {}` apenas
   se ausente. JSON inválido ou formato incompatível bloqueia com instrução de
   reparo e não é substituído. Não criar configuração JavaScript/CJS/MJS nem
   tentar interpretar arquivos PostCSS não JSON nesta etapa.
4. Criar `src/styles/company.css` com o CSS Angular já definido pela CLI
   (camadas Tailwind 4, preset Spartan, styles base e tokens). Se o arquivo já
   for byte-a-byte igual, mantê-lo. Se for diferente, falhar por padrão e só
   substituí-lo com `--overwrite`; nunca anexar imports em arquivo editado pelo
   consumidor.
5. Atualizar o array `projects[project].architect|targets.build.options.styles`.
   Aceitar itens string e objetos `{ input, ... }`; localizar estilos legados
   como todos os itens já existentes e inserir `src/styles/company.css` como a
   última entrada, portanto depois deles. Se essa entrada já existir em string
   ou em `input`, não alterá-la nem duplicá-la. Se `styles` estiver ausente,
   criar o array apenas com esse stylesheet. Um formato não-array bloqueia.
   Preservar os demais campos de `angular.json` e não mudar os estilos de
   `test`, `serve` ou qualquer outro projeto.
6. Aplicar o plano com escrita recuperável: gravar cada conteúdo final em um
   arquivo temporário no mesmo diretório, manter snapshots dos arquivos
   existentes e renomear os temporários somente após todos serem produzidos.
   Se qualquer gravação ou renomeação falhar, restaurar cada snapshot e remover
   somente temporários criados pela execução. Executar a instalação apenas
   depois de as alterações terem sido aplicadas; se a instalação falhar, manter
   a configuração já consistente e retornar erro claro para o usuário executar
   a instalação manualmente.

## Implementação, testes e documentação

1. Manter a lógica Angular em módulos locais (descoberta do workspace, plano e
   aplicação), em vez de aumentar o CLI React compartilhado. Atualizar o build
   para publicar todos os módulos importados em `dist`; os testes devem executar
   o artefato construído.
2. Ampliar os fixtures da CLI para: projeto único; múltiplos projetos com e sem
   `defaultProject`; `--project` válido e inválido; `architect` e `targets`;
   `styles` ausente, string e objeto; SCSS global; tema/estilos Angular Material
   antes de `company.css`; PostCSS novo, existente com plugins e inválido;
   arquivo CSS existente igual e divergente; metadado em conflito; e duas
   execuções idênticas. Em cada falha, comparar bytes de todos os arquivos que
   poderiam ser modificados e confirmar que nenhuma instalação foi chamada.
3. Cobrir uma falha injetada durante a aplicação para provar rollback de
   `package.json`, `.postcssrc.json`, `company.css`, `angular.json` e metadado.
   Cobrir sucesso com e sem `--skip-install`, usando stubs para Yarn/npm; não
   acessar registry real.
4. Atualizar o README Angular com pré-requisitos DS-2, exemplos de `init` para
   projeto único e `--project`, a ordem intencional de estilos (legados/
   Material antes de `company.css`), conteúdo PostCSS e recuperação para cada
   erro. Atualizar a mensagem final do CLI para informar o projeto e os
   arquivos configurados, substituindo a instrução manual de editar
   `angular.json`.
5. Validar com os testes do pacote Angular, build do pacote, verificações de
   template e um smoke test de pacote empacotado em fixture Angular SCSS +
   Material. Registrar comandos, resultados e escopo do diff em
   `implementation.json`. Não publicar pacote, release ou tag nesta etapa.
