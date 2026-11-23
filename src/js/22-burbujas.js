// Escena 3: Burbujas. Verbo: clic sobre algo que se mueve despacio. Cada burbuja suelta un pececito.
// Nada se pierde: las burbujas que llegan arriba se quedan flotando hasta que alguien las toque.
function fishArt(c, awake = true) {
  const d = shade(c, -.18), l = shade(c, .4);
  return `<path d="M-28 0 L-60 -24 Q-50 0 -60 24Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/>
<path d="M-12 -22 Q4 -44 22 -22Z" fill="${d}"/><ellipse rx="38" ry="27" fill="${c}"/>
<path d="M-8 -25 Q-17 0 -8 25" stroke="${l}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-2 10 Q8 20 2 26" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>
${awake ? EYE(17, -6, 7.5) : `<path d="M10 -5 q6 6 12 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`}
<path d="M24 10 q5 4 10 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>${CHEEK(8, 10, 6)}`;
}
function bgSea(id) {
  const P = 'data-p';
  let weeds = '';
  [[90, 860, 1.2], [260, 840, .9], [470, 870, 1], [1130, 860, 1.1], [1330, 840, .9], [1520, 870, 1.2], [700, 880, .7]].forEach(([x, y, s], i) => {
    weeds += `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway" style="--d:-${i * .7}s"><path d="M0 0 C-20 -50 20 -90 0 -140 C-10 -170 10 -190 4 -210" ${P}="#3fae6a" data-pa="stroke" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M14 0 C30 -40 0 -80 18 -120" ${P}="#55c47a" data-pa="stroke" stroke-width="12" fill="none" stroke-linecap="round"/></g></g>`;
  });
  const coral = (x, y, c, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 -60 M0 -40 L-30 -80 M0 -50 L28 -96 M-30 -80 L-40 -110 M28 -96 L44 -120 M-14 -60 L-6 -100" ${P}="${c}" data-pa="stroke" stroke-width="15" stroke-linecap="round" fill="none"/></g>`;
  let rays = '';
  for (let i = 0; i < 6; i++) rays += `<path d="M${150 + i * 260} 110 L${230 + i * 260} 110 L${360 + i * 260} 860 L${200 + i * 260} 860Z" fill="#fff" opacity=".07"/>`;
  return `<defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#9fe6f5"/><stop offset=".5" ${P}="#4fb8dc"/><stop offset="1" ${P}="#2f8fbf"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}w)"/>
<rect x="-600" y="-400" width="2800" height="505" ${P}="#d9f6ff" data-gl=""/>
<path d="M-600 105 Q-550 92 -500 105 ${Array.from({ length: 28 }, (_, i) => `T${-450 + i * 100} 105`).join(' ')} L2200 135 L-600 135Z" ${P}="#b8eefb" data-gl=""/>
${rays}
<path d="M-600 760 C-200 730 200 790 520 760 C820 732 1100 790 1400 762 C1700 740 1900 770 2200 760 L2200 1300 L-600 1300Z" ${P}="#e9d39b" data-gl=""/>
<path d="M-600 820 C-100 800 300 840 700 815 C1100 795 1500 840 2200 815 L2200 1300 L-600 1300Z" ${P}="#f3dfaa" data-gl=""/>
<g transform="translate(330 812)"><ellipse rx="80" ry="44" ${P}="#9aa3b5"/><ellipse cx="-20" cy="-16" rx="30" ry="12" ${P}="#b8c0cf"/></g>
<g transform="translate(1250 806)"><ellipse rx="64" ry="38" ${P}="#8d97ab"/></g>
${coral(600, 800, '#ff8fa8', 1)}${coral(1000, 806, '#ffae5c', .9)}${coral(180, 820, '#c794ff', .8)}${coral(1440, 812, '#ff8fa8', .85)}
<g transform="translate(860 860) rotate(-12)"><path d="${starPath(30, 14)}" ${P}="#ff9a6b" stroke-linejoin="round"/></g>
<g transform="translate(420 880)"><path d="M-18 8 C-18 -16 18 -16 18 8Z" ${P}="#ffd1dc"/><path d="M-10 6 L-6 -10 M0 6 L0 -12 M10 6 L6 -10" stroke="#e8a7b8" stroke-width="2.5"/></g>
${weeds}`;
}

Screens.burbujas = ctx => {
  const bg = grp({}, L.world, bgSea('bb'));
  Paint.scan(bg);
  const fishL = grp({}, L.world), lumiL = grp({}, L.world), bubL = grp({}, L.world);
  const lumi = new Lumi(lumiL, -160, 300, .85);
  const bar = makeBar(12);
  const FCOL = ['#ff8a7a', '#ffd84a', '#7fd1ff', '#b78cff', '#86d36f', '#ff9fd0', '#ffb25b', '#5fd6bd'];
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'burbujas');
  const bubbles = new Set(), fishes = [];
  let popped = 0, finished = false, phase = 1, bigB = null, spawnLock = false;

  function addFish(x, y, c, s = 1) {
    const f = { x, y, c, s, tx: rand(150, 1450), ty: rand(220, 720), sp: rand(70, 110), dir: 1, ph: rand(0, 6) };
    f.g = grp({ transform: tr(x, y) }, fishL);
    f.flip = grp({}, f.g); f.inner = grp({}, f.flip, `<g transform="scale(${s})">${fishArt(c)}</g>`);
    anim(f.inner, [{ transform: 'scale(.6) rotate(-30deg)' }, { transform: 'scale(1.3) rotate(10deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 600, easing: EB });
    f.t = App.addTarget({ x, y, r: 70 * s, prio: 1, kind: 'fish', hit: () => {
      App.lastGood = performance.now(); Sound.blub(); f.sp = 240; f.tx = clamp(f.x + rand(-400, 400), 150, 1450);
      anim(f.inner, [{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.25) rotate(-15deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 450, fill: 'none' });
      for (let k = 0; k < 3; k++) FX.burst(f.x, f.y - 20, ['#ffffff'], 1, 60, 'dot');
    } });
    fishes.push(f);
    return f;
  }
  ctx.loop((dt, now) => {
    for (const f of fishes) {
      if (f.circle) { const a = now * .0011 + f.circle.a; f.tx = f.circle.x + Math.cos(a) * f.circle.r; f.ty = f.circle.y + Math.sin(a) * f.circle.r * .55; }
      const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy);
      if (d < 20 && !f.circle) { f.tx = rand(150, 1450); f.ty = rand(220, 720); f.sp = rand(70, 110); }
      const v = Math.min(d, f.sp * dt / 1000);
      if (d > .1) { f.x += dx / d * v; f.y += dy / d * v; }
      f.sp = Math.max(90, f.sp - dt * .15);
      if (Math.abs(dx) > 4) f.dir = dx > 0 ? 1 : -1;
      const by = Math.sin(now * .004 + f.ph) * 5;
      f.g.setAttribute('transform', `translate(${f.x.toFixed(1)} ${(f.y + by).toFixed(1)})`);
      f.flip.setAttribute('transform', `scale(${f.dir} 1)`);
      f.t.x = f.x; f.t.y = f.y + by;
    }
    for (const b of bubbles) {
      if (b.hold != null) { if (b.y > b.hold) b.y -= b.sp * dt / 1000; }
      else if (b.y > 200) b.y -= b.sp * dt / 1000;
      else b.x += Math.sin(now * .0006 + b.ph) * .5;
      const sx = Math.sin(now * .0016 + b.ph) * 22;
      b.g.setAttribute('transform', tr((b.x + sx).toFixed(1), b.y.toFixed(1)));
      b.t.x = b.x + sx; b.t.y = b.y;
    }
  });

  function spawn(x, opt = {}) {
    const big = !!opt.big;
    const b = { x, y: 920, sp: opt.sp || rand(45, 60), ph: rand(0, 6), hold: opt.hold, big, taps: 0 };
    b.g = grp({ transform: tr(x, b.y) }, bubL);
    b.inner = grp({}, b.g);
    const R = big ? 118 : 58;
    b.inner.innerHTML = `<circle r="${R}" fill="#e8fbff" fill-opacity=".3" stroke="#fff" stroke-opacity=".95" stroke-width="${big ? 6 : 4}"/>
<path d="M${-R * .62} ${-R * .45} A${R * .76} ${R * .76} 0 0 1 ${-R * .1} ${-R * .8}" stroke="#fff" stroke-width="${big ? 11 : 7}" fill="none" stroke-linecap="round" opacity=".9"/>
<circle cx="${R * .5}" cy="${R * .52}" r="${R * .09}" fill="#fff" opacity=".75"/><g transform="scale(${big ? 1.25 : .62})">${fishArt('#9aa4b2', false)}</g>`;
    b.t = App.addTarget({ x, y: b.y, r: big ? 160 : 92, prio: 3, kind: big ? 'big' : 'bubble', hit: () => pop(b) });
    bubbles.add(b);
    Sound.blub();
    return b;
  }
  function pop(b) {
    if (b.big) {
      b.taps++; App.good(); Sound.grow(b.taps);
      anim(b.inner, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.18,.86)' }, { transform: 'scale(.92,1.08)' }, { transform: 'scale(1,1)' }], { duration: 500, fill: 'none' });
      FX.burst(b.x, b.y, ['#ffffff', '#d4f4ff'], 10, 170, 'dot');
      if (b.taps < 3) return;
    }
    bubbles.delete(b); App.removeTarget(b.t); App.good();
    const x = b.t.x, y = b.t.y;
    b.g.remove();
    FX.ring(x, y, '#ffffff', b.big ? 220 : 110, 8, 500);
    FX.burst(x, y, ['#ffffff', '#e8fbff'], 12, b.big ? 220 : 120, 'dot');
    const c = b.big ? '#ff8a7a' : FCOL[popped % FCOL.length];
    addFish(x, y, c, b.big ? 1.8 : 1);
    FX.burst(x, y, [c, '#ffd84a'], 10, 150, 'star');
    Sound.blub(); Sound.bloom(popped);
    Paint.wave(x, y, 560, .75); Paint.global(.1 + .7 * (popped + 1) / 12);
    bar.fill(c, x, y);
    lumi.happy(); lumi.move(ctx, clamp(x + (x < 800 ? 210 : -210), 170, 1430), clamp(y, 260, 640), 900, 40);
    popped++;
    if (b.big) return bigDone();
    if (phase === 1) { phase = 2; ctx.after(900, flow); }
  }
  // Mantiene burbujas subiendo: primero de a dos y más lentas, después de a tres.
  function flow() {
    if (finished || bigB) return;
    if (popped >= 11) { if (!bubbles.size) startBig(); else ctx.after(600, flow); return; }
    const max = popped < 5 ? 2 : 3;
    if (bubbles.size < max && popped + bubbles.size < 11) {
      let x, tries = 0;
      do { x = rand(200, 1400); tries++; } while (tries < 20 && [...bubbles].some(b => Math.abs(b.x - x) < 230));
      spawn(x, { sp: popped < 5 ? rand(42, 52) : rand(52, 66) });
    }
    ctx.after(1300, flow);
  }
  function startBig() {
    bigB = spawn(800, { big: true, hold: 460, sp: 90 });
    lumi.move(ctx, 1120, 300, 1000, 60);
    Sound.chord();
    ctx.after(3200, () => { if (bigB && !bigB.taps && !finished) Guide.tap(bigB.t.x, bigB.t.y, 3); });
  }
  async function bigDone() {
    finished = true;
    const mama = fishes[fishes.length - 1];
    mama.circle = { x: 800, y: 470, r: 90, a: 0 };
    fishes.slice(0, -1).forEach((f, i) => { f.circle = { x: 800, y: 470, r: 230 + (i % 3) * 60, a: i / 11 * Math.PI * 2 }; f.sp = 160; });
    Paint.all(1, 1400, 800, 470);
    lumi.move(ctx, 800, 220, 1000, 60);
    await finishScene(ctx, 'burbujas', first, t0, lumi, FCOL);
  }

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    lumi.move(ctx, 230, 300, 1300, 60);
    await ctx.wait(500);
    const b = spawn(800, { hold: 470, sp: 120 });
    ctx.after(3000, () => { if (bubbles.has(b)) Guide.tap(b.t.x, b.t.y, 99); });
  })();
  Sound.ambient(true);

  return {
    hint: () => {
      if (finished) return null;
      const b = [...bubbles].sort((p, q) => q.y - p.y).find(q => q.y < 760);
      return b ? { x: b.t.x, y: b.t.y } : null;
    },
    onMiss: p => {
      if (finished) return;
      Sound.miss(); FX.puff(p.x, p.y);
      let best = null, bd = Infinity;
      for (const b of bubbles) { const d = Math.hypot(b.t.x - p.x, b.t.y - p.y); if (d < bd) { bd = d; best = b; } }
      if (best) FX.ring(best.t.x, best.t.y, '#fff3a0', best.big ? 170 : 110, 9, 650);
    },
    onMove: p => lumi.look(p.x, p.y),
  };
};
