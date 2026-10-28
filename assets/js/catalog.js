export async function loadCatalog(url = 'data/exercises.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Catálogo indisponível (HTTP ${res.status}).`);
  return validateCatalog(await res.json());
}

export function validateCatalog(data) {
  if (!data?.source?.repo || !data.source.branch || !Array.isArray(data.exercises)) throw new Error('Catálogo inválido.');
  const seen = new Set();
  for (const ex of data.exercises) {
    for (const k of ['id', 'title', 'list', 'sourcePath']) if (!ex[k]) throw new Error(`Exercício sem "${k}": ${ex.id ?? '?'}`);
    if (seen.has(ex.id)) throw new Error(`id duplicado: ${ex.id}`);
    seen.add(ex.id);
  }
  return data;
}

export function filterExercises(items, { q = '', list = '' } = {}) {
  const t = q.trim().toLowerCase();
  return items.filter((e) => (!list || e.list === list) && (!t || `${e.title} ${e.list} ${e.description ?? ''}`.toLowerCase().includes(t)));
}

export const sourceUrl = (cat, ex) => `https://raw.githubusercontent.com/${cat.source.repo}/${cat.source.branch}/${encodeURI(ex.sourcePath)}`;

export async function fetchSource(cat, ex) {
  const res = await fetch(sourceUrl(cat, ex));
  if (!res.ok) throw new Error(`Não foi possível carregar ${ex.sourcePath} (HTTP ${res.status}).`);
  return res.text();
}
