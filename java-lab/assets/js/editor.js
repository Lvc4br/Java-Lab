// Editor simples (textarea). Para trocar por CodeMirror 6, mantenha esta mesma interface.
export function createEditor(el) {
  let original = '';
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || e.shiftKey) return;
    e.preventDefault();
    el.setRangeText('    ', el.selectionStart, el.selectionEnd, 'end');
  });
  return {
    load(text) { original = text; el.value = text; },
    get: () => el.value,
    reset() { el.value = original; },
    isDirty: () => el.value !== original,
  };
}
