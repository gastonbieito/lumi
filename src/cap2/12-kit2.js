// Capítulo 2: sonidos y dibujos que comparten las escenas (faro, caracoles, tambores, teclado, luciérnagas).

// Notas de las flores que cantan (do, re, mi, sol, la).
const SING = [523.25, 587.33, 659.25, 783.99, 880];
Object.assign(Sound, {
  toc(k = 0) { this.noise(.07, 1900 + k * 500, 1200, .2); this.note(640 + k * 160, { dur: .09, vol: .12, type: 'triangle' }); },
  open() { [0, 2, 4, 7].forEach((k, i) => this.bell(PENTA[k % PENTA.length], i * .07, .12)); this.noise(.4, 3000, 8000, .03, .1); },
  drum(i) {
    const f = [98, 131, 175, 220][i % 4];
    this.note(f * 2.2, { dur: .32, vol: .38, slide: f });
    this.noise(.1, 1200, 300, .14);
  },
  jump() { this.note(280, { dur: .26, vol: .17, slide: 760 }); },
  land(i) { this.bell(PENTA[(2 + i) % PENTA.length], 0, .12, .7); this.noise(.18, 700, 300, .05); },
  splash() { this.noise(.5, 2400, 500, .1); },
  sing(i, t = 0) { const f = SING[i % 5]; this.bell(f, t, .15, 1.2); this.note(f, { t, dur: .8, vol: .09, attack: .04 }); },
  chime(i) { this.bell(PENTA[i % PENTA.length], 0, .09, .5); },
  boing() { this.note(240, { dur: .22, vol: .1, slide: 150 }); },
  crayon(y) { this.noise(.06, 1600 + (900 - y) * 3, 2600, .025); },
  stamp() { this.note(rand(500, 700), { dur: .16, vol: .16, slide: 1200 }); this.bell(pick(PENTA.slice(5)), .04, .06, .5); },
});

// Faro con cara dormida (la cara usa las mismas clases que el sol: wake() lo despierta).
function faroArt(p, s = 1) {
  const hw = y => 48 - 16 * ((-20 - y) / 210);
  const band = (y1, y2, c) => `<path d="M${-hw(y1)} ${y1} L${-hw(y2)} ${y2} L${hw(y2)} ${y2} L${hw(y1)} ${y1}Z" ${fa(c, p)}/>`;
  return `<g transform="scale(${s})">
<path d="M-132 4 C-120 -30 -76 -46 -34 -40 C10 -52 74 -46 116 -22 C130 -12 134 4 134 4Z" ${fa('#a3958a', p)}/>
<path d="M-90 -10 C-70 -30 -40 -34 -10 -30" ${sa('#c2b6aa', p)} stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M-48 -20 L-32 -230 L32 -230 L48 -20Z" ${fa('#fffaf0', p)}/>
${band(-62, -100, '#ef6b6b')}${band(-142, -180, '#ef6b6b')}
<path d="M-13 -20 L-13 -48 A13 13 0 0 1 13 -48 L13 -20Z" ${fa('#9a6a45', p)}/>
<circle cy="-121" r="10" ${fa('#8fd3f4', p)} stroke="#fff" stroke-width="3"/>
<rect x="-54" y="-242" width="108" height="14" rx="7" ${fa('#5b5a86', p)}/>
<rect x="-30" y="-298" width="60" height="58" rx="10" ${fa('#fff3a0', p)} class="faro-glass"/>
<path d="M-10 -298 L-10 -240 M10 -298 L10 -240" ${sa('#5b5a86', p)} stroke-width="4"/>
<path d="M-42 -296 L0 -338 L42 -296Z" ${fa('#e0566a', p)}/><circle cy="-342" r="8" ${fa('#ffd84a', p)}/>
<g transform="translate(0 -268)"><g class="sun-sleep"><path d="M-22 -2 q6 6 12 0 M10 -2 q6 6 12 0" stroke="#8a7240" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g class="sun-awake" opacity="0">${EYE(-15, -4, 6)}${EYE(15, -4, 6)}<path d="M-8 10 Q0 18 8 10" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g></g></g>`;
}

