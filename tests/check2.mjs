// Prueba automática del capítulo 2: lo juega entero con mouse y teclado (Edge y Chrome, 1366x768 y 1024x600)
// y con pantalla táctil (tablet 1024x768 y celular acostado 844x390).
// Arranca con nombres y progreso del capítulo 1 ya guardados, como pasa en clase: verifica que se usen las mismas
// tarjetas, que el capítulo 1 no se borre y que se guarde el 2. Capturas en tests/out/cap2/.
//   URL=https://.../lumi/2/   CANALES=msedge   SOLO=1 (un tamaño por modo)   RAPIDO=1 (corta la fiesta)   MODOS=mouse,tactil
import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const url = process.env.URL || pathToFileURL(path.join(root, 'dist', '2', 'index.html')).href;
const out = path.join(root, 'tests', 'out', 'cap2');
fs.mkdirSync(out, { recursive: true });
const CHANNELS = (process.env.CANALES || 'msedge,chrome').split(',');
const MODES = (process.env.MODOS || 'mouse,tactil').split(',');
const ONLY = process.env.SOLO, FAST = process.env.RAPIDO;
const SCENES = ['flores', 'caracoles', 'tambores', 'caminos'];
const NAMES = ['Alfa', 'Beta', 'Gamma', 'Delta Ñandú', 'Épsilon', 'Zeta', 'Eta', 'Theta'];
const KID = 'n:delta ñandú';
let fails = 0;
const fail = m => { fails++; console.log('  FALLA:', m); };

// Guardado como lo deja el capítulo 1 después de una clase (8 nombres, una tarjeta asignada a esta compu).
const CREAT = ['gato', 'conejo', 'oso', 'rana', 'buho', 'pollito', 'zorro', 'pinguino'], COLS = ['coral', 'amarillo', 'celeste', 'violeta', 'naranja', 'menta', 'rosa', 'verde'];
const SEED = {
  schema: 1,
  profiles: NAMES.map((n, i) => ({ id: 'n:' + n.toLocaleLowerCase('es'), name: n, creature: CREAT[i], color: COLS[i] })),
  progress: { [KID]: { who: { creature: 'buho', color: 'violeta' }, cap1: Object.fromEntries(['semillas', 'hambre', 'burbujas', 'noche', 'fiesta'].map(k => [k, { done: true, plays: 1, last: 1, ms: 1000, misses: 0, hints: 0 }])) } },
  settings: { muted: false, fullscreen: false, seats: 1 }, claimed: [KID], last: KID,
};

async function waitScreen(page, name, ms = 25000) {
  await page.waitForFunction(n => window.__lumi && window.__lumi.screen === n && !window.__lumi.busy, name, { timeout: ms });
  await page.waitForTimeout(700);
}
const MOVING = ['crab', 'balloon'];
async function checkLayout(page, tag) {
  const r = await page.evaluate(MOVING => {
    const W = innerWidth, H = innerHeight, bad = [];
    const items = window.__lumi.targets().filter(t => !MOVING.includes(t.kind));
    const m = window.__lumi.toScreen(1538, 62), k = document.getElementById('stage').getScreenCTM().a;
    items.push({ kind: 'sonido', x: m.x, y: m.y, r: 40 * k, w: 0, h: 0 });
    for (const t of items) {
      const hw = t.w ? t.w / 2 : t.r * .45, hh = t.h ? t.h / 2 : t.r * .45;
      if (t.x - hw < 0 || t.y - hh < 0 || t.x + hw > W || t.y + hh > H) bad.push(`${t.kind} fuera de pantalla en ${t.x | 0},${t.y | 0}`);
      const e = document.elementFromPoint(t.x, t.y);
      if (!e || !e.closest('#stage')) bad.push(`${t.kind} tapado por ${e ? e.id || e.tagName : 'nada'} en ${t.x | 0},${t.y | 0}`);
      if (t.x < 70 && t.y < 70) bad.push(`${t.kind} pegado a la esquina docente`);
    }
    // Lo tocable más chico (en píxeles de pantalla), para saber si alcanza con el dedo.
    const min = Math.min(...items.filter(t => t.kind !== 'sonido').map(t => t.w ? Math.min(t.w, t.h) : t.r * 2));
    return { n: items.length, bad, min };
  }, MOVING);
  r.bad.forEach(b => fail(`[${tag}] ${b}`));
  return r;
}
const shot = (page, name) => page.screenshot({ path: path.join(out, name + '.png') });

