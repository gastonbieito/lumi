# Lumi y la isla dormida / Lumi y el faro dormido

Juego para chicos de 4 a 7 años que todavía no leen, en dos capítulos.

- **Capítulo 1, la isla dormida:** Semillas (clic), Hambre (arrastrar), Burbujas (clic sobre algo que se mueve),
  Noche (clic) y Fiesta final. https://gastonbieito.github.io/lumi/ (nota docente en `NOTA-DOCENTE.md`)
- **Capítulo 2, el faro dormido:** Flores que cantan (memoria), Caracoles (doble clic), Tambores (teclado: cualquier
  tecla, barra espaciadora y flechas), Caminos de luz (arrastrar sin soltar), Fiesta del faro y Taller de dibujo.
  Cada lugar tiene tres rondas que se van poniendo más difíciles, para que dure una clase entera.
  https://gastonbieito.github.io/lumi/2/ (nota docente en `NOTA-DOCENTE-2.md`)

- Un solo archivo autónomo por capítulo. Publicados desde `docs/` (`docs/index.html` y `docs/2/index.html`);
  `dist/` es la misma copia para abrir local.
- No hay nombres en el código ni en el repositorio: se cargan en el panel docente y quedan solo en el
  navegador de cada compu.

## Armar y probar

```
npm install
npm run build      # genera los dos capítulos (dist/ y docs/) a partir de src/
npm test           # arma y juega el capítulo 1 entero en Edge y Chrome (1366x768 y 1024x600)
npm run test2      # juega el capítulo 2 entero con mouse y teclado, y con pantalla táctil (tablet y celular)
```

Opciones de las pruebas: `CANALES=msedge`, `SOLO=1` (un solo tamaño), `RAPIDO=1` (no espera el final de la fiesta),
`URL=...` (probar la página publicada); en la del capítulo 2, además, `MODOS=mouse` o `MODOS=tactil`.
Las capturas quedan en `tests/out/` (las del capítulo 2 en `tests/out/cap2/`).

## Fuentes

`src/index.html` y `src/styles.css` son la base de los dos capítulos. `src/js/` se concatena en orden alfabético:
`00-util`, `01-store` (guardado), `02-audio`, `03-art` (dibujos), `04-engine` (pintura gris→color, manito,
Lumi, entrada y teclado), `05-kit` (piezas comunes), `10-start`, `11-map`, `20..24` escenas, `90-teacher`, `99-main`.

El capítulo 2 usa el mismo motor (todo `src/js/` menos `11-map` y las escenas `2x`) más `src/cap2/`:
`11-mapa`, `12-kit2` (sonidos y dibujos del capítulo), `30-flores`, `31-caracoles`, `32-tambores`, `33-caminos`,
`34-fiesta`, `35-taller`. El armado define `CAP` (`'cap1'` o `'cap2'`) y cada mapa define `SCENES`, `SCENE_NAMES`
y `CH_TITLE`, que usa el panel docente.

## Guardado (compartido por los dos capítulos)

Clave de `localStorage`: **`lumiIsla`** (estable). Contenido:

```js
{
  schema: 1,
  profiles: [{ id: 'n:alfa', name: 'Alfa', creature: 'gato', color: 'coral' }],
  progress: {
    'n:alfa': {                         // también 'a:<criatura>' si se jugó sin nombres, o 'invitado'
      who: { creature: 'gato', color: 'coral' },
      cap1: {
        semillas: { done: true, plays: 2, last: 1795390000000, ms: 154000, misses: 3, hints: 1 },
        hambre: {...}, burbujas: {...}, noche: {...}, fiesta: {...}
      },
      cap2: { flores: {...}, caracoles: {...}, tambores: {...}, caminos: {...}, fiesta: {...}, taller: {...} }
    }
  },
  settings: { muted: false, fullscreen: true, seats: 1 },   // seats: chicos que usan esta compu
  claimed: ['n:alfa'],                                     // tarjetas asignadas a esta compu
  last: 'n:alfa'
}
```

`capN.fiesta.done === true` significa que ese capítulo está completo. `misses` son clics o soltadas fuera
de lugar; `hints` cuántas veces apareció la manito por inactividad. Reiniciar desde el panel de un capítulo
borra solo ese capítulo; nombres, tarjetas y opciones son de los dos.

Ojo: el guardado depende del origen. Lo jugado desde el archivo (`file://`) y lo jugado desde la página
publicada no se comparten.
