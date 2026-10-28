import { loadCatalog, filterExercises, fetchSource } from './catalog.js';
import { onRoute } from './router.js';
import { createEditor } from './editor.js';
import { createConsole } from './console.js';
import { run } from './runner.js';

const $ = (id) => document.getElementById(id);

const editor = createEditor($('code'));
const term = createConsole({
  out: $('out'),
  err: $('err'),
  status: $('status'),
  statusDetail: $('status-detail'),
  statusTime: $('status-time'),
  problemsList: $('problems-list'),
  problemsEmpty: $('problems-empty'),
  problemsBadge: $('problems-badge'),
});

let catalog = null;
let current = null;
let running = false;

/* ---------- Abas Terminal / Problems ---------- */
function switchTab(name) {
  document.querySelectorAll('.panel-tab').forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.panel-view').forEach((view) => {
    const active = view.id === `view-${name}`;
    view.classList.toggle('active', active);
    view.hidden = !active;
  });
}

document.querySelectorAll('.panel-tab').forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

$('clear-term')?.addEventListener('click', () => term.clear());

/* ---------- Biblioteca ---------- */
function renderGrid() {
  const items = filterExercises(catalog.exercises, {
    q: $('q').value,
    list: $('list').value,
  });
  $('count').textContent = `${items.length} de ${catalog.exercises.length} exercícios`;
  $('grid').replaceChildren(
    ...items.map((ex) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const b = document.createElement('b');
      const s = document.createElement('small');
      a.href = `#/ex/${ex.id}`;
      b.textContent = ex.title;
      s.textContent = ex.usesScanner ? `${ex.list} · lê entrada` : ex.list;
      a.append(b, s);
      li.append(a);
      return li;
    })
  );
}

/* ---------- Abrir exercício ---------- */
async function openExercise(id) {
  current = catalog.exercises.find((e) => e.id === id);
  if (!current) {
    location.hash = '#/';
    return;
  }
  const ex = current;
  $('title').textContent = `${ex.list} / ${ex.title}`;
  $('file-label').textContent = `${ex.mainClass || ex.title}.java`;
  $('stdin').value = '';
  term.clear();
  switchTab('terminal');
  $('run').disabled = !ex.runnable;
  editor.load('// Carregando…');
  try {
    editor.load(await fetchSource(catalog, ex));
  } catch (e) {
    editor.load('');
    term.show({ kind: 'service_error', stderr: e.message });
  }
  if (!ex.runnable) {
    term.show({
      kind: 'client_error',
      stderr: 'Este arquivo não tem método main e não pode ser executado sozinho.',
    });
  }
}

/* ---------- Executar ---------- */
async function execute() {
  if (running || !current?.runnable) return;
  running = true;
  $('run').disabled = true;
  term.running();
  try {
    term.show(await run({ source: editor.get(), stdin: $('stdin').value }));
  } finally {
    running = false;
    $('run').disabled = !current?.runnable;
  }
}

$('run').addEventListener('click', execute);

// Atalho Ctrl+Enter (ou Cmd+Enter) no editor e na entrada
function isRunShortcut(e) {
  return (e.ctrlKey || e.metaKey) && e.key === 'Enter';
}
$('code').addEventListener('keydown', (e) => {
  if (isRunShortcut(e)) {
    e.preventDefault();
    execute();
  }
});
$('stdin').addEventListener('keydown', (e) => {
  if (isRunShortcut(e)) {
    e.preventDefault();
    execute();
  }
});

$('reset').addEventListener('click', () => {
  if (!editor.isDirty() || confirm('Descartar as alterações e voltar ao código original?')) {
    editor.reset();
  }
});

/* ---------- Boot ---------- */
try {
  catalog = await loadCatalog();
} catch (e) {
  $('count').textContent = e.message;
  throw e;
}

$('list').append(
  ...[...new Set(catalog.exercises.map((e) => e.list))]
    .sort()
    .map((l) => new Option(l, l))
);
$('q').addEventListener('input', renderGrid);
$('list').addEventListener('change', renderGrid);
renderGrid();

onRoute((r) => {
  const isEx = r.name === 'exercise';
  $('library').hidden = isEx;
  $('workspace').hidden = !isEx;
  if (isEx) openExercise(r.id);
});
