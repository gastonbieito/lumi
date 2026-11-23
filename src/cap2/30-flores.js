// Escena 1: Flores que cantan. Verbo: memoria de luces (clic).
// Lumi toca una secuencia de flores (cada una brilla y canta su nota) y el chico la repite.
// Tres rondas: 3 flores (1, 2 y 3 notas), 4 flores (2, 3 y 4) y 5 flores (3, 4 y 5).
// No se pierde: si se equivoca, la flor correcta late y Lumi vuelve a mostrar; a la segunda, la que sigue queda brillando.
const FLOWER_SET = [['daisy', '#ff6f91'], ['round', '#ffb347'], ['tulip', '#ffd84a'], ['star', '#5fc7ff'], ['daisy', '#b78cff']];

Screens.flores = ctx => {
  const bg = grp({}, L.world, bgLand('fl', `<g transform="translate(130 640)">${ART.flower('round', '#ff9fd0', 120, true)}</g><g transform="translate(1480 650) scale(.9)">${ART.flower('daisy', '#ffd84a', 130, true)}</g>`));
  Paint.scan(bg);
  const deco = grp({}, L.world), flL = grp({}, L.world), lumiL = grp({}, L.world);
  const lumi = new Lumi(lumiL, 800, 1100, .8);
  const ROUNDS = [{ n: 3, lens: [1, 2, 3], step: 900 }, { n: 4, lens: [2, 3, 4], step: 800 }, { n: 5, lens: [3, 4, 5], step: 700 }];
  const total = ROUNDS.reduce((a, r) => a + r.lens.length, 0);
  const bar = makeBar(total + 1);
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'flores');
  let flowers = [], mode = 'wait', seq = [], pos = 0, errs = 0, finished = false, solved = 0, onSolved = null;

  function makeFlowers(n) {
    const gap = Math.min(270, 1260 / n), out = [];
    for (let i = 0; i < n; i++) {
      const [type, col] = FLOWER_SET[i], x = 800 + (i - (n - 1) / 2) * gap, base = 830, h = 150, s = 1.2;
      const f = { i, x, y: base - h * s, col };
      f.g = grp({ transform: tr(x, base, s) }, flL);
      f.sway = grp({ class: 'sway', style: `--d:-${i * .7}s` }, f.g);
      const parts = ART.flowerParts(type, col, h);
      grp({}, f.sway, parts.stem + parts.leaves.map(l => `<g transform="translate(0 ${l.y}) scale(${l.s} 1)">${l.svg}</g>`).join(''));
      f.head = grp({ transform: `translate(0 ${-h})` }, f.sway);
      f.halo = grp({ opacity: 0 }, f.head, `<circle r="92" fill="url(#gGold)"/><circle r="70" fill="${col}" opacity=".35"/>`);
      f.pop = grp({}, f.head, parts.head);
      f.mouth = grp({ opacity: 0 }, f.head, `<ellipse cy="6" rx="6" ry="7" fill="#8a3550" stroke="${INK}" stroke-width="2"/>`);
      anim(f.g, [{ transform: `translate(${x}px,${base + 260}px) scale(${s})` }, { transform: `translate(${x}px,${base}px) scale(${s})` }], { duration: 700, delay: i * 120, easing: EB });
      f.t = App.addTarget({ x, y: f.y, r: 100, prio: 3, kind: 'flor', hit: () => tapFlower(f) });
      out.push(f);
    }
    return out;
  }
  function clearFlowers() {
    for (const f of flowers) {
      App.removeTarget(f.t);
      anim(f.g, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }).onfinish = () => f.g.remove();
    }
    flowers = [];
  }
  // Una flor brilla y canta.
  function shine(f, ms = 600) {
    Sound.sing(f.i);
    f.halo.setAttribute('opacity', 1); f.mouth.setAttribute('opacity', 1);
    anim(f.pop, [{ transform: 'scale(1)' }, { transform: 'scale(1.35)', offset: .3 }, { transform: 'scale(1.15)' }], { duration: ms, easing: EB, fill: 'none' });
    anim(f.halo, [{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1.1)', opacity: 1, offset: .3 }, { transform: 'scale(1)', opacity: 0 }], { duration: ms + 250 });
    FX.burst(f.x, f.y - 30, [f.col, '#fff'], 6, 110, 'dot');
    note(f);
    ctx.after(ms, () => f.mouth.setAttribute('opacity', 0));
  }
  // Notita musical que sube desde la flor.
  function note(f) {
    const [g, i] = FX.add(f.x + rand(-30, 30), f.y - 70, `<g fill="${shade(f.col, -.25)}"><ellipse rx="11" ry="8" transform="rotate(-20)"/><rect x="8" y="-38" width="5" height="38" rx="2"/><path d="M13 -38 q16 6 10 22 q-2 -12 -10 -12Z"/></g>`);
    anim(i, [{ transform: 'translate(0px,0px) scale(.4)', opacity: 0 }, { transform: 'translate(10px,-50px) scale(1)', opacity: 1, offset: .3 }, { transform: 'translate(-10px,-140px) scale(.8)', opacity: 0 }], { duration: 1300, easing: 'ease-out' }).onfinish = () => g.remove();
  }
  function pulse(f) {
    FX.ring(f.x, f.y, '#fff3a0', 120, 9, 650);
    anim(f.pop, [{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }], { duration: 500, fill: 'none' });
  }
  // Lumi muestra la secuencia: vuela sobre cada flor y la hace cantar.
  async function show(step) {
    mode = 'show'; Guide.hide();
    await ctx.wait(500);
    for (const k of seq) {
      const f = flowers[k];
      await lumi.move(ctx, f.x, f.y - 175, Math.min(380, step * .45), 40);
      lumi.happy(); shine(f, step * .7);
      await ctx.wait(step * .6);
    }
    await lumi.move(ctx, 800, 300, 500, 40);
    lumi.look(800, 700);
    mode = 'play'; pos = 0; App.lastGood = performance.now();
    if (errs >= 2) pulse(flowers[seq[0]]);
  }
  function tapFlower(f) {
    if (mode !== 'play') { if (mode === 'free') { shine(f, 500); App.good(); } return; }
    if (f.i === seq[pos]) {
      App.good(); shine(f, 520); lumi.look(f.x, f.y);
      Paint.wave(f.x, f.y, 400, .25);
      pos++;
      if (pos === seq.length) { mode = 'wait'; ctx.after(500, () => solvedSeq(f)); }
      else if (errs >= 2) ctx.after(450, () => pulse(flowers[seq[pos]]));
    } else {
      App.misses++; errs++;
      Sound.miss();
      anim(f.pop, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0deg)' }], { duration: 400, fill: 'none' });
      pulse(flowers[seq[pos]]);
      // Vuelve a mostrar desde el principio, cada vez con más ayuda.
      mode = 'wait';
      ctx.after(900, () => show(cur.step * (errs >= 2 ? 1.15 : 1)));
    }
  }
  function solvedSeq(f) {
    solved++; errs = 0;
    lumi.happy(true); Sound.chord();
    bar.fill(f.col, f.x, f.y);
    FX.burst(f.x, f.y, [f.col, '#fff', '#ffd84a'], 16, 190, 'star');
    Paint.global(.12 + .7 * solved / total);
    // Una florcita nueva nace en el jardín de atrás.
    const [type, col] = pick(FLOWER_SET), x = rand(160, 1440), y = rand(560, 640);
    const d = grp({ transform: tr(x, y, .45) }, deco, `<g class="sway" style="--d:-${rand(0, 3).toFixed(1)}s">${ART.flower(type, col, rand(100, 160))}</g>`);
    anim(d, [{ transform: `translate(${x}px,${y}px) scale(0)` }, { transform: `translate(${x}px,${y}px) scale(.45)` }], { duration: 600, easing: EB });
    if (onSolved) { const r = onSolved; onSolved = null; ctx.after(900, r); }
  }
  let cur = ROUNDS[0];
  async function round(r, ri) {
    cur = r;
    flowers = makeFlowers(r.n);
    await ctx.wait(900 + r.n * 120);
    // Al empezar: cada flor se presenta cantando su nota.
    for (const f of flowers) { shine(f, 450); await ctx.wait(330); }
    await ctx.wait(500);
    seq = [];
    for (const len of r.lens) {
      while (seq.length < len) { let k; do k = Math.floor(Math.random() * r.n); while (seq.length && k === seq[seq.length - 1]); seq.push(k); }
      errs = 0;
      const done = new Promise(res => { onSolved = res; });
      await show(r.step);
      if (ri === 0 && len === 1 && first) Guide.tap(flowers[seq[0]].x, flowers[seq[0]].y, 99);
      await done;
    }
    await ctx.wait(400);
    // Fin de ronda: todas cantan juntas.
    flowers.forEach((f, i) => ctx.after(i * 140, () => shine(f, 600)));
    lumi.spin();
    await ctx.wait(1400);
    clearFlowers();
    await ctx.wait(500);
  }

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    await lumi.move(ctx, 800, 300, 1200, -40);
    for (let i = 0; i < ROUNDS.length; i++) await round(ROUNDS[i], i);
    // Final: las cinco flores cantan la melodía y el jardín se llena de color.
    finished = true;
    flowers = makeFlowers(5);
    await ctx.wait(1300);
    mode = 'free';
    for (const k of [0, 1, 2, 3, 4, 3, 2, 4]) { shine(flowers[k], 420); await ctx.wait(300); }
    bar.fill('#ffd84a', 800, 400);
    Paint.all(1, 1600, 800, 600);
    wake(bg);
    await finishScene(ctx, 'flores', first, t0, lumi, ['#ff6f91', '#ffd84a', '#5fc7ff', '#b78cff', '#86d36f']);
  })();
  Sound.ambient(true);

  return {
    hint: () => mode === 'play' && !finished ? { x: flowers[seq[pos]].x, y: flowers[seq[pos]].y } : null,
    hintDelay: 7000,
    onMiss: p => { if (mode === 'play') { App.misses--; FX.puff(p.x, p.y); } },
    onMove: p => { if (mode === 'play') lumi.look(p.x, p.y); },
    auto: () => mode === 'play' ? { x: flowers[seq[pos]].x, y: flowers[seq[pos]].y } : null,
  };
};
