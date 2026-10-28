# Segurança

- Nenhuma chave privada no frontend, no JSON ou no Git. CORS não protege segredo.
- Limites: código e entrada (`config.js`), tempo (`timeoutMs`) e intervalo entre execuções. O limite no navegador é só conforto: o definitivo deve existir no backend ou no executor.
- O código dos visitantes roda só no executor isolado, nunca em função serverless própria.
- Saída e erros entram por `textContent`, nunca como HTML.
- Não armazenar código, entradas ou resultados sem necessidade e sem aviso.
- Antes de publicar, conferir termos de uso, cotas, CORS e autenticação do executor escolhido.
