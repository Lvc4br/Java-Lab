import { loadCatalog, filterExercises, fetchSource } from './catalog.js';
import { onRoute } from './router.js';
import { createEditor } from './editor.js';
import { createConsole } from './console.js';
import { run } from './runner.js';

const $ = (id) => document.getElementById(id);
const editor = createEditor($('code'));
const term = createConsole({ out: $('out'), err: $('err'), status: $('status') });
let catalog = null;
let current = null;

function renderGrid() {
  const items = filterExercises(catalog.exercises, { q: $('q').value, list: $('list').value });
  $('count').textContent = `${items.length} de ${catalog.exercises.length} exercícios`;
  $('grid').replaceChildren(...items.map((ex) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const b = document.createElement('b');
    const s = document.createElement('small');
    a.href = `#/ex/${ex.id}`;
    b.textContent = ex.title;
    s.textContent = ex.usesScanner ? `${ex.list}, lê entrada` : ex.list;
    a.append(b, s);
    li.append(a);
    return li;
  }));
}

async function openExercise(id) {
  current = catalog.exercises.find((e) => e.id === id);
  if (!current) { location.hash = '#/'; return; }
  const ex = current;
  $('title').textContent = `${ex.list}/${ex.title}`;
  $('stdin').value = '';
  term.clear();
  $('run').disabled = !ex.runnable;
  editor.load('// Carregando…');
  try { editor.load(await fetchSource(catalog, ex)); }
  catch (e) { editor.load(''); term.show({ kind: 'service_error', stderr: e.message }); }
  if (!ex.runnable) term.show({ kind: 'client_error', stderr: 'Este arquivo não tem método main e não pode ser executado sozinho.' });
}

$('run').addEventListener('click', async () => {
  $('run').disabled = true;
  term.running();
  try { term.show(await run({ source: editor.get(), stdin: $('stdin').value })); }
  finally { $('run').disabled = !current?.runnable; }
});
$('reset').addEventListener('click', () => { if (!editor.isDirty() || confirm('Descartar as alterações e voltar ao código original?')) editor.reset(); });

try { catalog = await loadCatalog(); } catch (e) { $('count').textContent = e.message; throw e; }
$('list').append(...[...new Set(catalog.exercises.map((e) => e.list))].sort().map((l) => new Option(l, l)));
$('q').addEventListener('input', renderGrid);
$('list').addEventListener('change', renderGrid);
renderGrid();
onRoute((r) => {
  const ex = r.name === 'exercise';
  $('library').hidden = ex; $('workspace').hidden = !ex;
  if (ex) openExercise(r.id);
});
