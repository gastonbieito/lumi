// Panel docente: triple clic en la esquina superior izquierda.
const SCENE_NAMES = { semillas: 'Semillas', hambre: 'Hambre', burbujas: 'Burbujas', noche: 'Noche', fiesta: 'Fiesta final' };
const Panel = {
  open: false,
  init() {
    let clicks = [];
    $('#corner').addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation();
      const now = performance.now();
      clicks = clicks.filter(t => now - t < 1000); clicks.push(now);
      if (clicks.length >= 3) { clicks = []; this.show(); }
    });
    $('#pClose').onclick = () => this.hide();
    $('#pSave').onclick = () => {
      Store.setNames($('#pNames').value.split(/\r?\n/));
      this.render();
      if (App.name === 'start') App.go('start');
    };
    $('#pClearNames').onclick = () => {
      if (!confirm('¿Borrar todos los nombres de esta compu? También se borra su progreso.')) return;
      Store.clearNames(); App.profile = null; this.render();
    };
    $('#pResetAll').onclick = () => {
      if (!confirm('¿Reiniciar el progreso de todos en esta compu?')) return;
      Store.resetAll(); this.render();
    };
    $('#pMute').onchange = e => { Sound.setMuted(e.target.checked); Store.data.settings.muted = e.target.checked; Store.save(); Hud.draw(); };
    $('#pFull').onchange = e => { Store.data.settings.fullscreen = e.target.checked; Store.save(); };
    $('#pList').onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      const id = b.dataset.id, act = b.dataset.act;
      if (act === 'reset') { const p = Store.data.profiles.find(q => q.id === id); if (!confirm(`¿Reiniciar el progreso de ${p ? p.name : 'este chico'}?`)) return; Store.resetOne(id); }
      else Store.cycle(id, act);
      this.render();
    };
    $('#pJump').onclick = e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      const who = $('#pWho').value;
      const pool = [...Store.data.profiles, ...Store.anonProfiles(), Store.guest()];
      if (b.dataset.go !== 'start') App.profile = pool.find(p => p.id === who) || Store.guest();
      this.hide();
      App.go(b.dataset.go);
    };
    $('#pFoot').textContent = 'Lumi y la isla dormida · capítulo 1 · ' + BUILD;
  },
  show() {
    this.open = true; Guide.hide();
    $('#pNames').value = Store.data.profiles.map(p => p.name).join('\n');
    this.render();
    $('#panel').hidden = false;
  },
  hide() { this.open = false; $('#panel').hidden = true; App.lastGood = performance.now(); },
  render() {
    const d = Store.data, keys = ['semillas', 'hambre', 'burbujas', 'noche'];
    const av = p => `<svg viewBox="-80 -80 160 160" width="46" height="46">${ART.avatar(p, 76)}</svg>`;
    const dots = p => keys.map(k => `<i class="${Store.isDone(p, k) ? 'ok' : ''}" title="${SCENE_NAMES[k]}"></i>`).join('');
    $('#pList').innerHTML = d.profiles.length ? d.profiles.map(p => `<div class="kid">${av(p)}<span class="nm">${escapeXml(p.name)}</span><span class="pr">${dots(p)}</span>
<button data-id="${escapeXml(p.id)}" data-act="creature">Otra criatura</button><button data-id="${escapeXml(p.id)}" data-act="color">Otro color</button><button data-id="${escapeXml(p.id)}" data-act="reset" class="warn">Reiniciar</button></div>`).join('')
      : '<p class="hint">No hay nombres cargados: los chicos eligen una tarjeta de color y criatura.</p>';
    const cur = App.profile ? App.profile.id : (d.profiles[0] || {}).id;
    const opts = d.profiles.length ? d.profiles.map(p => [p.id, p.name]) : Store.anonProfiles().map(p => [p.id, p.creature + ' ' + p.color]);
    opts.push(['invitado', 'Invitado (prueba)']);
    $('#pWho').innerHTML = opts.map(([id, n]) => `<option value="${escapeXml(id)}"${id === cur ? ' selected' : ''}>${escapeXml(n)}</option>`).join('');
    const jumps = [['start', 'Tarjetas'], ['map', 'Mapa'], ...keys.map(k => [k, SCENE_NAMES[k]]), ['fiesta', SCENE_NAMES.fiesta]];
    $('#pJump').innerHTML = jumps.map(([k, n]) => { const ok = k === 'start' || k === 'map' || sceneReady(k); return `<button data-go="${k}"${ok ? '' : ' disabled title="Todavía no está"'}>${n}</button>`; }).join('');
    $('#pMute').checked = d.settings.muted;
    $('#pFull').checked = d.settings.fullscreen;
  },
};
