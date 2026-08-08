# DS-4 — Reactive Forms nos controles Angular

Planejar a resolução de [Code2YouLabs/design-system#13](https://github.com/Code2YouLabs/design-system/issues/13), acrescentando integração nativa com Angular Reactive Forms aos templates `select`, `checkbox`, `radio-group` e `switch` da CLI `@code2youlabs/angular`.

## Resultado esperado

Após `company-angular add`, cada controle funciona diretamente com
`formControlName` e `[formControl]`, implementa `ControlValueAccessor` e preserva
as APIs atuais por propriedade e evento para consumidores que não usam Forms.

## Limites

- Alterar somente `Code2YouLabs/design-system`; este diretório é apenas
  evidência local da orquestração e não entra no PR.
- Não alterar `input`, `textarea`, `field`, `dialog`, Angular Material nem o
  projeto ClickManager.
- Não introduzir um pacote Angular runtime novo; os templates continuam sendo
  copiados para o consumidor e dependem apenas de APIs públicas de Angular.
- Não alterar seletores, nomes dos inputs/outputs, estrutura semântica nem os
  comportamentos atuais de mouse/teclado fora do necessário para Forms.

## Critérios de aceite

- `select`, `checkbox`, `radio-group` e `switch` suportam Reactive Forms,
  valores iniciais, mudanças programáticas, `disabled`, `touched` e inválido.
- As APIs existentes (`value`/`valueChange` e `checked`/`checkedChange`) seguem
  compatíveis e os eventos de saída não entram em loop com `writeValue`.
- Controles nativos mantêm foco e semântica acessível; o switch trata clique,
  Espaço e foco, e o radio preserva agrupamento por `name`.
- TestBed cobre os quatro controles como CVAs e o build/checagens do pacote
  continuam verdes.
