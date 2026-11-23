// Pantalla de inicio: una tarjeta por chico (color + criatura + nombre).
function bgDusk(id) {
  let stars = '';
  for (let i = 0; i < 26; i++) stars += `<g transform="translate(${rand(-200, 1800).toFixed(0)} ${rand(-150, 330).toFixed(0)}) scale(${rand(.35, .8).toFixed(2)})"><g class="pulse" style="animation-duration:${rand(1.8, 3.6).toFixed(1)}s;animation-delay:-${rand(0, 3).toFixed(1)}s"><path d="${SPARK}" fill="#fff"/></g></g>`;
  return `<defs><linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a99be0"/><stop offset=".55" stop-color="#e7c8e6"/><stop offset="1" stop-color="#ffe3c9"/></linearGradient>
<linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8c4dc"/><stop offset="1" stop-color="#8f9dbf"/></linearGradient></defs>
<rect x="-600" y="-400" width="2800" height="1700" fill="url(#${id}sky)"/>${stars}
<g transform="translate(1290 150)"><circle r="56" fill="#fff4dc" opacity=".9"/><circle cx="22" cy="-14" r="50" fill="#d7c3ea"/></g>
<rect x="-600" y="700" width="2800" height="700" fill="url(#${id}sea)"/>
<path d="M260 712 C380 600 520 560 700 575 C860 540 1040 560 1180 610 C1260 640 1320 680 1350 712Z" fill="#a3a8b8"/>
<path d="M560 600 C600 520 700 500 760 560 M900 560 C940 500 1030 510 1060 580" fill="none" stroke="#959aab" stroke-width="12" stroke-linecap="round"/>
<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round">
<g class="ripple"><path d="M60 790 q40 -14 80 0 M1400 760 q40 -14 80 0"/></g><g class="ripple" style="--d:-2s"><path d="M300 850 q40 -14 80 0 M1120 830 q40 -14 80 0"/></g></g>`;
}

Screens.start = ctx => {
  grp({}, L.world, bgDusk('st'));
  const lumi = new Lumi(L.world, 800, 118, .78);
  const named = Store.data.profiles.length > 0;
  const list = named ? Store.data.profiles : Store.anonProfiles();
  const n = list.length;
  const cols = n <= 4 ? n : n <= 8 ? 4 : n <= 10 ? 5 : n <= 12 ? 4 : n <= 15 ? 5 : 6;
  const rows = Math.ceil(n / cols), gap = 28, AW = 1440, AH = 640, top = 225;
  const ratio = named ? 1.12 : 1;
  let w = Math.min(300, (AW - (cols - 1) * gap) / cols), h = w * ratio;
  if (h * rows + gap * (rows - 1) > AH) { h = (AH - gap * (rows - 1)) / rows; w = h / ratio; }
  const cardsL = grp({}, L.world);
  let chosen = false;
  // Cupo de esta compu: cuando ya se eligieron tantas tarjetas como chicos, las demás se bloquean.
  const ids = new Set(list.map(p => p.id));
  const mine = Store.data.claimed.filter(id => ids.has(id));
  const full = mine.length >= (Store.data.settings.seats || 1);
  const cards = [];
  list.forEach((p, i) => {
    const r = Math.floor(i / cols), inRow = Math.min(cols, n - r * cols), c = i - r * cols;
    const x = 800 + (c - (inRow - 1) / 2) * (w + gap);
    const y = top + h / 2 + r * (h + gap) + (AH - (rows * h + (rows - 1) * gap)) / 2;
    const col = colorOf(p.color);
    const locked = full && !mine.includes(p.id);
    const card = grp({ transform: tr(x, y), class: 'card' + (locked ? ' locked' : '') }, cardsL);
    const pop = grp({}, card), lift = grp({ class: 'lift' }, pop);
    const ar = named ? w * .34 : w * .38, ay = named ? -h * .14 : 0;
    let html = `<rect x="${-w / 2}" y="${-h / 2 + 8}" width="${w}" height="${h}" rx="${w * .14}" fill="${shade(col, -.25)}" opacity=".35"/>
<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * .14}" fill="#fffaf3" stroke="${col}" stroke-width="${w * .045}"/>
<g transform="translate(0 ${ay})">${ART.avatar(p, ar)}</g>`;
    if (named) {
      const fs = Math.min(w * .19, (w * .86) / (Math.max(3, p.name.length) * .56));
      html += `<text x="0" y="${h * .36}" text-anchor="middle" dominant-baseline="middle" font-size="${fs.toFixed(1)}" fill="${INK}">${escapeXml(p.name)}</text>`;
    }
    if (locked) html += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * .14}" fill="#8d86a3" opacity=".55"/>
<g transform="translate(0 ${ay}) scale(${(w / 300).toFixed(3)})"><path d="M-24 -8 L-24 -26 A24 24 0 0 1 24 -26 L24 -8" fill="none" stroke="#fff" stroke-width="11"/><rect x="-38" y="-10" width="76" height="60" rx="12" fill="#fff"/><circle cy="16" r="8" fill="#8d86a3"/></g>`;
    lift.innerHTML = html;
    cards.push({ p, x, y, pop, locked });
    anim(pop, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 520, delay: 150 + i * 55, easing: EB });
    App.addTarget({
      x, y, w, h, kind: locked ? 'cardlock' : 'card', hit: () => {
        if (chosen) return;
        if (locked) {
          Sound.miss();
          anim(pop, [{ transform: 'translateX(0px)' }, { transform: 'translateX(-14px)' }, { transform: 'translateX(12px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(0px)' }], { duration: 420, fill: 'none' });
          const own = cards.find(c => !c.locked); if (own) Guide.tap(own.x, own.y, 2);
          return;
        }
        chosen = true; Store.claim(p.id);
        App.good(); Sound.chord(); fullscreen();
        anim(pop, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1.1)' }], { duration: 450, easing: EB });
        FX.burst(x, y, [col, '#ffffff', '#ffd84a'], 18, 220, 'star');
        lumi.happy(true);
        App.profile = p; Store.data.last = p.id; Store.save();
        ctx.after(900, () => App.go('map'));
      },
    });
  });
  const own = cards.filter(c => !c.locked);
  if (full && own.length) ctx.after(1600, () => { if (!chosen) Guide.tap(own[0].x, own[0].y, 2); });
  return { onMove: p => lumi.look(p.x, p.y), hint: () => full && own.length && !chosen ? { x: own[0].x, y: own[0].y } : null, hintDelay: 9000 };
};

function escapeXml(s) { return String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c])); }
