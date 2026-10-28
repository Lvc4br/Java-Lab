const LABEL = {
  ok: 'Executado com sucesso',
  compile_error: 'Erro de compilação',
  runtime_error: 'Erro durante a execução',
  timeout: 'Tempo limite excedido',
  service_error: 'Falha no executor',
  client_error: 'Não executado',
  pending: 'Execução ainda pendente',
};

/**
 * Console inspirado no painel Terminal + Problems do VS Code.
 * Tudo entra por textContent — a saída do programa nunca vira HTML.
 */
export function createConsole({
  out,
  err,
  status,
  statusDetail,
  statusTime,
  problemsList,
  problemsEmpty,
  problemsBadge,
}) {
  function setProblems(items) {
    problemsList.replaceChildren();
    if (!items.length) {
      problemsEmpty.hidden = false;
      problemsBadge.hidden = true;
      return;
    }
    problemsEmpty.hidden = true;
    problemsBadge.hidden = false;
    problemsBadge.textContent = String(items.length);

    for (const item of items) {
      const li = document.createElement('li');
      const sev = document.createElement('span');
      sev.className = `sev ${item.severity}`;
      sev.textContent =
        item.severity === 'error' ? 'Error' : item.severity === 'warn' ? 'Warning' : 'Info';
      const msg = document.createElement('span');
      msg.className = 'msg';
      msg.textContent = item.text;
      li.append(sev, msg);
      problemsList.append(li);
    }
  }

  return {
    running() {
      out.textContent = '';
      err.textContent = '';
      status.textContent = 'Executando…';
      status.dataset.kind = 'pending';
      if (statusDetail) statusDetail.textContent = 'enviando · compilando · aguardando resultado';
      if (statusTime) statusTime.textContent = '';
      setProblems([]);
    },

    clear() {
      out.textContent = '';
      err.textContent = '';
      status.textContent = 'Pronto';
      status.dataset.kind = '';
      if (statusDetail) statusDetail.textContent = '';
      if (statusTime) statusTime.textContent = '';
      setProblems([]);
    },

    show(r) {
      const notes = r.notes ?? [];
      const stdout = r.stdout ?? '';
      const stderr = r.stderr ?? '';

      out.textContent = stdout;

      const errParts = [];
      for (const n of notes) errParts.push(`[adaptação] ${n}`);
      if (stderr) errParts.push(stderr);
      err.textContent = errParts.join('\n');

      status.textContent = LABEL[r.kind] ?? r.kind;
      status.dataset.kind = r.kind;
      if (statusDetail) {
        statusDetail.textContent =
          r.kind === 'ok' && !stdout && !stderr ? '(sem saída)' : '';
      }
      if (statusTime) {
        statusTime.textContent = r.time ? `${r.time} s` : '';
      }

      const problems = [];
      if (r.kind === 'compile_error' && stderr) {
        problems.push({ severity: 'error', text: stderr });
      } else if (r.kind === 'runtime_error' && stderr) {
        problems.push({ severity: 'error', text: stderr });
      } else if (r.kind === 'timeout') {
        problems.push({
          severity: 'warn',
          text: stderr || 'O programa excedeu o tempo limite.',
        });
      } else if (r.kind === 'service_error' || r.kind === 'client_error') {
        problems.push({ severity: 'error', text: stderr || LABEL[r.kind] });
      }
      for (const n of notes) {
        problems.push({ severity: 'info', text: n });
      }
      setProblems(problems);

      // Abre a aba Problems quando há erro; Terminal quando ok
      if (problems.some((p) => p.severity === 'error')) {
        document.querySelector('.panel-tab[data-tab="problems"]')?.click();
      } else if (r.kind === 'ok') {
        document.querySelector('.panel-tab[data-tab="terminal"]')?.click();
      }
    },
  };
}
