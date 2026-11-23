// Escena 1: Semillas. Verbo: hacer clic. Cada semilla que brilla se vuelve flor y despierta el color.
const SEED_SPOTS = {
  W1: [800, 790], A: [230, 615], B: [480, 610], C: [1120, 610], D: [1370, 615], E: [330, 745],
  F: [600, 735], G: [1000, 735], H: [1270, 745], I: [520, 850], J: [110, 850], K: [1490, 850],
};
const BIG_SPOT = [800, 545];

function bgMeadow(id) {
  const P = 'data-p';
  let tufts = '';
  const tp = [[120, 700], [300, 600], [700, 620], [930, 660], [1180, 860], [1300, 720], [1500, 700], [520, 890], [60, 880], [880, 770], [450, 720], [1050, 720], [1380, 590], [200, 760], [660, 690], [1540, 820], [330, 880], [1000, 880]];
  for (const [x, y] of tp) tufts += `<path d="M${x - 14} ${y} q4 -24 8 -26 q-1 16 4 26 q3 -28 10 -32 q0 22 4 32 q5 -18 12 -20 q-4 12 -4 20Z" ${P}="#5fae4c"/>`;
  const soil = Object.values(SEED_SPOTS).map(([x, y]) => `<ellipse cx="${x}" cy="${y + 10}" rx="62" ry="17" ${P}="#b4855a"/><ellipse cx="${x}" cy="${y + 6}" rx="44" ry="9" ${P}="#c99a6c"/>`).join('');
  const bush = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-30" cy="0" r="30" ${P}="${c}"/><circle cx="8" cy="-16" r="36" ${P}="${shade(c, .1)}"/><circle cx="40" cy="2" r="28" ${P}="${c}"/><rect x="-60" y="0" width="128" height="28" rx="14" ${P}="${c}"/></g>`;
  let rays = '';
  for (let i = 0; i < 12; i++) rays += `<path d="M0 -86 L0 -108" transform="rotate(${i * 30})" ${P}="#ffd34d" data-pa="stroke" stroke-width="11" stroke-linecap="round"/>`;
  return `<defs>
<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#86cff2"/><stop offset=".6" ${P}="#c6ecf8"/><stop offset="1" ${P}="#fff0d2"/></linearGradient>
<linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#7fd0e6"/><stop offset="1" ${P}="#43aacb"/></linearGradient>
<linearGradient id="${id}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#b0e382"/><stop offset="1" ${P}="#74c05c"/></linearGradient>
<radialGradient id="${id}sg"><stop offset="0" ${P}="#fff3a6" stop-opacity=".9"/><stop offset="1" ${P}="#ffe066" stop-opacity="0"/></radialGradient>
</defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}sky)"/>
<g class="rainbow" opacity="0">${['#ff8b8b', '#ffb86b', '#ffe066', '#9ee07c', '#79c8ff', '#b394ff'].map((c, i) => `<path d="M${180 + i * 16} 470 A${620 - i * 16} ${620 - i * 16} 0 0 1 ${1420 - i * 16} 470" fill="none" stroke="${c}" stroke-width="17"/>`).join('')}</g>
<g transform="translate(1250 185)">
  <circle r="150" fill="url(#${id}sg)"/><g class="spin-slow">${rays}</g><circle r="72" ${P}="#ffd84d"/><circle r="60" ${P}="#ffe680"/>
  <g class="sun-sleep"><path d="M-32 -2 q11 9 22 0 M10 -2 q11 9 22 0" stroke="#8a7240" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cy="24" rx="7" ry="5" fill="#8a7240" opacity=".6"/></g>
  <g class="sun-awake" opacity="0">${EYE(-21, -6, 8)}${EYE(21, -6, 8)}<path d="M-16 16 Q0 34 16 16" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>${CHEEK(-36, 12, 10)}${CHEEK(36, 12, 10)}</g>
</g>
<g transform="translate(300 150)"><g class="drift">${ART.cloud(.9, true)}</g></g>
<g transform="translate(760 95)"><g class="drift" style="--d:-14s">${ART.cloud(.65, true)}</g></g>
<g transform="translate(1530 300)"><g class="drift" style="--d:-25s">${ART.cloud(.55, true)}</g></g>
<rect x="-600" y="420" width="2800" height="900" fill="url(#${id}sea)"/>
<g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"><g class="ripple"><path d="M40 448 q20 -8 40 0 M1480 452 q20 -8 40 0 M1220 440 q20 -8 40 0"/></g><g class="ripple" style="--d:-2.5s"><path d="M200 462 q20 -8 40 0 M1380 470 q20 -8 40 0"/></g></g>
<path d="M1440 438 C1470 400 1530 395 1560 438Z" ${P}="#9ccf86"/>
<path d="M-600 520 C-100 440 200 425 420 470 C600 508 680 470 800 452 C950 428 1050 480 1200 470 C1400 456 1600 412 2200 470 L2200 1300 L-600 1300Z" ${P}="#97d47e" data-gl=""/>
<path d="M-600 600 C-50 562 300 548 600 562 C900 577 1200 542 1500 556 C1700 566 1850 580 2200 600 L2200 1300 L-600 1300Z" fill="url(#${id}gr)"/>
<ellipse cx="800" cy="566" rx="200" ry="42" ${P}="#a7dd80"/>
${bush(330, 568, .9, '#6fc35e')}${bush(1240, 560, .8, '#68bd59')}${bush(640, 566, .6, '#7ccb66')}
<g transform="translate(95 560)"><path d="M-12 40 C-10 0 -8 -40 -4 -70 L8 -70 C10 -40 12 0 14 40Z" ${P}="#a8703f"/>
  <circle cx="-34" cy="-86" r="46" ${P}="#5cb656"/><circle cx="26" cy="-96" r="52" ${P}="#69c25e"/><circle cx="-6" cy="-140" r="48" ${P}="#78cd68"/></g>
<g transform="translate(1510 600)"><path d="M0 30 C-4 -40 10 -110 34 -170" ${P}="#b88550" data-pa="stroke" stroke-width="20" fill="none" stroke-linecap="round"/>
  ${[-160, -120, -70, -20, 30].map(a => `<path d="M34 -170 q40 -30 90 -6 q-50 -6 -90 6Z" transform="rotate(${a + 90} 34 -170)" ${P}="#5fbf5a"/>`).join('')}
  <circle cx="30" cy="-160" r="9" ${P}="#a0703f"/><circle cx="44" cy="-166" r="9" ${P}="#a0703f"/></g>
<g transform="translate(1080 880)"><ellipse rx="60" ry="30" ${P}="#b6b0c4"/><ellipse cx="-14" cy="-10" rx="22" ry="9" ${P}="#d3cede"/></g>
${soil}${tufts}`;
}

