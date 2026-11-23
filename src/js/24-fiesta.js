// Fiesta final: la isla entera con color, todos los personajes y el nombre del chico.
// Cualquier clic suma: globos que explotan en papelitos y fuegos de colores donde se toque.
Screens.fiesta = ctx => {
  const prof = App.profile || (App.profile = Store.guest());
  const first = !Store.isDone(prof, 'fiesta');
  Store.sceneDone(prof, 'fiesta', {});
  const COLS = ['#ff8fb1', '#ffd84a', '#6cc6ff', '#86d36f', '#b78cff', '#ffb25b', '#ff7b7b', '#5fd6bd'];
  let flags = '';
  for (let i = 0; i < 17; i++) {
    const x = -20 + i * 103, y = 92 + Math.sin(i / 16 * Math.PI) * 95;
    flags += `<path d="M${x - 24} ${y} L${x + 24} ${y} L${x} ${y + 46}Z" fill="${COLS[i % COLS.length]}"/>`;
  }
  let front = '';
  [60, 180, 1290, 1415, 1545, 980].forEach((x, i) => { front += `<g transform="translate(${x} ${880 - (i % 2) * 18}) scale(.75)"><g class="sway" style="--d:-${i * .5}s">${ART.flower(['daisy', 'round', 'tulip', 'star'][i % 4], COLS[i], 120 + (i % 3) * 20)}</g></g>`; });
  const bg = grp({}, L.world, bgLand('fs', `${treeArt(130, 600, 1, [[-50, -90, '#ff6b6b'], [40, -120, '#ffb33d'], [-10, -170, '#ff6b6b'], [60, -70, '#ffd84a'], [-70, -130, '#b07cff']])}
<g transform="translate(1480 650) scale(1.25)"><g class="sway">${ART.flower('daisy', '#ffc93c', 230)}</g></g>
<g class="rainbow" opacity=".45">${['#ff8b8b', '#ffb86b', '#ffe066', '#9ee07c', '#79c8ff', '#b394ff'].map((c, i) => `<path d="M${180 + i * 16} 470 A${620 - i * 16} ${620 - i * 16} 0 0 1 ${1420 - i * 16} 470" fill="none" stroke="${c}" stroke-width="17"/>`).join('')}</g>
<path d="M-80 92 Q800 285 1680 92" stroke="#fff" stroke-width="4" fill="none"/>${flags}${front}`));
  Paint.scan(bg, { level: 1 });
  bg.querySelectorAll('.sun-sleep').forEach(e => e.setAttribute('opacity', 0));
  bg.querySelectorAll('.sun-awake').forEach(e => e.setAttribute('opacity', 1));
  const midL = grp({}, L.world), topL = grp({}, L.world), balL = grp({}, L.world);

  // Los animales de la escena 2 bailan.
  const dancers = [['mono', 330, 640, .6], ['tortuga', 540, 716, .48], ['hipo', 1130, 650, .58]].map(([k, x, y, s], i) => {
    const o = grp({ transform: tr(x, y, s) }, midL), hop = grp({}, o, ANIMALS[k].svg + `<g transform="translate(${ANIMALS[k].mouth[0]} ${ANIMALS[k].mouth[1]})">${MOUTH}</g>`);
    hop.style.transformOrigin = '0px 160px';
    Paint.scan(hop, { level: 1 });
    ctx.every(1300 + i * 170, () => anim(hop, [{ transform: 'translateY(0px) rotate(0deg)' }, { transform: `translateY(-60px) rotate(${i % 2 ? 10 : -10}deg)` }, { transform: 'translateY(0px) rotate(0deg)' }], { duration: 650, fill: 'none', easing: 'ease-out' }));
    return hop;
  });
  // Peces que saltan en el mar.
  ctx.every(2300, () => {
    const x0 = pick([rand(80, 420), rand(1180, 1560)]), dir = Math.random() < .5 ? 1 : -1;
    const f = el('g', {}); f.innerHTML = `<g transform="scale(${.45 * dir} .45)">${fishArt(pick(COLS))}</g>`;
    bg.insertBefore(f, bg.querySelector('.hill'));
    ctx.tween(1300, (e, t) => f.setAttribute('transform', `translate(${(x0 + dir * 160 * t).toFixed(1)} ${(470 - Math.sin(Math.PI * t) * 140).toFixed(1)}) rotate(${(dir * (t * 120 - 60)).toFixed(1)})`), Ease.lin).then(() => { f.remove(); Sound.blub(); });
  });

  const lumi = new Lumi(topL, 800, 430, 1.3);
  const kid = grp({ transform: tr(800, 700) }, topL);
  const kidIn = grp({}, kid, ART.avatar(prof, 92));
  ctx.every(1600, () => { pick([() => lumi.happy(true), () => lumi.spin()])(); anim(kidIn, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-36px)' }, { transform: 'translateY(0px)' }], { duration: 600, fill: 'none', delay: 300 }); });
  if (prof.name) {
    const col = colorOf(prof.color), fs = 88, w = Math.max(380, prof.name.length * fs * .58 + 130);
    const b = grp({ transform: tr(800, 232) }, topL), bi = grp({}, b, `
<path d="M${-w / 2 - 70} -20 L${-w / 2 + 10} -20 L${-w / 2 + 10} 60 L${-w / 2 - 70} 60 L${-w / 2 - 40} 20Z" fill="${shade(col, -.15)}"/>
<path d="M${w / 2 + 70} -20 L${w / 2 - 10} -20 L${w / 2 - 10} 60 L${w / 2 + 70} 60 L${w / 2 + 40} 20Z" fill="${shade(col, -.15)}"/>
<rect x="${-w / 2}" y="-62" width="${w}" height="124" rx="36" fill="#fffaf3" stroke="${col}" stroke-width="10"/>
<text y="6" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" fill="${INK}">${escapeXml(prof.name)}</text>`);
    anim(bi, [{ transform: 'scale(0) rotate(-8deg)' }, { transform: 'scale(1) rotate(0deg)' }], { duration: 800, delay: 600, easing: EB });
  }

  // Globos.
  const balloons = new Set();
  function balloon() {
    if (balloons.size >= 6) return;
    const c = pick(COLS), b = { x: rand(160, 1440), y: 1000, sp: rand(70, 100), ph: rand(0, 6), c };
    b.g = grp({}, balL, `<path d="M0 46 q-10 30 4 60 q10 30 -4 60" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8"/><ellipse rx="44" ry="52" fill="${c}"/><path d="M-6 50 L6 50 L0 42Z" fill="${shade(c, -.2)}"/><ellipse cx="-16" cy="-20" rx="9" ry="15" fill="#fff" opacity=".45" transform="rotate(25 -16 -20)"/>`);
    b.t = App.addTarget({ x: b.x, y: b.y, r: 78, prio: 2, kind: 'balloon', hit: () => {
      balloons.delete(b); App.removeTarget(b.t); b.g.remove(); App.good();
      FX.ring(b.t.x, b.t.y, c, 130, 8, 500);
      FX.burst(b.t.x, b.t.y, [c, '#fff', pick(COLS), pick(COLS)], 20, 200, Math.random() < .5 ? 'petal' : 'star');
      Sound.boom(); lumi.look(b.t.x, b.t.y);
    } });
    balloons.add(b);
  }
  ctx.every(1100, balloon);
  ctx.loop((dt, now) => {
    for (const b of balloons) {
      b.y -= b.sp * dt / 1000;
      const x = b.x + Math.sin(now * .0015 + b.ph) * 26;
      b.g.setAttribute('transform', tr(x.toFixed(1), b.y.toFixed(1)));
      b.t.x = x; b.t.y = b.y;
      if (b.y < -150) { balloons.delete(b); App.removeTarget(b.t); b.g.remove(); }
    }
  });
  Sound.fanfare();
  ctx.after(400, () => { for (let i = 0; i < 5; i++) ctx.after(i * 300, () => { FX.burst(rand(300, 1300), rand(150, 420), COLS, 18, 220, 'star'); Sound.boom(); }); });
  ctx.after(3500, () => { const b = [...balloons].find(q => q.y < 760 && q.y > 300); if (b) Guide.tap(b.t.x, b.t.y, 2); });
  ctx.after(55000, () => App.go('map', { justDone: 'fiesta', first }));
  Sound.ambient(true);

  return {
    onMove: p => lumi.look(p.x, p.y),
    onMiss: p => {
      App.misses--;
      FX.burst(p.x, p.y, [pick(COLS), pick(COLS), '#fff'], 16, 170, 'star');
      FX.ring(p.x, p.y, pick(COLS), 120, 8, 600);
      Sound.boom();
    },
  };
};
