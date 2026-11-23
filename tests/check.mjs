// Prueba automática: juega el capítulo 1 entero en Edge y Chrome, en 1366x768 y 1024x600.
// Verifica que lo tocable quede dentro de la pantalla y sin nada encima, que se guarde el progreso
// y que no haya errores. Capturas en tests/out/.
//   URL=https://... (probar la página publicada)  CANALES=msedge  SOLO=1 (un solo tamaño)  RAPIDO=1 (no espera el final de la fiesta)
import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const url = process.env.URL || pathToFileURL(path.join(root, 'dist', 'index.html')).href;
const out = path.join(root, 'tests', 'out');
fs.mkdirSync(out, { recursive: true });
const SIZES = [[1366, 768], [1024, 600]];
const CHANNELS = (process.env.CANALES || 'msedge,chrome').split(',');
const ONLY = process.env.SOLO, FAST = process.env.RAPIDO;
const SCENES = ['semillas', 'hambre', 'burbujas', 'noche'];
let fails = 0;
const fail = m => { fails++; console.log('  FALLA:', m); };

async function waitScreen(page, name, ms = 20000) {
  await page.waitForFunction(n => window.__lumi && window.__lumi.screen === n && !window.__lumi.busy, name, { timeout: ms });
  await page.waitForTimeout(700);
}
const MOVING = ['bubble', 'balloon', 'fish', 'big'];
async function checkLayout(page, tag) {
  const r = await page.evaluate(MOVING => {
    const W = innerWidth, H = innerHeight, bad = [];
    const items = window.__lumi.targets().filter(t => !(MOVING.includes(t.kind) && window.__lumi.screen !== 'semillas'));
    const m = window.__lumi.toScreen(1538, 62), k = document.getElementById('stage').getScreenCTM().a;
    items.push({ kind: 'sonido', x: m.x, y: m.y, r: 40 * k, w: 0, h: 0 });
    for (const t of items) {
      const hw = t.w ? t.w / 2 : t.r * .45, hh = t.h ? t.h / 2 : t.r * .45;
      if (t.x - hw < 0 || t.y - hh < 0 || t.x + hw > W || t.y + hh > H) bad.push(`${t.kind} fuera de pantalla en ${t.x | 0},${t.y | 0}`);
      const e = document.elementFromPoint(t.x, t.y);
      if (!e || !e.closest('#stage')) bad.push(`${t.kind} tapado por ${e ? e.id || e.tagName : 'nada'} en ${t.x | 0},${t.y | 0}`);
      if (t.x < 70 && t.y < 70) bad.push(`${t.kind} pegado a la esquina docente`);
    }
    return { n: items.length, bad };
  }, MOVING);
  r.bad.forEach(b => fail(`[${tag}] ${b}`));
  return r.n;
}
const shot = (page, name) => page.screenshot({ path: path.join(out, name + '.png') });
async function click(page, x, y) { await page.mouse.move(x, y, { steps: 3 }); await page.mouse.down(); await page.mouse.up(); }

// Juega una escena con las acciones que sugiere el propio juego (clic o arrastre).
async function play(page, scene, tag) {
  let n = 0, checks = 0, idle = 0, finalShot = false, t0 = Date.now(), sticky = false;
  while (Date.now() - t0 < 180000) {
    if (await page.evaluate(() => __lumi.screen) !== scene) break;
    const a = await page.evaluate(() => __lumi.auto());
    if (!a) {
      idle++;
      if (n > 3 && idle === 8 && !finalShot) { finalShot = true; await page.waitForTimeout(1500); await shot(page, `${tag}-${scene}-final`); }
      await page.waitForTimeout(300); continue;
    }
    idle = 0;
    if (checks < 4) { await checkLayout(page, `${tag} ${scene}`); checks++; }
    if (a.x2 != null) {
      if (!sticky) { // una vez, con "clic y clic"
        sticky = true;
        await click(page, a.x, a.y); await page.mouse.move(a.x2, a.y2, { steps: 12 }); await click(page, a.x2, a.y2);
      } else {
        await page.mouse.move(a.x, a.y, { steps: 3 }); await page.mouse.down();
        await page.mouse.move(a.x2, a.y2, { steps: 14 }); await page.mouse.up();
      }
      await page.waitForTimeout(1300);
    } else { await click(page, a.x, a.y); await page.waitForTimeout(scene === 'fiesta' ? 500 : 450); }
    n++;
    if (n === 4) { await page.waitForTimeout(500); await shot(page, `${tag}-${scene}-juego`); }
    if (scene === 'fiesta' && n === 8) { await shot(page, `${tag}-fiesta`); if (FAST) return n; }
  }
  return n;
}

