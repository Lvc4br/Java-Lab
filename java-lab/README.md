# Java Lab

Biblioteca web estática para abrir, editar e executar os exercícios Java de
[ETEC-Desenvolvimento-de-Sistemas](https://github.com/Lvc4br/ETEC-Desenvolvimento-de-Sistemas).
A interface fica no GitHub Pages; a compilação e a execução ficam em um executor externo.

## Rodar localmente
```
npm install
npm run catalog   # gera data/exercises.json a partir do repositório de exercícios
npm run dev       # servidor local (módulos ES exigem http, não file://)
npm test
```

## Como funciona
catálogo (`data/exercises.json`) → editor (código carregado do repositório original) → `runner.js`
(limites, adaptação para `Main.java`) → `api-client.js` (POST ao executor, API do Judge0) → console (saída, erros, status).

- A entrada (stdin) é enviada antes da execução, um valor por linha.
- Se o código tem outra classe pública ou `package`, o envio é adaptado e o console informa a adaptação. O original não muda.
- Sem `executor.endpoint` em `assets/js/config.js`, a execução responde "Executor não configurado". Não existe saída simulada.

## Estado
Pronto: catálogo, biblioteca com busca e filtro, editor com restaurar original, console, cliente e testes de runner e catálogo.
Falta: escolher e validar o executor (Etapa 3), trocar o textarea por CodeMirror 6, segurança e responsividade finas, publicação.
