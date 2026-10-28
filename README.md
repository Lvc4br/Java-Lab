<<<<<<< HEAD
# Java Lab

Biblioteca web estática para abrir, editar e executar os exercícios Java de
[ETEC-Desenvolvimento-de-Sistemas](https://github.com/Lvc4br/ETEC-Desenvolvimento-de-Sistemas).

Interface inspirada no Visual Studio Code: editor, painel Terminal / Problems e status bar.
A compilação e a execução ficam no Judge0 CE (serviço externo).

## Rodar localmente

```bash
npm install
npm run catalog   # gera data/exercises.json a partir do repositório de exercícios
npm run dev       # servidor local (módulos ES exigem http, não file://)
npm test
```

Abra `http://127.0.0.1:5173` (porta do Vite).

## Como funciona

1. Catálogo (`data/exercises.json`) lista os exercícios.
2. O código original é carregado do GitHub (raw).
3. Você edita no navegador; o original não é alterado.
4. `runner.js` adapta a classe pública para `Main` (exigência do Judge0) e remove `package` se houver.
5. `api-client.js` envia o código com `base64_encoded=true` (suporta acentos) e consulta o resultado por token.
6. O painel Terminal mostra a saída; Problems lista erros de compilação/execução.

### Entrada (stdin)

Informe um valor por linha no campo **Entrada**. Os dados são enviados **antes** da execução (não é um terminal interativo em tempo real).

### Atalhos

- **Ctrl+Enter** (ou **Cmd+Enter** no Mac) no editor ou na entrada → Executar.

## Estrutura principal

```
java-lab/
├── assets/
│   ├── css/          # tokens + layout estilo VS Code
│   └── js/
│       ├── app.js        # UI, rotas, execução
│       ├── api-client.js # Judge0 (base64)
│       ├── runner.js     # adaptação + limites + interpretação
│       ├── console.js    # Terminal + Problems + status bar
│       ├── editor.js     # textarea (interface estável para trocar por CodeMirror depois)
│       ├── catalog.js
│       ├── config.js
│       └── router.js
├── data/exercises.json
├── scripts/build-catalog.mjs
├── tests/
└── index.html
```

## Configuração do executor

`assets/js/config.js`:

```js
export const CONFIG = {
  executor: {
    endpoint: 'https://ce.judge0.com',
    languageId: 91,      // Java JDK 17
    timeoutMs: 20000,
  },
  limits: {
    maxCodeBytes: 50000,
    maxStdinBytes: 5000,
    minIntervalMs: 3000,
  },
};
```

## Limitações conhecidas

- O Judge0 CE público pode ter rate-limit ou bloqueio ocasional (Cloudflare).
- Entrada é pré-enviada (não há interação real durante a execução).
- Editor ainda é textarea (sem highlight de sintaxe). CodeMirror 6 é o próximo candidato.
- Não há backend próprio: tudo roda no cliente + executor externo.

## Segurança

Ver `docs/security.md`. Nenhuma chave privada no frontend. Código dos alunos executa só no sandbox do Judge0.
=======
# Java-Lab
>>>>>>> origin/main
