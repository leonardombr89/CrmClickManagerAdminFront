# DS-4 plan — Reactive Forms via ControlValueAccessor

## Contrato público e compatibilidade

1. Nos quatro templates, implementar `ControlValueAccessor` e registrar o
   componente como `NG_VALUE_ACCESSOR` com `multi: true`; usar uma referência
   adiantada do próprio componente para não criar dependência circular. O
   seletor standalone, imports e superfície publicada permanecem inalterados.
2. Preservar literalmente as APIs já existentes: `ds-select` e
   `ds-radio-group` mantêm `value`, `valueChange`, `disabled` e `invalid`;
   `ds-checkbox` e `ds-switch` mantêm `checked`, `checkedChange` e `disabled`.
   Não criar outputs alternativos nem renomear propriedades. `invalid` continua
   uma decisão explícita do consumidor: esta etapa não adiciona acoplamento a
   classes/erros do `NgControl`.
3. Cada controle manterá um valor interno gravável para o caminho CVA e uma
   entrada externa observada para o caminho atual. Antes da primeira chamada a
   `writeValue`, uma entrada externa controla a visualização; depois, o valor
   entregue pelo formulário é a fonte de verdade. Uma alteração posterior da
   entrada externa continua atualizando a visualização para preservar bindings
   legados. `writeValue` atualiza somente a visualização e jamais chama
   `onChange` nem emite o output.
4. Um gesto real do usuário atualiza a visualização, chama `onChange` uma vez e
   emite o output atual uma vez. O callback é inicializado como no-op e
   substituído em `registerOnChange`; `registerOnTouched` registra o callback
   de toque. Não emitir durante `writeValue`, `setDisabledState` ou reflexos de
   inputs impede realimentação entre FormControl, signal e output.
5. O estado efetivo desabilitado é `disabled` externo OU estado informado por
   `setDisabledState`; `setDisabledState(false)` não pode reativar um controle
   ainda desabilitado pelo input. Em ambos os caminhos, atributos e interação
   nativa devem refletir o resultado.

## Implementação por controle

1. **Select:** normalizar `null` e `undefined` recebidos por `writeValue` para
   `''`; manter valores string das opções. Propagar `(change)` uma vez e marcar
   touched em `(blur)`. Conservar `<select>`, placeholder e
   `aria-invalid`; adicionar `aria-disabled` apenas onde a semântica nativa não
   o ofereça automaticamente.
2. **Checkbox:** normalizar valores CVA com coerção booleana explícita (`true`
   somente para marcado; `null`/`undefined` como `false`). Usar o `checked` do
   input nativo para mudança e `blur` para touched. Preservar label e conteúdo
   projetado, sem criar botão substituto.
3. **Radio group:** normalizar `null`/`undefined` para ausência de seleção,
   preservar `name` obrigatório em todos os radios e emitir somente pelo radio
   selecionado. Marcar touched quando qualquer radio do grupo perder foco;
   respeitar o `fieldset[disabled]` e `option.disabled`. Adicionar
   `aria-invalid` ao `fieldset` quando o input existente for disponibilizado
   para o grupo, sem alterar o contrato atual de invalidez.
4. **Switch:** manter o botão com `role="switch"`, `aria-checked` e estado
   `disabled`; adicionar gestão de touched em `blur`. Acionar alternância por
   clique e pelo comportamento nativo de botão com Espaço, impedindo somente
   acionamentos duplicados. Normalizar valor CVA para booleano e nunca alternar
   quando estiver efetivamente desabilitado.

## Testes, exemplos e entrega

1. Criar uma suíte TestBed Angular para os templates gerados, importando
   `ReactiveFormsModule` e cada componente em um host standalone. Testar
   `[formControl]` e `formControlName`, valor inicial, `setValue`/`reset`,
   mudança por interação, emissão única do callback e do output, e garantia de
   que `writeValue` não emite.
2. Para cada controle, testar `control.disable()`/`enable()` combinados com o
   input `[disabled]`; testar touched por blur e estado inválido passado pelo
   input. Cobrir `null`/`undefined` e opções/radios desabilitados. Para switch,
   incluir tecla Espaço, foco e clique; para radio, agrupamento por `name` e
   ausência de seleção após reset.
3. Atualizar stories para incluir um exemplo Reactive Forms por tipo de valor e
   estados disabled/invalid, sem remover a história de API controlada atual.
   Atualizar README Angular com exemplos de `formControlName` e a regra de
   coexistência com os inputs/outputs legados.
4. Executar build do pacote Angular, seus testes, `check`, build/check da raiz
   e `git diff --check`. Registrar comandos, resultados, arquivos alterados e
   limitações em `implementation.json`. Não publicar, criar tag ou alterar o
   ClickManager nesta etapa.
