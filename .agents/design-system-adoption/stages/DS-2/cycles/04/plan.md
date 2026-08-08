# DS-2 — rodada excepcional 04

Autorização humana registrada em 2026-08-07: executar uma quarta e última
rodada de correção e revisão para a DS-2. Esta rodada não amplia o escopo da
issue #10 nem altera o ClickManager.

## Correção de produto — DS2-R3

1. No leitor de lockfiles de `packages/angular/src/compatibility.mjs`, valide a
   estrutura mínima esperada antes de tentar extrair versões: Yarn precisa ter
   ao menos uma entrada de resolução válida. Não aceite texto arbitrário só
   porque ele não contém os padrões de erro já conhecidos.
2. Quando um `yarn.lock` presente não puder ser lido como lockfile, retorne
   `lockfile_unreadable` de modo explícito. A precedência pode continuar para a
   declaração do manifesto apenas depois desse diagnóstico; nunca omita o check
   nem reporte a situação como lockfile ausente/válido. `pnpm-lock.yaml` não é
   uma fonte suportada e deve ser ignorado.
3. Acrescente fixtures de regressão com conteúdo arbitrário de Yarn e mantenha
   as fixtures válidas Classic/Berry. A suíte deve comprovar que o conteúdo
   arbitrário gera o check, que o comando não escreve arquivos e que os
   lockfiles válidos não mudam de comportamento.

## Correção de controle

1. Manter no validador a exigência de `correction.json` para toda revisão com
   mudanças, exceto quando o mesmo ciclo tiver sido encerrado por uma transição
   `correcting -> blocked` registrada com `blockedReason`, `cycle` e
   `reviewCycleLimit`. Essa exceção representa uma parada terminal, não uma
   correção implícita.
2. Validar que uma parada terminal ocorreu exatamente no limite registrado e
   somente após o número correspondente de revisões `changes_requested`.
   Preservar o limite padrão de três para as demais etapas.
3. Permitir exclusivamente `blocked -> planning` no esquema, para reabertura
   humana auditável. DS-2 é a única etapa com `maxReviewCycles: 4`; ao fim da
   rodada 04, uma nova reprovação bloqueia a etapa, sem quinta correção
   automática.

## Entrega da rodada

- O implementador atualiza o clone isolado do Design System, registra a nova
  evidência em `implementation.json` e cria `cycles/04/correction.json` com o
  commit e os comandos executados.
- O revisor registra `cycles/04/review.json`. Só após aprovação a DS-2 pode
  ser publicada como PR e liberar DS-3.
- O controle local deve passar em `node .agents/design-system-adoption/scripts/validate-state.mjs` antes da implementação iniciar.

## Decisão humana posterior

Em 2026-08-07, foi definido que npm e Yarn são os gerenciadores suportados.
Assim, esta rodada remove qualquer leitura ou diagnóstico de `pnpm-lock.yaml`;
o arquivo não participa da resolução de versões.