// Almeja: la tapa (clase "top") se levanta al abrirse y deja ver la perla.
function shellArt(c, p) {
  const sh = shade(c, -.22);
  let ridges = '';
  for (let i = -3; i <= 3; i++) ridges += `<path d="M0 6 L${i * 17} -54" stroke="${sh}" stroke-width="3" stroke-linecap="round" opacity=".45"/>`;
  return `<ellipse cy="34" rx="70" ry="13" fill="#000" opacity=".1"/>
<path d="M-64 2 C-64 36 64 36 64 2Z" ${fa(shade(c, -.1), p)} stroke="${sh}" stroke-width="3"/>
<g class="pearl" opacity="0"><circle cy="-4" r="40" fill="url(#gWhite)" opacity=".9"/><circle cy="-2" r="19" fill="#fff8fc" stroke="#f0d6ea" stroke-width="3"/><circle cx="-6" cy="-8" r="6" fill="#fff"/></g>
<g class="top"><path d="M-66 4 C-70 -40 -32 -64 0 -64 C32 -64 70 -40 66 4 C40 14 -40 14 -66 4Z" ${fa(c, p)} stroke="${sh}" stroke-width="3"/>${ridges}
<path d="M-20 -14 q6 6 12 0 M8 -14 q6 6 12 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>${CHEEK(-30, -4, 8)}${CHEEK(30, -4, 8)}</g>
<g class="knocks"><circle cx="-18" cy="-90" r="12" fill="#fff" opacity=".9" stroke="${sh}" stroke-width="3"/><circle cx="18" cy="-90" r="12" fill="#fff" opacity=".9" stroke="${sh}" stroke-width="3"/>
<circle class="k1" cx="-18" cy="-90" r="10" fill="#ffc93c" opacity="0"/><circle class="k2" cx="18" cy="-90" r="10" fill="#ffc93c" opacity="0"/></g>`;
}

// Bongó con parche.
function drumArt(c, p) {
  const sh = shade(c, -.25);
  let lace = '';
  for (let i = 0; i < 6; i++) { const x = -52 + i * 21; lace += `<path d="M${x} -46 L${x + 10} 40 L${x + 21} -46" stroke="#fff" stroke-width="3" fill="none" opacity=".75"/>`; }
  return `<ellipse cy="64" rx="70" ry="14" fill="#000" opacity=".12"/>
<path d="M-62 -50 L-54 48 C-30 64 30 64 54 48 L62 -50Z" ${fa(c, p)} stroke="${sh}" stroke-width="4"/>${lace}
<ellipse cy="-50" rx="62" ry="20" ${fa('#fff1d6', p)} stroke="${sh}" stroke-width="5"/>
<ellipse cy="-52" rx="40" ry="11" fill="#fff" opacity=".45"/>`;
}

// Luciérnaga: dormida (gris) o despierta (con la colita encendida).
function fireflyArt(awake) {
  return `${awake ? '<g class="pulse"><circle cx="0" cy="18" r="46" fill="url(#gGold)"/></g>' : ''}
<g class="${awake ? 'flap' : ''}"><ellipse cx="-16" cy="-16" rx="16" ry="24" fill="#e6f4ff" opacity=".8" transform="rotate(-30 -16 -16)"/></g>
<g transform="scale(-1 1)"><g class="${awake ? 'flap' : ''}"><ellipse cx="-16" cy="-16" rx="16" ry="24" fill="#e6f4ff" opacity=".8" transform="rotate(-30 -16 -16)"/></g></g>
<ellipse cy="18" rx="15" ry="17" fill="${awake ? '#fff26a' : '#b9b6c6'}"/>
<circle cy="-6" r="17" fill="${awake ? '#5b4a8a' : '#8f8aa3'}"/>
${awake ? `${EYE(-6, -8, 4)}${EYE(6, -8, 4)}` : `<path d="M-10 -7 q4 4 8 0 M2 -7 q4 4 8 0" stroke="#4d4860" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}
<path d="M-5 -22 q-6 -12 -12 -14 M5 -22 q6 -12 12 -14" stroke="${awake ? '#5b4a8a' : '#8f8aa3'}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

