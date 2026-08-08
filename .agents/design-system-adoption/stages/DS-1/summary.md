# DS-1 — Consumo privado de pacotes

Status: `complete`
Issue: [Code2YouLabs/design-system#12](https://github.com/Code2YouLabs/design-system/issues/12)
Pull request: [#15](https://github.com/Code2YouLabs/design-system/pull/15)
Branch: `feat/private-consumer-docs`

## Resultado

Foi criado um guia para consumidores externos da organização e uma fixture
Angular que demonstra autenticação via `NODE_AUTH_TOKEN`, GitHub Actions e
Docker com segredo BuildKit. A solução evita `ARG`, `ENV`, build args e valores
literais de token.

## Evidências

- `corepack yarn check:private-consumer` passou.
- `corepack yarn verify` passou.
- O detector de vazamento foi testado em cenários com token, sem token e stream
  limpo.
- A revisão independente aprovou a etapa no primeiro ciclo.

## Limitação registrada

O build Docker ponta a ponta depende de secret e daemon Docker; por isso é
executado pelo workflow protegido. A validação estática continua disponível no
CI comum.
