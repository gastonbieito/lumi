// Mapa de la isla: cuatro lugares + la fiesta. Sin texto: lo hecho tiene color y estrella,
// lo próximo brilla y lo que falta está tapado por una nube dormida.
const SCENES = [
  { key: 'semillas', x: 470, y: 640, art: 'jardin' },
  { key: 'hambre', x: 1130, y: 640, art: 'arbol' },
  { key: 'burbujas', x: 1130, y: 290, art: 'laguna' },
  { key: 'noche', x: 470, y: 290, art: 'noche' },
];
const FIESTA = { key: 'fiesta', x: 800, y: 468, art: 'fiesta' };
const sceneReady = k => !!Screens[k];

const SPOT_ART = {
  jardin: p => `<ellipse cy="48" rx="128" ry="40" ${fa('#a3dc7e', p)}/><ellipse cy="46" rx="88" ry="22" ${fa('#b98457', p)}/>
<g transform="translate(-54 48) scale(.62)">${ART.flower('daisy', '#ff8fb1', 112, p)}</g><g transform="translate(54 50) scale(.62)">${ART.flower('tulip', '#ffb35c', 100, p)}</g>
<g transform="translate(0 42) scale(.72)">${ART.flower('round', '#b48cff', 140, p)}</g>`,
  arbol: p => `<ellipse cy="52" rx="128" ry="38" ${fa('#a3dc7e', p)}/><path d="M-15 52 C-12 20 -12 0 -9 -20 L9 -20 C12 0 12 20 15 52Z" ${fa('#a8703f', p)}/>
<circle cx="-42" cy="-38" r="46" ${fa('#5fbf5a', p)}/><circle cx="40" cy="-44" r="50" ${fa('#6ccc60', p)}/><circle cx="0" cy="-82" r="50" ${fa('#7bd56b', p)}/>
${[[-48, -30, '#ff6b6b'], [30, -18, '#ffb33d'], [6, -96, '#ff6b6b'], [54, -62, '#b07cff'], [-24, -72, '#ffd84a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="12" ${fa(c, p)}/><circle cx="${x - 4}" cy="${y - 4}" r="3.5" fill="#fff" opacity=".6"/>`).join('')}`,
  laguna: p => `<ellipse cy="42" rx="132" ry="50" ${fa('#a3dc7e', p)}/><ellipse cy="38" rx="106" ry="38" ${fa('#58bde0', p)}/><ellipse cy="32" rx="80" ry="24" ${fa('#8fdcf2', p)}/>
<ellipse cx="54" cy="46" rx="22" ry="9" ${fa('#6cc65a', p)}/><path d="M-60 36 q12 -8 24 0" ${sa('#ffffff', p)} stroke-width="4" fill="none" stroke-linecap="round"/>
${[[-34, -12, 15, '0s'], [-6, -52, 11, '-1.5s'], [22, -22, 9, '-3s']].map(([x, y, r, d]) => `<g transform="translate(${x} ${y})"><g class="float" style="--d:${d}"><circle r="${r}" ${fa('#d4f4ff', p)} stroke="#fff" stroke-width="3"/><circle cx="${-r * .35}" cy="${-r * .35}" r="${r * .25}" fill="#fff"/></g></g>`).join('')}`,
  noche: p => `<ellipse cy="48" rx="128" ry="38" ${fa('#a3dc7e', p)}/><circle cy="-50" r="88" ${fa('#46529a', p)}/>
<path d="M-112 50 C-80 -30 80 -30 112 50Z" ${fa('#7c86c9', p)}/><path d="M-40 -4 C-10 -20 20 -16 50 8" ${sa('#98a1d8', p)} stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="-22" cy="-84" r="30" ${fa('#fff2a8', p)}/><circle cx="-8" cy="-94" r="26" ${fa('#46529a', p)}/>
${[[36, -100, 13], [52, -56, 9], [-56, -46, 10], [12, -40, 7]].map(([x, y, r]) => `<path d="${starPath(r, r * .45)}" transform="translate(${x} ${y})" ${fa('#ffd84a', p)}/>`).join('')}`,
  fiesta: p => `<ellipse cy="46" rx="124" ry="40" ${fa('#f3d9a4', p)}/><ellipse cy="42" rx="92" ry="26" ${fa('#ffeac0', p)}/>
