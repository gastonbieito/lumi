// Escena 4: Caminos de luz. Verbo: arrastrar siguiendo un camino, sin soltar.
// Se aprieta sobre Lumi y se la lleva por el caminito brillante hasta la luciérnaga dormida, que se despierta.
// Si se suelta, Lumi se queda donde estaba (no se pierde lo avanzado). Si el mouse se sale del camino, Lumi espera.
// Tres rondas de tres caminos: anchos y suaves, con curvas, y finitos con vueltas.
const PATHS = [
  { tol: 125, d: ['M220 560 C500 520 1100 600 1380 540', 'M240 700 C500 700 700 380 1000 380 C1200 380 1300 460 1380 460', 'M260 420 C500 300 700 640 900 560 C1100 480 1200 360 1380 380'] },
  { tol: 100, d: ['M230 300 C1000 260 1250 360 1100 480 C950 600 400 520 380 640 C360 760 900 780 1370 720', 'M260 760 C260 400 600 230 800 230 C1000 230 1340 400 1340 760', 'M220 560 C320 380 420 380 520 560 C620 740 720 740 820 560 C920 380 1020 380 1120 560 C1220 740 1320 740 1400 600'] },
  { tol: 82, d: ['M220 300 L520 700 L820 300 L1120 700 L1380 360', 'M220 660 C500 660 700 660 800 520 C900 380 780 250 640 300 C500 350 560 560 760 560 C1000 560 1150 400 1380 300', 'M240 380 C400 170 560 570 700 370 C840 170 980 570 1120 370 C1220 230 1380 300 1380 580'] },
];

