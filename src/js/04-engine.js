// Motor: capas, pintura (gris -> color), efectos, manito guía, Lumi, entrada y pantallas.
const stage = $('#stage');
const L = { defs: $('#defs'), world: $('#world'), fx: $('#fx'), hud: $('#hud'), hudfix: $('#hudfix'), guide: $('#guide'), veil: $('#veil') };
L.defs.innerHTML = ART.defs();
const toSvg = (cx, cy) => { const p = new DOMPoint(cx, cy).matrixTransform(stage.getScreenCTM().inverse()); return { x: p.x, y: p.y }; };
const toScreen = (x, y) => { const p = new DOMPoint(x, y).matrixTransform(stage.getScreenCTM()); return { x: p.x, y: p.y }; };

// ---------- Pintura: cada elemento con data-p arranca gris y se colorea con ondas.
const Paint = {
  items: [], running: false,
  scan(root, opt = {}) {
    const inv = stage.getScreenCTM().inverse();
    root.querySelectorAll('[data-p]').forEach(e => {
      const c = hex2rgb(e.getAttribute('data-p'));
      const it = { e, c, gr: grayOf(c), attr: e.getAttribute('data-pa') || (e.tagName === 'stop' ? 'stop-color' : 'fill'), lv: 0, to: 0, act: false, x: null, y: null, group: opt.group || null };
      if (!opt.global && e.tagName !== 'stop' && !e.hasAttribute('data-gl')) {
        try { const b = e.getBBox(); const p = new DOMPoint(b.x + b.width / 2, b.y + b.height / 2).matrixTransform(inv.multiply(e.getScreenCTM())); it.x = p.x; it.y = p.y; } catch (_) { }
      }
      e.removeAttribute('data-p');
      this.items.push(it); this.set(it, opt.level || 0); it.to = it.lv;
    });
  },
  set(it, lv) { it.lv = lv; it.e.setAttribute(it.attr, rgbStr(mixRgb(it.gr, it.c, lv))); },
  go(it, to, delay, dur) { it.from = it.lv; it.to = to; it.t0 = performance.now() + delay; it.dur = dur; it.act = true; this.kick(); },
  wave(x, y, R = 540, amt = .9) {
    for (const it of this.items) {
      if (it.x === null || it.group) continue;
      const d = Math.hypot(it.x - x, it.y - y);
      if (d < R) this.go(it, Math.min(1, Math.max(it.to, it.lv) + amt * (1 - d / R) + .08), d * 1.1, 650);
    }
  },
  global(lv, dur = 1200) { for (const it of this.items) if (it.x === null && !it.group && lv > it.to) this.go(it, lv, 0, dur); },
  group(name, lv, dur = 1000) { for (const it of this.items) if (it.group === name) this.go(it, lv, 0, dur); },
  all(lv, dur, cx = 800, cy = 450) { for (const it of this.items) if (!it.group) this.go(it, lv, it.x === null ? 0 : Math.hypot(it.x - cx, it.y - cy) * .9, dur); },
  kick() { if (!this.running) { this.running = true; requestAnimationFrame(this.tick); } },
  tick: now => {
    let any = false;
    for (const it of Paint.items) {
      if (!it.act) continue;
      if (now < it.t0) { any = true; continue; }
      const t = Math.min(1, (now - it.t0) / it.dur);
      Paint.set(it, it.from + (it.to - it.from) * Ease.out(t));
      if (t >= 1) it.act = false; else any = true;
    }
    if (any) requestAnimationFrame(Paint.tick); else Paint.running = false;
  },
  reset() { this.items = []; },
};

