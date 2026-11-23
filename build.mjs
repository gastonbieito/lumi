// Arma un único HTML autónomo por capítulo (funciona sin internet).
// Uso: node build.mjs  ->  dist/index.html (capítulo 1) y dist/2/index.html (capítulo 2); lo mismo en docs/.
// El motor (src/js) es común; cada capítulo trae su mapa y sus escenas.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = (...p) => path.join(root, 'src', ...p);
const read = f => fs.readFileSync(f, 'utf8').replace(/^﻿/, '');

// Archivos de src/js que son solo del capítulo 1 (mapa y escenas).
const CAP1_ONLY = /^(11-map|2\d-.*)\.js$/;
const list = dir => fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => ({ f, p: path.join(dir, f) }));
const common = list(src('js')).filter(x => !CAP1_ONLY.test(x.f));

const CHAPTERS = [
  { cap: 'cap1', out: '', title: 'Lumi y la isla dormida', js: list(src('js')), css: [] },
  { cap: 'cap2', out: '2', title: 'Lumi y el faro dormido', js: [...common, ...list(src('cap2'))], css: [src('cap2', 'cap2.css')] },
];

const fontPath = path.join(root, 'node_modules/@fontsource/nunito/files/nunito-latin-800-normal.woff2');
const font = fs.existsSync(fontPath)
  ? `@font-face{font-family:'Nunito';font-weight:800;font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(fontPath).toString('base64')}) format('woff2')}`
  : '';
if (!font) console.warn('Aviso: no se encontró la fuente Nunito; se usará la del sistema.');
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

for (const ch of CHAPTERS) {
  const files = ch.js.sort((a, b) => a.f.localeCompare(b.f));
  const js = files.map(x => `// ---- ${x.f}\n` + read(x.p)).join('\n');
  const css = [src('styles.css'), ...ch.css].map(read).join('\n').replace('/*FONT*/', () => font);
  const html = read(src('index.html'))
    .replaceAll('Lumi y la isla dormida', ch.title)
    .replace('<!--CSS-->', () => `<style>\n${css}\n</style>`)
    .replace('<!--JS-->', () => `<script>\n(()=>{\nconst BUILD='${stamp}', CAP='${ch.cap}';\n${js}\n})();\n</script>`);
  // dist/ es la copia para abrir desde la compu; docs/ es lo que publica GitHub Pages.
  for (const dir of ['dist', 'docs']) {
    const d = path.join(root, dir, ch.out);
    fs.mkdirSync(d, { recursive: true });
    // El botón de volver al portal solo va en la versión publicada (docs/); la copia local (dist/) no lo necesita.
    fs.writeFileSync(path.join(d, 'index.html'), dir === 'dist' ? html.replace(/<script src="\/volver\.js"[^>]*><\/script>\n?/, '') : html);
  }
  console.log(`${ch.cap}: ${path.join(ch.out, 'index.html')}  ${(html.length / 1024).toFixed(0)} KB  (${files.length} módulos)`);
}
console.log('Armado', stamp);
