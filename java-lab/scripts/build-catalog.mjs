// Gera data/exercises.json a partir do repositório de exercícios. Só lê; não altera os originais.
import { writeFile } from 'node:fs/promises';
const REPO = process.env.REPO ?? 'Lvc4br/ETEC-Desenvolvimento-de-Sistemas';
const get = async (url) => { const r = await fetch(url, { headers: { 'User-Agent': 'java-lab' } }); if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`); return r; };
const { default_branch: branch } = await (await get(`https://api.github.com/repos/${REPO}`)).json();
const { tree, truncated } = await (await get(`https://api.github.com/repos/${REPO}/git/trees/${branch}?recursive=1`)).json();
if (truncated) console.warn('Aviso: a árvore do GitHub veio truncada.');
const exercises = [];
for (const f of tree.filter((n) => n.type === 'blob' && n.path.endsWith('.java')).sort((a, b) => a.path.localeCompare(b.path))) {
  const src = await (await get(`https://raw.githubusercontent.com/${REPO}/${branch}/${encodeURI(f.path)}`)).text();
  const parts = f.path.split('/');
  exercises.push({
    id: f.path.replace(/\.java$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: parts.at(-1).replace(/\.java$/, ''),
    list: parts.length > 1 ? parts.at(-2) : 'raiz',
    sourcePath: f.path,
    mainClass: /public\s+(?:final\s+)?class\s+(\w+)/.exec(src)?.[1] ?? null,
    runnable: /static\s+void\s+main\s*\(/.test(src),
    usesScanner: /\bScanner\b/.test(src),
    hasPackage: /^\s*package\s/m.test(src),
  });
}
await writeFile('data/exercises.json', JSON.stringify({ generatedAt: new Date().toISOString(), source: { repo: REPO, branch }, exercises }, null, 2) + '\n');
console.log(`${exercises.length} exercícios (${exercises.filter((e) => !e.runnable).length} sem main).`);
