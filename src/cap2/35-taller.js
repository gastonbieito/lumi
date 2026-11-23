// Taller de dibujo (se abre después de la fiesta): dibujo libre, sin fin, para el que termina antes.
// Crayones gordos de colores, uno arcoíris, sellos (estrella, corazón, flor y Lumi) y una hoja nueva.
// La hoja terminada se cuelga en la soga de arriba. Los dibujos quedan mientras la página esté abierta (no se guardan).
const Taller = { sheet: '', hung: [] };

Screens.taller = ctx => {
  const prof = App.profile || (App.profile = Store.guest());
  Store.sceneDone(prof, 'taller', {});
  grp({}, L.world, `<rect x="-600" y="-400" width="2800" height="1700" fill="#f6e7cf"/>
<g opacity=".5">${[...Array(18)].map((_, i) => `<path d="M${-300 + i * 130} -200 L${-500 + i * 130} 1200" stroke="#efdcbd" stroke-width="40"/>`).join('')}</g>
<path d="M150 64 Q800 104 1450 64" stroke="#a8703f" stroke-width="5" fill="none"/>`);
  const PAPER = { x: 150, y: 128, w: 1300, h: 600 };
  grp({}, L.world, `<rect x="${PAPER.x + 6}" y="${PAPER.y + 10}" width="${PAPER.w}" height="${PAPER.h}" rx="18" fill="#000" opacity=".1"/>
<rect x="${PAPER.x}" y="${PAPER.y}" width="${PAPER.w}" height="${PAPER.h}" rx="18" fill="#fffdf8"/>
<rect x="${PAPER.x + 560}" y="${PAPER.y - 16}" width="180" height="36" rx="6" fill="#ffe7a0" opacity=".85" transform="rotate(-2 800 ${PAPER.y})"/>`);
  const clip = el('clipPath', { id: 'tpaper' }, L.world); el('rect', { x: PAPER.x, y: PAPER.y, width: PAPER.w, height: PAPER.h, rx: 18 }, clip);
  const art = grp({ 'clip-path': 'url(#tpaper)' }, L.world);
  art.innerHTML = Taller.sheet;
  const lineL = grp({}, L.world), uiL = grp({}, L.world);

  // Soga con los dibujos colgados (los más nuevos a la derecha, hasta 6).
  function drawLine() {
    lineL.innerHTML = '';
    Taller.hung.slice(-6).forEach((h, i) => {
      const x = 260 + i * 200, y = 76 + Math.sin((x - 150) / 1300 * Math.PI) * 14;
      grp({ transform: tr(x, y) }, lineL, `<rect x="-62" y="0" width="124" height="60" rx="5" fill="#fffdf8" stroke="#e7d6b8" stroke-width="2"/>
<g transform="translate(-62 0) scale(${124 / PAPER.w}) translate(${-PAPER.x} ${-PAPER.y})">${h}</g><rect x="-6" y="-8" width="12" height="20" rx="3" fill="#ff8fb1"/>`);
    });
  }
  drawLine();

  const COLS = ['#2d2240', '#ff5d6c', '#ff9a3c', '#ffd23f', '#5cc95c', '#3fb6ff', '#8a6cff', '#ff8fd0'];
  const tools = [];
  let tool = { kind: 'crayon', c: COLS[1] }, stroke = null, last = null, hue = 0, sel = null, drawn = !!Taller.sheet, lastSnd = 0;
  function button(x, y, html, t, r = 44) {
    const g = grp({ transform: tr(x, y) }, uiL), pop = grp({}, g, `<circle r="${r + 4}" fill="#fff" opacity=".9"/>${html}`);
    const ring = grp({ opacity: 0 }, g, `<circle r="${r + 10}" fill="none" stroke="${INK}" stroke-width="5"/>`);
    const b = { x, y, g, pop, ring, t };
    b.tg = App.addTarget({ x, y, r: r + 10, prio: 3, kind: 'tool', hit: () => choose(b) });
    tools.push(b);
    return b;
  }
  function choose(b) {
    App.good();
    anim(b.pop, [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300, easing: EB, fill: 'none' });
    if (b.t.kind === 'map') { Sound.chord(); save(); App.go('map'); return; }
    if (b.t.kind === 'new') return newSheet();
    Sound.tap(); Sound.chime(tools.indexOf(b));
    tool = b.t;
    if (sel) sel.ring.setAttribute('opacity', 0);
    sel = b; b.ring.setAttribute('opacity', 1);
  }
  const crayon = c => `<circle r="40" fill="${c}"/><circle cx="-12" cy="-12" r="10" fill="#fff" opacity=".35"/>`;
  COLS.forEach((c, i) => button(290 + i * 92, 818, crayon(c), { kind: 'crayon', c }));
  button(290 + 8 * 92, 818, `<circle r="40" fill="url(#gRain)"/><circle cx="-12" cy="-12" r="10" fill="#fff" opacity=".35"/>`, { kind: 'rainbow' });
  const STAMPS = {
    star: () => ART.star(46),
    heart: c => `<path d="M0 34 C-60 -6 -40 -52 0 -26 C40 -52 60 -6 0 34Z" fill="${c}" stroke="${shade(c, -.25)}" stroke-width="4"/>`,
    flower: c => `<g transform="scale(.9)">${ART.flowerParts('daisy', c, 0).head}</g>`,
    lumi: () => `<g transform="scale(.42)">${ART.lumi().replace(/class="(pulse|blink)"/g, '')}</g>`,
  };
  const stampBtn = (k, x) => button(x, 818, `<g transform="scale(.62)">${STAMPS[k]('#ff8fb1')}</g>`, { kind: 'stamp', s: k });
  stampBtn('star', 1200); stampBtn('heart', 1292); stampBtn('lumi', 1384);
  button(1500, 818, `<rect x="-26" y="-32" width="52" height="64" rx="6" fill="#fffdf8" stroke="${INK}" stroke-width="4"/><path d="M-12 -8 h24 M-12 6 h24" stroke="#d9cfe6" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="-26" r="14" fill="#86d36f"/><path d="M14 -26 h12 M20 -32 v12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`, { kind: 'new' });
  button(110, 818, `<g transform="scale(.075) translate(-805 -480)"><path d="M250 520 C215 330 370 165 620 150 C760 118 900 150 1010 135 C1210 122 1350 230 1366 405 C1382 560 1330 720 1160 792 C990 852 770 832 610 818 C420 800 280 700 250 520Z" fill="#8fd474" stroke="#f5dfaa" stroke-width="30"/></g><g transform="translate(0 28) scale(.17)">${faroArt(false)}</g>`, { kind: 'map' });
  if (!$('#gRain')) L.defs.insertAdjacentHTML('beforeend', `<linearGradient id="gRain" x1="0" y1="0" x2="1" y2="1">${['#ff5d6c', '#ff9a3c', '#ffd23f', '#5cc95c', '#3fb6ff', '#8a6cff'].map((c, i) => `<stop offset="${i / 5}" stop-color="${c}"/>`).join('')}</linearGradient>`);
  choose(tools[1]);

  const inPaper = p => p.x > PAPER.x + 4 && p.x < PAPER.x + PAPER.w - 4 && p.y > PAPER.y + 4 && p.y < PAPER.y + PAPER.h - 4;
  const colorNow = () => tool.kind === 'rainbow' ? `hsl(${hue % 360} 90% 60%)` : tool.c;
  function save() { Taller.sheet = art.innerHTML; }
  function newStroke(p) {
    stroke = el('path', { d: `M${p.x.toFixed(1)} ${p.y.toFixed(1)} l0.1 0`, fill: 'none', stroke: colorNow(), 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, art);
    last = p;
  }
  function stamp(p) {
    const c = pick(COLS.slice(1)), s = grp({ transform: tr(p.x, p.y) }, art), inner = grp({}, s, STAMPS[tool.s](c));
    anim(inner, [{ transform: 'scale(0) rotate(-30deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 380, easing: EB });
    Sound.stamp(); FX.burst(p.x, p.y, [c, '#fff'], 8, 90, 'star');
  }
  function newSheet() {
    if (!art.childElementCount) { Sound.tap(); return; }
    save(); Taller.hung.push(Taller.sheet); Taller.sheet = '';
    Sound.whoosh();
    const slot = Math.min(Taller.hung.length, 6) - 1, x = 260 + slot * 200;
    anim(art, [{ transform: 'translate(0px,0px) scale(1)', opacity: 1 }, { transform: `translate(${x - 62 - PAPER.x * .095}px,${76 - PAPER.y * .095}px) scale(.095)`, opacity: .3 }], { duration: 700, easing: 'ease-in' }).onfinish = () => {
      art.innerHTML = ''; art.getAnimations && art.getAnimations().forEach(a => a.cancel());
      drawLine(); Sound.fanfare();
      FX.burst(x, 110, COLS.slice(1), 16, 160, 'star');
    };
  }

  if (!drawn) ctx.after(1500, () => Guide.drag(500, 400, 1000, 460));
  return {
    onDown: p => {
      if (!inPaper(p)) return false;
      App.good(); drawn = true;
      if (tool.kind === 'stamp') { stamp(p); return true; }
      newStroke(p); Sound.crayon(p.y);
      return true;
    },
    onMove: p => {
      if (!stroke) return;
      if (!inPaper(p)) { stroke = null; save(); return; }
      if (Math.hypot(p.x - last.x, p.y - last.y) < 5) return;
      App.lastGood = performance.now();
      if (tool.kind === 'rainbow') { hue += 14; newStroke(last); }
      stroke.setAttribute('d', stroke.getAttribute('d') + ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      last = p;
      const now = performance.now(); if (now - lastSnd > 90) { lastSnd = now; Sound.crayon(p.y); }
    },
    onUp: () => { if (stroke) { stroke = null; save(); } },
    onMiss: () => { App.misses--; },
    hint: () => !drawn ? { x: 500, y: 400, x2: 1000, y2: 460 } : null,
    hintDelay: 9000,
    auto: () => null,
  };
};