// ---------- Efectos de partículas.
const FX = {
  n: 0,
  add(x, y, html) { const g = grp({ transform: tr(x, y) }, L.fx); const i = grp({}, g, html); return [g, i]; },
  burst(x, y, colors, n = 12, spread = 140, shape = 'petal') {
    for (let k = 0; k < n; k++) {
      const c = colors[k % colors.length], a = rand(0, Math.PI * 2), d = rand(.45, 1) * spread;
      const html = shape === 'star' ? `<path d="${SPARK}" fill="${c}" transform="scale(${rand(.8, 1.5).toFixed(2)})"/>`
        : shape === 'dot' ? `<circle r="${rand(5, 9).toFixed(1)}" fill="${c}"/>`
          : `<ellipse rx="${rand(6, 9).toFixed(1)}" ry="${rand(11, 15).toFixed(1)}" fill="${c}"/>`;
      const [g, i] = this.add(x, y, html);
      const dx = Math.cos(a) * d, dy = Math.sin(a) * d - 40, r = rand(-260, 260);
      anim(i, [{ transform: 'translate(0px,0px) scale(.3) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${r * .6}deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx * 1.15}px,${dy + 70}px) scale(.7) rotate(${r}deg)`, opacity: 0 }],
        { duration: rand(850, 1300), easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => g.remove();
    }
  },
  ring(x, y, color = '#fff', r = 120, w = 8, dur = 700) {
    const [g, i] = this.add(x, y, `<circle r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/>`);
    anim(i, [{ transform: 'scale(.15)', opacity: .95 }, { transform: 'scale(1)', opacity: 0 }], { duration: dur, easing: 'cubic-bezier(.1,.6,.3,1)' }).onfinish = () => g.remove();
  },
  sparkle(x, y, c = '#fff6b0', s = 1, dur = 650) {
    const [g, i] = this.add(x, y, `<path d="${SPARK}" fill="${c}"/>`);
    anim(i, [{ transform: `scale(0) rotate(0deg)`, opacity: 1 }, { transform: `scale(${s * 1.4}) rotate(60deg)`, opacity: 1, offset: .4 }, { transform: `translate(0px,-24px) scale(0) rotate(140deg)`, opacity: 0 }], { duration: dur, easing: 'ease-out' }).onfinish = () => g.remove();
  },
  puff(x, y) {
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 2, [g, i] = this.add(x, y, `<circle r="${rand(7, 12)}" fill="#efe9f4"/>`);
      anim(i, [{ transform: 'translate(0px,0px) scale(.4)', opacity: .9 }, { transform: `translate(${Math.cos(a) * 40}px,${Math.sin(a) * 30 - 14}px) scale(1)`, opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => g.remove();
    }
  },
  fly(html, x1, y1, x2, y2, dur = 900, arc = 120, layer = L.fx) {
    const g = grp({ transform: tr(x1, y1) }, layer, html);
    const t0 = performance.now();
    return new Promise(res => {
      const step = now => {
        const t = Math.min(1, (now - t0) / dur), e = Ease.inOut(t);
        g.setAttribute('transform', tr(lerp(x1, x2, e), lerp(y1, y2, e) - Math.sin(Math.PI * t) * arc, 1 + Math.sin(Math.PI * t) * .35));
        if (t < 1) requestAnimationFrame(step); else { g.remove(); res(); }
      };
      requestAnimationFrame(step);
    });
  },
  trailT: 0, tx: 0, ty: 0,
  trail(x, y) {
    const now = performance.now();
    if (now - this.trailT < 45 || Math.hypot(x - this.tx, y - this.ty) < 14 || L.fx.childElementCount > 120) return;
    this.trailT = now; this.tx = x; this.ty = y;
    const [g, i] = this.add(x + rand(-6, 6), y + rand(-6, 6), `<path d="${SPARK}" fill="${pick(['#fff3a6', '#ffe0f0', '#d9f2ff', '#ffffff'])}"/>`);
    anim(i, [{ transform: 'scale(.7) rotate(0deg)', opacity: .95 }, { transform: 'translate(0px,16px) scale(0) rotate(90deg)', opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => g.remove();
  },
};

// ---------- Manito guía.
const Guide = {
  g: null, inner: null, tk: 0, visible: false, x: 0, y: 0,
  init() { this.g = grp({ opacity: 0 }, L.guide); this.press = grp({}, this.g, ART.hand()); },
  place(x, y) { this.x = x; this.y = y; this.g.setAttribute('transform', tr(x, y, .95)); },
  async moveTo(x, y, dur, tk) {
    const x0 = this.x, y0 = this.y, t0 = performance.now();
    await new Promise(res => {
      const step = now => { if (tk !== this.tk) return res(); const t = Math.min(1, (now - t0) / dur), e = Ease.inOut(t); this.place(lerp(x0, x, e), lerp(y0, y, e)); t < 1 ? requestAnimationFrame(step) : res(); };
      requestAnimationFrame(step);
    });
  },
  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
  fade(o, d = 250) { anim(this.g, [{ opacity: +getComputedStyle(this.g).opacity }, { opacity: o }], { duration: d }); },
  async tap(x, y, reps = 3) {
    const tk = ++this.tk; this.visible = true;
    this.place(x + 150, y + 190); this.fade(1);
    await this.moveTo(x, y, 650, tk);
    for (let i = 0; i < reps && tk === this.tk; i++) {
      anim(this.press, [{ transform: 'scale(1)' }, { transform: 'scale(.82)', offset: .4 }, { transform: 'scale(1)' }], { duration: 420, fill: 'none' });
      await this.sleep(170); if (tk !== this.tk) break;
      FX.ring(x, y, '#ffffff', 70, 7, 600);
      await this.sleep(850);
    }
    if (tk === this.tk) { this.fade(0); this.visible = false; }
  },
  async drag(x1, y1, x2, y2, reps = 2) {
    const tk = ++this.tk; this.visible = true;
    for (let i = 0; i < reps && tk === this.tk; i++) {
      this.place(x1 + 120, y1 + 160); this.fade(1);
      await this.moveTo(x1, y1, 550, tk); if (tk !== this.tk) break;
      anim(this.press, [{ transform: 'scale(1)' }, { transform: 'scale(.84)' }], { duration: 200 });
      await this.sleep(250);
      await this.moveTo(x2, y2, 1100, tk); if (tk !== this.tk) break;
      anim(this.press, [{ transform: 'scale(.84)' }, { transform: 'scale(1)' }], { duration: 200 });
      FX.ring(x2, y2, '#ffffff', 80, 7, 600);
      await this.sleep(500); this.fade(0); await this.sleep(400);
    }
    if (tk === this.tk) { this.fade(0); this.visible = false; }
  },
  // Doble golpe: dos toques rápidos y una pausa.
  async dtap(x, y, reps = 3) {
    const tk = ++this.tk; this.visible = true;
    this.place(x + 150, y + 190); this.fade(1);
    await this.moveTo(x, y, 650, tk);
    for (let i = 0; i < reps && tk === this.tk; i++) {
      for (let k = 0; k < 2 && tk === this.tk; k++) {
        anim(this.press, [{ transform: 'scale(1)' }, { transform: 'scale(.8)', offset: .45 }, { transform: 'scale(1)' }], { duration: 230, fill: 'none' });
        await this.sleep(105); if (tk !== this.tk) break;
        FX.ring(x, y, '#ffffff', 52 + k * 26, 7, 420);
        await this.sleep(140);
      }
      await this.sleep(950);
    }
    if (tk === this.tk) { this.fade(0); this.visible = false; }
  },
  // Arrastre siguiendo un camino (lista de puntos), sin soltar.
  async follow(pts, reps = 1) {
    const tk = ++this.tk; this.visible = true;
    for (let i = 0; i < reps && tk === this.tk; i++) {
      this.place(pts[0].x + 120, pts[0].y + 160); this.fade(1);
      await this.moveTo(pts[0].x, pts[0].y, 550, tk); if (tk !== this.tk) break;
      anim(this.press, [{ transform: 'scale(1)' }, { transform: 'scale(.84)' }], { duration: 200 });
      await this.sleep(250);
      for (let k = 1; k < pts.length && tk === this.tk; k++) await this.moveTo(pts[k].x, pts[k].y, Math.max(60, Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y) * 2.6), tk);
      if (tk !== this.tk) break;
      anim(this.press, [{ transform: 'scale(.84)' }, { transform: 'scale(1)' }], { duration: 200 });
      await this.sleep(400); this.fade(0); await this.sleep(400);
    }
    if (tk === this.tk) { this.fade(0); this.visible = false; }
  },
  hide() { if (this.visible) { this.tk++; this.fade(0, 180); this.visible = false; } },
};

// ---------- Lumi.
class Lumi {
  constructor(parent, x, y, s = 1) {
    this.x = x; this.y = y; this.s = s; this.mt = 0;
    this.root = grp({ transform: tr(x, y, s) }, parent);
    this.hop = grp({}, this.root);
    this.hop.style.transformOrigin = '0px 60px';
    this.body = grp({ class: 'bob' }, this.hop, ART.lumi());
    this.pupils = [...this.root.querySelectorAll('.pupil')];
    this.mouth = this.root.querySelector('.mouth'); this.mouthO = this.root.querySelector('.mouth-o');
    this.arms = [...this.root.querySelectorAll('.arm')];
  }
  place(x, y) { this.x = x; this.y = y; this.root.setAttribute('transform', tr(x, y, this.s)); }
  move(ctx, x, y, dur = 900, arc = 50) {
    const my = ++this.mt, x0 = this.x, y0 = this.y;
    return ctx.tween(dur, (e, t) => { if (my === this.mt) this.place(lerp(x0, x, e), lerp(y0, y, e) - Math.sin(Math.PI * t) * arc); });
  }
  look(px, py) {
    const dx = px - this.x, dy = py - this.y, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 180) * 4.5;
    const t = `translate(${(dx / d * k).toFixed(1)} ${(dy / d * k).toFixed(1)})`;
    this.pupils.forEach(p => p.setAttribute('transform', t));
  }
  smile(ms = 900) {
    this.mouthO.setAttribute('opacity', 1); this.mouth.setAttribute('opacity', 0);
    clearTimeout(this._st); this._st = setTimeout(() => { this.mouthO.setAttribute('opacity', 0); this.mouth.setAttribute('opacity', 1); }, ms);
  }
  happy(big) {
    this.smile();
    const h = big ? 90 : 50;
    anim(this.hop, [{ transform: 'translateY(0px) scale(1,1)' }, { transform: 'translateY(4px) scale(1.14,.86)', offset: .15 }, { transform: `translateY(${-h}px) scale(.92,1.1)`, offset: .5 }, { transform: 'translateY(3px) scale(1.1,.9)', offset: .85 }, { transform: 'translateY(0px) scale(1,1)' }], { duration: big ? 850 : 650, easing: 'ease-out', fill: 'none' });
    this.arms.forEach((a, i) => anim(a, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-26px) rotate(' + (i ? 30 : -30) + 'deg)', offset: .5 }, { transform: 'translateY(0px)' }], { duration: 650, fill: 'none' }));
  }
  spin() {
    this.smile(1200);
    anim(this.hop, [{ transform: 'rotate(0deg) translateY(0px)' }, { transform: 'rotate(180deg) translateY(-30px)', offset: .5 }, { transform: 'rotate(360deg) translateY(0px)' }], { duration: 900, easing: 'ease-in-out', fill: 'none' });
  }
}

// ---------- Botón de sonido (siempre visible, arriba a la derecha).
const Hud = {
  x: 1538, y: 62,
  init() { this.g = grp({ transform: tr(this.x, this.y) }, L.hudfix); this.draw(); },
  draw() { this.g.innerHTML = ART.speaker(Sound.muted); },
  hit(p) { return Math.hypot(p.x - this.x, p.y - this.y) < 54; },
  toggle() {
    Sound.setMuted(!Sound.muted); Store.data.settings.muted = Sound.muted; Store.save(); this.draw();
    anim(this.g.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300, fill: 'none' });
    Sound.tap();
  },
};

// ---------- Aplicación, pantallas y entrada.
const Screens = {};
const App = {
  name: null, ctx: null, h: {}, targets: [], busy: true, going: false, profile: null,
  lastGood: performance.now(), pointer: { x: 800, y: 450 }, misses: 0, hints: 0,
  // Pantalla táctil sin mouse (tablet o celular): se sabe de entrada o al primer toque.
  touch: !!(window.matchMedia && matchMedia('(any-pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches),
  addTarget(t) { t.prio = t.prio || 1; this.targets.push(t); return t; },
  removeTarget(t) { const i = this.targets.indexOf(t); if (i >= 0) this.targets.splice(i, 1); },
  good() { this.lastGood = performance.now(); Guide.hide(); },
  veil(o, dur) {
    return new Promise(res => {
      const o0 = +L.veil.getAttribute('opacity'), t0 = performance.now();
      const step = now => { const t = Math.min(1, (now - t0) / dur); L.veil.setAttribute('opacity', lerp(o0, o, Ease.inOut(t))); t < 1 ? requestAnimationFrame(step) : res(); };
      requestAnimationFrame(step);
    });
  },
  async go(name, params = {}) {
    if (this.going) return;
    this.going = true; this.busy = true; Guide.hide();
    await this.veil(1, 380);
    if (this.ctx) this.ctx.destroy();
    Sound.ambient(false);
    L.world.innerHTML = ''; L.fx.innerHTML = ''; L.hud.innerHTML = '';
    Paint.reset(); this.targets = [];
    this.ctx = new Ctx(); this.name = name; this.misses = 0; this.hints = 0;
    this.busy = false; this.going = false;
    this.h = Screens[name](this.ctx, params) || {};
    this.lastGood = performance.now();
    await this.veil(0, 480);
  },
  hitTest(p) {
    let best = null, bs = Infinity;
    for (const t of this.targets) {
      let d;
      if (t.w) { const dx = Math.max(Math.abs(p.x - t.x) - t.w / 2, 0), dy = Math.max(Math.abs(p.y - t.y) - t.h / 2, 0); d = Math.hypot(dx, dy); if (d > 18) continue; }
      else { d = Math.hypot(p.x - t.x, p.y - t.y); if (d > t.r) continue; d /= t.r; }
      const s = -t.prio * 1000 + d;
      if (s < bs) { bs = s; best = t; }
    }
    return best;
  },
};

function fullscreen() {
  if (!Store.data.settings.fullscreen || document.fullscreenElement) return;
  try { const r = document.documentElement.requestFullscreen({ navigationUI: 'hide' }); if (r && r.catch) r.catch(() => { }); } catch (e) { }
}

stage.addEventListener('pointerdown', e => {
  e.preventDefault();
  Sound.init();
  if (e.pointerType === 'touch' || e.pointerType === 'pen') App.touch = true;
  if (App.busy || Panel.open) return;
  const p = toSvg(e.clientX, e.clientY);
  App.pointer = p;
  FX.ring(p.x, p.y, 'rgba(255,255,255,.95)', 38, 5, 380);
  if (Hud.hit(p)) return Hud.toggle();
  const h = App.h;
  if (h.onDown && h.onDown(p, e) === true) return;
  const t = App.hitTest(p);
  if (t) t.hit(p, t);
  else if (h.onMiss) { App.misses++; h.onMiss(p); }
});
stage.addEventListener('pointermove', e => {
  const p = toSvg(e.clientX, e.clientY);
  App.pointer = p; FX.trail(p.x, p.y);
  if (!App.busy && App.h.onMove) App.h.onMove(p);
});
window.addEventListener('pointerup', e => { if (!App.busy && App.h.onUp) App.h.onUp(toSvg(e.clientX, e.clientY)); });
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('dragstart', e => e.preventDefault());
window.addEventListener('selectstart', e => { if (!Panel.open) e.preventDefault(); });
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
window.addEventListener('keydown', e => {
  if (Panel.open) return;
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0', 'p', 's', 'o', 'f', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
  if (['Backspace', 'Tab', ' ', 'F1', 'F3', 'F7', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  if (!App.busy && !e.repeat && App.h.onKey) { Sound.init(); App.h.onKey(e.key, e); }
});
document.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });

// Pista automática: si pasa un rato sin aciertos, la manito muestra qué hacer.
setInterval(() => {
  const h = App.h;
  if (App.busy || Panel.open || Guide.visible || !h.hint) return;
  if (performance.now() - App.lastGood < (h.hintDelay || 6500)) return;
  const t = h.hint();
  App.lastGood = performance.now();
  if (!t) return;
  App.hints++;
  if (t.run) t.run(); else if (t.path) Guide.follow(t.path); else if (t.dbl) Guide.dtap(t.x, t.y, 2); else if (t.x2 != null) Guide.drag(t.x, t.y, t.x2, t.y2); else Guide.tap(t.x, t.y, 2);
}, 300);

// Ganchos de prueba (Playwright): posiciones de lo tocable en píxeles de pantalla.
window.__lumi = {
  get screen() { return App.name; },
  get busy() { return App.busy; },
  get touch() { return App.touch; },
  targets() { return App.targets.map(t => { const c = toScreen(t.x, t.y), k = stage.getScreenCTM().a; return { kind: t.kind || '', x: c.x, y: c.y, r: (t.r || Math.min(t.w, t.h) / 2) * k, w: t.w ? t.w * k : 0, h: t.h ? t.h * k : 0 }; }); },
  toScreen,
  auto() {
    const h = App.h; let a = h.auto ? h.auto() : null;
    if (!a && !h.auto) { const t = App.targets.filter(t => t.prio >= 2 && t.x > 40 && t.x < 1560 && t.y > 90 && t.y < 860).sort((p, q) => q.prio - p.prio)[0]; if (t) a = { x: t.x, y: t.y }; }
    if (!a) return null;
    if (a.key) return { key: a.key };
    const s = toScreen(a.x, a.y), r = { x: s.x, y: s.y, dbl: !!a.dbl };
    if (a.x2 != null) { const e = toScreen(a.x2, a.y2); r.x2 = e.x; r.y2 = e.y; }
    if (a.path) r.path = a.path.map(q => toScreen(q.x, q.y));
    return r;
  },
};
