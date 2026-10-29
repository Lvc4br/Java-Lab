import { afterEach, describe, expect, it, vi } from 'vitest';
import { execute } from '../assets/js/api-client.js';

function encodeUtf8Base64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('Judge0 API client', () => {
  it('sends Java source and stdin as UTF-8 base64 and decodes output', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'submission-1' }), { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: { id: 3, description: 'Accepted' },
        stdout: encodeUtf8Base64('Olá, ação!'),
        stderr: '',
        compile_output: '',
      }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const pending = execute(
      { source: 'public class Main { // ação }', stdin: 'çã' },
      { executor: { endpoint: 'https://judge.example/', languageId: 91, timeoutMs: 5000 } },
    );

    await vi.advanceTimersByTimeAsync(1000);
    const result = await pending;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe('https://judge.example/submissions?base64_encoded=true&wait=false');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.source_code).toBe(encodeUtf8Base64('public class Main { // ação }'));
    expect(body.stdin).toBe(encodeUtf8Base64('çã'));
    expect(result.stdout).toBe('Olá, ação!');
  });

  it('fails closed when the executor endpoint is missing', async () => {
    await expect(execute({ source: 'class Main {}', stdin: '' }, {
      executor: { endpoint: '', languageId: 91, timeoutMs: 1000 },
    })).rejects.toThrow(/Executor não configurado/);
  });

  it('surfaces non-success HTTP responses without pretending execution succeeded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'rate limited' }), { status: 429 }),
    ));

    await expect(execute({ source: 'class Main {}', stdin: '' }, {
      executor: { endpoint: 'https://judge.example', languageId: 91, timeoutMs: 1000 },
    })).rejects.toThrow(/HTTP 429/);
  });
});
