# Lumi y la isla dormida

Juego para chicos de 4 a 7 años que todavía no leen. Capítulo 1: Semillas (clic), Hambre (arrastrar),
Burbujas (clic sobre algo que se mueve), Noche (clic) y Fiesta final.

- Un solo archivo autónomo. Publicado en https://gastonbieito.github.io/lumi/ (carpeta `docs/`); `dist/` es la misma copia para abrir local.
- No hay nombres en el código ni en el repositorio: se cargan en el panel docente y quedan solo en el
  navegador de cada compu.

## Armar y probar

```
npm install
npm run build      # genera dist/index.html a partir de src/
npm test           # arma y juega el capítulo entero en Edge y Chrome (1366x768 y 1024x600)
```

Opciones de la prueba: `CANALES=msedge`, `SOLO=1` (un solo tamaño), `RAPIDO=1` (no espera el final de la fiesta).
Las capturas quedan en `tests/out/`.

## Fuentes

`src/index.html` y `src/styles.css` son la base. `src/js/` se concatena en orden alfabético:
`00-util`, `01-store` (guardado), `02-audio`, `03-art` (dibujos), `04-engine` (pintura gris→color, manito,
Lumi, entrada), `05-kit` (piezas comunes), `10-start`, `11-map`, `20..24` escenas, `90-teacher`, `99-main`.

## Guardado (para el capítulo 2)

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
      }
      // el capítulo 2 agrega aquí: cap2: {...}
    }
  },
  settings: { muted: false, fullscreen: true, seats: 1 },   // seats: chicos que usan esta compu
  claimed: ['n:alfa'],                                     // tarjetas asignadas a esta compu
  last: 'n:alfa'
}
```

`cap1.fiesta.done === true` significa que el capítulo 1 está completo. `misses` son clics o soltadas fuera
de lugar; `hints` cuántas veces apareció la manito por inactividad.

Ojo: el guardado depende del origen. Lo jugado desde el archivo (`file://`) y lo jugado desde la página
publicada no se comparten.