// Entrada: mouse o dedo (el dedo arrastra con eventos táctiles de verdad).
function input(page, touch) {
  let cdp = null;
  const getCdp = async () => cdp || (cdp = await page.context().newCDPSession(page));
  const touchEv = async (type, x, y) => (await getCdp()).send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  return {
    async tap(x, y) {
      if (touch) return page.touchscreen.tap(x, y);
      await page.mouse.move(x, y, { steps: 3 }); await page.mouse.down(); await page.mouse.up();
    },
    async drag(pts) {
      if (touch) {
        await touchEv('touchStart', pts[0].x, pts[0].y);
        for (const p of pts.slice(1)) { await touchEv('touchMove', p.x, p.y); await page.waitForTimeout(8); }
        await touchEv('touchEnd');
        return;
      }
      await page.mouse.move(pts[0].x, pts[0].y, { steps: 3 }); await page.mouse.down();
      for (const p of pts.slice(1)) await page.mouse.move(p.x, p.y, { steps: 2 });
      await page.mouse.up();
    },
  };
}

// Juega una escena con lo que sugiere el propio juego.
async function play(page, io, scene, tag) {
  let n = 0, checks = 0, idle = 0, t0 = Date.now(), min = Infinity, kinds = new Set();
  while (Date.now() - t0 < 420000) {
    if (await page.evaluate(() => __lumi.screen) !== scene) break;
    const a = await page.evaluate(() => __lumi.auto());
    if (!a) { idle++; if (idle === 12 && n > 3) await shot(page, `${tag}-${scene}-final`); await page.waitForTimeout(250); continue; }
    idle = 0;
    if (checks < 6 && n % 7 === 0) { const r = await checkLayout(page, `${tag} ${scene}`); min = Math.min(min, r.min); checks++; }
    if (a.key) { kinds.add('tecla'); await page.keyboard.press(a.key === ' ' ? 'Space' : a.key); await page.waitForTimeout(380); }
    else if (a.path) { kinds.add('camino'); await io.drag([{ x: a.x, y: a.y }, ...a.path]); await page.waitForTimeout(500); }
    else if (a.dbl) { kinds.add('doble'); await io.tap(a.x, a.y); await page.waitForTimeout(90); await io.tap(a.x, a.y); await page.waitForTimeout(450); }
    else { kinds.add('toque'); await io.tap(a.x, a.y); await page.waitForTimeout(scene === 'fiesta' ? 450 : 360); }
    n++;
    if (n === 5) { await page.waitForTimeout(400); await shot(page, `${tag}-${scene}-juego`); }
    if (n === 25 && scene !== 'fiesta') await shot(page, `${tag}-${scene}-juego2`);
  }
  return { n, s: Math.round((Date.now() - t0) / 1000), min: Math.round(min), kinds: [...kinds].join('+') };
}