<rect x="-84" y="-66" width="8" height="110" rx="4" ${fa('#a8703f', p)}/><rect x="76" y="-66" width="8" height="110" rx="4" ${fa('#a8703f', p)}/>
<path d="M-80 -60 Q0 -12 80 -60" ${sa('#ffffff', p)} stroke-width="3" fill="none"/>
${[-60, -36, -12, 12, 36, 60].map((x, i) => { const y = -60 + 48 * (1 - Math.pow(x / 80, 2)) * .98; return `<path d="M${x - 10} ${y - 4} L${x + 10} ${y - 4} L${x} ${y + 18}Z" ${fa(['#ff8fb1', '#ffd84a', '#6cc6ff', '#86d36f', '#b78cff', '#ffb25b'][i], p)}/>`; }).join('')}
<rect x="-44" y="2" width="88" height="38" rx="8" ${fa('#ff9fc4', p)}/><rect x="-30" y="-26" width="60" height="30" rx="7" ${fa('#ffd1e3', p)}/>
<path d="M-44 14 q11 10 22 0 q11 10 22 0 q11 10 22 0 q11 10 22 0" ${sa('#ffffff', p)} stroke-width="4" fill="none"/>
<rect x="-3" y="-46" width="6" height="20" rx="3" ${fa('#8fd3f4', p)}/><g transform="translate(0 -52)"><g class="pulse"><ellipse rx="6" ry="9" fill="#ffcf4a"/></g></g>`,
};

function bgMap(id) {
  let waves = '';
  for (let i = 0; i < 14; i++) waves += `<g transform="translate(${rand(-150, 1750).toFixed(0)} ${[rand(40, 120), rand(780, 880)][i % 2].toFixed(0)})"><g class="ripple" style="--d:-${rand(0, 5).toFixed(1)}s"><path d="M-26 0 q13 -9 26 0 q13 9 26 0" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`;
  const isl = 'M230 470 C200 260 420 135 700 145 C900 115 1160 125 1310 230 C1450 330 1460 570 1345 695 C1235 815 985 835 800 825 C560 835 330 805 250 685 C215 625 235 545 230 470Z';
  return `<defs><radialGradient id="${id}sea" cx=".5" cy=".5" r=".75"><stop offset="0" data-p="#8fdcf0"/><stop offset="1" data-p="#4aaed3"/></radialGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}sea)"/>${waves}
