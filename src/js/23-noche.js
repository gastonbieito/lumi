// Escena 4: Noche. Verbo: clic. Cada estrella apagada se enciende; al final se arma un corazón
// de estrellas y pasa una estrella fugaz. La luna se despierta.
function bgNight(id) {
  const P = 'data-p';
  let dots = '';
  for (let i = 0; i < 40; i++) dots += `<circle cx="${rand(-300, 1900).toFixed(0)}" cy="${rand(-200, 620).toFixed(0)}" r="${rand(1.5, 3.2).toFixed(1)}" ${P}="#fff6c8" data-gl="" opacity="${rand(.4, .9).toFixed(2)}"/>`;
  return `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#1d2560"/><stop offset=".55" ${P}="#43398c"/><stop offset="1" ${P}="#8a5aa8"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}s)"/>${dots}
<g transform="translate(200 165)"><circle r="120" fill="url(#gWhite)" opacity=".25"/><circle r="66" ${P}="#fff2b0" data-gl=""/><circle cx="-20" cy="-18" r="12" ${P}="#f1df92" data-gl=""/><circle cx="24" cy="22" r="8" ${P}="#f1df92" data-gl=""/>
<g class="sun-sleep"><path d="M-30 0 q10 8 20 0 M10 0 q10 8 20 0" stroke="#8a7a4a" stroke-width="5" fill="none" stroke-linecap="round"/></g>
<g class="sun-awake" opacity="0">${EYE(-19, -4, 7.5)}${EYE(19, -4, 7.5)}<path d="M-13 16 Q0 30 13 16" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>${CHEEK(-32, 12, 9)}${CHEEK(32, 12, 9)}</g></g>
<path d="M-600 760 C-200 650 200 700 500 720 C800 740 1000 640 1300 660 C1600 680 1900 700 2200 690 L2200 1300 L-600 1300Z" ${P}="#3b4f8a" data-gl=""/>
<path d="M-600 830 C-100 760 400 800 800 790 C1200 780 1500 820 2200 800 L2200 1300 L-600 1300Z" ${P}="#2e6b5e" data-gl=""/>
${[[140, 790, 1], [1450, 780, 1.2], [1300, 800, .8]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="-20" width="14" height="40" ${P}="#5a4a6a"/><path d="M0 -130 L-46 -10 L46 -10Z" ${P}="#2f5a50"/><path d="M0 -160 L-34 -70 L34 -70Z" ${P}="#36685c"/></g>`).join('')}
<g transform="translate(560 800)"><rect x="-50" y="-50" width="100" height="60" rx="6" ${P}="#e8b26a"/><path d="M-64 -46 L0 -96 L64 -46Z" ${P}="#c75c5c"/><rect x="-14" y="-30" width="28" height="40" rx="12" ${P}="#ffe28a"/></g>`;
}
const STAR_DIM = `<path d="${starPath(36, 17)}" fill="#a3a7bb" fill-opacity=".55" stroke="#c9cbd8" stroke-width="3" stroke-linejoin="round"/><path d="M-12 0 q5 4 10 0 M2 0 q5 4 10 0" stroke="#5d6178" stroke-width="3" fill="none" stroke-linecap="round"/>`;

Screens.noche = ctx => {
  const bg = grp({}, L.world, bgNight('nc'));
  Paint.scan(bg);
  const lineL = grp({}, L.world), lumiL = grp({}, L.world), starL = grp({}, L.world);
  const lumi = new Lumi(lumiL, 800, 1100, .85);
  const bar = makeBar(18);
  const t0 = performance.now(), first = !Store.isDone(App.profile, 'noche');
  const pending = new Set(), lit = [];
  let count = 0, roundDone = null, finished = false, shooting = null;

  function addStar(x, y, s = 1) {
    const st = { x, y, s, on: false };
    st.g = grp({ transform: tr(x, y, s) }, starL);
    st.inner = grp({}, st.g, STAR_DIM);
    anim(st.inner, [{ transform: 'scale(0) rotate(-90deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 550, easing: EB, delay: rand(0, 300) });
    st.t = App.addTarget({ x, y, r: 92, prio: 3, kind: 'star', hit: () => light(st) });
    pending.add(st);
    return st;
  }
  function light(st) {
    if (st.on) return;
    st.on = true; pending.delete(st); App.removeTarget(st.t); App.good();
    st.inner.innerHTML = `<g class="pulse"><circle r="80" fill="url(#gGold)"/></g>${ART.star(38)}`;
    anim(st.inner, [{ transform: 'scale(.6) rotate(0deg)' }, { transform: 'scale(1.35) rotate(25deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 600, easing: EB });
    FX.ring(st.x, st.y, '#fff3a0', 200, 9, 800);
    FX.burst(st.x, st.y, ['#fff3a0', '#ffffff', '#ffd84a'], 12, 150, 'star');
    Paint.wave(st.x, st.y, 600, .5); Paint.global(.12 + .7 * (count + 1) / 18);
    Sound.star(count);
    bar.fill('#ffd84a', st.x, st.y);
    lumi.happy(); lumi.look(st.x, st.y);
    count++;
    st.t2 = App.addTarget({ x: st.x, y: st.y, r: 70, prio: 1, kind: 'litstar', hit: () => { App.lastGood = performance.now(); Sound.twinkle(); anim(st.inner, [{ transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.25) rotate(20deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 450, fill: 'none' }); } });
    lit.push(st);
    if (!pending.size && roundDone) { const r = roundDone; roundDone = null; ctx.after(700, r); }
  }
  // Las estrellas ya encendidas suben y quedan chiquitas arriba, para dejar lugar.
  function lift() {
    for (const st of lit.splice(0)) {
      App.removeTarget(st.t2);
      const x0 = st.x, y0 = st.y, x1 = rand(380, 1250), y1 = rand(120, 200);
      ctx.tween(1200, e => st.g.setAttribute('transform', tr(lerp(x0, x1, e), lerp(y0, y1, e), lerp(st.s, .38, e))));
    }
  }
  async function round(pts, first) {
    pts.forEach(([x, y]) => addStar(x, y));
    if (first) ctx.after(1200, () => Guide.tap(pts[0][0], pts[0][1], 99));
    await new Promise(r => { roundDone = r; });
    lumi.happy(true); Sound.chord();
    await ctx.wait(800);
  }

  function shootingStar() {
    return new Promise(res => {
      const g = grp({}, starL), body = grp({}, g, `<path d="M0 0 L-190 -40" stroke="url(#gGold)" stroke-width="0"/><path d="M-10 -4 L-200 -46" stroke="#fff3a0" stroke-width="14" stroke-linecap="round" opacity=".55"/><path d="M-10 -2 L-140 -30" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/><g class="pulse"><circle r="80" fill="url(#gGold)"/></g>${ART.star(44)}`);
      const s = { x: -200, y: 200 };
      const t = App.addTarget({ x: s.x, y: s.y, r: 140, prio: 3, kind: 'big', hit: () => {
        App.removeTarget(t); App.good(); shooting = null;
        FX.ring(s.x, s.y, '#fff3a0', 400, 16, 1200);
        for (let k = 0; k < 4; k++) ctx.after(k * 180, () => FX.burst(s.x + rand(-60, 60), s.y + rand(-60, 60), ['#fff3a0', '#ffd84a', '#ff9fd0', '#7fd1ff'], 16, 220, 'star'));
        bar.fill('#ffd84a', s.x, s.y);
        anim(body, [{ transform: 'scale(1)' }, { transform: 'scale(1.6)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }], { duration: 700 }).onfinish = () => g.remove();
        res();
      } });
      shooting = t;
      let k = 0;
      ctx.loop(dt => {
        if (shooting !== t) return false;
        k += dt / 9000; if (k > 1) k = 0;
        s.x = lerp(-150, 1750, k); s.y = 170 + Math.sin(k * Math.PI) * 260;
        g.setAttribute('transform', tr(s.x.toFixed(1), s.y.toFixed(1)) + ` rotate(${(Math.cos(k * Math.PI) * -26 + 12).toFixed(1)})`);
        t.x = s.x; t.y = s.y;
      });
      ctx.after(3500, () => { if (shooting === t) Guide.tap(s.x + 120, s.y + 30, 2); });
    });
  }

  (async () => {
    await ctx.wait(300);
    Sound.whoosh();
    await lumi.move(ctx, 800, 745, 1200, -40);
    await round([[800, 360]], true);
    lift();
    await round([[380, 280], [1200, 260], [560, 520], [1040, 500]]);
    lift();
    await ctx.wait(600);
    const heart = [[800, 300], [900, 215], [1010, 240], [1050, 340], [990, 450], [900, 540], [800, 620], [700, 540], [610, 450], [550, 340], [590, 240], [700, 215]];
    await round(heart);
    // Se dibuja el corazón uniendo las estrellas.
    const d = heart.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + 'Z';
    const path = el('path', { d, fill: 'none', stroke: '#fff3a0', 'stroke-width': 6, 'stroke-linejoin': 'round', opacity: .8 }, lineL);
    const len = path.getTotalLength();
    path.setAttribute('stroke-dasharray', len);
    anim(path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1600, easing: 'ease-in-out' });
    Sound.fanfare();
    await ctx.wait(1700);
    el('path', { d, fill: '#ff8fb1', opacity: .25 }, lineL);
    lumi.move(ctx, 1150, 745, 900, -40);
    await shootingStar();
    finished = true;
    Paint.all(1, 1600, 800, 400);
    wake(bg);
    for (let i = 0; i < 18; i++) {
      const f = grp({ transform: tr(rand(100, 1500), rand(640, 860)) }, lumiL, `<g class="float" style="--d:-${rand(0, 4).toFixed(1)}s"><g class="pulse" style="animation-duration:${rand(1.2, 2.4).toFixed(1)}s"><circle r="16" fill="url(#gGold)"/><circle r="4" fill="#fffbd0"/></g></g>`);
      anim(f, [{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: i * 80 });
    }
    lumi.move(ctx, 800, 745, 900, 60);
    await finishScene(ctx, 'noche', first, t0, lumi, ['#fff3a0', '#ffd84a', '#ff9fd0', '#7fd1ff', '#b78cff']);
  })();
  Sound.ambient(true);

  return {
    hint: () => {
      if (finished) return null;
      const s = [...pending][0];
      if (s) return { x: s.x, y: s.y };
      return shooting ? { x: shooting.x + 120, y: shooting.y + 30 } : null;
    },
    onMiss: p => {
      if (finished) return;
      Sound.miss(); FX.puff(p.x, p.y);
      let best = null, bd = Infinity;
      for (const s of pending) { const d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } }
      if (best) { FX.ring(best.x, best.y, '#fff3a0', 110, 9, 650); anim(best.inner, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 500, fill: 'none' }); }
    },
    onMove: p => lumi.look(p.x, p.y),
  };
};
