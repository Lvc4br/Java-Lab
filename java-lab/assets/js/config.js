// Executor remoto compatível com a API do Judge0 (POST /submissions). Deixe endpoint vazio até escolher o serviço.
// Nunca coloque chave privada aqui: este arquivo é público.
export const CONFIG = {
  executor: { endpoint: '', languageId: 62, timeoutMs: 20000 },
  limits: { maxCodeBytes: 50000, maxStdinBytes: 5000, minIntervalMs: 3000 },
};