<path d="${isl}" transform="translate(0 16)" data-p="#3f9cc2" opacity=".5"/>
<path d="${isl}" data-p="#f5dfaa"/>
<path d="${isl}" transform="translate(800 482) scale(.9) translate(-800 -482)" data-p="#8fd474"/>
<path d="M470 640 C640 760 960 760 1130 640 C1290 520 1290 400 1130 290 C960 180 640 180 470 290" fill="none" data-p="#fff6dc" data-pa="stroke" stroke-width="12" stroke-dasharray="2 26" stroke-linecap="round"/>
${[[300, 470], [1300, 470], [800, 760], [800, 200]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle cx="-16" cy="0" r="20" data-p="#74c463"/><circle cx="14" cy="-6" r="24" data-p="#7fcd6c"/></g>`).join('')}
<g transform="translate(240 160)"><g class="drift">${ART.cloud(.8, true)}</g></g><g transform="translate(1390 800)"><g class="drift" style="--d:-12s">${ART.cloud(.7, true)}</g></g>`;
}

Screens.map = (ctx, params) => {
  const prof = App.profile || (App.profile = Store.guest());
  const done = SCENES.map(s => Store.isDone(prof, s.key));
  const nDone = done.filter(Boolean).length;
  const all = [...SCENES, FIESTA];
  const justI = all.findIndex(s => s.key === params.justDone);
  const fresh = justI >= 0 && params.first;
  const lvOf = k => .12 + .88 * k / 4;
  const bg = grp({}, L.world, bgMap('mp'));
  Paint.scan(bg, { global: true, level: lvOf(fresh && justI < 4 ? nDone - 1 : nDone) });

  const nextI = done.indexOf(false);
  const spots = all.map((s, i) => {
    const isF = i === 4;
    const isDone = isF ? Store.isDone(prof, 'fiesta') : done[i];
    const isNext = isF ? nextI === -1 && !isDone : i === nextI;
    const open = (isDone || isNext) && sceneReady(s.key);
    const g = grp({ transform: tr(s.x, s.y), class: 'spot' + (open ? ' open' : '') }, L.world);
    const glow = grp({ transform: 'translate(0 44)', opacity: isNext && open ? 1 : 0 }, g, `<g class="glowring"><ellipse rx="160" ry="56" fill="none" stroke="#fff3a0" stroke-width="10"/><ellipse rx="150" ry="50" fill="url(#gGold)" opacity=".7"/></g>`);
    const pop = grp({}, g), lift = grp({ class: 'lift' }, pop);
    const art = grp({}, lift, SPOT_ART[s.art](true));
    Paint.scan(art, { group: 's' + i, level: isDone && !(fresh && i === justI) ? 1 : (isNext && open ? .35 : 0) });
    let fog = null, badge = null;
    if (!open) fog = grp({ transform: 'translate(0 -10)' }, lift, `<g class="float" style="--d:-${i}s"><g opacity=".96">${ART.cloud(1.35)}</g><path d="M-38 4 q9 8 18 0 M20 4 q9 8 18 0" stroke="#a49cb8" stroke-width="5" fill="none" stroke-linecap="round"/>${CHEEK(-48, 20, 9)}${CHEEK(48, 20, 9)}</g>`);
    if (isDone) badge = grp({ transform: 'translate(-100 -96)', opacity: fresh && i === justI ? 0 : 1 }, lift, ART.star(30));
    App.addTarget({
      x: s.x, y: s.y, r: 150, kind: open ? (isNext ? 'next' : 'spot') : 'locked', hit: () => {
        if (open) {
          App.good(); Sound.chord();
          anim(pop, [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.08)' }], { duration: 400, easing: EB });
          FX.burst(s.x, s.y, ['#fff', '#ffd84a', '#ff9fd0'], 14, 180, 'star');
          lumi.move(ctx, s.x + 60, s.y - 120, 600, 60); lumi.happy();
          App.busy = true; ctx.after(700, () => { App.busy = false; App.go(s.key); });
        } else {
          Sound.miss();
          if (fog) anim(fog, [{ transform: 'translate(0px,-10px)' }, { transform: 'translate(-14px,-10px)' }, { transform: 'translate(12px,-10px)' }, { transform: 'translate(-6px,-10px)' }, { transform: 'translate(0px,-10px)' }], { duration: 450, fill: 'none' });
          const nx = spots.find(q => q.isNext && q.open);
          if (nx) Guide.tap(nx.s.x, nx.s.y, 2);
        }
      },
    });
    return { s, g, glow, badge, isNext, open, i };
  });

  // Chico/a que está jugando: abajo a la izquierda.
  const badge = grp({ transform: tr(96, 806) }, L.world, ART.avatar(prof, 62));
  if (prof.name) grp({}, L.world, `<text x="172" y="808" dominant-baseline="middle" font-size="46" fill="${INK}" stroke="#fff" stroke-width="10" paint-order="stroke" stroke-linejoin="round">${escapeXml(prof.name)}</text>`);
  anim(badge, [{ opacity: 0 }, { opacity: 1 }], 600);

  const nx = spots.find(q => q.isNext && q.open);
  const home = nx || spots[justI] || spots[0];
  const lumi = new Lumi(L.world, home.s.x + 175, home.s.y - 70, .78);
  Sound.ambient(true);

  const hintNext = () => nx ? { x: nx.s.x, y: nx.s.y } : null;
  if (fresh) {
    const sp = spots[justI];
    lumi.place(sp.s.x + 175, sp.s.y - 70);
    App.busy = true;
    (async () => {
      await ctx.wait(550);
      Sound.whoosh();
      await FX.fly(`<g>${ART.star(46)}</g>`, 800, 90, sp.s.x - 100, sp.s.y - 96, 1100, 150);
      Sound.fanfare();
      sp.badge.setAttribute('opacity', 1);
      anim(sp.badge.firstElementChild, [{ transform: 'scale(1.8)' }, { transform: 'scale(1)' }], { duration: 500, easing: EB });
      Paint.group('s' + justI, 1, 1300); Paint.global(lvOf(nDone), 1800);
      FX.burst(sp.s.x, sp.s.y, ['#ffd84a', '#fff', '#ff9fd0', '#86d36f'], 22, 230, 'star');
      lumi.happy(true);
      await ctx.wait(1400);
      App.busy = false;
      if (nx) { await lumi.move(ctx, nx.s.x + 175, nx.s.y - 70, 1100, 90); Guide.tap(nx.s.x, nx.s.y, 3); }
      App.lastGood = performance.now();
    })();
  } else if (nx) ctx.after(1100, () => Guide.tap(nx.s.x, nx.s.y, 3));

  return { onMove: p => lumi.look(p.x, p.y), hint: hintNext, hintDelay: 7000, onMiss: () => { } };
};
