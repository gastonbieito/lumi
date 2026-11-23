// Escena 2: Caracoles. Verbo: doble clic.
// Cada almeja dormida se abre si se la golpea dos veces seguidas y deja salir una perla.
// El primer golpe enciende un puntito arriba; el segundo, si llega a tiempo, la abre.
// El tiempo entre golpes se achica de a poco: 1,6 s, 1,2 s, 0,9 s y 0,75 s (como un doble clic de verdad).
// Cuarta ronda: además, cangrejitos ermitaños que caminan con su caracol. Final: la almeja gigante.
const SHELL_COLS = ['#ff9fc4', '#b9a2ff', '#ffb35c', '#7fd6c2', '#ff8b7b', '#8fc8ff', '#ffd84a'];

Screens.caracoles = ctx => {
  const bg = grp({}, L.world, bgBeach('cr', `${palmArt(120, 560, .95)}${palmArt(1490, 540, .8)}`));
  Paint.scan(bg);
  const shL = grp({}, L.world), lumiL = grp({}, L.world);
  const lumi = new Lumi(lumiL, 800, 1100, .75);
  const bar = makeBar(22);
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'caracoles');
  const shells = new Set();
  let win = 1600, finished = false, opened = 0, roundDone = null, slow = 0, shown = false;

  function addShell(x, y, s, col, crab = null) {
    const sh = { x, y, s, col, knockT: -1e9, open: false, crab };
    sh.g = grp({ transform: tr(x, y) }, shL);
    sh.body = grp({ transform: `scale(${s})` }, sh.g);
    if (crab) grp({}, sh.body, `<g class="legs"><path d="M-40 20 l-22 26 M-20 26 l-12 28 M20 26 l12 28 M40 20 l22 26" stroke="#e8734e" stroke-width="9" stroke-linecap="round"/></g>
<path d="M-64 6 C-90 -6 -100 20 -84 30 C-74 36 -64 26 -64 18" fill="#ff8b6a" stroke="#d65a3e" stroke-width="3"/>
<g transform="translate(-58 -8)"><path d="M0 0 L-6 -30 M0 0 L8 -32" stroke="#e8734e" stroke-width="5"/>${EYE(-6, -34, 7)}${EYE(8, -36, 7)}</g>`);
    sh.inner = grp({}, sh.body, shellArt(col));
    sh.top = sh.inner.querySelector('.top'); sh.pearl = sh.inner.querySelector('.pearl');
    sh.k1 = sh.inner.querySelector('.k1'); sh.k2 = sh.inner.querySelector('.k2');
    anim(sh.body, [{ transform: `scale(0)` }, { transform: `scale(${s})` }], { duration: 550, easing: EB, delay: rand(0, 250) });
    sh.t = App.addTarget({ x, y: y - 10 * s, r: 92 * s + 18, prio: 3, kind: crab ? 'crab' : 'shell', hit: () => knock(sh) });
    shells.add(sh);
    return sh;
  }
  function squash(sh, k = .86) {
    anim(sh.inner, [{ transform: 'scale(1,1)' }, { transform: `scale(${2 - k},${k})`, offset: .35 }, { transform: 'scale(1,1)' }], { duration: 260, fill: 'none' });
  }
  function knock(sh) {
    if (sh.open || finished && !sh.giant) return;
    const now = performance.now();
    if (now - sh.knockT <= win) return openShell(sh);
    sh.knockT = now;
    Sound.toc(0); squash(sh);
    sh.k1.setAttribute('opacity', 1);
    anim(sh.k1, [{ transform: 'scale(0)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 250, fill: 'none' });
    const my = now;
    ctx.after(win, () => {
      if (sh.open || sh.knockT !== my) return;
      anim(sh.k1, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = () => sh.k1.setAttribute('opacity', 0);
      // Golpes muy separados: la manito muestra el doble golpe.
      if (++slow >= 3) { slow = 0; Guide.dtap(sh.x, sh.y - 10 * sh.s, 2); App.hints++; }
    });
  }
  function openShell(sh) {
    sh.open = true; shells.delete(sh); App.removeTarget(sh.t); App.good(); slow = 0;
    Sound.toc(1);
    sh.k2.setAttribute('opacity', 1);
    anim(sh.k2, [{ transform: 'scale(0)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 250, fill: 'none' });
    squash(sh, .78);
    ctx.after(160, () => {
      Sound.open();
      anim(sh.top, [{ transform: 'translateY(0px) scaleY(1)' }, { transform: 'translateY(-58px) scaleY(.5)' }], { duration: 450, easing: EB });
      sh.pearl.setAttribute('opacity', 1);
      anim(sh.pearl, [{ transform: 'scale(0)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 500, easing: EB });
      anim(sh.inner.querySelector('.knocks'), [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 300 });
      FX.ring(sh.x, sh.y, '#fff', 160 * sh.s, 9, 700);
      FX.burst(sh.x, sh.y - 20, [sh.col, '#fff', '#ffd84a'], 14, 170, 'star');
      Paint.wave(sh.x, sh.y, 520, .45); Paint.global(.12 + .7 * (opened + 1) / 22);
      lumi.happy(); lumi.look(sh.x, sh.y);
      opened++;
      ctx.after(650, () => {
        bar.fill('#fff4fb', sh.x, sh.y - 10);
        anim(sh.pearl, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
        if (sh.crab) { sh.crab.happy = true; }
      });
      if (!shells.size && roundDone) { const r = roundDone; roundDone = null; ctx.after(1100, r); }
    });
  }

  // Cangrejitos que caminan de un lado a otro, despacio.
  function walkers() {
    ctx.loop((dt, now) => {
      for (const sh of [...shells, ...[]]) {
        if (!sh.crab) continue;
        const c = sh.crab;
        c.x += c.v * dt / 1000;
        if (c.x < c.a || c.x > c.b) { c.v = -c.v; c.x = clamp(c.x, c.a, c.b); }
        sh.x = c.x;
        sh.g.setAttribute('transform', tr(c.x.toFixed(1), (sh.y + Math.abs(Math.sin(now * .008)) * -4).toFixed(1)) + (c.v > 0 ? ' scale(-1 1)' : ''));
        sh.t.x = c.x;
      }
    });
  }

  async function round(list, w, s) {
    win = w;
    const made = list.map(([x, y, crab], i) => addShell(x, y, s, SHELL_COLS[(i + opened) % SHELL_COLS.length], crab));
    await new Promise(r => { roundDone = r; if (!shown && first) { shown = true; ctx.after(1100, () => { const sh = made[0]; if (!sh.open) Guide.dtap(sh.x, sh.y - 10 * s, 99); }); } });
    lumi.happy(true); Sound.chord();
    await ctx.wait(700);
    // Las almejas abiertas se van al mar para dejar lugar.
    for (const sh of made) anim(sh.g, [{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: rand(0, 300) }).onfinish = () => sh.g.remove();
    await ctx.wait(900);
  }

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    await lumi.move(ctx, 800, 420, 1200, -40);
    await round([[430, 690], [800, 640], [1170, 690]], 1600, 1.25);
    await round([[300, 640], [620, 780], [800, 600], [980, 780], [1300, 640]], 1200, 1.05);
    await round([[260, 700], [480, 580], [700, 800], [900, 620], [1120, 800], [1340, 640]], 900, .95);
    walkers();
    await round([[330, 620], [1270, 620], [560, 800], [1040, 800],
      [700, 700, { x: 700, a: 260, b: 760, v: 60 }], [900, 860, { x: 900, a: 480, b: 1100, v: -50 }], [1100, 700, { x: 1100, a: 840, b: 1340, v: 55 }]], 750, .9);
    // Final: la almeja gigante.
    const g = addShell(800, 700, 1.9, '#ffc93c');
    g.giant = true;
    await new Promise(r => { roundDone = r; });
    finished = true;
    for (let k = 0; k < 6; k++) ctx.after(k * 160, () => FX.burst(800 + rand(-120, 120), 600 + rand(-60, 40), ['#fff4fb', '#ffd84a', '#ff9fc4', '#8fc8ff'], 14, 230, 'star'));
    Paint.all(1, 1600, 800, 600);
    wake(bg);
    await ctx.wait(1200);
    await finishScene(ctx, 'caracoles', first, t0, lumi, ['#ff9fc4', '#ffd84a', '#8fc8ff', '#7fd6c2', '#fff4fb']);
  })();
  Sound.ambient(true);

  const nearest = () => { let best = null, bd = Infinity; for (const sh of shells) { const d = (sh.crab ? 300 : 0) + Math.hypot(sh.x - App.pointer.x, sh.y - App.pointer.y); if (d < bd) { bd = d; best = sh; } } return best; };
  return {
    hint: () => { const sh = nearest(); return sh ? { x: sh.x, y: sh.y - 10 * sh.s, dbl: true } : null; },
    hintDelay: 6500,
    auto: () => { const sh = [...shells].sort((a, b) => !!a.crab - !!b.crab)[0]; return sh ? { x: sh.x, y: sh.y - 10 * sh.s, dbl: true } : null; },
    onMiss: p => { Sound.miss(); FX.puff(p.x, p.y); const sh = nearest(); if (sh) FX.ring(sh.x, sh.y, '#fff', 120, 8, 600); },
    onMove: p => lumi.look(p.x, p.y),
  };
};