Screens.semillas = ctx => {
  const bg = grp({}, L.world, bgMeadow('sm'));
  Paint.scan(bg);
  const rainbow = bg.querySelector('.rainbow'), sunSleep = bg.querySelector('.sun-sleep'), sunAwake = bg.querySelector('.sun-awake');
  const flowersL = grp({}, L.world), seedsL = grp({}, L.world), topL = grp({}, L.world);
  const lumi = new Lumi(topL, -180, 300, 1);
  const TYPES = ['daisy', 'round', 'tulip', 'star'];
  const PCOL = ['#ff8fb1', '#ffb35c', '#b48cff', '#6cc6ff', '#ff7b7b', '#f59ee6', '#ffd84a', '#7fdcb0'];
  const TOTAL = 13, t0 = performance.now();
  let count = 0, waveDone = null, big = null, finished = false;
  const seeds = new Set(), flowers = [];

  // Progreso: fila de casilleros arriba al centro (sin nÃºmeros).
  const bar = grp({ transform: tr(800, 56) }, L.hud);
  grp({}, bar, `<rect x="-306" y="-28" width="612" height="56" rx="28" fill="#fff" fill-opacity=".6" stroke="#fff" stroke-width="3"/>`);
  const slots = [];
  for (let i = 0; i < TOTAL; i++) {
    const x = (i - 6) * 44 - (i === 12 ? -6 : 0), r = i === 12 ? 18 : 13;
    const s = grp({ transform: tr(x, 0) }, bar, `<circle r="${r}" fill="#efe8f3" stroke="${i === 12 ? '#ffd84a' : '#ddd2e8'}" stroke-width="3"/>`);
    slots.push({ g: s, x: 800 + x, y: 56 });
  }
  const fillSlot = (i, col, x, y) => {
    const s = slots[i];
    FX.fly(`<circle r="12" fill="${col}" stroke="#fff" stroke-width="3"/>`, x, y, s.x, s.y, 800, 120, L.hud).then(() => {
      const f = grp({}, s.g, `<circle r="${i === 12 ? 18 : 13}" fill="${col}"/><circle r="5" fill="#ffd34d"/>`);
      anim(f, [{ transform: 'scale(1.8)' }, { transform: 'scale(1)' }], { duration: 400, easing: EB });
      Sound.twinkle();
    });
  };

  function addFlower(x, y, type, col, h, scale = 1) {
    const f = { x, y, h, col, i: flowers.length };
    f.g = el('g', { transform: tr(x, y, scale) });
    const before = [...flowersL.children].find(c => +c.dataset.y > y);
    flowersL.insertBefore(f.g, before || null); f.g.dataset.y = y;
    const sw = grp({ class: 'sway', style: `--d:-${rand(0, 3).toFixed(1)}s` }, f.g);
    const parts = ART.flowerParts(type, col, h);
    const stem = grp({}, sw, parts.stem);
    const leaves = parts.leaves.map((l, k) => { const o = grp({ transform: `translate(0 ${l.y}) scale(${l.s} 1)` }, sw); const i = grp({}, o, l.svg); anim(i, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 450, delay: 260 + k * 120, easing: EB }); return i; });
    const ho = grp({ transform: `translate(0 ${-h})` }, sw);
    f.head = grp({}, ho, parts.head);
    anim(stem, [{ transform: 'scale(1,0)' }, { transform: 'scale(1,1)' }], { duration: 480, easing: 'cubic-bezier(.2,.8,.3,1)' });
    anim(f.head, [{ transform: 'scale(0) rotate(-120deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 620, delay: 380, easing: EB });
    f.t = App.addTarget({ x, y: y - h * scale, r: 80 * scale, prio: 1, kind: 'flower', hit: () => wiggle(f) });
    flowers.push(f);
    return f;
  }
  function wiggle(f) {
    App.lastGood = performance.now();
    anim(f.head, [{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(-16deg) scale(1.12)' }, { transform: 'rotate(12deg) scale(1.08)' }, { transform: 'rotate(-6deg) scale(1.02)' }, { transform: 'rotate(0deg) scale(1)' }], { duration: 600, fill: 'none' });
    Sound.ding(f.i + 2);
    for (let k = 0; k < 3; k++) FX.sparkle(f.x + rand(-50, 50), f.y - f.h + rand(-50, 30), '#fff6b0', rand(.8, 1.3));
  }

  function spawnSeed([x, y], delay = 0) {
    const s = { x, y, alive: true };
    s.g = grp({ transform: tr(x, y - 8) }, seedsL);
    s.inner = grp({}, s.g, `<g transform="scale(1.3)">${ART.seed()}</g>`);
    anim(s.inner, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 520, delay, easing: EB });
    ctx.after(delay, () => Sound.pop());
    s.t = App.addTarget({ x, y: y - 14, r: 108, prio: 3, kind: 'seed', hit: () => bloom(s) });
    seeds.add(s);
    return s;
  }
  function bloom(s) {
    if (!s.alive) return;
    s.alive = false; App.removeTarget(s.t); seeds.delete(s); App.good();
    anim(s.inner, [{ transform: 'scale(1)' }, { transform: 'scale(1.4)', offset: .3 }, { transform: 'scale(0)' }], { duration: 360 }).onfinish = () => s.g.remove();
    const col = PCOL[count % PCOL.length], type = TYPES[count % TYPES.length], h = count === 0 ? 105 : rand(105, 150);
    const f = addFlower(s.x, s.y, type, col, h);
    FX.ring(s.x, s.y, col, 280, 12, 950);
    ctx.after(380, () => FX.burst(s.x, s.y - h, [col, '#ffffff', '#ffd84a'], 14, 150));
    Paint.wave(s.x, s.y, 560, .8);
    Paint.global(.1 + .7 * (count + 1) / TOTAL);
    Sound.bloom(count);
    lumi.happy();
    lumi.move(ctx, clamp(s.x + (s.x < 800 ? 170 : -170), 170, 1430), rand(300, 370), 950, 50);
    fillSlot(count, col, f.x, f.y - h);
    count++;
    if (seeds.size === 0 && waveDone) { const w = waveDone; waveDone = null; ctx.after(500, w); }
  }
  const waitWave = () => new Promise(r => { waveDone = r; });
  async function wave(spots, first) {
    spots.forEach((p, i) => spawnSeed(SEED_SPOTS[p], i * 180));
    if (first) ctx.after(900, () => Guide.tap(SEED_SPOTS[spots[0]][0], SEED_SPOTS[spots[0]][1] - 14, 99));
    await waitWave();
    lumi.happy(true); Sound.chord();
    await ctx.wait(700);
  }
  async function waveSeq(spots) {
    for (const p of spots) { spawnSeed(SEED_SPOTS[p]); await waitWave(); }
    lumi.happy(true); Sound.chord();
    await ctx.wait(700);
  }

  // Semilla gigante: cinco toques.
  function bigSeed() {
    return new Promise(res => {
      const [x, y] = BIG_SPOT;
      const go = grp({ transform: tr(x, y - 30) }, seedsL), g = grp({}, go);
      const ring = grp({}, g);
      const segs = [];
      for (let i = 0; i < 5; i++) {
        const a0 = (-90 + i * 72 + 6) * Math.PI / 180, a1 = (-90 + i * 72 + 66) * Math.PI / 180, R = 112;
        segs.push(el('path', { d: `M${Math.cos(a0) * R} ${Math.sin(a0) * R} A${R} ${R} 0 0 1 ${Math.cos(a1) * R} ${Math.sin(a1) * R}`, fill: 'none', stroke: '#ffffff', 'stroke-opacity': .7, 'stroke-width': 14, 'stroke-linecap': 'round' }, ring));
      }
      const sc = grp({}, g), inner = grp({ transform: 'scale(1.7)' }, sc, ART.seed(true));
      anim(g, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 700, easing: EB });
      Sound.pop(); Sound.chord();
      let taps = 0;
      big = { x, y: y - 30 };
      const t = App.addTarget({
        x, y: y - 30, r: 150, prio: 3, kind: 'big', hit: () => {
          taps++; App.good();
          segs[taps - 1].setAttribute('stroke', '#ffd84a'); segs[taps - 1].setAttribute('stroke-opacity', 1);
          anim(sc, [{ transform: `scale(${1 + (taps - 1) * .12})` }, { transform: `scale(${1.25 + taps * .12})`, offset: .35 }, { transform: `scale(${1 + taps * .12})` }], { duration: 450, easing: 'ease-out' });
          FX.burst(x, y - 30, ['#ffd84a', '#fff', '#ffb35c'], 10, 160, 'star');
          Sound.grow(taps);
          if (taps === 5) {
            App.removeTarget(t); big = null;
            anim(g, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: .3 }, { transform: 'scale(0)' }], { duration: 420 }).onfinish = () => go.remove();
            res();
          }
        },
      });
      ctx.after(1200, () => { if (taps === 0) Guide.tap(x, y - 30, 3); });
    });
  }

  function butterfly(c, cx, cy) {
    const g = grp({}, topL), inner = grp({ transform: 'scale(.9)' }, g, ART.butterfly(c));
    const a = rand(0, 6), sp = rand(.0007, .0012), rx = rand(140, 260), ry = rand(50, 110);
    let x0 = cx < 800 ? -100 : 1700, k = 0;
    ctx.loop((dt, now) => {
      k = Math.min(1, k + dt / 2500);
      const x = lerp(x0, cx + Math.cos(now * sp + a) * rx, Ease.out(k)), y = lerp(cy - 200, cy + Math.sin(now * sp * 2 + a) * ry, Ease.out(k));
      g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(Math.cos(now * sp + a) * 18).toFixed(1)})`);
    });
  }

  async function finale() {
    const [x, y] = BIG_SPOT;
    Sound.fanfare();
    const f = addFlower(x, y, 'daisy', '#ffc93c', 225, 1.6);
    App.removeTarget(f.t);
    f.t = App.addTarget({ x, y: y - 360, r: 120, prio: 1, kind: 'flower', hit: () => wiggle(f) });
    lumi.move(ctx, 1080, 360, 1000, 80);
    fillSlot(12, '#ffc93c', x, y - 360);
    count++;
    await ctx.wait(900);
    FX.ring(x, y - 360, '#fff6b0', 600, 18, 1400);
    Paint.all(1, 1400, x, y - 200);
    anim(rainbow, [{ opacity: 0 }, { opacity: .55 }], { duration: 2200, easing: 'ease-out' });
    anim(sunSleep, [{ opacity: 1 }, { opacity: 0 }], 600); anim(sunAwake, [{ opacity: 0 }, { opacity: 1 }], 600);
    ['#ff9fd0', '#6cc6ff', '#ffb35c', '#b78cff'].forEach((c, i) => ctx.after(500 + i * 450, () => butterfly(c, [380, 1220, 560, 1040][i], [420, 400, 330, 470][i])));
    finished = true;
    Store.sceneDone(App.profile, 'semillas', { ms: Math.round(performance.now() - t0), misses: App.misses, hints: App.hints });
    for (let i = 0; i < 6; i++) ctx.after(i * 420, () => { FX.burst(rand(250, 1350), rand(180, 520), PCOL, 16, 200, i % 2 ? 'star' : 'petal'); Sound.twinkle(); if (i % 2) lumi.happy(true); else lumi.spin(); });
    await ctx.wait(6200);
    App.go('map', { justDone: 'semillas', first });
  }
  const first = !Store.isDone(App.profile, 'semillas');

  (async () => {
    await ctx.wait(350);
    Sound.whoosh();
    await lumi.move(ctx, 800, 330, 1500, 90);
    lumi.look(800, 740);
    await ctx.wait(250);
    await wave(['W1'], true);
    await wave(['E', 'H', 'C']);
    await wave(['A', 'F', 'G', 'D']);
    await waveSeq(['B', 'I', 'J', 'K']);
    lumi.move(ctx, 1110, 330, 1000, 70);
    await bigSeed();
    await finale();
  })();
  Sound.ambient(true);

  return {
    onMove: p => lumi.look(p.x, p.y),
    hint: () => { if (finished) return null; const s = [...seeds][0]; return s ? { x: s.x, y: s.y - 14 } : big; },
    onMiss: p => {
      if (finished) return;
      Sound.miss(); FX.puff(p.x, p.y);
      let best = null, bd = Infinity;
      for (const s of seeds) { const d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } }
      if (best) {
        anim(best.inner, [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 550, fill: 'none' });
        FX.ring(best.x, best.y - 14, '#ffe27a', 120, 9, 650);
        lumi.look(best.x, best.y);
      } else if (big) FX.ring(big.x, big.y, '#ffe27a', 160, 10, 650);
    },
  };
};
