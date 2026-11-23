'use strict';
const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function grp(attrs, parent, html) { const e = el('g', attrs, parent); if (html) e.innerHTML = html; return e; }
const tr = (x, y, s) => `translate(${x} ${y})` + (s != null && s !== 1 ? ` scale(${s})` : '');
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const Ease = {
  out: t => 1 - Math.pow(1 - t, 3),
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  lin: t => t,
};
const EB = 'cubic-bezier(.34,1.56,.64,1)';
function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
const rgbStr = c => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
const mixRgb = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function grayOf(c) { const l = .3 * c[0] + .59 * c[1] + .11 * c[2]; const v = 52 + l * .72; return mixRgb([v, v + 2, v + 9], c, .06); }
const toHex = c => '#' + c.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
function shade(hex, k) { const c = hex2rgb(hex); return toHex(k < 0 ? mixRgb(c, [40, 25, 60], -k) : mixRgb(c, [255, 255, 255], k)); }
// Web Animations sobre elementos SVG; devuelve la animación (o un objeto vacío si no hay soporte).
function anim(e, kf, o) {
  if (!e || !e.animate) return { set onfinish(f) { f && f(); }, finished: Promise.resolve() };
  return e.animate(kf, Object.assign({ fill: 'both' }, typeof o === 'number' ? { duration: o } : o));
}

// Contexto de una pantalla: todo lo que agenda se cancela al salir.
class Ctx {
  constructor() { this.alive = true; this.ids = new Set(); this.fns = []; }
  after(ms, fn) { const id = setTimeout(() => { this.ids.delete(id); if (this.alive) fn(); }, ms); this.ids.add(id); return id; }
  every(ms, fn) { const id = setInterval(() => { if (this.alive) fn(); }, ms); this.ids.add(id); return id; }
  wait(ms) { return new Promise(r => this.after(ms, r)); }
  tween(dur, fn, ease = Ease.inOut) {
    return new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        if (!this.alive) return;
        const t = Math.min(1, (now - t0) / dur);
        fn(ease(t), t);
        if (t < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
  }
  loop(fn) { let last = performance.now(); const step = now => { if (!this.alive) return; const dt = Math.min(50, now - last); last = now; if (fn(dt, now) !== false) requestAnimationFrame(step); }; requestAnimationFrame(step); }
  onEnd(fn) { this.fns.push(fn); }
  destroy() { this.alive = false; this.ids.forEach(id => clearTimeout(id)); this.ids.clear(); this.fns.forEach(f => { try { f(); } catch (e) { } }); }
}
