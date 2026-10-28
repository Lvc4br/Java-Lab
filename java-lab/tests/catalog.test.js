import { describe, it, expect } from 'vitest';
import { validateCatalog, filterExercises } from '../assets/js/catalog.js';

const ex = (id, list = 'listaA') => ({ id, title: id, list, sourcePath: `${list}/${id}.java` });
const cat = (exercises) => ({ source: { repo: 'a/b', branch: 'main' }, exercises });

describe('catálogo', () => {
  it('valida um catálogo correto', () => expect(validateCatalog(cat([ex('a1')])).exercises).toHaveLength(1));
  it('recusa ids duplicados e campos ausentes', () => {
    expect(() => validateCatalog(cat([ex('a1'), ex('a1')]))).toThrow(/duplicado/);
    expect(() => validateCatalog(cat([{ id: 'x' }]))).toThrow(/sem "title"/);
  });
  it('filtra por texto e por lista', () => {
    const items = [ex('a1'), ex('d1', 'listaD')];
    expect(filterExercises(items, { list: 'listaD' })).toHaveLength(1);
    expect(filterExercises(items, { q: 'A1' })).toHaveLength(1);
  });
});
