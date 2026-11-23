// Capítulo 2. Mapa de la segunda isla: cuatro lugares, el faro en el medio (la fiesta) y, al final, el taller.
// Igual que en el capítulo 1: lo hecho tiene color y estrella, lo próximo brilla y lo que falta duerme bajo una nube.
const CH_TITLE = 'capítulo 2';
const SCENES = [
  { key: 'flores', x: 500, y: 650, art: 'flores' },
  { key: 'caracoles', x: 1100, y: 650, art: 'caracoles' },
  { key: 'tambores', x: 1100, y: 290, art: 'tambores' },
  { key: 'caminos', x: 500, y: 290, art: 'caminos' },
];
const FIESTA = { key: 'fiesta', x: 800, y: 470, art: 'faro' };
const TALLER = { key: 'taller', x: 1440, y: 700, art: 'taller', r: 120 };
const SCENE_NAMES = { flores: 'Flores que cantan', caracoles: 'Caracoles', tambores: 'Tambores', caminos: 'Caminos de luz', fiesta: 'Fiesta del faro', taller: 'Taller de dibujo' };
const sceneReady = k => !!Screens[k];

const SPOT_ART = {
  flores: p => `<ellipse cy="48" rx="128" ry="40" ${fa('#a3dc7e', p)}/>
<g transform="translate(-58 48) scale(.6)">${ART.flower('daisy', '#ff6f91', 120, p)}</g><g transform="translate(58 50) scale(.6)">${ART.flower('round', '#6cc6ff', 104, p)}</g>
<g transform="translate(0 44) scale(.7)">${ART.flower('tulip', '#ffd84a', 150, p)}</g>
<path d="M-96 -58 v-26 l18 -5 v24" ${sa('#8a6fd6', p)} stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-101" cy="-58" rx="8" ry="6" ${fa('#8a6fd6', p)}/><ellipse cx="-83" cy="-63" rx="8" ry="6" ${fa('#8a6fd6', p)}/>
<path d="M92 -76 v-24" ${sa('#ff8fb1', p)} stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="87" cy="-76" rx="8" ry="6" ${fa('#ff8fb1', p)}/>`,
  caracoles: p => `<ellipse cy="46" rx="132" ry="42" ${fa('#ffe2a8', p)}/>
<g transform="translate(-58 30) scale(.55)">${shellArt('#ff9fc4', p).replace('<g class="knocks">', '<g class="knocks" opacity="0">')}</g><g transform="translate(56 34) scale(.5)">${shellArt('#b9a2ff', p).replace('<g class="knocks">', '<g class="knocks" opacity="0">')}</g>
<g transform="translate(0 -10) scale(.62)"><g transform="translate(0 -40)"><circle r="44" fill="url(#gWhite)" opacity=".8"/><circle r="19" ${fa('#fff8fc', p)} stroke="#f0d6ea" stroke-width="3"/></g>${shellArt('#ffb35c', p).replace('<g class="knocks">', '<g class="knocks" opacity="0">').replace('class="top"', 'class="top" transform="translate(0 -46) scale(1 .5)"')}</g>`,
  tambores: p => `<ellipse cy="50" rx="128" ry="38" ${fa('#a3dc7e', p)}/>
<g transform="translate(-48 0) scale(.62)">${drumArt('#ff8b7b', p)}</g><g transform="translate(52 10) scale(.52)">${drumArt('#6cc6ff', p)}</g>
<path d="M-92 -60 v-26 l18 -5 v24" ${sa('#ff8b7b', p)} stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-97" cy="-60" rx="8" ry="6" ${fa('#ff8b7b', p)}/><ellipse cx="-79" cy="-65" rx="8" ry="6" ${fa('#ff8b7b', p)}/>
<path d="M100 -70 v-24" ${sa('#6cc6ff', p)} stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="95" cy="-70" rx="8" ry="6" ${fa('#6cc6ff', p)}/>`,
  caminos: p => `<ellipse cy="48" rx="128" ry="38" ${fa('#a3dc7e', p)}/><circle cy="-46" r="90" ${fa('#46529a', p)}/>
<path d="M-96 40 C-60 -10 -10 40 20 -10 C40 -44 70 -40 84 -70" ${sa('#fff3a0', p)} stroke-width="8" stroke-dasharray="2 18" stroke-linecap="round" fill="none"/>
<g transform="translate(-64 -60) scale(.7)">${p ? fireflyArt(false).replace(/fill="#b9b6c6"/, 'data-p="#fff26a"').replace(/fill="#8f8aa3"/g, 'data-p="#5b4a8a"') : fireflyArt(true)}</g>
<g transform="translate(84 -92) scale(.6)">${p ? fireflyArt(false).replace(/fill="#b9b6c6"/, 'data-p="#fff26a"').replace(/fill="#8f8aa3"/g, 'data-p="#5b4a8a"') : fireflyArt(true)}</g>`,
  faro: p => `<ellipse cy="64" rx="150" ry="40" ${fa('#a3dc7e', p)}/><g transform="translate(0 70) scale(.62)">${faroArt(p)}</g>`,
  taller: p => `<rect x="-58" y="-74" width="116" height="94" rx="10" ${fa('#fffaf0', p)} stroke="#d8c7a8" stroke-width="4"/>
<path d="M-40 0 C-20 -40 0 10 20 -30 C30 -48 40 -40 44 -50" ${sa('#ff6f91', p)} stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="-24" cy="-44" r="12" ${fa('#ffd84a', p)}/><path d="M-36 30 L-54 74 M36 30 L54 74 M0 20 L0 74" ${sa('#a8703f', p)} stroke-width="7" stroke-linecap="round"/>
${['#6cc6ff', '#86d36f', '#b78cff'].map((c, i) => `<rect x="${-64 + i * 46}" y="70" width="34" height="14" rx="7" ${fa(c, p)} transform="rotate(${-12 + i * 10} ${-47 + i * 46} 77)"/>`).join('')}`,
};

