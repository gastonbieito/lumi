// Dibujos en SVG. Cada pieza está centrada en su (0,0), que también es su punto de giro/escala.
// Con p=true el color se escribe como data-p: la "pintura" lo arranca gris y lo va coloreando.
const INK = '#2d2240';
const fa = (c, p) => p ? `data-p="${c}"` : `fill="${c}"`;
const sa = (c, p) => p ? `data-p="${c}" data-pa="stroke"` : `stroke="${c}"`;
const EYE = (x, y, r = 8) => `<g transform="translate(${x} ${y})"><g class="blink"><circle r="${r}" fill="${INK}"/><circle cx="${r * .36}" cy="${-r * .38}" r="${r * .36}" fill="#fff"/></g></g>`;
const CHEEK = (x, y, rx = 10) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .6}" fill="#ff6f9c" opacity=".38"/>`;
const SMILE = (y = 20, w = 10, sw = 4) => `<path d="M${-w} ${y} Q0 ${y + w * 1.05} ${w} ${y}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
function starPath(R, r, n = 5) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1);
  }
  return d + 'Z';
}
const SPARK = 'M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z';

const ART = {
  defs() {
    return `
<radialGradient id="gLumi" cx=".38" cy=".34" r=".72"><stop offset="0" stop-color="#fffdf2"/><stop offset=".42" stop-color="#ffe98a"/><stop offset="1" stop-color="#ffb43a"/></radialGradient>
<radialGradient id="gLumiGlow"><stop offset="0" stop-color="#fff1a8" stop-opacity=".9"/><stop offset=".45" stop-color="#ffd66b" stop-opacity=".35"/><stop offset="1" stop-color="#ffc54d" stop-opacity="0"/></radialGradient>
<radialGradient id="gGold"><stop offset="0" stop-color="#fff6b8" stop-opacity="1"/><stop offset=".5" stop-color="#ffd54d" stop-opacity=".45"/><stop offset="1" stop-color="#ffc83d" stop-opacity="0"/></radialGradient>
<radialGradient id="gWhite"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="gStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff07a"/><stop offset="1" stop-color="#ffb627"/></linearGradient>`;
  },

  lumi() {
    return `
<g class="pulse" style="animation-duration:2.6s"><circle r="125" fill="url(#gLumiGlow)"/></g>
<g class="l-arms">
  <g transform="translate(-58 12)"><g class="arm"><ellipse rx="13" ry="10" fill="#ffc24a"/></g></g>
  <g transform="translate(58 12)"><g class="arm"><ellipse rx="13" ry="10" fill="#ffc24a"/></g></g>
</g>
<g transform="translate(-21 52)"><g class="foot"><ellipse cy="9" rx="15" ry="10" fill="#ff9d3b"/><ellipse cx="-4" cy="5" rx="6" ry="3" fill="#ffd08a"/></g></g>
<g transform="translate(21 52)"><g class="foot"><ellipse cy="9" rx="15" ry="10" fill="#ff9d3b"/><ellipse cx="-4" cy="5" rx="6" ry="3" fill="#ffd08a"/></g></g>
<path d="M-17 -50 C-24 -72 -6 -84 7 -100 C5 -82 25 -72 17 -50 Z" fill="url(#gLumi)"/>
<circle r="60" fill="url(#gLumi)"/>
<ellipse cx="-22" cy="-30" rx="17" ry="10" fill="#fff" opacity=".6" transform="rotate(-32 -22 -30)"/>
${CHEEK(-34, 16, 11)}${CHEEK(34, 16, 11)}
<g transform="translate(-20 -4)"><g class="blink"><ellipse rx="12.5" ry="16" fill="#fff"/><g class="pupil"><circle r="8.5" fill="${INK}"/><circle cx="3" cy="-4" r="3.2" fill="#fff"/></g></g></g>
<g transform="translate(20 -4)"><g class="blink"><ellipse rx="12.5" ry="16" fill="#fff"/><g class="pupil"><circle r="8.5" fill="${INK}"/><circle cx="3" cy="-4" r="3.2" fill="#fff"/></g></g></g>
<path class="mouth" d="M-11 19 Q0 30 11 19" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
<path class="mouth-o" d="M-14 16 Q0 42 14 16 Z" fill="#8a3550" stroke="${INK}" stroke-width="3" stroke-linejoin="round" opacity="0"/>`;
  },

  hand() {
    const s = `<rect x="-13" y="0" width="26" height="90" rx="13"/><rect x="-18" y="52" width="82" height="76" rx="28"/>
