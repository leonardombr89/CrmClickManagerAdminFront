# APP-1 plan — Autenticação segura no GitHub Packages

1. Confirmar que DS-7 está completo e identificar o gerenciador de pacotes,
   lockfile, Dockerfile e workflows existentes.
2. Adicionar `.npmrc.example` com registry por escopo e interpolação de
   `NODE_AUTH_TOKEN`; não criar `.npmrc` real.
3. Documentar o uso local de `npm ci`, o escopo de secret no CI e o padrão
   BuildKit para a futura instalação privada.
4. Adicionar `.npmrc` ao `.dockerignore` para evitar envio acidental de
   credenciais locais.
5. Validar que não há token literal, que o lockfile não foi alterado e que o
   build público existente continua passando.

## Saída

APP-1 pode ser concluída sem testar autenticação contra o registry, pois nenhum
pacote privado é instalado nesta etapa. A leitura autenticada e a alteração de
dependências ficam para APP-5, após os upgrades de Angular.
