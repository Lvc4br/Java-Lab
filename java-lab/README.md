# Java Lab — Aplicação web

Esta pasta contém a aplicação web de biblioteca de exercícios Java. Ela é parte do repositório principal [Lvc4br/Java-Lab](https://github.com/Lvc4br/Java-Lab), que deve ser consultado para o README de referência e o estado geral do projeto.

## Executar localmente

Na pasta que contém o `package.json`:

```bash
npm install
npm run catalog
npm run dev
npm test
```

Use o endereço local mostrado pelo Vite. Os módulos JavaScript precisam ser servidos por HTTP; abrir o HTML diretamente como arquivo não é suportado.

## Fluxo de execução

O catálogo lista os exercícios do repositório [ETEC-Desenvolvimento-de-Sistemas](https://github.com/Lvc4br/ETEC-Desenvolvimento-de-Sistemas). O usuário pode editar uma cópia no navegador, e o código é enviado a um executor externo configurado em `assets/js/config.js`.

- A entrada padrão (`stdin`) é enviada antes de iniciar a execução.
- A adaptação necessária para o executor não altera o arquivo original do exercício.
- Sem um executor configurado, a aplicação informa que a execução não está disponível; não simula resultados.

Consulte o README principal do repositório para limitações, segurança e configuração atualizadas.