async function run(browser, tag, opts, touch) {
  console.log('▶', tag);
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const io = input(page, touch);
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(url);
  await page.evaluate(s => { localStorage.clear(); localStorage.setItem('lumiIsla', s); }, JSON.stringify(SEED));
  await page.reload();
  await waitScreen(page, 'start');
  const kinds = await page.evaluate(() => __lumi.targets().map(t => t.kind));
  if (kinds.filter(k => k === 'card').length !== 1 || kinds.filter(k => k === 'cardlock').length !== 7) fail('las tarjetas del capítulo 1 no pasan al 2: ' + kinds.join(','));
  await shot(page, `${tag}-0-inicio`);
  const card = (await page.evaluate(() => __lumi.targets())).find(t => t.kind === 'card');
  await io.tap(card.x, card.y);

  const times = [];
  for (const sc of [...SCENES, 'fiesta', 'taller']) {
    await waitScreen(page, 'map', 30000);
    await page.waitForTimeout(sc === 'flores' ? 1200 : 4500);
    await checkLayout(page, `${tag} mapa antes de ${sc}`);
    await shot(page, `${tag}-mapa-antes-${sc}`);
    const ts = await page.evaluate(() => __lumi.targets().filter(t => t.kind === 'next'));
    if (!ts.length) { fail('no hay lugar siguiente en el mapa para ' + sc); break; }
    await io.tap(ts[0].x, ts[0].y);
    await waitScreen(page, sc);
    await page.waitForTimeout(2000);
    await shot(page, `${tag}-${sc}-inicio`);
    if (sc === 'taller') break;
    if (sc === 'fiesta' && FAST) {
      for (let i = 0; i < 6; i++) { await io.tap(300 + i * 90, 300); await page.waitForTimeout(300); }
      if (!touch) await page.keyboard.press('a');
      await shot(page, `${tag}-fiesta`);
      await page.evaluate(() => { const b = document.querySelector('#pJump'); });
      // Salta el resto de la fiesta desde el panel docente.
      for (let i = 0; i < 3; i++) await page.mouse.click(12, 12);
      await page.waitForSelector('#panel:not([hidden])', { timeout: 3000 });
      await page.click('#pJump button[data-go="map"]');
      continue;
    }
    const r = await play(page, io, sc, tag);
    times.push(`${sc} ${r.s}s`);
    console.log(`  ${sc}: ${r.n} acciones (${r.kinds}), ${r.s} s, lo más chico mide ${r.min} px`);
  }
  // Taller: dibujar, sellar, hoja nueva, volver al mapa.
  if (await page.evaluate(() => __lumi.screen) === 'taller') {
    const P = p => page.evaluate(([x, y]) => __lumi.toScreen(x, y), p);
    const pts = []; for (let i = 0; i <= 20; i++) pts.push(await P([400 + i * 40, 420 + Math.sin(i / 3) * 120]));
    await io.drag(pts);
    const tools = await page.evaluate(() => __lumi.targets().filter(t => t.kind === 'tool'));
    await io.tap(tools[8].x, tools[8].y); // arcoíris
    const pts2 = []; for (let i = 0; i <= 20; i++) pts2.push(await P([450 + i * 30, 300 + i * 12]));
    await io.drag(pts2);
    await io.tap(tools[9].x, tools[9].y); // estrella
    for (const q of [[400, 600], [700, 250], [1200, 600]]) { const s = await P(q); await io.tap(s.x, s.y); await page.waitForTimeout(150); }
    const nEls = await page.evaluate(() => document.querySelector('[clip-path]').childElementCount);
    if (nEls < 10) fail('el taller no dibuja: ' + nEls + ' trazos');
    await page.waitForTimeout(500);
    await shot(page, `${tag}-taller-dibujo`);
    await io.tap(tools[12].x, tools[12].y); // hoja nueva
    await page.waitForTimeout(1600);
    const left = await page.evaluate(() => document.querySelector('[clip-path]').childElementCount);
    if (left) fail('la hoja nueva no se limpió');
    await shot(page, `${tag}-taller-colgado`);
    await io.tap(tools[13].x, tools[13].y); // mapa
    await waitScreen(page, 'map');
    await page.waitForTimeout(3500);
    await shot(page, `${tag}-mapa-final`);
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lumiIsla')));
  const e = saved.progress[KID] || {};
  const miss2 = [...SCENES, 'fiesta', 'taller'].filter(k => !(e.cap2 && e.cap2[k] && e.cap2[k].done));
  if (miss2.length) fail('no se guardó en el capítulo 2: ' + miss2.join(', ')); else console.log('  progreso del capítulo 2 guardado: ' + times.join(', '));
  if (!(e.cap1 && e.cap1.fiesta && e.cap1.fiesta.done)) fail('se perdió el progreso del capítulo 1');
  if (saved.profiles.length !== 8) fail('se perdieron los nombres');
  // Reiniciar desde el panel borra solo el capítulo 2.
  for (let i = 0; i < 3; i++) await page.mouse.click(12, 12);
  await page.waitForSelector('#panel:not([hidden])', { timeout: 3000 });
  page.once('dialog', d => d.accept());
  await page.click('#pResetAll');
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('lumiIsla')).progress);
  if (after[KID].cap2 || !after[KID].cap1) fail('reiniciar no respeta los capítulos: ' + JSON.stringify(after[KID]));
  else console.log('  reiniciar borra solo el capítulo 2');
  await shot(page, `${tag}-panel`);
  if (errs.length) errs.forEach(x => fail('error en consola: ' + x));
  await ctx.close();
}

for (const ch of CHANNELS) {
  let browser;
  try { browser = await chromium.launch({ channel: ch, headless: true }); }
  catch (e) { console.log(`(${ch} no disponible, se omite)`); continue; }
  if (MODES.includes('mouse')) for (const [w, h] of [[1366, 768], [1024, 600]]) {
    await run(browser, `${ch}-${w}x${h}`, { viewport: { width: w, height: h } }, false);
    if (ONLY) break;
  }
  if (MODES.includes('tactil')) for (const [w, h, name] of [[1024, 768, 'tablet'], [844, 390, 'celular']]) {
    await run(browser, `${ch}-${name}`, { viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, true);
    if (ONLY) break;
  }
  await browser.close();
}
console.log(fails ? `\n${fails} problema(s).` : '\nTodo en orden.');
process.exit(fails ? 1 : 0);