// Teclado dibujado. modo 'todo' (cualquier tecla), 'espacio' o 'flechas'.
// Devuelve el dibujo y las teclas (en coordenadas locales) para resaltarlas o tocarlas en tablet.
function keyboardArt(mode) {
  const keys = [];
  let html = '';
  const key = (x, y, w, h, k, on, label) => {
    keys.push({ x: x + w / 2, y: y + h / 2, w, h, key: k, on });
    const fill = on ? '#fffdf5' : '#e9e4f0', st = on ? '#ffc93c' : '#cfc6dc';
    html += `<g class="${on ? 'kon' : ''}" data-k="${k}"><rect x="${x}" y="${y + 5}" width="${w}" height="${h}" rx="${Math.min(12, h * .25)}" fill="${on ? '#e8a92b' : '#b8aecb'}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(12, h * .25)}" fill="${fill}" stroke="${st}" stroke-width="${on ? 4 : 2}"/>${label ? label(x + w / 2, y + h / 2) : ''}</g>`;
  };
  if (mode === 'flechas') {
    const s = 96, g = 12;
    html += `<rect x="${-1.5 * s - 2 * g}" y="${-s - g * 2}" width="${3 * s + 4 * g}" height="${2 * s + 3 * g}" rx="26" fill="#5b5a86" opacity=".9"/>`;
    const lbl = rot => (cx, cy) => `<path d="M-22 0 L10 -24 L10 -10 L26 -10 L26 10 L10 10 L10 24Z" transform="translate(${cx} ${cy}) rotate(${rot})" fill="${INK}"/>`;
    key(-s / 2, -s - g / 2, s, s - 6, 'ArrowUp', false, lbl(90));
    key(-1.5 * s - g, g / 2, s, s - 6, 'ArrowLeft', true, lbl(0));
    key(-s / 2, g / 2, s, s - 6, 'ArrowDown', false, lbl(-90));
    key(s / 2 + g, g / 2, s, s - 6, 'ArrowRight', true, lbl(180));
    return { html, keys };
  }
  const kw = 40, g = 7, rows = [10, 9, 7];
  const W = 10 * kw + 9 * g + 36;
  html += `<rect x="${-W / 2}" y="-104" width="${W}" height="${4 * kw + 3 * g + 36}" rx="22" fill="#5b5a86" opacity=".9"/>`;
  rows.forEach((n, r) => {
    const rw = n * kw + (n - 1) * g;
    for (let i = 0; i < n; i++) key(-rw / 2 + i * (kw + g), -86 + r * (kw + g), kw, kw, 'abcdefghijklmnopqrstuvwxyz'[r * 10 + i] || 'z', mode === 'todo');
  });
  key(-130, -86 + 3 * (kw + g), 260, kw, ' ', true);
  for (const x of [-200, -164, 140, 176]) key(x, -86 + 3 * (kw + g), 30, kw, 'x', mode === 'todo');
  return { html, keys };
}

// Pantalla en tablet: tocar las teclas dibujadas funciona como apretarlas.
// En la compu, tocar el dibujo solo muestra con la manito que se usa el teclado de verdad.
function makeKeyboard(ctx, layer, x, y, s, mode, onKey) {
  const g = grp({ transform: tr(x, y, s) }, layer);
  const kb = keyboardArt(mode);
  const inner = grp({}, g, kb.html);
  anim(inner, [{ transform: 'translateY(240px)', opacity: 0 }, { transform: 'translateY(0px)', opacity: 1 }], { duration: 600, easing: EB });
  const ons = kb.keys.filter(k => k.on);
  ctx.every(1400, () => inner.querySelectorAll('.kon > rect:nth-child(2)').forEach(r => anim(r, [{ fill: '#fffdf5' }, { fill: '#ffe7a0' }, { fill: '#fffdf5' }], { duration: 700, fill: 'none' })));
  const targets = [];
  const press = (k) => {
    const e = [...inner.querySelectorAll('[data-k]')].find(q => q.dataset.k === k.key);
    if (e) anim(e, [{ transform: 'translateY(0px)' }, { transform: 'translateY(5px)' }, { transform: 'translateY(0px)' }], { duration: 160, fill: 'none' });
  };
  for (const k of kb.keys) {
    const t = App.addTarget({ x: x + k.x * s, y: y + k.y * s, w: k.w * s + 8, h: k.h * s + 8, prio: 2, kind: 'tecla', hit: () => {
      if (App.touch) { press(k); onKey(k.key); }
      else { Sound.tap(); hintKey(); }
    } });
    targets.push(t);
  }
  // Todo el teclado como blanco grande (prioridad baja): en tablet, con "cualquier tecla", vale tocar en cualquier parte.
  const xs = kb.keys.map(k => k.x), ys = kb.keys.map(k => k.y);
  const fx = (Math.min(...xs) + Math.max(...xs)) / 2, fy = (Math.min(...ys) + Math.max(...ys)) / 2;
  targets.push(App.addTarget({ x: x + fx * s, y: y + fy * s, w: (Math.max(...xs) - Math.min(...xs) + 90) * s, h: (Math.max(...ys) - Math.min(...ys) + 90) * s, prio: 1, kind: 'teclado', hit: () => {
    if (App.touch && mode === 'todo') { const k = pick(kb.keys); press(k); onKey(k.key); } else { Sound.tap(); hintKey(); }
  } }));
  const center = ons.length ? ons[Math.floor(ons.length / 2)] : kb.keys[0];
  function hintKey(k = center) { Guide.tap(x + k.x * s, y + k.y * s, 2); }
  return {
    g, press: key => { const k = kb.keys.find(q => q.key === key) || (mode === 'todo' ? pick(kb.keys) : null); if (k) press(k); },
    hint: hintKey, keyAt: key => kb.keys.find(q => q.key === key),
    pos: key => { const k = kb.keys.find(q => q.key === key) || center; return { x: x + k.x * s, y: y + k.y * s }; },
    remove() { targets.forEach(t => App.removeTarget(t)); anim(inner, [{ transform: 'translateY(0px)', opacity: 1 }, { transform: 'translateY(240px)', opacity: 0 }], { duration: 450 }).onfinish = () => g.remove(); },
  };
}