function bgMap2(id) {
  let waves = '';
  for (let i = 0; i < 14; i++) waves += `<g transform="translate(${rand(-150, 1750).toFixed(0)} ${[rand(40, 110), rand(800, 880)][i % 2].toFixed(0)})"><g class="ripple" style="--d:-${rand(0, 5).toFixed(1)}s"><path d="M-26 0 q13 -9 26 0 q13 9 26 0" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`;
  const isl = 'M250 520 C215 330 370 165 620 150 C760 118 900 150 1010 135 C1210 122 1350 230 1366 405 C1382 560 1330 720 1160 792 C990 852 770 832 610 818 C420 800 280 700 250 520Z';
  const islet = 'M1318 712 C1330 640 1420 618 1490 636 C1560 654 1580 730 1540 772 C1500 808 1400 812 1350 786 C1324 770 1314 742 1318 712Z';
  return `<defs><radialGradient id="${id}sea" cx=".5" cy=".5" r=".75"><stop offset="0" data-p="#8fdcf0"/><stop offset="1" data-p="#4aaed3"/></radialGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}sea)"/>${waves}
<path d="${isl}" transform="translate(0 16)" data-p="#3f9cc2" opacity=".5"/><path d="${islet}" transform="translate(0 14)" data-p="#3f9cc2" opacity=".5"/>
<path d="${isl}" data-p="#f5dfaa"/><path d="${islet}" data-p="#f5dfaa"/>
<path d="${isl}" transform="translate(805 484) scale(.9) translate(-805 -484)" data-p="#8fd474"/>
<path d="M500 650 C660 770 940 770 1100 650 C1260 530 1260 410 1100 290 C940 180 660 180 500 290" fill="none" data-p="#fff6dc" data-pa="stroke" stroke-width="12" stroke-dasharray="2 26" stroke-linecap="round"/>
<path d="M1220 690 C1290 700 1330 704 1360 706" fill="none" data-p="#c79a62" data-pa="stroke" stroke-width="16" stroke-linecap="round"/>
<path d="M1226 682 L1226 700 M1262 686 L1262 704 M1298 690 L1298 708 M1334 694 L1334 712" data-p="#a8703f" data-pa="stroke" stroke-width="5" stroke-linecap="round"/>
${[[300, 470], [1316, 470], [800, 780], [800, 170]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle cx="-16" cy="0" r="20" data-p="#74c463"/><circle cx="14" cy="-6" r="24" data-p="#7fcd6c"/></g>`).join('')}
<g transform="translate(220 150)"><g class="drift">${ART.cloud(.8, true)}</g></g><g transform="translate(1400 120)"><g class="drift" style="--d:-12s">${ART.cloud(.6, true)}</g></g>`;
}

// Barquito para la llegada de Lumi.
const BOAT = `<path d="M-90 10 L90 10 L66 52 L-66 52Z" fill="#e0566a" stroke="#b8404f" stroke-width="4" stroke-linejoin="round"/><rect x="-72" y="18" width="144" height="10" fill="#fff" opacity=".8"/>
<path d="M0 10 L0 -120" stroke="#8a5a3a" stroke-width="7"/><path d="M6 -112 L70 -10 L6 -10Z" fill="#fffaf0" stroke="#e3d8c7" stroke-width="3"/>`;

Screens.map = (ctx, params) => {
  const prof = App.profile || (App.profile = Store.guest());
  const done = SCENES.map(s => Store.isDone(prof, s.key));
  const nDone = done.filter(Boolean).length;
  const fDone = Store.isDone(prof, 'fiesta');
  const all = [...SCENES, FIESTA, TALLER];
  const justI = all.findIndex(s => s.key === params.justDone);
  const fresh = justI >= 0 && params.first;
  const lvOf = k => .12 + .88 * k / 4;
  const bg = grp({}, L.world, bgMap2('mp'));
  Paint.scan(bg, { global: true, level: lvOf(fresh && justI < 4 ? nDone - 1 : nDone) });

  const nextI = done.indexOf(false);
  const spots = all.map((s, i) => {
    const isF = i === 4, isT = i === 5;
    const isDone = i < 4 ? done[i] : Store.isDone(prof, s.key);
    const isNext = isT ? fDone && !isDone : isF ? nextI === -1 && !isDone : i === nextI;
    const open = (isDone || isNext) && sceneReady(s.key);
    const r = s.r || 150;
    const g = grp({ transform: tr(s.x, s.y), class: 'spot' + (open ? ' open' : '') }, L.world);
    const glow = grp({ transform: 'translate(0 44)', opacity: isNext && open ? 1 : 0 }, g, `<g class="glowring"><ellipse rx="${r + 10}" ry="${r * .37}" fill="none" stroke="#fff3a0" stroke-width="10"/><ellipse rx="${r}" ry="${r * .33}" fill="url(#gGold)" opacity=".7"/></g>`);
    const pop = grp({}, g), lift = grp({ class: 'lift' }, pop);
    const art = grp({}, lift, SPOT_ART[s.art](true));
    const lit = isDone && !(fresh && i === justI);
    Paint.scan(art, { group: 's' + i, level: lit ? 1 : (isNext && open ? .35 : 0) });
    if (isF && (lit || nDone)) art.querySelectorAll('.sun-awake').forEach(e => e.setAttribute('opacity', lit ? 1 : 0));
    if (isF && lit) art.querySelectorAll('.sun-sleep').forEach(e => e.setAttribute('opacity', 0));
    // El faro se va encendiendo con cada lugar terminado.
    if (isF) grp({ transform: 'translate(0 -116)', opacity: lit ? 1 : nDone / 5 }, lift, `<g class="pulse"><circle r="90" fill="url(#gGold)"/></g>`);
    let fog = null, badge = null;
    if (!open) fog = grp({ transform: 'translate(0 -10)' }, lift, `<g class="float" style="--d:-${i}s"><g opacity=".96">${ART.cloud(isT ? 1.05 : 1.35)}</g><path d="M-38 4 q9 8 18 0 M20 4 q9 8 18 0" stroke="#a49cb8" stroke-width="5" fill="none" stroke-linecap="round"/>${CHEEK(-48, 20, 9)}${CHEEK(48, 20, 9)}</g>`);
    if (isDone && !isT) badge = grp({ transform: isF ? 'translate(-120 -150)' : 'translate(-100 -96)', opacity: fresh && i === justI ? 0 : 1 }, lift, ART.star(30));
    App.addTarget({
      x: s.x, y: isF ? s.y - 60 : s.y, r, kind: open ? (isNext ? 'next' : 'spot') : 'locked', hit: () => {
        if (open) {
          App.good(); Sound.chord();
          anim(pop, [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.08)' }], { duration: 400, easing: EB });
          FX.burst(s.x, s.y, ['#fff', '#ffd84a', '#ff9fd0'], 14, 180, 'star');
          lumi.move(ctx, s.x + (isT ? -110 : 60), s.y - 120, 600, 60); lumi.happy();
          App.busy = true; ctx.after(700, () => { App.busy = false; App.go(s.key); });
        } else {
          Sound.miss();
          if (fog) anim(fog, [{ transform: 'translate(0px,-10px)' }, { transform: 'translate(-14px,-10px)' }, { transform: 'translate(12px,-10px)' }, { transform: 'translate(-6px,-10px)' }, { transform: 'translate(0px,-10px)' }], { duration: 450, fill: 'none' });
          const nx = spots.find(q => q.isNext && q.open);
          if (nx) Guide.tap(nx.s.x, nx.s.y, 2);
        }
      },
    });
    return { s, g, glow, badge, isNext, open, i, art };
  });

  // Chico/a que está jugando: abajo a la izquierda.
  const badge = grp({ transform: tr(96, 806) }, L.world, ART.avatar(prof, 62));
  if (prof.name) grp({}, L.world, `<text x="172" y="808" dominant-baseline="middle" font-size="46" fill="${INK}" stroke="#fff" stroke-width="10" paint-order="stroke" stroke-linejoin="round">${escapeXml(prof.name)}</text>`);
  anim(badge, [{ opacity: 0 }, { opacity: 1 }], 600);

  const nx = spots.find(q => q.isNext && q.open);
  const homeOf = q => ({ x: q.s.x + (q.i === 5 ? -170 : 175), y: q.s.y - 70 });
  const home = nx || spots[justI] || spots[0];
  const lumi = new Lumi(L.world, homeOf(home).x, homeOf(home).y, .78);
  Sound.ambient(true);

  const hintNext = () => nx ? { x: nx.s.x, y: nx.s.y } : null;
  const firstVisit = !nDone && !params.justDone && !Store.isDone(prof, 'flores');
  if (fresh) {
    const sp = spots[justI];
    lumi.place(homeOf(sp).x, homeOf(sp).y);
    App.busy = true;
    (async () => {
      await ctx.wait(550);
      if (sp.badge) {
        Sound.whoosh();
        const b = sp.i === 4 ? { x: sp.s.x - 120, y: sp.s.y - 150 } : { x: sp.s.x - 100, y: sp.s.y - 96 };
        await FX.fly(`<g>${ART.star(46)}</g>`, 800, 90, b.x, b.y, 1100, 150);
        Sound.fanfare();
        sp.badge.setAttribute('opacity', 1);
        anim(sp.badge.firstElementChild, [{ transform: 'scale(1.8)' }, { transform: 'scale(1)' }], { duration: 500, easing: EB });
      } else Sound.chord();
      Paint.group('s' + justI, 1, 1300); Paint.global(lvOf(nDone), 1800);
      if (sp.i === 4) wake(sp.art);
      FX.burst(sp.s.x, sp.s.y, ['#ffd84a', '#fff', '#ff9fd0', '#86d36f'], 22, 230, 'star');
      lumi.happy(true);
      await ctx.wait(1400);
      App.busy = false;
      if (nx) { await lumi.move(ctx, homeOf(nx).x, homeOf(nx).y, 1100, 90); Guide.tap(nx.s.x, nx.s.y, 3); }
      App.lastGood = performance.now();
    })();
  } else if (firstVisit && nx) {
    // Llegada en barquito desde la isla del capítulo 1.
    App.busy = true;
    const boat = grp({}, L.world, BOAT);
    lumi.root.remove(); L.world.appendChild(lumi.root);
    const from = { x: -200, y: 660 }, to = { x: 150, y: 640 };
    (async () => {
      await ctx.tween(2600, e => { const x = lerp(from.x, to.x, e), y = lerp(from.y, to.y, e) + Math.sin(e * 12) * 6; boat.setAttribute('transform', tr(x, y)); lumi.place(x - 20, y - 52); }, Ease.out);
      Sound.splash();
      await lumi.move(ctx, homeOf(nx).x, homeOf(nx).y, 900, 120);
      lumi.happy(true); Sound.chord();
      App.busy = false; App.lastGood = performance.now();
      Guide.tap(nx.s.x, nx.s.y, 3);
    })();
  } else if (nx) ctx.after(1100, () => Guide.tap(nx.s.x, nx.s.y, 3));

  return { onMove: p => lumi.look(p.x, p.y), hint: hintNext, hintDelay: 7000, onMiss: () => { } };
};
