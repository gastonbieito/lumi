// Arranque.
Store.load();
Sound.muted = !!Store.data.settings.muted;
Guide.init(); Hud.init(); Panel.init();
const startNow = () => App.go('start');
if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 800))]).then(startNow);
else startNow();
