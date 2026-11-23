// Piezas que comparten las escenas: barra de progreso, fondo de exterior, sol dormido y cierre de escena.

// Barra de casilleros arriba al centro (sin números). El último es más grande: el "gran final".
function makeBar(n) {
  const bar = grp({ transform: tr(800, 56) }, L.hud);
  const sp = Math.min(44, 520 / (n - 1)), half = sp * (n - 1) / 2 + 36;
  grp({}, bar, `<rect x="${-half}" y="-28" width="${half * 2}" height="56" rx="28" fill="#fff" fill-opacity=".6" stroke="#fff" stroke-width="3"/>`);
  const slots = [];
  for (let i = 0; i < n; i++) {
    const last = i === n - 1, x = (i - (n - 1) / 2) * sp + (last ? 4 : 0), r = last ? 18 : 13;
    slots.push({ g: grp({ transform: tr(x, 0) }, bar, `<circle r="${r}" fill="#efe8f3" stroke="${last ? '#ffd84a' : '#ddd2e8'}" stroke-width="3"/>`), x: 800 + x, y: 56, r });
  }
  let next = 0;
  return {
    fill(col, x, y) {
      const s = slots[Math.min(next++, n - 1)];
      FX.fly(`<circle r="12" fill="${col}" stroke="#fff" stroke-width="3"/>`, x, y, s.x, s.y, 800, 120, L.hud).then(() => {
        const f = grp({}, s.g, `<circle r="${s.r}" fill="${col}"/><circle r="5" fill="#fff" opacity=".8"/>`);
        anim(f, [{ transform: 'scale(1.8)' }, { transform: 'scale(1)' }], { duration: 400, easing: EB });
        Sound.twinkle();
      });
    },
  };
}

// Sol con cara dormida que se despierta al final.
function sunArt(x, y) {
  let rays = '';
  for (let i = 0; i < 12; i++) rays += `<path d="M0 -86 L0 -108" transform="rotate(${i * 30})" data-p="#ffd34d" data-pa="stroke" stroke-width="11" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y})"><circle r="150" fill="url(#gWhite)" opacity=".5"/><g class="spin-slow">${rays}</g><circle r="72" data-p="#ffd84d"/><circle r="60" data-p="#ffe680"/>
<g class="sun-sleep"><path d="M-32 -2 q11 9 22 0 M10 -2 q11 9 22 0" stroke="#8a7240" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cy="24" rx="7" ry="5" fill="#8a7240" opacity=".6"/></g>
<g class="sun-awake" opacity="0">${EYE(-21, -6, 8)}${EYE(21, -6, 8)}<path d="M-16 16 Q0 34 16 16" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>${CHEEK(-36, 12, 10)}${CHEEK(36, 12, 10)}</g></g>`;
}
function wake(root) {
  root.querySelectorAll('.sun-sleep').forEach(e => anim(e, [{ opacity: 1 }, { opacity: 0 }], 600));
  root.querySelectorAll('.sun-awake').forEach(e => anim(e, [{ opacity: 0 }, { opacity: 1 }], 600));
}

// Fondo de exterior: cielo, sol, nubes, mar, lomas y pasto.
function bgLand(id, extra = '') {
  const P = 'data-p';
  return `<defs>
<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#86cff2"/><stop offset=".6" ${P}="#c6ecf8"/><stop offset="1" ${P}="#fff0d2"/></linearGradient>
<linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#7fd0e6"/><stop offset="1" ${P}="#43aacb"/></linearGradient>
<linearGradient id="${id}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#b0e382"/><stop offset="1" ${P}="#74c05c"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}sky)"/>
${sunArt(1250, 185)}
<g transform="translate(300 150)"><g class="drift">${ART.cloud(.9, true)}</g></g>
<g transform="translate(760 100)"><g class="drift" style="--d:-14s">${ART.cloud(.6, true)}</g></g>
<rect x="-600" y="420" width="2800" height="900" fill="url(#${id}sea)"/>
<g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"><g class="ripple"><path d="M40 448 q20 -8 40 0 M1480 452 q20 -8 40 0 M1220 440 q20 -8 40 0"/></g><g class="ripple" style="--d:-2.5s"><path d="M200 462 q20 -8 40 0 M1380 470 q20 -8 40 0"/></g></g>
<path class="hill" d="M-600 520 C-100 440 200 425 420 470 C600 508 680 470 800 452 C950 428 1050 480 1200 470 C1400 456 1600 412 2200 470 L2200 1300 L-600 1300Z" ${P}="#97d47e" data-gl=""/>
<path d="M-600 600 C-50 562 300 548 600 562 C900 577 1200 542 1500 556 C1700 566 1850 580 2200 600 L2200 1300 L-600 1300Z" fill="url(#${id}gr)"/>${extra}`;
}

function treeArt(x, y, s = 1, fruits = []) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 60 C-12 10 -12 -30 -8 -70 L10 -70 C12 -30 14 10 18 60Z" data-p="#a8703f"/>
<circle cx="-50" cy="-96" r="56" data-p="#5cb656"/><circle cx="44" cy="-104" r="60" data-p="#69c25e"/><circle cx="-4" cy="-160" r="58" data-p="#78cd68"/>
${fruits.map(([fx, fy, c]) => `<circle cx="${fx}" cy="${fy}" r="13" data-p="${c}"/><circle cx="${fx - 4}" cy="${fy - 4}" r="4" fill="#fff" opacity=".55"/>`).join('')}</g>`;
}

// Cierre común: guarda, festeja unos segundos y vuelve al mapa con la estrella.
async function finishScene(ctx, key, first, t0, lumi, colors) {
  Store.sceneDone(App.profile, key, { ms: Math.round(performance.now() - t0), misses: App.misses, hints: App.hints });
  Sound.fanfare();
  for (let i = 0; i < 6; i++) ctx.after(i * 420, () => {
    FX.burst(rand(250, 1350), rand(180, 520), colors, 16, 200, i % 2 ? 'star' : 'petal'); Sound.twinkle();
    if (i % 2) lumi.happy(true); else lumi.spin();
  });
  await ctx.wait(6000);
  App.go('map', { justDone: key, first });
}
