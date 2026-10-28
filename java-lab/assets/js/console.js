const LABEL = {
  ok: 'Executado com sucesso', compile_error: 'Erro de compilação', runtime_error: 'Erro durante a execução',
  timeout: 'Tempo limite excedido', service_error: 'Falha no executor', client_error: 'Não executado', pending: 'Execução ainda pendente',
};

// Tudo entra por textContent: a saída do programa nunca é interpretada como HTML.
export function createConsole({ out, err, status }) {
  return {
    running() { out.textContent = ''; err.textContent = ''; status.textContent = 'Executando…'; status.dataset.kind = 'pending'; },
    clear() { out.textContent = ''; err.textContent = ''; status.textContent = ''; delete status.dataset.kind; },
    show(r) {
      out.textContent = r.stdout ?? '';
      err.textContent = [...(r.notes ?? []).map((n) => `[adaptação] ${n}`), r.stderr].filter(Boolean).join('\n');
      status.textContent = LABEL[r.kind] + (r.time ? ` em ${r.time} s` : '');
      status.dataset.kind = r.kind;
    },
  };
}
