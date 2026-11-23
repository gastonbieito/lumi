// Fiesta del faro: el faro se despierta y alumbra el mar; están todos los amigos del capítulo y el nombre del chico.
// Cualquier clic suma fuegos de colores; cualquier tecla también. Los farolitos que suben se pueden explotar.
Screens.fiesta = ctx => {
  const prof = App.profile || (App.profile = Store.guest());
  const first = !Store.isDone(prof, 'fiesta');
  Store.sceneDone(prof, 'fiesta', {});
  const COLS = ['#ff8fb1', '#ffd84a', '#6cc6ff', '#86d36f', '#b78cff', '#ffb25b', '#ff7b7b', '#5fd6bd'];
  let stars = '';
  for (let i = 0; i < 40; i++) stars += `<g transform="translate(${rand(-200, 1800).toFixed(0)} ${rand(-100, 380).toFixed(0)}) scale(${rand(.3, .7).toFixed(2)})"><g class="pulse" style="animation-duration:${rand(1.6, 3.4).toFixed(1)}s;animation-delay:-${rand(0, 3).toFixed(1)}s"><path d="${SPARK}" fill="#fff"/></g></g>`;
  const bg = grp({}, L.world, `<defs><linearGradient id="fsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f7a"/><stop offset=".6" stop-color="#7a5ab0"/><stop offset="1" stop-color="#ffb3a0"/></linearGradient>
<linearGradient id="fbeam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff6b0" stop-opacity=".75"/><stop offset="1" stop-color="#fff6b0" stop-opacity="0"/></linearGradient>
<linearGradient id="fsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f7fc0"/><stop offset="1" stop-color="#2d4f8f"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#fsk)"/>${stars}
<rect x="-600" y="520" width="2800" height="900" fill="url(#fsea)"/>
<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"><g class="ripple"><path d="M80 600 q30 -10 60 0 M700 640 q30 -10 60 0 M1000 580 q30 -10 60 0"/></g><g class="ripple" style="--d:-2s"><path d="M300 700 q30 -10 60 0 M900 720 q30 -10 60 0"/></g></g>
<path d="M-600 770 C-200 730 300 760 800 750 C1300 740 1700 760 2200 770 L2200 1300 L-600 1300Z" fill="#ffe2a8"/>`);
  const beamL = grp({}, L.world), midL = grp({}, L.world), topL = grp({}, L.world), lanL = grp({}, L.world);

  // Faro despierto con su haz de luz que barre el cielo.
  const faro = grp({ transform: tr(1330, 760, 1.15) }, midL, faroArt(false));
  faro.querySelectorAll('.sun-sleep').forEach(e => e.setAttribute('opacity', 0));
  faro.querySelectorAll('.sun-awake').forEach(e => e.setAttribute('opacity', 1));
  const lamp = { x: 1330, y: 760 - 268 * 1.15 };
  grp({ transform: tr(lamp.x, lamp.y) }, beamL, `<g class="pulse"><circle r="150" fill="url(#gGold)"/></g>`);
  const beam = grp({ transform: tr(lamp.x, lamp.y) }, beamL);
  const beamIn = grp({}, beam, `<path d="M0 -14 L-1500 -190 L-1500 190 L0 14Z" fill="url(#fbeam)"/>`);
  ctx.loop((dt, now) => beamIn.setAttribute('transform', `rotate(${(Math.sin(now * .0007) * 22 - 4).toFixed(2)})`));

  // Los amigos: flores que cantan, caracoles abiertos, ranas y luciérnagas.
  const flowers = FLOWER_SET.map(([t, c], i) => {
    const g = grp({ transform: tr(90 + i * 105, 860, .7) }, midL);
    const s = grp({ class: 'sway', style: `--d:-${i * .6}s` }, g, ART.flower(t, c, 150 + (i % 2) * 30));
    return { g, s, i, x: 90 + i * 105, y: 860 - (150 + (i % 2) * 30) * .7 };
  });
  [[700, 820, '#ff9fc4'], [1000, 840, '#b9a2ff']].forEach(([x, y, c]) => {
    const g = grp({ transform: tr(x, y, .6) }, midL, shellArt(c));
    g.querySelector('.top').setAttribute('transform', 'translate(0 -58) scale(1 .5)');
    g.querySelector('.pearl').setAttribute('opacity', 1);
    g.querySelector('.knocks').setAttribute('opacity', 0);
  });
  const frogs = [[560, 790], [1150, 800]].map(([x, y], i) => {
    const o = grp({ transform: tr(x, y, .6) }, midL), hop = grp({}, o, `<ellipse cy="0" rx="46" ry="32" fill="#7fd36a"/><circle cx="-22" cy="-30" r="17" fill="#7fd36a"/><circle cx="22" cy="-30" r="17" fill="#7fd36a"/>${EYE(-22, -32, 9)}${EYE(22, -32, 9)}<path d="M-18 6 Q0 20 18 6" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    ctx.every(900 + i * 200, () => anim(hop, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-50px)' }, { transform: 'translateY(0px)' }], { duration: 450, fill: 'none', easing: 'ease-out' }));
    return hop;
  });
  for (let i = 0; i < 9; i++) {
    const g = grp({ transform: tr(rand(150, 1100), rand(380, 540), .5) }, midL, `<g class="float" style="--d:-${rand(0, 4).toFixed(1)}s">${fireflyArt(true)}</g>`);
    anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: i * 120 });
  }
  // Barquitos con farol.
  [[300, 640, 1], [880, 690, -1]].forEach(([x, y, d], i) => {
    const b = grp({ transform: tr(x, y, .55) }, midL, `<g class="float" style="--d:-${i * 2}s">${BOAT}<g transform="translate(0 -130)"><g class="pulse"><circle r="40" fill="url(#gGold)"/></g><circle r="9" fill="#fff3a0"/></g></g>`);
    ctx.loop((dt, now) => b.setAttribute('transform', tr(x + Math.sin(now * .0004 + i) * 60 * d, y, .55)));
  });

  const lumi = new Lumi(topL, 760, 470, 1.15);
  const kid = grp({ transform: tr(760, 650) }, topL);
  const kidIn = grp({}, kid, ART.avatar(prof, 82));
  ctx.every(1600, () => { pick([() => lumi.happy(true), () => lumi.spin()])(); anim(kidIn, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-36px)' }, { transform: 'translateY(0px)' }], { duration: 600, fill: 'none', delay: 300 }); });
  if (prof.name) {
    const col = colorOf(prof.color), fs = 84, w = Math.max(360, prof.name.length * fs * .58 + 120);
    const b = grp({ transform: tr(760, 230) }, topL), bi = grp({}, b, `
<path d="M${-w / 2 - 66} -20 L${-w / 2 + 10} -20 L${-w / 2 + 10} 58 L${-w / 2 - 66} 58 L${-w / 2 - 38} 19Z" fill="${shade(col, -.15)}"/>
<path d="M${w / 2 + 66} -20 L${w / 2 - 10} -20 L${w / 2 - 10} 58 L${w / 2 + 66} 58 L${w / 2 + 38} 19Z" fill="${shade(col, -.15)}"/>
<rect x="${-w / 2}" y="-60" width="${w}" height="120" rx="34" fill="#fffaf3" stroke="${col}" stroke-width="10"/>
<text y="6" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" fill="${INK}">${escapeXml(prof.name)}</text>`);
    anim(bi, [{ transform: 'scale(0) rotate(-8deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 800, delay: 600, easing: EB });
  }

  function firework(x, y) {
    const c = pick(COLS);
    FX.ring(x, y, c, 150, 8, 650);
    FX.burst(x, y, [c, pick(COLS), '#fff'], 22, 230, Math.random() < .5 ? 'star' : 'dot');
    Sound.boom(); lumi.look(x, y);
  }
  // Farolitos que suben.
  const lanterns = new Set();
  function lantern() {
    if (lanterns.size >= 6) return;
    const c = pick(COLS), b = { x: rand(160, 1200), y: 980, sp: rand(70, 100), ph: rand(0, 6) };
    b.g = grp({}, lanL, `<g class="pulse"><circle r="70" fill="url(#gGold)"/></g><path d="M-34 -40 C-46 0 -40 36 -26 48 L26 48 C40 36 46 0 34 -40Z" fill="${c}"/><rect x="-30" y="-48" width="60" height="12" rx="6" fill="${shade(c, -.2)}"/><rect x="-22" y="46" width="44" height="10" rx="5" fill="${shade(c, -.2)}"/><ellipse cx="0" cy="8" rx="14" ry="20" fill="#fff6b0" opacity=".8"/>`);
    b.t = App.addTarget({ x: b.x, y: b.y, r: 80, prio: 2, kind: 'balloon', hit: () => {
      lanterns.delete(b); App.removeTarget(b.t); b.g.remove(); App.good();
      firework(b.t.x, b.t.y);
    } });
    lanterns.add(b);
  }
  ctx.every(1200, lantern);
  ctx.loop((dt, now) => {
    for (const b of lanterns) {
      b.y -= b.sp * dt / 1000;
      const x = b.x + Math.sin(now * .0013 + b.ph) * 24;
      b.g.setAttribute('transform', tr(x.toFixed(1), b.y.toFixed(1)));
      b.t.x = x; b.t.y = b.y;
      if (b.y < -150) { lanterns.delete(b); App.removeTarget(b.t); b.g.remove(); }
    }
  });
  // Las flores cantan una melodía de vez en cuando.
  ctx.every(4200, () => [0, 2, 4, 3, 1].forEach((k, j) => ctx.after(j * 260, () => { Sound.sing(k); anim(flowers[k].s, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 300, fill: 'none' }); })));
  Sound.fanfare();
  ctx.after(400, () => { for (let i = 0; i < 6; i++) ctx.after(i * 280, () => firework(rand(200, 1300), rand(150, 420))); });
  ctx.after(3500, () => { const b = [...lanterns].find(q => q.y < 760 && q.y > 300); if (b) Guide.tap(b.t.x, b.t.y, 2); });
  ctx.after(55000, () => App.go('map', { justDone: 'fiesta', first }));
  Sound.ambient(true);

  return {
    onMove: p => lumi.look(p.x, p.y),
    onKey: () => { App.good(); firework(rand(200, 1300), rand(130, 450)); Sound.drum(Math.floor(rand(0, 4))); },
    onMiss: p => { App.misses--; firework(p.x, p.y); },
  };
};
