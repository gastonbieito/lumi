// Escena 3: Tambores. Verbo: teclado. Abajo hay un teclado dibujado con las teclas que sirven brillando.
// Ronda 1: cualquier tecla toca un tambor y despierta a las ranas (12 golpes).
// Ronda 2: la barra espaciadora hace saltar a Lumi de piedra en piedra para cruzar la laguna.
// Ronda 3: las flechas mueven el bote de Lumi hasta la estrella que espera arriba.
// En tablet o celular las teclas dibujadas se tocan. En la compu, tocar el dibujo muestra con la manito qué tecla apretar.
Screens.tambores = ctx => {
  const P = 'data-p';
  const bg = grp({}, L.world, `<defs><linearGradient id="tbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#8fd0f5"/><stop offset="1" ${P}="#e4f6fb"/></linearGradient>
<linearGradient id="tblag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#69c6dd"/><stop offset="1" ${P}="#3c9fc4"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#tbsky)"/>${sunArt(1300, 160)}
<g transform="translate(360 140)"><g class="drift">${ART.cloud(.8, true)}</g></g>
<path d="M-600 420 C-200 330 200 360 520 380 C800 400 1000 330 1300 350 C1600 370 1900 400 2200 390 L2200 1300 L-600 1300Z" ${P}="#9fd987" data-gl=""/>
<path d="M-600 470 C-100 440 300 450 800 452 C1300 454 1700 440 2200 470 L2200 1300 L-600 1300Z" ${P}="#86cf6f" data-gl=""/>
<path d="M-600 500 C-200 480 200 486 800 484 C1400 482 1800 490 2200 500 L2200 740 L-600 740Z" fill="url(#tblag)"/>
<g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"><g class="ripple"><path d="M200 560 q20 -8 40 0 M900 600 q20 -8 40 0 M1350 560 q20 -8 40 0"/></g><g class="ripple" style="--d:-2s"><path d="M560 660 q20 -8 40 0 M1150 690 q20 -8 40 0"/></g></g>
<path d="M-600 720 C-200 700 300 712 800 706 C1300 700 1800 712 2200 720 L2200 1300 L-600 1300Z" ${P}="#ffe2a8"/>
<path d="M-600 560 C-400 540 -200 530 -40 540 C80 548 160 580 200 740 L-600 740Z" ${P}="#8fd474"/>
<path d="M2200 560 C2000 540 1800 530 1640 540 C1520 548 1440 580 1400 740 L2200 740Z" ${P}="#8fd474"/>`);
  Paint.scan(bg);
  const midL = grp({}, L.world), lumiL = grp({}, L.world), topL = grp({}, L.world), kbL = grp({}, L.world);
  const lumi = new Lumi(lumiL, 800, 1100, .7);
  const bar = makeBar(21);
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'tambores');
  let mode = 'wait', kb = null, finished = false, onDone = null, hits = 0, busy = false;
  const COLS = ['#ff8b7b', '#ffd84a', '#6cc6ff'];

  // ---------- Ronda 1: tambores sobre una balsa, ranas dormidas en hojas de nenúfar.
  const raft = grp({ transform: tr(800, 640) }, midL, `<rect x="-300" y="-30" width="600" height="60" rx="20" fill="#c99760" stroke="#9a6e40" stroke-width="4"/>
${[-240, -160, -80, 0, 80, 160, 240].map(x => `<path d="M${x} -26 L${x} 26" stroke="#9a6e40" stroke-width="3" opacity=".6"/>`).join('')}`);
  const drums = COLS.map((c, i) => {
    const x = 800 + (i - 1) * 190, y = 560 + (i === 1 ? -10 : 0);
    const g = grp({ transform: tr(x, y, i === 1 ? 1.05 : .9) }, midL), inner = grp({}, g, drumArt(c));
    return { x, y, c, g, inner };
  });
  const frogs = [[170, 600], [370, 690], [1230, 690], [1430, 600], [1300, 520], [330, 520]].map(([x, y], i) => {
    const g = grp({ transform: tr(x, y, .7) }, midL);
    grp({}, g, `<ellipse cy="30" rx="80" ry="22" fill="#5cbd58"/><path d="M0 30 L60 22" stroke="#3c9fc4" stroke-width="6"/>`);
    const hop = grp({}, g), face = `<ellipse cy="0" rx="46" ry="32" fill="#7fd36a"/><circle cx="-22" cy="-30" r="17" fill="#7fd36a"/><circle cx="22" cy="-30" r="17" fill="#7fd36a"/>`;
    const sleep = grp({}, hop, `<g opacity=".6">${face}</g><path d="M-30 -30 q8 6 16 0 M14 -30 q8 6 16 0" stroke="#3e6b3a" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    const awake = grp({ opacity: 0 }, hop, `${face}${EYE(-22, -32, 9)}${EYE(22, -32, 9)}<path d="M-18 6 Q0 20 18 6" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>${CHEEK(-32, 4, 8)}${CHEEK(32, 4, 8)}`);
    return { x, y, g, hop, sleep, awake, on: false };
  });
  function note(x, y, c) {
    const [g, i] = FX.add(x + rand(-40, 40), y - 70, `<g fill="${shade(c, -.25)}"><ellipse rx="12" ry="9" transform="rotate(-20)"/><rect x="9" y="-40" width="5" height="40" rx="2"/><path d="M14 -40 q16 6 10 22 q-2 -12 -10 -12Z"/></g>`);
    anim(i, [{ transform: 'translate(0px,0px) scale(.4)', opacity: 0 }, { transform: `translate(${rand(-30, 30)}px,-60px) scale(1)`, opacity: 1, offset: .3 }, { transform: `translate(${rand(-60, 60)}px,-170px) scale(.8)`, opacity: 0 }], { duration: 1300, easing: 'ease-out' }).onfinish = () => g.remove();
  }
  function drumHit(k) {
    // La tecla elige el tambor: las de la izquierda, el de la izquierda; las de la derecha, el de la derecha.
    const row = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    let i = hits % 3;
    for (const r of row) { const c = r.indexOf(String(k).toLowerCase()); if (c >= 0) i = Math.min(2, Math.floor(c / r.length * 3)); }
    if (k === ' ') i = 1;
    const d = drums[i];
    App.good(); Sound.drum(i);
    if (kb) kb.press(k);
    anim(d.inner, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.12,.84)', offset: .25 }, { transform: 'scale(.96,1.06)', offset: .6 }, { transform: 'scale(1,1)' }], { duration: 380, fill: 'none' });
    FX.ring(d.x, d.y - 50, d.c, 110, 8, 500);
    note(d.x, d.y, d.c);
    lumi.happy(); lumi.look(d.x, d.y);
    Paint.wave(d.x, d.y, 420, .2);
    hits++;
    if (hits % 2 === 0) {
      bar.fill(d.c, d.x, d.y);
      const f = frogs[hits / 2 - 1];
      if (f && !f.on) {
        f.on = true;
        anim(f.sleep, [{ opacity: 1 }, { opacity: 0 }], 300); anim(f.awake, [{ opacity: 0 }, { opacity: 1 }], 300);
        Paint.wave(f.x, f.y, 380, .6);
        FX.burst(f.x, f.y - 30, ['#7fd36a', '#fff', '#ffd84a'], 10, 120, 'star');
      }
    }
    // Las ranas despiertas saltan al ritmo.
    frogs.forEach((f, j) => { if (f.on) anim(f.hop, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-40px)' }, { transform: 'translateY(0px)' }], { duration: 380, delay: j * 40, fill: 'none', easing: 'ease-out' }); });
    if (hits >= 12 && onDone) { const r = onDone; onDone = null; mode = 'wait'; ctx.after(500, r); }
  }

  // ---------- Ronda 2: piedras para cruzar la laguna.
  const stones = [];
  function makeStones() {
    for (let i = 0; i < 8; i++) {
      const x = 260 + i * 145, y = 610 + (i % 2 ? -26 : 14);
      const g = grp({ transform: tr(x, y) }, midL, `<ellipse cy="10" rx="66" ry="22" fill="#2f86ab" opacity=".5"/><ellipse rx="62" ry="24" fill="#b7b2c2"/><ellipse cy="-6" rx="50" ry="15" fill="#d2cede"/>`);
      anim(g, [{ transform: `translate(${x}px,${y + 50}px) scale(.3)`, opacity: 0 }, { transform: `translate(${x}px,${y}px) scale(1)`, opacity: 1 }], { duration: 500, delay: i * 90, easing: EB });
      stones.push({ x, y, g });
    }
  }
  let at = -1;
  function jump() {
    if (busy) return;
    busy = true; App.good();
    if (kb) kb.press(' ');
    at++;
    const s = stones[at], to = s ? { x: s.x, y: s.y - 62 } : { x: 1500, y: 560 };
    Sound.jump(); lumi.happy();
    lumi.move(ctx, to.x, to.y, 480, 150).then(() => {
      busy = false;
      if (s) {
        Sound.land(at);
        const c = pick(['#ff9fc4', '#ffd84a', '#ffb25b', '#b78cff', '#fff']);
        grp({ transform: tr(s.x + 40, s.y - 4, .5) }, s.g.parentNode, `<g class="pulse"><circle r="40" fill="url(#gGold)"/></g>${[0, 1, 2, 3, 4, 5].map(k => `<ellipse cy="-20" rx="10" ry="22" fill="${c}" transform="rotate(${k * 60})"/>`).join('')}<circle r="12" fill="#ffd84a"/>`);
        FX.ring(s.x, s.y, '#fff', 90, 7, 500);
        Paint.wave(s.x, s.y, 360, .35);
        bar.fill(c, s.x, s.y);
        if (at === stones.length - 1 && onDone) { const r = onDone; onDone = null; mode = 'wait'; ctx.after(400, async () => { await lumi.move(ctx, 1500, 560, 600, 120); Sound.splash(); r(); }); }
      }
    });
  }

  // ---------- Ronda 3: el bote y las estrellas.
  const LANES = [480, 800, 1120];
  let lane = 1, star = null, caught = 0, arrow = null;
  const boat = grp({ transform: tr(800, 1000) }, lumiL, `<path d="M-90 10 L90 10 L66 50 L-66 50Z" fill="#e0566a" stroke="#b8404f" stroke-width="4" stroke-linejoin="round"/><rect x="-72" y="18" width="144" height="9" fill="#fff" opacity=".8"/>`);
  function placeBoat(x) { boat.setAttribute('transform', tr(x, 630)); lumi.place(x, 590); }
  let bx = 800;
  function moveBoat(dir) {
    const nl = lane + dir;
    if (kb) kb.press(dir < 0 ? 'ArrowLeft' : 'ArrowRight');
    if (nl < 0 || nl > 2) { Sound.boing(); anim(boat, [{ transform: `translate(${bx}px,630px)` }, { transform: `translate(${bx + dir * 24}px,630px)` }, { transform: `translate(${bx}px,630px)` }], { duration: 300, fill: 'none' }); return; }
    lane = nl; App.good(); busy = true; Sound.whoosh();
    const x0 = bx, x1 = LANES[lane];
    ctx.tween(420, e => { bx = lerp(x0, x1, e); placeBoat(bx); }).then(() => { busy = false; check(); });
  }
  function showArrow() {
    if (arrow) arrow.remove();
    if (!star || star.lane === lane) return;
    const dir = star.lane > lane ? 1 : -1;
    arrow = grp({ transform: tr(bx + dir * 150, 600, dir) }, topL, `<g class="pulse"><path d="M-40 -22 L10 -22 L10 -46 L52 0 L10 46 L10 22 L-40 22Z" fill="#fff3a0" stroke="#ffc93c" stroke-width="5" stroke-linejoin="round" opacity=".9"/></g>`);
  }
  function newStar() {
    let l; do l = Math.floor(Math.random() * 3); while (l === lane);
    if (caught === 0) l = 2;
    const x = LANES[l];
    const g = grp({ transform: tr(x, -80) }, topL), inner = grp({}, g, `<g class="pulse"><circle r="80" fill="url(#gGold)"/></g>${ART.star(40)}`);
    star = { lane: l, x, g, inner };
    ctx.tween(900, e => g.setAttribute('transform', tr(x, lerp(-80, 420, e))), Ease.out).then(() => { showArrow(); check(); });
  }
  function check() {
    showArrow();
    if (!star || star.lane !== lane || star.taken) return;
    star.taken = true;
    const s = star; star = null;
    if (arrow) { arrow.remove(); arrow = null; }
    lumi.happy(true); Sound.star(caught);
    ctx.tween(400, e => s.g.setAttribute('transform', tr(s.x, lerp(420, 540, e), lerp(1, .5, e)))).then(() => {
      s.g.remove();
      FX.burst(s.x, 540, ['#fff3a0', '#ffd84a', '#fff'], 14, 160, 'star');
      bar.fill('#ffd84a', s.x, 540);
      Paint.wave(s.x, 560, 500, .4);
      caught++;
      if (caught >= 6) { if (onDone) { const r = onDone; onDone = null; mode = 'wait'; ctx.after(500, r); } }
      else ctx.after(500, newStar);
    });
  }

  function wrongKey() {
    App.misses++; Sound.boing();
    lumi.look(800, 800);
    if (kb) kb.hint();
  }
  function onKey(k) {
    if (k === 'Spacebar') k = ' ';
    fullscreen();
    if (mode === 'todo') return drumHit(k);
    if (mode === 'espacio') return k === ' ' ? jump() : (busy ? null : wrongKey());
    if (mode === 'flechas') {
      if (busy) return;
      if (k === 'ArrowLeft') return moveBoat(-1);
      if (k === 'ArrowRight') return moveBoat(1);
      if (k === 'ArrowUp' || k === 'ArrowDown') { Sound.tap(); lumi.happy(); return; }
      return wrongKey();
    }
  }
  const setKb = m => { if (kb) kb.remove(); kb = makeKeyboard(ctx, kbL, 800, m === 'flechas' ? 800 : 790, m === 'flechas' ? .72 : .82, m, onKey); };
  const round = (m, setup) => new Promise(res => { onDone = res; mode = m; setKb(m); setup && setup(); App.lastGood = performance.now(); if (first) ctx.after(1200, () => { if (mode === m) kb.hint(m === 'flechas' ? kb.keyAt('ArrowRight') : undefined); }); });

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    await lumi.move(ctx, 800, 430, 1200, -40);
    await round('todo');
    // Fin de la ronda 1: redoble y la balsa se va.
    for (let i = 0; i < 6; i++) ctx.after(i * 110, () => { Sound.drum(i % 3); FX.ring(drums[i % 3].x, drums[i % 3].y - 50, drums[i % 3].c, 120, 8, 500); });
    lumi.spin();
    await ctx.wait(1200);
    await lumi.move(ctx, 130, 520, 900, 140);
    for (const o of [raft, ...drums.map(d => d.g)]) anim(o, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 }).onfinish = () => o.remove();
    makeStones();
    await ctx.wait(900);
    await round('espacio');
    lumi.happy(true); Sound.chord();
    await ctx.wait(800);
    // Ronda 3: Lumi sube al bote.
    for (const s of stones) anim(s.g, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 }).onfinish = () => s.g.remove();
    await ctx.tween(1000, e => { bx = 800; boat.setAttribute('transform', tr(800, lerp(1000, 630, e))); });
    await lumi.move(ctx, 800, 590, 700, 140);
    Sound.splash();
    await round('flechas', () => ctx.after(300, newStar));
    finished = true;
    if (kb) { kb.remove(); kb = null; }
    lumi.spin(); Sound.fanfare();
    for (let i = 0; i < 8; i++) ctx.after(i * 120, () => Sound.drum(i % 4));
    frogs.forEach((f, j) => ctx.every(700 + j * 60, () => anim(f.hop, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-50px)' }, { transform: 'translateY(0px)' }], { duration: 420, fill: 'none' })));
    Paint.all(1, 1600, 800, 500);
    wake(bg);
    await ctx.wait(600);
    await finishScene(ctx, 'tambores', first, t0, lumi, ['#ff8b7b', '#ffd84a', '#6cc6ff', '#7fd36a', '#fff3a0']);
  })();
  Sound.ambient(true);

  const needKey = () => mode === 'todo' ? 'a' : mode === 'espacio' ? ' ' : mode === 'flechas' && star && !busy && star.lane !== lane ? (star.lane > lane ? 'ArrowRight' : 'ArrowLeft') : null;
  return {
    onKey,
    hint: () => { const k = needKey(); if (!k || !kb) return null; const q = kb.keyAt(k); return { run: () => kb.hint(q) }; },
    hintDelay: 5500,
    auto: () => { const k = needKey(); if (!k || busy) return null; if (App.touch && kb) { const p = kb.pos(k); return { x: p.x, y: p.y }; } return { key: k }; },
    onMiss: p => { if (finished || !kb) return; App.misses--; Sound.tap(); kb.hint(); },
    onMove: p => lumi.look(p.x, p.y),
  };
};
