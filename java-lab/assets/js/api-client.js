export async function execute({ source, stdin }, cfg) {
  const { endpoint, languageId, timeoutMs } = cfg.executor;
  if (!endpoint) throw new Error('Executor não configurado. Defina executor.endpoint em assets/js/config.js.');
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${endpoint}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
      body: JSON.stringify({ source_code: source, language_id: languageId, stdin }),
    });
    if (!res.ok) throw new Error(`O executor respondeu HTTP ${res.status}.`);
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('O executor não respondeu a tempo.');
    if (e instanceof TypeError) throw new Error('Não foi possível contatar o executor (rede ou CORS).');
    throw e;
  } finally { clearTimeout(timer); }
}
