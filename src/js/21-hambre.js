// Escena 2: Hambre. Verbo: arrastrar. Cada animal abre la boca y muestra la fruta (el color) que quiere.
// Tolerancias: se puede arrastrar o hacer "clic y clic" (la fruta queda pegada al cursor hasta el segundo clic).
const FRUITS = {
  manzana: { c: '#ff5d5d', svg: `<path d="M0 -24 C-10 -36 -40 -32 -40 -2 C-40 26 -18 40 0 32 C18 40 40 26 40 -2 C40 -32 10 -36 0 -24Z" fill="#ff5d5d" stroke="#d63f4a" stroke-width="3"/><path d="M0 -24 C0 -32 2 -40 6 -46" stroke="#7a4f27" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M5 -38 C15 -50 31 -46 33 -40 C23 -32 11 -32 5 -38Z" fill="#6cc65a"/><ellipse cx="-20" cy="-6" rx="7" ry="11" fill="#fff" opacity=".45" transform="rotate(20 -20 -6)"/>` },
  banana: { c: '#ffd84a', svg: `<path d="M-38 -24 C-38 16 4 40 42 22 C46 18 45 13 39 12 C8 20 -20 4 -26 -26 C-28 -34 -38 -32 -38 -24Z" fill="#ffd84a" stroke="#d9a400" stroke-width="3" stroke-linejoin="round"/><path d="M-33 -30 L-30 -40" stroke="#7a5a20" stroke-width="6" stroke-linecap="round"/><path d="M-26 -6 C-16 12 6 20 28 18" stroke="#fff" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  uva: { c: '#a970ff', svg: `${[[-17, -16], [0, -20], [17, -16], [-9, 0], [9, 0], [0, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12.5" fill="#a970ff" stroke="#7d48d6" stroke-width="2.5"/><circle cx="${x - 4}" cy="${y - 4}" r="3.5" fill="#fff" opacity=".5"/>`).join('')}<path d="M0 -32 L0 -40" stroke="#7a4f27" stroke-width="5" stroke-linecap="round"/><path d="M2 -38 C12 -48 28 -44 30 -38 C20 -30 8 -32 2 -38Z" fill="#6cc65a"/>` },
  naranja: { c: '#ffa53a', svg: `<circle r="34" fill="#ffa53a" stroke="#e07e12" stroke-width="3"/>${[[-12, 4], [8, 12], [14, -8], [-4, -14], [-16, -6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#e07e12"/>`).join('')}<path d="M2 -34 C10 -46 26 -44 28 -38 C18 -30 8 -30 2 -34Z" fill="#6cc65a"/><ellipse cx="-16" cy="-14" rx="7" ry="10" fill="#fff" opacity=".45" transform="rotate(30 -16 -14)"/>` },
  pera: { c: '#9be064', svg: `<path d="M0 -36 C-12 -36 -14 -18 -18 -8 C-36 8 -32 38 0 38 C32 38 36 8 18 -8 C14 -18 12 -36 0 -36Z" fill="#9be064" stroke="#6aae38" stroke-width="3"/><path d="M0 -36 C0 -42 2 -46 5 -50" stroke="#7a4f27" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M4 -44 C12 -54 26 -50 28 -45 C20 -38 10 -38 4 -44Z" fill="#6cc65a"/><ellipse cx="-14" cy="8" rx="6" ry="11" fill="#fff" opacity=".45" transform="rotate(15 -14 8)"/>` },
};
const MOUTH = `<g class="mclosed"><path d="M-14 0 Q0 13 14 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/></g>
<g class="mopen" opacity="0"><g class="mo"><ellipse rx="22" ry="17" fill="#7a2f45" stroke="${INK}" stroke-width="3.5"/><ellipse cy="8" rx="12" ry="6" fill="#ff8fa0"/></g></g>`;
const ANIMALS = {
  mono: { mouth: [0, 30], svg: `<path d="M48 120 C112 116 120 50 92 40 C78 36 72 54 84 58" data-p="#9a6440" data-pa="stroke" stroke-width="13" fill="none" stroke-linecap="round"/>
<ellipse cy="112" rx="58" ry="52" data-p="#a8714a"/><ellipse cy="122" rx="34" ry="34" data-p="#f1cfa3"/>
<circle cx="-70" cy="-4" r="26" data-p="#a8714a"/><circle cx="-70" cy="-4" r="15" data-p="#f1cfa3"/><circle cx="70" cy="-4" r="26" data-p="#a8714a"/><circle cx="70" cy="-4" r="15" data-p="#f1cfa3"/>
<circle r="66" data-p="#b07a50"/><path d="M-48 -4 C-48 -34 -14 -40 0 -24 C14 -40 48 -34 48 -4 C52 30 30 56 0 56 C-30 56 -52 30 -48 -4Z" data-p="#f3d3a8"/>
${EYE(-20, -8, 9)}${EYE(20, -8, 9)}<circle cx="-5" cy="13" r="2.6" fill="${INK}"/><circle cx="5" cy="13" r="2.6" fill="${INK}"/>${CHEEK(-34, 18)}${CHEEK(34, 18)}` },
  hipo: { mouth: [0, 46], svg: `<ellipse cy="122" rx="78" ry="54" data-p="#a597cf"/><ellipse cx="-44" cy="160" rx="22" ry="14" data-p="#978ac2"/><ellipse cx="44" cy="160" rx="22" ry="14" data-p="#978ac2"/>
<ellipse cx="-44" cy="-54" rx="15" ry="13" data-p="#978ac2"/><ellipse cx="44" cy="-54" rx="15" ry="13" data-p="#978ac2"/><ellipse cx="-44" cy="-54" rx="7" ry="6" data-p="#f2a6c4"/><ellipse cx="44" cy="-54" rx="7" ry="6" data-p="#f2a6c4"/>
<ellipse cy="-6" rx="72" ry="58" data-p="#b0a3db"/><ellipse cy="36" rx="72" ry="42" data-p="#c9bfe8"/>
<ellipse cx="-24" cy="18" rx="6" ry="4.5" fill="#7d6fae"/><ellipse cx="24" cy="18" rx="6" ry="4.5" fill="#7d6fae"/>${EYE(-26, -24, 9)}${EYE(26, -24, 9)}${CHEEK(-50, 30, 11)}${CHEEK(50, 30, 11)}` },
  tortuga: { mouth: [0, 22], svg: `<ellipse cx="-74" cy="150" rx="26" ry="16" data-p="#7fc862"/><ellipse cx="74" cy="150" rx="26" ry="16" data-p="#7fc862"/>
<path d="M-104 150 C-104 46 104 46 104 150Z" data-p="#c9934f"/><path d="M-60 140 L-50 96 L-14 88 L-6 140Z M6 140 L14 88 L50 96 L60 140Z" data-p="#b07a3c"/><path d="M-104 150 L104 150" data-p="#a8703f" data-pa="stroke" stroke-width="10" stroke-linecap="round"/>
<rect x="-26" y="20" width="52" height="60" rx="22" data-p="#8fd36f"/><circle r="54" data-p="#94d874"/>
${EYE(-19, -10, 9)}${EYE(19, -10, 9)}${CHEEK(-33, 12)}${CHEEK(33, 12)}<circle cx="-14" cy="-36" r="5" fill="#b6e79c"/><circle cx="12" cy="-40" r="3.5" fill="#b6e79c"/>` },
};

Screens.hambre = ctx => {
  const bg = grp({}, L.world, bgLand('hb', `
${treeArt(110, 560, 1, [[-50, -90, '#ff6b6b'], [40, -120, '#ffb33d'], [-10, -170, '#ff6b6b'], [60, -70, '#ffd84a'], [-70, -130, '#b07cff']])}
${treeArt(1500, 560, .95, [[-40, -100, '#9be064'], [30, -60, '#ff6b6b'], [10, -170, '#ffa53a'], [-60, -150, '#ffd84a']])}
<path d="M120 700 L1480 700 L1560 905 L40 905Z" data-p="#ff9c9c"/>
${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${200 + i * 200} 700 L${300 + i * 200} 700 L${300 + i * 200 + (i - 3) * 30} 905 L${200 + i * 200 + (i - 3.5) * 30} 905Z" data-p="#fff1f1" opacity=".75"/>`).join('')}
<path d="M80 800 L1520 800" data-p="#fff1f1" data-pa="stroke" stroke-width="40" opacity=".55"/>`));
  Paint.scan(bg);
  const animL = grp({}, L.world), fruitL = grp({}, L.world), topL = grp({}, L.world);
  const lumi = new Lumi(topL, -160, 182, .85);
  const bar = makeBar(11);
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'hambre');
  const animals = [], slots = [];
  let held = null, sticky = false, downT = 0, downP = null, roundDone = null, finished = false, firstDemo = true;

  function makeAnimal(kind, x) {
    const d = ANIMALS[kind], a = { kind, x, y: 430, want: null, left: 0, lv: 0, group: 'an' + animals.length };
    a.g = grp({ transform: tr(x, a.y) }, animL);
    a.hop = grp({}, a.g); a.hop.style.transformOrigin = '0px 160px';
    a.body = grp({}, a.hop, d.svg + `<g transform="translate(${d.mouth[0]} ${d.mouth[1]})">${MOUTH}</g>`);
    Paint.scan(a.body, { group: a.group, level: 0 });
    a.mc = a.body.querySelector('.mclosed'); a.mo = a.body.querySelector('.mopen'); a.moIn = a.body.querySelector('.mo');
    a.mx = d.mouth[0]; a.my = d.mouth[1];
    a.bub = grp({ transform: tr(92, -128), opacity: 0 }, a.g);
    animals.push(a);
    return a;
  }
  const mouth = (a, open) => { a.mo.setAttribute('opacity', open ? 1 : 0); a.mc.setAttribute('opacity', open ? 0 : 1); };
  function moveAnimal(a, x, dur = 900) {
    const x0 = a.x; a.x = x;
    anim(a.hop, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-40px)' }, { transform: 'translateY(0px)' }, { transform: 'translateY(-30px)' }, { transform: 'translateY(0px)' }], { duration: dur, fill: 'none' });
    return ctx.tween(dur, e => a.g.setAttribute('transform', tr(lerp(x0, x, e), a.y)));
  }
  function ask(a) {
    const taken = animals.filter(b => b !== a && b.want).map(b => b.want);
    const pool = Object.keys(FRUITS).filter(k => !taken.includes(k) && k !== a.last);
    a.want = pool.length ? pick(pool) : pick(Object.keys(FRUITS));
    a.bub.innerHTML = `<g><g class="float"><circle cx="-62" cy="78" r="9" fill="#fff"/><circle cx="-40" cy="50" r="14" fill="#fff"/><circle r="58" fill="#fff" stroke="#efe4f5" stroke-width="4"/><g transform="scale(.95)">${FRUITS[a.want].svg}</g></g></g>`;
    a.bub.getAnimations && a.bub.getAnimations().forEach(x => x.cancel());
    a.bub.setAttribute('opacity', 1);
    anim(a.bub.firstElementChild, [{ transform: 'scale(.2)' }, { transform: 'scale(1)' }], { duration: 450, easing: EB });
    mouth(a, true);
    anim(a.moIn, [{ transform: 'scale(.4)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 500, fill: 'none' });
    Sound.pop();
  }

  // Frutas sobre el mantel.
  function makeFruit(type, slot, delay = 0) {
    const f = { type, slot, x: slot.x, y: slot.y };
    f.g = grp({ transform: tr(f.x, f.y) }, fruitL);
    f.inner = grp({}, f.g, `<ellipse cy="40" rx="34" ry="9" fill="#000" opacity=".12"/>${FRUITS[type].svg}`);
    anim(f.inner, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 480, delay, easing: EB });
    ctx.after(delay, () => Sound.pop());
    slot.fruit = f;
    return f;
  }
  const setPos = (f, x, y) => { f.x = x; f.y = y; f.g.setAttribute('transform', tr(x, y)); };
  function refill(delay = 300) {
    const free = slots.filter(s => !s.fruit);
    if (!free.length) return;
    const have = slots.map(s => s.fruit && s.fruit.type).filter(Boolean);
    const need = animals.filter(a => a.want && !have.includes(a.want)).map(a => a.want);
    shuffle(free).forEach((s, i) => {
      const type = need.length ? need.shift() : pick(Object.keys(FRUITS));
      makeFruit(type, s, delay + i * 150);
    });
  }
  function setSlots(xs) {
    for (const s of slots) if (s.fruit) { const g = s.fruit.g; anim(s.fruit.inner, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], 300).onfinish = () => g.remove(); }
    slots.length = 0;
    xs.forEach(x => slots.push({ x, y: 790, fruit: null }));
  }
  function backHome(f) {
    const x0 = f.x, y0 = f.y;
    anim(f.inner, [{ transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 400, fill: 'forwards' });
    ctx.tween(450, e => setPos(f, lerp(x0, f.slot.x, e), lerp(y0, f.slot.y, e) - Math.sin(Math.PI * e) * 40), Ease.out);
  }
  const animalAt = p => { let best = null, bd = 210; for (const a of animals) { if (!a.want) continue; const d = Math.hypot(p.x - a.x, p.y - (a.y + 30)); if (d < bd) { bd = d; best = a; } } return best; };
  const fruitAt = p => { let best = null, bd = 100; for (const s of slots) { const f = s.fruit; if (!f || f === held) continue; const d = Math.hypot(p.x - f.x, p.y - f.y); if (d < bd) { bd = d; best = f; } } return best; };
  const fruitFor = a => slots.map(s => s.fruit).find(f => f && f !== held && f.type === a.want);

  function grab(f, p) {
    held = f; sticky = false; downT = performance.now(); downP = p;
    fruitL.appendChild(f.g);
    anim(f.inner, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }], { duration: 160, fill: 'forwards' });
    Sound.tap(); Guide.hide();
    setPos(f, p.x, p.y);
  }
  function drop(p) {
    const f = held; held = null; sticky = false;
    animals.forEach(a => a.want && anim(a.moIn, [{ transform: 'scale(1)' }], { duration: 150, fill: 'forwards' }));
    const a = animalAt({ x: f.x, y: f.y }) || animalAt(p);
    if (!a) return backHome(f);
    if (a.want === f.type) return eat(a, f);
    // Fruta equivocada: el animal dice que no con la cabeza y la correcta brilla.
    App.misses++;
    Sound.miss();
    anim(a.hop, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0deg)' }], { duration: 600, fill: 'none' });
    anim(a.bub.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 500, fill: 'none' });
    backHome(f);
    ctx.after(450, () => { const g = fruitFor(a); if (g) { FX.ring(g.x, g.y, '#ffe27a', 90, 9, 650); anim(g.inner, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 500, fill: 'none' }); } });
  }
  function eat(a, f) {
    App.good();
    const want = a.want; a.want = null; a.last = want; f.slot.fruit = null;
    anim(a.bub, [{ opacity: 1 }, { opacity: 0 }], 250).onfinish = () => a.bub.setAttribute('opacity', 0);
    const mx = a.x + a.mx, my = a.y + a.my, x0 = f.x, y0 = f.y;
    ctx.tween(320, e => setPos(f, lerp(x0, mx, e), lerp(y0, my, e)), Ease.out);
    anim(f.inner, [{ transform: 'scale(1.18)' }, { transform: 'scale(.15)' }], { duration: 330, fill: 'forwards' }).onfinish = () => f.g.remove();
    ctx.after(330, () => {
      mouth(a, true);
      anim(a.moIn, [{ transform: 'scale(1,1)' }, { transform: 'scale(1.1,.3)' }, { transform: 'scale(1,1)' }, { transform: 'scale(1.1,.3)' }, { transform: 'scale(1,1)' }, { transform: 'scale(1.1,.3)' }], { duration: 700, fill: 'none' });
      Sound.munch();
      ctx.after(720, () => {
        mouth(a, false);
        a.lv = Math.min(1, a.lv + .5); Paint.group(a.group, a.lv, 900);
        Paint.wave(a.x, a.y + 100, 520, .55); Paint.global(.1 + .7 * (count + 1) / 11);
        anim(a.hop, [{ transform: 'translateY(0px) scale(1,1)' }, { transform: 'translateY(4px) scale(1.1,.9)', offset: .2 }, { transform: 'translateY(-50px) scale(.95,1.06)', offset: .55 }, { transform: 'translateY(0px) scale(1,1)' }], { duration: 650, fill: 'none' });
        for (let k = 0; k < 5; k++) ctx.after(k * 90, () => FX.burst(a.x + rand(-40, 40), a.y - 40, ['#ff7aa2', '#ffb3c8'], 1, 90, 'dot'));
        FX.burst(a.x, a.y - 20, [FRUITS[want].c, '#fff', '#ffd84a'], 14, 170, 'star');
        Sound.bloom(count);
        bar.fill(FRUITS[want].c, a.x, a.y - 60);
        count++;
        lumi.happy(); lumi.move(ctx, clamp(a.x + (a.x < 800 ? 230 : -230), 180, 1420), 182, 900, 20);
        a.left--;
        if (a.left > 0) ctx.after(600, () => { ask(a); refill(250); });
        else if (animals.every(b => b.left <= 0) && roundDone) { const r = roundDone; roundDone = null; ctx.after(700, r); }
        else refill(250);
      });
    });
  }
  let count = 0;

  async function round(spec, xs) {
    const moves = [];
    spec.forEach(([kind, x, n]) => {
      let a = animals.find(b => b.kind === kind);
      if (!a) { a = makeAnimal(kind, x > 800 ? 1800 : -200); }
      a.left = n;
      moves.push(moveAnimal(a, x, 1000));
    });
    setSlots(xs);
    await Promise.all(moves);
    animals.forEach(a => ask(a));
    refill(200);
    await new Promise(r => { roundDone = r; });
    lumi.happy(true); Sound.chord();
    animals.forEach((a, i) => ctx.after(i * 120, () => anim(a.hop, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-60px)' }, { transform: 'translateY(0px)' }], { duration: 600, fill: 'none', easing: 'ease-out' })));
    await ctx.wait(900);
  }

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    lumi.move(ctx, 230, 182, 1300, 30);
    await round([['mono', 800, 1]], [800]);
    await round([['mono', 560, 2], ['hipo', 1040, 2]], [560, 800, 1040]);
    await round([['mono', 380, 2], ['hipo', 800, 2], ['tortuga', 1220, 2]], [360, 580, 800, 1020, 1240]);
    finished = true;
    setSlots([]);
    Paint.all(1, 1400, 800, 500);
    animals.forEach(a => Paint.group(a.group, 1, 900));
    wake(bg);
    animals.forEach((a, i) => ctx.every(900, () => anim(a.hop, [{ transform: 'translateY(0px) rotate(0deg)' }, { transform: `translateY(-46px) rotate(${i % 2 ? 8 : -8}deg)` }, { transform: 'translateY(0px) rotate(0deg)' }], { duration: 600, fill: 'none', delay: i * 150 })));
    lumi.move(ctx, 800, 182, 900, 20);
    await finishScene(ctx, 'hambre', first, t0, lumi, Object.values(FRUITS).map(f => f.c));
  })();
  // Primera vez: la manito muestra cómo llevar la fruta a la boca.
  ctx.after(2600, () => { if (firstDemo && !held && animals[0] && animals[0].want) { const f = fruitFor(animals[0]); if (f) Guide.drag(f.x, f.y, animals[0].x, animals[0].y + 30, 3); } });
  Sound.ambient(true);

  return {
    hintDelay: 7000,
    auto() { return this.hint(); },
    hint: () => {
      if (finished || held) return null;
      for (const a of animals) { if (!a.want) continue; const f = fruitFor(a); if (f) return { x: f.x, y: f.y, x2: a.x, y2: a.y + 30 }; }
      return null;
    },
    onDown: p => {
      if (finished) return true;
      if (held) { drop(p); return true; }
      const f = fruitAt(p);
      if (f) { firstDemo = false; grab(f, p); return true; }
      App.misses++;
      Sound.miss(); FX.puff(p.x, p.y);
      const a = animals.find(b => b.want);
      if (a) { const g = fruitFor(a); if (g) { FX.ring(g.x, g.y, '#ffe27a', 90, 9, 650); anim(g.inner, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 500, fill: 'none' }); } }
      return true;
    },
    onMove: p => {
      lumi.look(p.x, p.y);
      if (!held) return;
      setPos(held, p.x, p.y);
      const a = animalAt(p);
      for (const b of animals) if (b.want) anim(b.moIn, [{ transform: `scale(${b === a ? 1.35 : 1})` }], { duration: 150, fill: 'forwards' });
    },
    onUp: p => {
      if (!held) return;
      const quick = performance.now() - downT < 400 && Math.hypot(p.x - downP.x, p.y - downP.y) < 14;
      if (quick && !sticky) { sticky = true; return; }
      drop(p);
    },
  };
};