// Fondo de playa: cielo, sol, mar arriba y arena abajo.
function bgBeach(id, extra = '') {
  const P = 'data-p';
  return `<defs>
<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#7fcdf5"/><stop offset=".7" ${P}="#c9eefa"/><stop offset="1" ${P}="#fff3d6"/></linearGradient>
<linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#5cc2df"/><stop offset="1" ${P}="#3aa0c8"/></linearGradient>
<linearGradient id="${id}sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${P}="#ffe2a8"/><stop offset="1" ${P}="#f4c77e"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}sky)"/>
${sunArt(1280, 170)}
<g transform="translate(330 140)"><g class="drift">${ART.cloud(.85, true)}</g></g><g transform="translate(820 90)"><g class="drift" style="--d:-16s">${ART.cloud(.55, true)}</g></g>
<rect x="-600" y="360" width="2800" height="300" fill="url(#${id}sea)"/>
<g fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"><g class="ripple"><path d="M80 400 q20 -8 40 0 M1460 410 q20 -8 40 0 M700 392 q20 -8 40 0"/></g><g class="ripple" style="--d:-2.5s"><path d="M300 430 q20 -8 40 0 M1100 440 q20 -8 40 0"/></g></g>
<path d="M-600 500 C-200 470 200 480 500 470 C800 460 1100 486 1400 474 C1700 462 1900 470 2200 480 L2200 1300 L-600 1300Z" fill="url(#${id}sand)"/>
<path d="M-600 500 C-200 470 200 480 500 470 C800 460 1100 486 1400 474 C1700 462 1900 470 2200 480" fill="none" ${P}="#ffffff" data-pa="stroke" data-gl="" stroke-width="10" opacity=".75"/>
${[[160, 760], [420, 840], [1240, 830], [1480, 740], [980, 880], [640, 760]].map(([x, y], i) => `<path d="M${x - 10} ${y} q10 -10 20 0" ${P}="#e0ad62" data-pa="stroke" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}${extra}`;
}

// Palmera.
function palmArt(x, y, s = 1, coconuts = true) {
  let leaves = '';
  for (const [a, c] of [[-150, '#4fae4f'], [-115, '#5cbd58'], [-65, '#5cbd58'], [-30, '#4fae4f'], [-90, '#6cc65a']]) leaves += `<path d="M0 0 C40 -30 110 -20 150 30 C100 0 50 0 0 8Z" data-p="${c}" transform="rotate(${a + 90})"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 C-6 -100 6 -200 30 -300 L50 -296 C28 -200 18 -100 16 0Z" data-p="#b98a55"/>
<path d="M-6 -60 h24 M-2 -130 h26 M8 -200 h26" data-p="#9a6e40" data-pa="stroke" stroke-width="5" stroke-linecap="round"/>
<g transform="translate(40 -298)">${leaves}${coconuts ? '<circle cx="-12" cy="16" r="15" data-p="#8a5a3a"/><circle cx="12" cy="20" r="15" data-p="#7a4d30"/>' : ''}</g></g>`;
}
