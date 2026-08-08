# DS-5 plan — Upgrade/diff seguro para templates Angular

## Interface e metadata

1. Habilitar `company-angular upgrade <componentes>|--all` no dispatcher compartilhado e documentar `--strategy skip|diff|merge|overwrite`; `diff` é o padrão e `--overwrite` continua exclusivo de `init`/`add`.
2. Generalizar o fluxo existente de upgrade React por configuração de framework, sem copiar regras divergentes. Para Angular, resolver `company-components.json` com `framework: "angular"`, `ui` e `styles`, e endereçar templates por `<ui>/<name>.ts`.
3. Evoluir ou reutilizar o schema versionado de `company-components.json` para preservar campos desconhecidos e registrar, por componente efetivamente instalado/reinstalado, versão do pacote, SHA-256 e snapshot completo do template TypeScript. Não registrar componentes que falharam ou foram apenas inspecionados.
4. Manter metadata e candidatos fora dos exports públicos: snapshots ficam somente no JSON e conflitos em `<ui>/.company-components/candidates/<name>.ts.merge`. Não exportar nem incluir essa pasta no barrel.

## Operação segura

1. Validar todos os nomes, caminhos e pré-condições antes de qualquer escrita. `upgrade` deve rejeitar componentes desconhecidos, ausentes no diretório UI e argumentos inválidos; `merge` também rejeita instalações legadas sem snapshot antes de criar arquivo, metadata ou candidato.
2. Para `diff`, ler o arquivo local e o template novo e devolver um diff legível com ambos os caminhos, sem escrita. Para `skip`, informar que o arquivo foi mantido, sem atualizar base/snapshot.
3. Para `merge`, aplicar merge textual de três vias entre snapshot, arquivo local e template atual. Alterações não sobrepostas resultam em atualização do `.ts` e da snapshot; sobreposição cria/atualiza apenas o candidato `.merge`, preserva arquivo e metadata originais e informa o caminho ao usuário.
4. Para `overwrite`, substituir somente o componente solicitado após o plano completo ser validado, atualizar snapshot/hash/versão e remover seu candidato anterior. Um merge limpo faz a mesma limpeza. A estratégia `diff` ou `skip` jamais remove candidato.
5. Tornar o processamento de vários componentes determinístico e sem sobrescrita cruzada: ordenar/deduplicar a seleção, calcular destinos distintos e preparar todas as leituras/validações antes das mutações. Se houver pré-condição inválida, abortar a operação sem alterar nenhum componente; conflitos de merge são resultados por componente e não permitem que outro componente sobrescreva o original por engano.

## Compatibilidade Angular e barrel

1. Preservar literalmente seletores, nomes de inputs/outputs, APIs de Forms, imports standalone e dependências dos templates existentes. O upgrade apenas troca o arquivo por uma versão limpa, mesclada ou candidata; não deve introduzir renomeações implícitas.
2. Proteger a geração do `index.ts` em `add` e re-add: produzir uma linha `export * from './<component>';` por template Angular presente no registro, em ordem estável, sem duplicatas e sem exportar `.company-components`. `upgrade` não deve reescrever exports apenas por atualizar arquivos existentes.
3. Acrescentar validações específicas em testes para detectar seletor repetido nos templates instaláveis e imports inválidos/ausentes nos componentes standalone. Essa checagem protege o pacote de entregar um upgrade que compila isoladamente mas conflita no consumidor.

## Testes e entrega

1. Expandir a suíte da CLI Angular com fixtures temporários que exercitem cada estratégia em `.ts`: padrão `diff`, `skip`, `overwrite`, merge limpo, conflito, snapshot legada ausente, `--all`, componente desconhecido e componentes inexistentes. Verificar conteúdo, hashes/snapshots, ausência/presença de candidatos e nenhuma escrita em modos de inspeção.
2. Cobrir operações paralelas por invocações concorrentes sobre a mesma fixture e componentes diferentes: o contrato é não perder/duplicar metadata, não sobrescrever destinos de outro componente e retornar erro acionável para disputa do mesmo destino. Implementar lock local por projeto ou uma fila/commit atômico equivalente; nunca aceitar escrita intercalada silenciosa.
3. Cobrir barrel determinístico e verificar, com TypeScript/Angular compiler ou TestBed mínimo, que todos os templates gerados continuam carregáveis e não possuem selectors duplicados ou imports incompatíveis. Rodar build, `check`, testes Angular, verificações da raiz e `git diff --check`.
4. Atualizar README Angular com o contrato, exemplos dos quatro modos, limitações do merge textual, resolução de candidatos, componentes legados e a garantia de que `upgrade` é local: não instala dependências e não chama rede. Registrar branch, commit, comandos, resultados e limitações em `implementation.json`; não publicar nem abrir PR antes da revisão independente.
