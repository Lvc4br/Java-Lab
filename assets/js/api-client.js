/**
 * Cliente HTTP para o Judge0 CE.
 * Usa base64_encoded=true para evitar HTTP 400 com caracteres não-ASCII
 * (acentos comuns nos exercícios da ETEC).
 */

function toBase64(text) {
  // btoa não aceita Unicode diretamente → passar por UTF-8 bytes
  const bytes = new TextEncoder().encode(text ?? '');
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64) {
  if (b64 == null || b64 === '') return '';
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    // Se por algum motivo não for base64 válido, devolve o texto cru
    return String(b64);
  }
}

function decodeFields(data) {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  for (const key of ['stdout', 'stderr', 'compile_output', 'message']) {
    if (typeof out[key] === 'string') out[key] = fromBase64(out[key]);
  }
  return out;
}

async function readResponse(response) {
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const details =
      data.error ||
      data.message ||
      data.description ||
      text ||
      'O serviço não forneceu detalhes.';

    throw new Error(
      `HTTP ${response.status}: ${
        typeof details === 'string' ? details : JSON.stringify(details)
      }`
    );
  }

  return decodeFields(data);
}

/**
 * Envia o código e a entrada para o executor e espera o resultado final.
 * @param {{ source: string, stdin: string }} params
 * @param {typeof import('./config.js').CONFIG} cfg
 */
export async function execute({ source, stdin }, cfg) {
  const { endpoint, languageId, timeoutMs } = cfg.executor;

  if (!endpoint) {
    throw new Error('Executor não configurado em config.js.');
  }

  const base = endpoint.replace(/\/+$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Submissão assíncrona (wait=false) + base64 para suportar acentos
    const response = await fetch(
      `${base}/submissions?base64_encoded=true&wait=false`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          source_code: toBase64(source),
          language_id: languageId,
          stdin: toBase64(stdin ?? ''),
        }),
      }
    );

    const submission = await readResponse(response);

    if (!submission.token) {
      throw new Error('O executor não retornou o token da submissão.');
    }

    const url =
      `${base}/submissions/${encodeURIComponent(submission.token)}` +
      '?base64_encoded=true';

    // Poll até sair de "In Queue" (1) ou "Processing" (2)
    while (true) {
      await new Promise((resolve, reject) => {
        const delay = setTimeout(resolve, 1000);

        controller.signal.addEventListener(
          'abort',
          () => {
            clearTimeout(delay);
            reject(new Error('Tempo limite de execução excedido.'));
          },
          { once: true }
        );
      });

      const result = await readResponse(
        await fetch(url, {
          method: 'GET',
          signal: controller.signal,
        })
      );

      const statusId = result.status?.id;

      if (statusId !== 1 && statusId !== 2) {
        return result;
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('O executor não respondeu dentro do tempo limite.');
    }

    if (error instanceof TypeError) {
      throw new Error(
        'Não foi possível acessar o executor. Verifique a rede e o CORS.'
      );
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