Screens.caminos = ctx => {
  const P = 'data-p';
  let dots = '';
  for (let i = 0; i < 46; i++) dots += `<circle cx="${rand(-300, 1900).toFixed(0)}" cy="${rand(-200, 560).toFixed(0)}" r="${rand(1.5, 3).toFixed(1)}" ${P}="#fff6c8" data-gl="" opacity="${rand(.35, .85).toFixed(2)}"/>`;
  const bg = grp({}, L.world, `<defs><linearGradient id="cms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#202a66"/><stop offset=".6" ${P}="#3f3d8f"/><stop offset="1" ${P}="#7a5aa6"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#cms)"/>${dots}
<g transform="translate(1420 150)"><circle r="110" fill="url(#gWhite)" opacity=".22"/><circle r="60" ${P}="#fff2b0" data-gl=""/><circle cx="-18" cy="-14" r="10" ${P}="#f1df92" data-gl=""/>
<g class="sun-sleep"><path d="M-28 0 q9 7 18 0 M10 0 q9 7 18 0" stroke="#8a7a4a" stroke-width="5" fill="none" stroke-linecap="round"/></g>
<g class="sun-awake" opacity="0">${EYE(-18, -4, 7)}${EYE(18, -4, 7)}<path d="M-12 14 Q0 27 12 14" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>${CHEEK(-30, 10, 8)}${CHEEK(30, 10, 8)}</g></g>
<path d="M-600 800 C-200 740 300 780 800 770 C1300 760 1700 790 2200 780 L2200 1300 L-600 1300Z" ${P}="#2e6b5e" data-gl=""/>
${[[90, 820, 1.1], [1520, 810, 1], [1380, 840, .7], [260, 850, .6]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -150 L-50 -10 L50 -10Z" ${P}="#2f5a50" data-gl=""/><path d="M0 -190 L-38 -80 L38 -80Z" ${P}="#36685c" data-gl=""/></g>`).join('')}`);
  Paint.scan(bg);
  const skyL = grp({}, L.world), pathL = grp({}, L.world), endL = grp({}, L.world), lumiL = grp({}, L.world);
  const lumi = new Lumi(lumiL, 800, 1100, .55);
  const bar = makeBar(10);
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'caminos');
  let pts = [], idx = 0, tol = 120, dragging = false, off = false, mode = 'wait', sparks = [], done = null, nDone = 0, band = null, walk = null, len = 0, fly = null, finished = false, shownHint = false;
  const LOOK = 44;

  function setup(d, t) {
    pathL.innerHTML = ''; endL.innerHTML = '';
    tol = t;
    const meas = el('path', { d, fill: 'none' }, pathL);
    len = meas.getTotalLength();
    pts = [];
    for (let s = 0; s <= len; s += 6) { const q = meas.getPointAtLength(s); pts.push({ x: q.x, y: q.y }); }
    const last = meas.getPointAtLength(len); pts.push({ x: last.x, y: last.y });
    meas.remove();
    band = el('path', { d, fill: 'none', stroke: '#fff3a0', 'stroke-width': tol * 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .16 }, pathL);
    el('path', { d, fill: 'none', stroke: '#fff3a0', 'stroke-width': tol * .7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .14 }, pathL);
    el('path', { d, fill: 'none', stroke: '#fffbe0', 'stroke-width': 8, 'stroke-dasharray': '2 22', 'stroke-linecap': 'round', opacity: .8 }, pathL);
    walk = el('path', { d, fill: 'none', stroke: '#ffd84a', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': `0 ${len + 20}` }, pathL);
    anim(pathL, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
    sparks = [];
    for (let s = 130; s < len - 80; s += 130) {
      const i = Math.round(s / 6), q = pts[i];
      sparks.push({ i, g: grp({ transform: tr(q.x, q.y) }, pathL, `<g class="pulse" style="animation-duration:1.8s"><path d="${SPARK}" fill="#fffbe0" transform="scale(1.4)"/></g>`) });
    }
    const e = pts[pts.length - 1];
    fly = { x: e.x, y: e.y, g: grp({ transform: tr(e.x, e.y - 10, .95) }, endL) };
    fly.inner = grp({}, fly.g, fireflyArt(false) + `<g class="float"><text x="30" y="-40" font-size="30" fill="#c9c4e0">z</text><text x="48" y="-66" font-size="22" fill="#c9c4e0">z</text></g>`);
    anim(fly.inner, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 500, easing: EB });
    idx = 0; dragging = false; off = false;
    lumi.place(pts[0].x, pts[0].y);
    FX.ring(pts[0].x, pts[0].y, '#fff3a0', 140, 8, 700);
  }
  function hintPts(from = idx, n = 70) {
    const out = [];
    for (let j = from; j < Math.min(pts.length, from + n); j += 6) out.push(pts[j]);
    out.push(pts[Math.min(pts.length - 1, from + n)]);
    return out;
  }
  function advance(j) {
    idx = j;
    const q = pts[idx];
    lumi.place(q.x, q.y);
    walk.setAttribute('stroke-dasharray', `${idx * 6} ${len + 20}`);
    for (const s of sparks) if (!s.got && s.i <= idx) {
      s.got = true; Sound.chime(sparks.indexOf(s) + 2);
      FX.burst(pts[s.i].x, pts[s.i].y, ['#fffbe0', '#ffd84a'], 8, 90, 'star');
      anim(s.g, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    }
    if (idx >= pts.length - 2) arrive();
  }
  function arrive() {
    if (mode !== 'path') return;
    mode = 'wait'; dragging = false; App.good();
    walk.setAttribute('stroke-dasharray', `${len + 20} 0`);
    Sound.fanfare(); lumi.happy(true);
    // La luciérnaga se despierta y sube al cielo, donde queda brillando.
    fly.inner.innerHTML = fireflyArt(true);
    FX.ring(fly.x, fly.y, '#fff3a0', 220, 10, 800);
    FX.burst(fly.x, fly.y, ['#fff3a0', '#ffd84a', '#fff'], 16, 200, 'star');
    nDone++;
    Paint.global(.12 + .7 * nDone / 9);
    const x0 = fly.x, y0 = fly.y, x1 = 180 + (nDone - 1) * 135, y1 = 150 + (nDone % 2) * 60, g = fly.g;
    bar.fill('#fff26a', fly.x, fly.y);
    ctx.after(700, () => {
      g.remove(); skyL.appendChild(g);
      ctx.tween(1300, e => g.setAttribute('transform', tr(lerp(x0, x1, e), lerp(y0, y1, e) - Math.sin(Math.PI * e) * 120, lerp(.95, .6, e)))).then(() => { if (done) { const r = done; done = null; r(); } });
    });
  }

  async function round(r, ri) {
    for (let k = 0; k < r.d.length; k++) {
      setup(r.d[k], r.tol);
      await ctx.wait(700);
      mode = 'path'; App.lastGood = performance.now();
      if (!shownHint && first) { shownHint = true; ctx.after(600, () => { if (!dragging && idx === 0) Guide.follow(hintPts(0, 90), 2); }); }
      await new Promise(res => { done = res; });
      await ctx.wait(400);
      anim(pathL, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
      await ctx.wait(450);
    }
    lumi.spin(); Sound.chord();
    await ctx.wait(900);
  }

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    for (let i = 0; i < PATHS.length; i++) await round(PATHS[i], i);
    finished = true;
    pathL.innerHTML = '';
    lumi.move(ctx, 800, 520, 900, 80);
    bar.fill('#ffd84a', 800, 450);
    // Las luciérnagas bailan en ronda alrededor de la luna.
    [...skyL.children].forEach((g, i) => anim(g, [{ transform: g.getAttribute('transform').replace(/translate\(([^ ]+) ([^)]+)\)/, 'translate($1px,$2px)') }, { transform: `translate(${800 + Math.cos(i / 9 * Math.PI * 2) * 300}px,${420 + Math.sin(i / 9 * Math.PI * 2) * 180}px) scale(.7)` }], { duration: 1500, delay: i * 60, easing: 'ease-in-out' }));
    Paint.all(1, 1600, 800, 400);
    wake(bg);
    await ctx.wait(1500);
    await finishScene(ctx, 'caminos', first, t0, lumi, ['#fff26a', '#ffd84a', '#ff9fd0', '#7fd1ff', '#b78cff']);
  })();
  Sound.ambient(true);

  return {
    onDown: p => {
      if (mode !== 'path') return false;
      const q = pts[idx];
      if (Math.hypot(p.x - q.x, p.y - q.y) < Math.max(115, tol + 15)) {
        dragging = true; off = false; App.good(); Sound.tap(); lumi.smile();
        return true;
      }
      return false;
    },
    onMove: p => {
      if (!dragging || mode !== 'path') { lumi.look(p.x, p.y); return; }
      let best = -1, bd = Infinity;
      for (let j = idx; j <= Math.min(pts.length - 1, idx + LOOK); j++) { const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y); if (d < bd) { bd = d; best = j; } }
      if (bd <= tol) {
        if (off) { off = false; }
        if (best > idx) { App.good(); advance(best); }
      } else if (!off) {
        off = true; Sound.boing();
        anim(band, [{ opacity: .16 }, { opacity: .5 }, { opacity: .16 }], { duration: 500, fill: 'none' });
        anim(lumi.hop, [{ transform: 'translateX(0px)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0px)' }], { duration: 350, fill: 'none' });
      }
    },
    onUp: () => { dragging = false; },
    onMiss: p => {
      if (mode !== 'path') return;
      Sound.miss(); FX.puff(p.x, p.y);
      const q = pts[idx]; FX.ring(q.x, q.y, '#fff3a0', 120, 8, 600);
    },
    hint: () => mode === 'path' && !dragging ? { path: hintPts() } : null,
    hintDelay: 6000,
    auto: () => mode === 'path' && !dragging ? { x: pts[idx].x, y: pts[idx].y, path: hintPts(idx, pts.length).filter((_, i) => i % 2 === 0).concat([pts[pts.length - 1]]) } : null,
  };
};
