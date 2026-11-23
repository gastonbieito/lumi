// Sonido sintetizado con Web Audio. Todo el juego funciona igual sin sonido.
const PENTA = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98];
const Sound = {
  ac: null, out: null, muted: false, amb: null, nb: null,
  init() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ac = new AC();
      this.out = this.ac.createGain();
      this.out.gain.value = this.muted ? 0 : .9;
      const comp = this.ac.createDynamicsCompressor();
      this.out.connect(comp); comp.connect(this.ac.destination);
      const len = this.ac.sampleRate;
      this.nb = this.ac.createBuffer(1, len, len);
      const d = this.nb.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { this.ac = null; }
  },
  ok() { return this.ac && !this.muted && this.ac.state === 'running'; },
  setMuted(m) { this.muted = m; if (this.out) this.out.gain.setTargetAtTime(m ? 0 : .9, this.ac.currentTime, .05); },
  note(f, o = {}) {
    if (!this.ok()) return;
    const { t = 0, dur = .5, type = 'sine', vol = .2, attack = .006, slide = null } = o;
    const a = this.ac, t0 = a.currentTime + t;
    const osc = a.createOscillator(), g = a.createGain();
    osc.type = type; osc.frequency.setValueAtTime(f, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur * .8);
    g.gain.setValueAtTime(.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    osc.connect(g); g.connect(this.out); osc.start(t0); osc.stop(t0 + dur + .05);
  },
  bell(f, t = 0, vol = .16, dur = 1.1) {
    this.note(f, { t, dur, vol });
    this.note(f * 2.005, { t, dur: dur * .5, vol: vol * .28 });
    this.note(f * 3.01, { t, dur: dur * .25, vol: vol * .1, type: 'triangle' });
  },
  noise(dur, f0, f1, vol = .12, t = 0) {
    if (!this.ok()) return;
    const a = this.ac, t0 = a.currentTime + t;
    const s = a.createBufferSource(); s.buffer = this.nb;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(f0, t0); bp.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const g = a.createGain();
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + dur * .35); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    s.connect(bp); bp.connect(g); g.connect(this.out); s.start(t0); s.stop(t0 + dur + .05);
  },
  pop() { this.note(rand(480, 620), { dur: .14, vol: .22, slide: 1300 }); },
  tap() { this.note(1046, { dur: .07, vol: .05, type: 'triangle' }); },
  miss() { this.note(260, { dur: .22, vol: .14, slide: 200 }); this.note(390, { dur: .16, vol: .05, type: 'triangle' }); },
  whoosh() { this.noise(.7, 300, 2400, .1); },
  bloom(i) {
    const b = i % 6;
    [0, 2, 4].forEach((k, j) => this.bell(PENTA[b + k], j * .085, .14));
    this.noise(.35, 2500, 7000, .03);
  },
  ding(i) { this.bell(PENTA[i % PENTA.length], 0, .13, .8); },
  grow(i) { this.note(220 + i * 70, { dur: .35, vol: .2, slide: 330 + i * 90 }); this.bell(PENTA[2 + i], .05, .1); },
  munch() { for (let i = 0; i < 3; i++) { this.noise(.09, 900, 500, .14, i * .2); this.note(180 + i * 20, { t: i * .2, dur: .08, vol: .1, type: 'triangle' }); } },
  blub() { this.note(rand(300, 420), { dur: .18, vol: .18, slide: rand(900, 1200) }); this.noise(.12, 1500, 4000, .04); },
  star(i) { this.bell(PENTA[3 + i % 8], 0, .14, 1.4); this.bell(PENTA[3 + i % 8] * 1.5, .07, .06, 1); },
  boom() { this.noise(.6, 200, 60, .2); this.bell(PENTA[rand(5, 10) | 0], .05, .08, 1.2); },
  twinkle() { this.bell(pick(PENTA.slice(6)), 0, .06, .6); },
  chord() { [523.25, 659.25, 783.99].forEach((f, i) => this.bell(f, i * .06, .1)); },
  fanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.bell(f, i * .12, .15));
    [523.25, 659.25, 783.99, 1046.5].forEach(f => this.bell(f, .6, .09, 1.8));
    this.noise(1.2, 3000, 9000, .03, .5);
  },
  ambient(on) {
    clearTimeout(this.amb);
    if (!on) return;
    const go = () => { if (this.ok()) this.bell(pick(PENTA.slice(2, 8)), 0, .035, 1.6); this.amb = setTimeout(go, rand(2200, 4800)); };
    this.amb = setTimeout(go, 1500);
  },
};
