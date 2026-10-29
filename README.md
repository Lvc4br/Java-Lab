# Java Lab

Biblioteca web estática para consultar, editar e executar os exercícios Java do repositório [ETEC-Desenvolvimento-de-Sistemas](https://github.com/Lvc4br/ETEC-Desenvolvimento-de-Sistemas).

A interface é inspirada em um editor de código, com área de edição, painel de saída e lista de erros. A compilação e a execução são enviadas ao serviço externo **Judge0 CE**; o projeto não mantém um servidor próprio de execução.

## Requisitos

- Node.js e npm
- Conexão com a internet para carregar exercícios do GitHub e usar o Judge0 CE

## Executar localmente

Na raiz do projeto:

```bash
npm install
npm run catalog
npm run dev
npm test
```

Abra o endereço local exibido pelo Vite, normalmente `http://127.0.0.1:5173`.

## Como funciona

1. O catálogo `data/exercises.json` é gerado a partir do repositório de exercícios.
2. O código original é carregado do GitHub.
3. O usuário pode editar uma cópia no navegador; o arquivo original não é alterado.
4. O executor adapta o código para o formato esperado pelo Judge0 e envia a execução ao serviço.
5. O resultado é apresentado no painel de saída.

A entrada padrão (`stdin`) é enviada antes da execução; não é um terminal interativo em tempo real.

## Atalhos

- **Ctrl+Enter** (ou **Cmd+Enter** no macOS): executar o código.

## Limitações

- O serviço público Judge0 CE pode apresentar limites de uso ou indisponibilidade.
- A entrada é pré-enviada, sem interação durante a execução.
- O editor é baseado em textarea e pode não oferecer realce de sintaxe completo.
- A aplicação depende de serviços externos e não deve ser usada para executar código sensível.

## Projeto relacionado

O conteúdo de exercícios é mantido em [ETEC-Desenvolvimento-de-Sistemas](https://github.com/Lvc4br/ETEC-Desenvolvimento-de-Sistemas).

**Autor:** Luca Toniolo — [@Lvc4br](https://github.com/Lvc4br)
