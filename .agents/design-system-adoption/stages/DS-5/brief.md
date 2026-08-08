# DS-5 — Upgrade e diff assistidos para Angular

Planejar a ampliação de [Code2YouLabs/design-system#5](https://github.com/Code2YouLabs/design-system/issues/5) para a CLI `@code2youlabs/angular`. A implementação deve dar aos componentes Angular copiados o mesmo caminho seguro de inspeção e atualização que já existe para React, sem apagar customizações locais.

## Resultado esperado

`company-angular upgrade <componentes>` deve aceitar os templates Angular `.ts` instalados pela CLI, com `diff` como padrão e estratégias explícitas `skip`, `merge` e `overwrite`. A operação deve registrar a base instalada, preservar o arquivo local em conflitos e produzir um candidato separado e estável para resolução manual.

## Limites

- Alterar somente `Code2YouLabs/design-system`; este diretório registra a orquestração e não entra no PR.
- Não modificar o ClickManager, publicar pacotes, criar tags, executar instalação de dependências, preflight de rede ou alterar o comportamento de `init`/`add` fora do metadata necessário.
- Não tentar mesclar semanticamente TypeScript/Angular. O merge é textual de três vias e deve falhar de forma segura quando houver sobreposição.
- Não criar exports públicos para metadata, snapshots ou candidatos; eles permanecem dentro de `<ui>/.company-components/`.

## Critérios de aceite

- A CLI Angular expõe `upgrade`, inclusive em `--all`, e aceita `.ts` sem assumir templates React/TSX.
- `diff` não escreve arquivos nem metadata; `skip` não altera o componente; `overwrite` só ocorre por estratégia explícita.
- `merge` usa o snapshot da instalação anterior, preserva alterações independentes e não altera o original nem metadata quando houver conflito.
- Instalações antigas sem snapshot recusam `merge` antes de qualquer escrita e orientam o uso seguro de `diff`, `skip` ou `overwrite`.
- Reexecuções são idempotentes: não duplicam candidatos, não acumulam metadata e removem candidato obsoleto depois de merge/overwrite limpo.
- Adições múltiplas geram um único barrel `index.ts` determinístico, sem exports repetidos; upgrades não reescrevem o barrel salvo quando uma mudança deliberada for necessária para manter a lista instalada correta.
- Templates Angular gerados continuam compiláveis como standalone components, sem conflitos novos de selector, import ou API pública.
