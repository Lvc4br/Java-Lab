export function parseRoute(hash) {
  const m = /^#\/ex\/([\w.-]+)$/.exec(hash || '');
  return m ? { name: 'exercise', id: m[1] } : { name: 'library' };
}
export function onRoute(cb) {
  const fire = () => cb(parseRoute(location.hash));
  addEventListener('hashchange', fire);
  fire();
}