<rect x="9" y="45" width="25" height="46" rx="12.5"/><rect x="30" y="51" width="24" height="44" rx="12"/><rect x="47" y="60" width="20" height="38" rx="10"/>
<rect x="-42" y="70" width="27" height="48" rx="13.5" transform="rotate(-36 -28 94)"/>`;
    return `<g transform="rotate(-16)">
<g fill="${INK}" stroke="${INK}" stroke-width="10" stroke-linejoin="round">${s}</g>
<g fill="#fff">${s}</g>
<path d="M-5 12 Q0 9 5 12" stroke="#d8cfe6" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M16 64 L16 80 M37 70 L37 84" stroke="#e2dbec" stroke-width="3" stroke-linecap="round"/>
<rect x="-22" y="120" width="90" height="36" rx="13" fill="#b9a6ff" stroke="${INK}" stroke-width="5"/>
</g>`;
  },

  creature(t) {
    const W = (y1, y2) => `<path d="M-30 ${y1} L-60 ${y1 - 6} M-30 ${y2} L-60 ${y2 + 3} M30 ${y1} L60 ${y1 - 6} M30 ${y2} L60 ${y2 + 3}" stroke="${INK}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`;
    const C = {
      gato: `<path d="M-48 -12 L-41 -68 L-8 -44Z" fill="#f2a15a"/><path d="M-39 -24 L-36 -56 L-18 -42Z" fill="#ffc4c4"/>
<path d="M48 -12 L41 -68 L8 -44Z" fill="#f2a15a"/><path d="M39 -24 L36 -56 L18 -42Z" fill="#ffc4c4"/>
<circle r="51" fill="#f7b267"/><path d="M-11 -49 L-7 -35 M0 -51 L0 -35 M11 -49 L7 -35" stroke="#e0883a" stroke-width="5" stroke-linecap="round"/>
<ellipse cy="21" rx="27" ry="18" fill="#fff3e2"/>${EYE(-19, -4, 8.5)}${EYE(19, -4, 8.5)}
<path d="M-6 10 L6 10 L0 17Z" fill="#ff7f9e" stroke="#ff7f9e" stroke-width="3" stroke-linejoin="round"/>
<path d="M0 17 Q-6 27 -13 22 M0 17 Q6 27 13 22" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>${W(14, 21)}${CHEEK(-33, 10)}${CHEEK(33, 10)}`,
      conejo: `<g transform="rotate(-9)"><ellipse cx="-19" cy="-68" rx="15" ry="40" fill="#efe7f6"/><ellipse cx="-19" cy="-64" rx="7.5" ry="29" fill="#ffc0d6"/></g>
<g transform="rotate(9)"><ellipse cx="19" cy="-68" rx="15" ry="40" fill="#efe7f6"/><ellipse cx="19" cy="-64" rx="7.5" ry="29" fill="#ffc0d6"/></g>
<circle r="51" fill="#f3edf8"/>${EYE(-18, -6, 8.5)}${EYE(18, -6, 8.5)}
<ellipse cy="11" rx="7.5" ry="5.5" fill="#ff8fb0"/><path d="M0 16 Q-7 25 -13 20 M0 16 Q7 25 13 20" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
<rect x="-6.5" y="22" width="13" height="11" rx="3" fill="#fff" stroke="#d8cde4" stroke-width="2"/>${CHEEK(-32, 10)}${CHEEK(32, 10)}`,
      oso: `<circle cx="-37" cy="-37" r="19" fill="#a6714a"/><circle cx="-37" cy="-37" r="9.5" fill="#e8b98e"/><circle cx="37" cy="-37" r="19" fill="#a6714a"/><circle cx="37" cy="-37" r="9.5" fill="#e8b98e"/>
<circle r="52" fill="#b9825a"/><ellipse cy="19" rx="25" ry="19" fill="#f0d2ab"/>${EYE(-19, -8, 8.5)}${EYE(19, -8, 8.5)}
<ellipse cy="10" rx="10" ry="7" fill="${INK}"/>${SMILE(19, 7, 3.5)}${CHEEK(-34, 8)}${CHEEK(34, 8)}`,
      rana: `<circle cx="-27" cy="-33" r="21" fill="#74c75c"/><circle cx="27" cy="-33" r="21" fill="#74c75c"/>
<ellipse cy="7" rx="60" ry="45" fill="#84d36a"/><circle cx="-27" cy="-35" r="14" fill="#fff"/><circle cx="27" cy="-35" r="14" fill="#fff"/>
${EYE(-27, -35, 7.5)}${EYE(27, -35, 7.5)}<path d="M-30 10 Q0 40 30 10" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
${CHEEK(-40, 14, 12)}${CHEEK(40, 14, 12)}<circle cx="-8" cy="-6" r="2.5" fill="#4e9e3b"/><circle cx="8" cy="-6" r="2.5" fill="#4e9e3b"/>`,
      buho: `<path d="M-46 -26 L-40 -66 L-16 -44Z" fill="#8a6cc2"/><path d="M46 -26 L40 -66 L16 -44Z" fill="#8a6cc2"/>
<ellipse rx="53" ry="55" fill="#9d81d2"/><ellipse cy="27" rx="31" ry="24" fill="#ddd1f4"/>
<path d="M-12 22 q4 5 8 0 M4 22 q4 5 8 0 M-4 33 q4 5 8 0" stroke="#a991d8" stroke-width="3" fill="none" stroke-linecap="round"/>
<circle cx="-20" cy="-12" r="20" fill="#fff"/><circle cx="20" cy="-12" r="20" fill="#fff"/>${EYE(-20, -12, 10)}${EYE(20, -12, 10)}
<path d="M-8 3 L8 3 L0 15Z" fill="#ffae3b" stroke="#ffae3b" stroke-width="3" stroke-linejoin="round"/>`,
      pollito: `<path d="M-6 -47 C-16 -68 -2 -72 0 -56 C2 -74 18 -66 6 -47Z" fill="#ffc23a"/>
<ellipse cx="-49" cy="14" rx="12" ry="19" fill="#ffc93c" transform="rotate(22 -49 14)"/><ellipse cx="49" cy="14" rx="12" ry="19" fill="#ffc93c" transform="rotate(-22 49 14)"/>
<circle r="51" fill="#ffd94f"/>${EYE(-18, -6, 8.5)}${EYE(18, -6, 8.5)}
<path d="M-12 8 L12 8 L0 23Z" fill="#ff9b3d" stroke="#ff9b3d" stroke-width="4" stroke-linejoin="round"/>${CHEEK(-32, 12)}${CHEEK(32, 12)}`,
      zorro: `<path d="M-50 -8 L-43 -68 L-9 -40Z" fill="#ee8646"/><path d="M-42 -22 L-39 -55 L-21 -38Z" fill="#6a3d2a" opacity=".75"/>
<path d="M50 -8 L43 -68 L9 -40Z" fill="#ee8646"/><path d="M42 -22 L39 -55 L21 -38Z" fill="#6a3d2a" opacity=".75"/>
<path d="M-54 -16 C-54 -52 54 -52 54 -16 C54 16 24 44 0 52 C-24 44 -54 16 -54 -16Z" fill="#f39250"/>
<path d="M-54 -8 C-42 28 -14 44 0 52 C14 44 42 28 54 -8 C36 12 16 16 0 18 C-16 16 -36 12 -54 -8Z" fill="#fff5ea"/>
${EYE(-19, -14, 8.5)}${EYE(19, -14, 8.5)}<ellipse cy="42" rx="9" ry="7" fill="${INK}"/>${CHEEK(-34, 6)}${CHEEK(34, 6)}`,
      pinguino: `<circle r="52" fill="#3f4d6b"/><path d="M0 -26 C-14 -46 -46 -38 -42 -6 C-40 24 -18 44 0 46 C18 44 40 24 42 -6 C46 -38 14 -46 0 -26Z" fill="#fff"/>
${EYE(-16, -6, 8.5)}${EYE(16, -6, 8.5)}<path d="M-11 8 L11 8 L0 21Z" fill="#ffab3d" stroke="#ffab3d" stroke-width="4" stroke-linejoin="round"/>${CHEEK(-29, 13)}${CHEEK(29, 13)}`,
      raton: `<circle cx="-40" cy="-32" r="28" fill="#b4afc8"/><circle cx="-40" cy="-32" r="17" fill="#ffc4d6"/><circle cx="40" cy="-32" r="28" fill="#b4afc8"/><circle cx="40" cy="-32" r="17" fill="#ffc4d6"/>
<circle cy="5" r="47" fill="#c8c3da"/>${EYE(-16, -3, 8.5)}${EYE(16, -3, 8.5)}<ellipse cy="15" rx="8" ry="6" fill="#ff8fb0"/>${SMILE(23, 6, 3.2)}${W(15, 22)}${CHEEK(-30, 14)}${CHEEK(30, 14)}`,
      pulpo: `<g fill="none" stroke="#ff8cc6" stroke-width="15" stroke-linecap="round"><path d="M-36 18 C-46 42 -26 52 -36 66"/><path d="M-12 24 C-18 48 -2 54 -10 70"/><path d="M12 24 C18 48 2 54 10 70"/><path d="M36 18 C46 42 26 52 36 66"/></g>
<path d="M-50 20 C-58 -44 58 -44 50 20 C32 36 -32 36 -50 20Z" fill="#ff9fd0"/><circle cx="-22" cy="-24" r="6" fill="#ffc4e4"/><circle cx="26" cy="-30" r="4.5" fill="#ffc4e4"/>
${EYE(-17, -2, 8.5)}${EYE(17, -2, 8.5)}${SMILE(13, 8, 3.5)}${CHEEK(-32, 10)}${CHEEK(32, 10)}`,
    };
    return `<g style="--bd:${(-Math.random() * 5).toFixed(2)}s">${C[t] || C.pollito}</g>`;
  },

  avatar(p, r = 76) {
    const c = colorOf(p.color);
    return `<circle r="${r}" fill="${c}"/><circle r="${r * .86}" fill="${shade(c, .55)}"/><g transform="scale(${(r / 76 * .92).toFixed(3)}) translate(0 6)">${ART.creature(p.creature)}</g>`;
  },

  flowerParts(type, col, h, p) {
    const sh = shade(col, -.2);
    let petals = '';
    if (type === 'daisy') for (let i = 0; i < 8; i++) petals += `<ellipse cy="-27" rx="12.5" ry="22" ${fa(col, p)} stroke="${sh}" stroke-width="2" transform="rotate(${i * 45})"/>`;
    else if (type === 'round') for (let i = 0; i < 5; i++) petals += `<circle cy="-25" r="21" ${fa(col, p)} stroke="${sh}" stroke-width="2" transform="rotate(${i * 72})"/>`;
    else if (type === 'star') for (let i = 0; i < 6; i++) petals += `<path d="M0 -48 C17 -33 15 -16 0 -8 C-15 -16 -17 -33 0 -48Z" ${fa(col, p)} stroke="${sh}" stroke-width="2" transform="rotate(${i * 60})"/>`;
    const tulip = type === 'tulip';
    if (tulip) petals = `<path d="M-30 -10 C-34 -40 -20 -50 -14 -45 L0 -28 L14 -45 C20 -50 34 -40 30 -10 C26 18 -26 18 -30 -10Z" ${fa(col, p)} stroke="${sh}" stroke-width="2.5"/><path d="M-12 -30 L0 -16 L12 -30" stroke="${sh}" stroke-width="2.5" fill="none" opacity=".5"/>`;
    const face = `<path d="M-9 -3 q3.5 -4.5 7 0 M2 -3 q3.5 -4.5 7 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-5 4 q5 5 10 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>${CHEEK(-11, 3, 4)}${CHEEK(11, 3, 4)}`;
    const center = tulip ? `<g transform="translate(0 -4)">${face}</g>` : `<circle r="18" ${fa('#ffd34d', p)} stroke="#f0b52a" stroke-width="2.5"/>${face}`;
    const stem = `<path d="M0 0 C7 ${-h * .35} -7 ${-h * .65} 0 ${-h}" ${sa('#4fae4f', p)} stroke-width="9" fill="none" stroke-linecap="round"/>`;
    const leafA = `<path d="M0 0 C12 -22 40 -22 50 -9 C36 4 14 6 0 0Z" ${fa('#6cc65a', p)}/><path d="M4 -2 C18 -10 32 -11 44 -9" stroke="#4fae4f" stroke-width="2" fill="none" opacity=".6"/>`;
    return {
      stem, head: petals + center,
      leaves: [{ y: -h * .36, s: 1, svg: leafA }, { y: -h * .56, s: -1, svg: leafA }],
    };
  },
  // Flor completa (estática) para mapas y adornos.
  flower(type, col, h, p) {
    const f = ART.flowerParts(type, col, h, p);
    return f.stem + f.leaves.map(l => `<g transform="translate(0 ${l.y}) scale(${l.s} 1)">${l.svg}</g>`).join('') + `<g transform="translate(0 ${-h})">${f.head}</g>`;
  },

  seed(big) {
    let sp = '';
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .4; sp += `<path d="${SPARK}" fill="#fff6b0" transform="translate(${(Math.cos(a) * 48).toFixed(1)} ${(Math.sin(a) * 48).toFixed(1)}) scale(${i % 2 ? .7 : 1})"/>`; }
    return `<g class="pulse"><circle r="${big ? 80 : 66}" fill="url(#gGold)"/></g>
<g class="spin">${sp}</g>
<g transform="translate(0 6)"><path d="M0 -27 C17 -14 19 6 0 15 C-19 6 -17 -14 0 -27Z" fill="#b97d45" stroke="#7a4f27" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M-6 -15 C-3 -20 3 -20 5 -13" stroke="#e8bd85" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
  },

  cloud(s = 1, p) {
    return `<g transform="scale(${s})"><circle cx="-46" cy="4" r="32" ${fa('#ffffff', p)}/><circle cx="-4" cy="-18" r="44" ${fa('#ffffff', p)}/><circle cx="44" cy="0" r="34" ${fa('#ffffff', p)}/><rect x="-80" y="0" width="160" height="36" rx="18" ${fa('#ffffff', p)}/></g>`;
  },

  star(R = 40) {
    return `<path d="${starPath(R, R * .48)}" fill="url(#gStar)" stroke="#e59a12" stroke-width="${R * .09}" stroke-linejoin="round"/>
