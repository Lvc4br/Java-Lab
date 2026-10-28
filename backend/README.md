# Backend (opcional)

Só é necessário se o executor escolhido exigir chave de API. Nesse caso, o frontend chama uma função serverless
que guarda a chave em variável de ambiente, aplica os limites de `docs/security.md` e repassa a requisição ao executor.
Aponte `executor.endpoint` em `assets/js/config.js` para essa função.
