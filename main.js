/* ═══════════════════════════════════════════════════
   main.js  –  dsfx.core
   ═══════════════════════════════════════════════════ */

/* ── 1. TITLE TYPEWRITER ──────────────────────────── */
(function () {
  const title = 'dsfx.core/';
  let i = 0;
  document.title = '';
  const id = setInterval(() => {
    document.title += title[i++];
    if (i >= title.length) clearInterval(id);
  }, 110);
})();

/* ── 2. INTRO SCREEN then start music ────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-screen');
  const audio = document.getElementById('bg-audio');

  setTimeout(() => {
    intro.classList.add('hidden');
    audio.play().catch(() => {});
  }, 2100);
});

/* ── 3. NFS CARBON X-ELEMENTS — FALLING TOP TO BOTTOM */
(function () {
  const canvas = document.getElementById('nfs-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  let color = '#c77dff';

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 28;
  const particles = [];

  function mkParticle (stagger) {
    const size = 14 + Math.random() * 28;
    return {
      x:     Math.random() * W,
      y:     stagger ? Math.random() * H : -size * 2,
      size:  size,
      speed: 0.18 + Math.random() * 0.22,
      alpha: 0.12 + Math.random() * 0.35,
      angle: (Math.random() - 0.5) * 0.5,
      drift: (Math.random() - 0.5) * 0.25,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push(mkParticle(true));
  }

  function drawX (cx, cy, size, alpha, rot) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth   = Math.max(1, size * 0.09);
    ctx.lineCap     = 'round';
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const h = size / 2;
    ctx.beginPath();
    ctx.moveTo(-h, -h); ctx.lineTo(h,  h);
    ctx.moveTo( h, -h); ctx.lineTo(-h, h);
    ctx.stroke();
    ctx.restore();
  }

  function tick () {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      let alpha = p.alpha;
      const fadeZone = H * 0.12;
      if (p.y < fadeZone)     alpha *= p.y / fadeZone;
      if (p.y > H - fadeZone) alpha *= (H - p.y) / fadeZone;
      drawX(p.x, p.y, p.size, Math.max(0, alpha), p.angle);
      if (p.y > H + p.size * 2) Object.assign(p, mkParticle(false));
    });
    requestAnimationFrame(tick);
  }
  tick();

  window.setNfsColor = function (c) { color = c; };
})();

/* ── 4. COLOUR PANEL ──────────────────────────────── */
(function () {
  const btn   = document.getElementById('color-toggle-btn');
  const panel = document.getElementById('color-panel');
  const hexIn = document.getElementById('hex-input');
  const apply = document.getElementById('hex-apply');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#color-btn-wrap')) panel.classList.remove('open');
  });

  function applyColor (hex) {
    const full = hex.startsWith('#') ? hex : '#' + hex;
    document.documentElement.style.setProperty('--accent', full);
    document.documentElement.style.setProperty('--border-accent', full);
    window.setNfsColor && window.setNfsColor(full);
    document.querySelectorAll('.swatch').forEach(s =>
      s.classList.toggle('active', s.dataset.color === full)
    );
  }

  document.querySelectorAll('.swatch').forEach(s =>
    s.addEventListener('click', () => applyColor(s.dataset.color))
  );
  apply.addEventListener('click', () => {
    const val = hexIn.value.replace('#', '').trim();
    if (/^[0-9a-fA-F]{6}$/.test(val)) applyColor(val);
  });
  hexIn.addEventListener('keydown', e => { if (e.key === 'Enter') apply.click(); });
})();

/* ── 5. QUOTES ────────────────────────────────────── */
(function () {
  const QUOTES = [
    'eternal passion, autumn anxiety, eternal bliss',
    "glitching through the void like it's home",
    'soft static, loud feelings',
    'system failure is just a plot twist',
    'i exist in lowercase and lowercase only',
    'core temperature: cold outside, on fire inside',
    'loading\u2026 please be patient with me',
    'dream in 16:9, live in letterbox',
    'running on spite and lo-fi beats',
    'undefined behaviour, defined soul',
    'error 404: chill not found',
    "i am the background music you didn't notice",
    'tender violence, quiet storms',
  ];
  const el  = document.getElementById('quote-text');
  let idx   = Math.floor(Math.random() * QUOTES.length);
  el.textContent = QUOTES[idx];
  setInterval(() => {
    el.classList.add('fade');
    setTimeout(() => {
      idx = (idx + 1) % QUOTES.length;
      el.textContent = QUOTES[idx];
      el.classList.remove('fade');
    }, 650);
  }, 7000);
})();

/* ── 6. MUSIC PLAYER ──────────────────────────────── */
(function () {
  const audio   = document.getElementById('bg-audio');
  const playBtn = document.getElementById('play-pause-btn');
  const bar     = document.getElementById('progress-bar');
  const timeEl  = document.getElementById('track-time');
  const pWrap   = document.getElementById('progress-wrap');

  // Title/artist are edited directly in index.html
  // <div id="track-name">Track Title</div>
  // <div id="track-artist">Artist Name</div>

  audio.src  = 'assets/background.mp3';
  audio.loop = true;

  function fmt (s) {
    if (!isFinite(s)) return '0:00';
    return Math.floor(s / 60) + ':' + Math.floor(s % 60).toString().padStart(2, '0');
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    bar.style.width    = (audio.currentTime / audio.duration * 100) + '%';
    timeEl.textContent = fmt(audio.currentTime);
  });

  playBtn.addEventListener('click', () => {
    audio.paused ? audio.play() : audio.pause();
  });
  audio.addEventListener('play',  () => { playBtn.textContent = '\u23F8'; });
  audio.addEventListener('pause', () => { playBtn.textContent = '\u25B6'; });

  pWrap.addEventListener('click', e => {
    const r = pWrap.getBoundingClientRect();
    if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
})();

/* ── 7. BACKGROUND VIDEO fallback ────────────────── */
(function () {
  document.getElementById('bg-video').addEventListener('error', function () {
    this.parentElement.style.display = 'none';
  });
})();
