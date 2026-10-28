// Executor público do Judge0 CE.
// Não há chave privada neste arquivo.
export const CONFIG = {
  executor: {
    endpoint: 'https://ce.judge0.com',
    languageId: 91,
    timeoutMs: 20000,
  },
  limits: {
    maxCodeBytes: 50000,
    maxStdinBytes: 5000,
    minIntervalMs: 3000,
  },
};