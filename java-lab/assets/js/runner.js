import { CONFIG } from './config.js';
import { execute } from './api-client.js';

export const detectMainClass = (src) => /public\s+(?:final\s+)?class\s+(\w+)/.exec(src)?.[1] ?? null;

// O executor espera Main.java. A adaptação vale só para o envio e é sempre informada; o original não muda.
export function adaptSource(source) {
  const notes = [];
  let out = source;
  if (/^\s*package\s+[\w.]+\s*;/m.test(out)) { out = out.replace(/^\s*package\s+[\w.]+\s*;[ \t]*$/m, ''); notes.push('Declaração package removida.'); }
  const cls = detectMainClass(out);
  if (cls && cls !== 'Main') { out = out.replace(new RegExp(`\\b${cls}\\b`, 'g'), 'Main'); notes.push(`Classe ${cls} renomeada para Main.`); }
  return { source: out, notes };
}

export function checkLimits(source, stdin, limits = CONFIG.limits) {
  const size = (s) => new TextEncoder().encode(s).length;
  if (size(source) > limits.maxCodeBytes) return `O código passa de ${limits.maxCodeBytes} bytes.`;
  if (size(stdin) > limits.maxStdinBytes) return `A entrada passa de ${limits.maxStdinBytes} bytes.`;
  return null;
}

// Converte a resposta do Judge0 em um resultado que a interface entende.
export function interpret(res) {
  const id = res?.status?.id;
  const base = { stdout: res?.stdout ?? '', time: res?.time ?? null };
  if (id === 3) return { kind: 'ok', ...base, stderr: res.stderr ?? '' };
  if (id === 6) return { kind: 'compile_error', ...base, stderr: res.compile_output ?? '' };
  if (id === 5) return { kind: 'timeout', ...base, stderr: res.stderr ?? '' };
  if (id >= 7 && id <= 12) return { kind: 'runtime_error', ...base, stderr: [res.stderr, res.message].filter(Boolean).join('\n') };
  if (id === 1 || id === 2) return { kind: 'pending', ...base, stderr: '' };
  return { kind: 'service_error', ...base, stderr: res?.message ?? 'Resposta inesperada do executor.' };
}

let last = 0;
export async function run({ source, stdin }, cfg = CONFIG) {
  const fail = (kind, stderr, notes = []) => ({ kind, stdout: '', stderr, notes });
  const limit = checkLimits(source, stdin, cfg.limits);
  if (limit) return fail('client_error', limit);
  const wait = last + cfg.limits.minIntervalMs - Date.now();
  if (wait > 0) return fail('client_error', `Aguarde ${Math.ceil(wait / 1000)} s para executar de novo.`);
  last = Date.now();
  const { source: adapted, notes } = adaptSource(source);
  try { return { ...interpret(await execute({ source: adapted, stdin }, cfg)), notes }; }
  catch (e) { return fail('service_error', e.message, notes); }
}
