// Guardado local. Clave estable 'lumiIsla' (la lee también el capítulo 2).
// Estructura:
// { schema:1, profiles:[{id,name,creature,color}], progress:{ [id]:{ who:{creature,color}, cap1:{ [escena]:{done,plays,last,ms,misses,hints} } } },
//   settings:{muted,fullscreen}, last:id }
const STORE_KEY = 'lumiIsla';
const COLORS = [
  { id: 'coral', c: '#ff8b7b' }, { id: 'naranja', c: '#ffb25b' }, { id: 'amarillo', c: '#ffd84a' },
  { id: 'verde', c: '#86d36f' }, { id: 'menta', c: '#5fd6bd' }, { id: 'celeste', c: '#6cc6ff' },
  { id: 'azul', c: '#8a95ff' }, { id: 'violeta', c: '#b78cff' }, { id: 'rosa', c: '#ff9fd0' }, { id: 'lima', c: '#c3e05a' },
];
const CREATURES = ['gato', 'conejo', 'oso', 'rana', 'buho', 'pollito', 'zorro', 'pinguino', 'raton', 'pulpo'];
const colorOf = id => (COLORS.find(c => c.id === id) || COLORS[0]).c;
const normName = s => s.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');

const Store = {
  data: null,
  load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { d = null; }
    if (!d || d.schema !== 1) d = { schema: 1 };
    d.profiles = Array.isArray(d.profiles) ? d.profiles : [];
    d.progress = d.progress && typeof d.progress === 'object' ? d.progress : {};
    d.settings = Object.assign({ muted: false, fullscreen: true }, d.settings || {});
    this.data = d;
  },
  save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) { } },
  prog(p) {
    const all = this.data.progress;
    const e = all[p.id] || (all[p.id] = {});
    e.who = { creature: p.creature, color: p.color };
    return e.cap1 || (e.cap1 = {});
  },
  isDone(p, key) { const e = this.data.progress[p.id]; return !!(e && e.cap1 && e.cap1[key] && e.cap1[key].done); },
  sceneDone(p, key, stats) {
    const c = this.prog(p);
    const s = c[key] || { plays: 0 };
    Object.assign(s, stats, { done: true, plays: (s.plays || 0) + 1, last: Date.now() });
    c[key] = s;
    this.save();
  },
  anonProfiles() { return CREATURES.map((cr, i) => ({ id: 'a:' + cr, name: '', creature: cr, color: COLORS[(i * 3) % 10].id })); },
  guest() { return { id: 'invitado', name: '', creature: 'pollito', color: 'amarillo' }; },
  setNames(names) {
    const old = new Map(this.data.profiles.map(p => [normName(p.name), p]));
    const seen = new Set(), out = [];
    for (const raw of names) {
      const n = raw.trim().replace(/\s+/g, ' ');
      const k = normName(n);
      if (!n || seen.has(k)) continue;
      seen.add(k);
      let p = old.get(k);
      if (!p) {
        const used = new Set(out.map(q => q.creature));
        let i = 0;
        while (i < 10 && used.has(CREATURES[i])) i++;
        if (i === 10) i = out.length;
        p = { id: 'n:' + k, name: n, creature: CREATURES[i % 10], color: COLORS[(i * 3) % 10].id };
      }
      out.push(p);
    }
    this.data.profiles = out;
    this.save();
  },
  cycle(id, field) {
    const p = this.data.profiles.find(q => q.id === id); if (!p) return;
    const list = field === 'creature' ? CREATURES : COLORS.map(c => c.id);
    p[field] = list[(list.indexOf(p[field]) + 1) % list.length];
    this.save();
  },
  resetOne(id) { delete this.data.progress[id]; this.save(); },
  resetAll() { this.data.progress = {}; this.save(); },
  clearNames() {
    for (const p of this.data.profiles) delete this.data.progress[p.id];
    this.data.profiles = []; this.data.last = null; this.save();
  },
};
