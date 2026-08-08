# DS-7 plan — Release estável do Design System

## Preparação

1. Confirmar que DS-6 está completo e que a `main` do Design System contém os
   PRs DS-1 a DS-6.
2. Executar o CI completo da `main` e registrar commit, workflow, runtime e
   resultados sem mascarar falhas de ambiente.
3. Revisar os manifests dos cinco pacotes, peer dependencies e a documentação
   de consumo privado para que a versão publicada seja instalável por um
   consumidor fora da organização.

## Versionamento e publicação

1. Definir a versão estável e atualizar changelog/documentação com Angular,
   Node, TypeScript, CDK, Tailwind, Spartan e requisitos do registry.
2. Publicar `@code2youlabs/tokens` e `@code2youlabs/icons` antes dos pacotes que
   os consomem, depois `@code2youlabs/styles`, `@code2youlabs/react` e
   `@code2youlabs/angular`, conforme o grafo real de dependências.
3. Executar a publicação somente em workflow ou ambiente autorizado, usando
   `NODE_AUTH_TOKEN` como secret e sem imprimir configuração autenticada.
4. Registrar nome, versão, tarball metadata, commit e URLs dos pacotes
   publicados.

## Validação de consumidor

1. Criar um diretório temporário limpo fora deste repositório e instalar os
   pacotes com Yarn e, quando suportado, npm.
2. Validar o exemplo Angular 22 com instalação imutável, build e testes, sem
   depender de `workspace:` ou caminhos locais.
3. Confirmar que a documentação reproduz a autenticação por variável de
   ambiente e que nenhum token aparece em logs, arquivos versionados ou bundles.
4. Preservar os logs sanitizados e a lista final de versões como evidência de
   implementação e revisão.

## Saída e handoff

- A etapa só entra em `complete` após revisão independente e evidência de
  instalação limpa.
- Se a publicação ou instalação falhar, corrigir no repositório fornecedor e
  repetir a revisão; não contornar a falha alterando o ClickManager.
- APP-1 fica desbloqueado apenas depois da aprovação e conclusão de DS-7.