for (const ch of CHANNELS) {
  let browser;
  try { browser = await chromium.launch({ channel: ch, headless: true }); }
  catch (e) { console.log(`(${ch} no disponible, se omite)`); continue; }
  for (const [w, h] of SIZES) {
    const tag = `${ch}-${w}x${h}`;
    console.log('▶', tag);
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(url);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitScreen(page, 'start');
    console.log('  tarjetas sin nombres:', await checkLayout(page, tag + ' inicio'));
    await shot(page, `${tag}-0-inicio`);

    // Panel docente: triple clic en la esquina, cargar 8 nombres.
    for (let i = 0; i < 3; i++) await page.mouse.click(12, 12);
    await page.waitForSelector('#panel:not([hidden])', { timeout: 3000 }).catch(() => fail('no abrió el panel'));
    await page.fill('#pNames', ['Alfa', 'Beta', 'Gamma', 'Delta Ñandú', 'Épsilon', 'Zeta', 'Eta', 'Theta'].join('\n'));
    await page.click('#pSave');
    const ok = await page.$eval('#pClose', b => { const r = b.getBoundingClientRect(); return r.bottom <= innerHeight && r.top >= 0; });
    if (!ok) fail('botón de cerrar el panel fuera de pantalla');
    await shot(page, `${tag}-0-panel`);
    await page.click('#pClose');
    await waitScreen(page, 'start');
    console.log('  tarjetas con 8 nombres:', await checkLayout(page, tag + ' inicio con nombres'));
    await shot(page, `${tag}-0-inicio-nombres`);
    let ts = await page.evaluate(() => __lumi.targets());
    await click(page, ts[3].x, ts[3].y);

    for (const sc of [...SCENES, 'fiesta']) {
      await waitScreen(page, 'map');
      await page.waitForTimeout(sc === 'semillas' ? 800 : 4500);
      await checkLayout(page, `${tag} mapa antes de ${sc}`);
      await shot(page, `${tag}-mapa-antes-${sc}`);
      ts = await page.evaluate(() => __lumi.targets().filter(t => t.kind === 'next'));
      if (!ts.length) { fail('no hay lugar siguiente en el mapa para ' + sc); break; }
      await click(page, ts[0].x, ts[0].y);
      await waitScreen(page, sc);
      await page.waitForTimeout(sc === 'hambre' ? 3500 : 2500);
      await shot(page, `${tag}-${sc}-inicio`);
      if (sc === 'semillas') { const m = await page.evaluate(() => __lumi.toScreen(800, 470)); await click(page, m.x, m.y); }
      const n = await play(page, sc, tag);
      console.log(`  ${sc}: ${n} acciones`);
      if (sc === 'fiesta' && FAST) break;
    }
    if (!FAST) {
      await waitScreen(page, 'map', 70000);
      await page.waitForTimeout(4500);
      await shot(page, `${tag}-mapa-final`);
    }
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lumiIsla')));
    const prog = (saved.progress['n:delta ñandú'] || {}).cap1 || {};
    const missing = [...SCENES, 'fiesta'].filter(k => !(prog[k] && prog[k].done));
    if (missing.length) fail('no se guardó: ' + missing.join(', ')); else console.log('  progreso guardado para las 5 partes');
    if (saved.profiles.length !== 8) fail('no se guardaron los 8 nombres');
    if (errs.length) errs.forEach(e => fail('error en consola: ' + e));
    await ctx.close();
    if (ONLY) break;
  }
  await browser.close();
}
console.log(fails ? `\n${fails} problema(s).` : '\nTodo en orden.');
process.exit(fails ? 1 : 0);