<path d="M${-R * .28} ${-R * .02} q${R * .1} ${-R * .12} ${R * .2} 0 M${R * .08} ${-R * .02} q${R * .1} ${-R * .12} ${R * .2} 0" stroke="${INK}" stroke-width="${R * .07}" fill="none" stroke-linecap="round"/>
<path d="M${-R * .12} ${R * .14} q${R * .12} ${R * .12} ${R * .24} 0" stroke="${INK}" stroke-width="${R * .07}" fill="none" stroke-linecap="round"/>`;
  },

  butterfly(c) {
    const w = `<path d="M0 0 C-12 -40 -52 -38 -42 -8 C-36 6 -14 6 0 0Z" fill="${c}" stroke="${shade(c, -.25)}" stroke-width="2"/><path d="M0 2 C-30 4 -40 26 -22 30 C-10 32 -2 16 0 2Z" fill="${shade(c, .25)}" stroke="${shade(c, -.25)}" stroke-width="2"/><circle cx="-26" cy="-14" r="6" fill="#fff" opacity=".6"/>`;
    return `<g class="flap">${w}</g><g transform="scale(-1 1)"><g class="flap">${w}</g></g><ellipse rx="4.5" ry="17" fill="${INK}"/><path d="M-2 -15 q-8 -12 -12 -12 M2 -15 q8 -12 12 -12" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  },

  speaker(muted) {
    return `<circle r="40" fill="#fff" fill-opacity=".82" stroke="#e3d8ef" stroke-width="3"/>
<path d="M-20 -9 L-9 -9 L5 -21 L5 21 L-9 9 L-20 9Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      (muted ? `<path d="M13 -10 L29 10 M29 -10 L13 10" stroke="#e0566a" stroke-width="5.5" stroke-linecap="round"/>`
        : `<path d="M12 -10 q8 10 0 20 M19 -18 q15 18 0 36" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`);
  },
};
