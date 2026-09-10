document.addEventListener('DOMContentLoaded', () => {


  // =========================================
// DESKTOP WARNING LOGIC
// =========================================
const desktopWarning = document.getElementById('desktopWarning');
const closeWarningBtn = document.getElementById('closeWarningBtn');

if (closeWarningBtn && desktopWarning) {
  closeWarningBtn.addEventListener('click', () => {
    desktopWarning.style.display = 'none';
  });
}

  /* =========================================
     EDIT ME: set this to the real date you got together
     (year, month index 0-11, day)
  ========================================= */
  const RELATIONSHIP_START = new Date(2024, 8, 11, 0, 0, 0);

  const envelopeBtn = document.getElementById('envelopeBtn');
  const lockOverlay = document.getElementById('lockOverlay');
  const flashScreen = document.getElementById('flashScreen');
  const mainContent = document.getElementById('mainContent');
  const titleContainer = document.getElementById('titleContainer');

  const bgLock = document.getElementById('bgLock');
  const bgMain = document.getElementById('bgMain');

  const bgMusic = document.getElementById('bgMusic');
  const musicNotch = document.getElementById('musicNotch');
  const notchStatus = document.getElementById('notchStatus');

  const heartsField = document.getElementById('heartsField');

  let isClicked = false;
  let heartsInterval = null;

  // =========================================
  // OPEN THE ENVELOPE
  // =========================================
  function openEnvelope() {
    if (isClicked) return;
    isClicked = true;

    envelopeBtn.classList.add('opening');

    setTimeout(() => {
      if (flashScreen) flashScreen.classList.add('active');
    }, 150);

    setTimeout(() => {
      if (lockOverlay) lockOverlay.classList.add('hidden');
      if (bgLock) bgLock.classList.add('hidden');
      if (bgMain) bgMain.classList.remove('hidden');
      if (mainContent) mainContent.classList.remove('hidden');
      document.body.style.overflow = 'auto';
      startHeartsField();
    }, 600);

    setTimeout(() => {
      if (flashScreen) flashScreen.classList.remove('active');
      if (titleContainer) titleContainer.classList.add('start-anim');

      if (bgMusic) {
        bgMusic.play().catch(err => {
          console.log('Autoplay prevented by browser: ', err);
        });
      }
    }, 900);
  }

  if (envelopeBtn) {
    envelopeBtn.addEventListener('click', openEnvelope);
    envelopeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  // =========================================
  // MUSIC NOTCH PLAY / PAUSE TOGGLE
  // =========================================
  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicNotch.classList.remove('paused');
      if (notchStatus) notchStatus.textContent = 'Playing';
    } else {
      bgMusic.pause();
      musicNotch.classList.add('paused');
      if (notchStatus) notchStatus.textContent = 'Paused';
    }
  }

  if (musicNotch && bgMusic) {
    musicNotch.addEventListener('click', toggleMusic);
    musicNotch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMusic();
      }
    });
  }

  // =========================================
  // SCROLL REVEAL OBSERVER
  // =========================================
  const animatedElements = document.querySelectorAll('.anim-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => observer.observe(el));

  // =========================================
  // 3D TILT HOVER FOR POLAROIDS
  // =========================================
  const polaroids = document.querySelectorAll('.polaroid-card');

  polaroids.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      card.style.transform = `scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =========================================
  // LOVE COUNTER (days / hours / mins / secs)
  // =========================================
  const countDays = document.getElementById('countDays');
  const countHours = document.getElementById('countHours');
  const countMins = document.getElementById('countMins');
  const countSecs = document.getElementById('countSecs');

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function updateCounter() {
    if (!countDays) return;
    const now = new Date();
    let diff = now - RELATIONSHIP_START;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    countDays.textContent = pad(days);
    countHours.textContent = pad(hours);
    countMins.textContent = pad(mins);
    countSecs.textContent = pad(secs);
  }

  if (countDays) {
    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // =========================================
  // FLIP CARDS ("Reasons I Love You")
  // =========================================
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // =========================================
  // AMBIENT FLOATING HEARTS
  // =========================================
  function spawnHeart() {
    if (!heartsField) return;
    const heart = document.createElement('span');
    heart.className = 'floaty-heart';
    heart.textContent = Math.random() > 0.5 ? '❤' : '♡';
    heart.style.left = Math.random() * 96 + 'vw';
    heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    const duration = 8 + Math.random() * 6;
    heart.style.animationDuration = duration + 's';
    heartsField.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  function startHeartsField() {
    if (heartsInterval) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    spawnHeart();
    heartsInterval = setInterval(spawnHeart, 1800);
  }

  // =========================================
  // REPLAY BUTTON
  // =========================================
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      window.location.reload();
    });
  }

  // =========================================
  // INTERACTIVE HUG METER
  // =========================================
  (function initHugMeter() {
    const wrap = document.querySelector('.hug-meter-wrap');
    const heartBtn = document.getElementById('hugHeartBtn');
    const ringFill = document.getElementById('hugRingFill');
    const percentText = document.getElementById('hugPercent');
    const statusText = document.getElementById('hugStatus');
    const badge = document.getElementById('hugBadge');
    const overlay = document.getElementById('hugCompleteOverlay');
    const overlayClose = document.getElementById('hugCompleteClose');
    const canvas = document.getElementById('hugParticles');

    if (!heartBtn || !canvas) return;

    const ctx = canvas.getContext('2d');
    const CIRCUMFERENCE = 565.48;
    const HOLD_DURATION = 3000; // ms to reach 100%
    const DECAY_DURATION = 600; // ms to fall back to 0 if released early

    let holding = false;
    let startTime = 0;
    let currentPercent = 0;
    let rafId = null;
    let completed = false;
    let hitMilestones = new Set();
    let particles = [];

    function resizeCanvas() {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const milestoneLabels = {
      25: 'Warming Up!',
      50: 'Extra Warm!',
      75: 'Super Cozy!',
      100: 'Ultimate Hug!'
    };

    function showBadge(text) {
      if (!badge) return;
      badge.textContent = text;
      badge.classList.remove('show');
      // force reflow so the animation can restart
      void badge.offsetWidth;
      badge.classList.add('show');
    }

    function screenShake() {
      heartBtn.classList.remove('shake');
      void heartBtn.offsetWidth;
      heartBtn.classList.add('shake');
    }

    function spawnParticle() {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const radius = 55 + Math.random() * 10;
      const type = Math.random();
      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.6 - Math.random() * 0.9,
        life: 1,
        decay: 0.008 + Math.random() * 0.01,
        size: 8 + Math.random() * 10,
        glyph: type < 0.5 ? '❤' : (type < 0.8 ? '✦' : '·'),
        hue: type < 0.5 ? '#ffcbd6' : (type < 0.8 ? '#fff2e6' : '#d9c4f0')
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.hue;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.glyph, p.x, p.y);
      });
      ctx.globalAlpha = 1;
      particles = particles.filter(p => p.life > 0);
    }

    function setPercent(pct) {
      currentPercent = Math.max(0, Math.min(100, pct));
      const offset = CIRCUMFERENCE - (CIRCUMFERENCE * currentPercent) / 100;
      ringFill.style.strokeDashoffset = offset;
      percentText.textContent = `Hug Power: ${Math.round(currentPercent)}%`;
      statusText.textContent = `Sending ${Math.round(currentPercent * 10)} hugs... 💕`;

      [25, 50, 75, 100].forEach(m => {
        if (currentPercent >= m && !hitMilestones.has(m)) {
          hitMilestones.add(m);
          showBadge(milestoneLabels[m]);
          screenShake();
          const density = m === 100 ? 12 : 4;
          for (let i = 0; i < density; i++) spawnParticle();
        }
      });
    }

    function completeHug() {
      completed = true;
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden', 'false');
      for (let i = 0; i < 40; i++) {
        setTimeout(spawnParticle, i * 20);
      }
    }

    function loop(timestamp) {
      if (holding && !completed) {
        const elapsed = timestamp - startTime;
        const pct = (elapsed / HOLD_DURATION) * 100;
        setPercent(pct);
        if (Math.random() < 0.6) spawnParticle();
        if (pct >= 100) {
          completeHug();
        }
      }
      drawParticles();
      if (particles.length > 0 || holding) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(loop);
    }

    function decayBack() {
      const decayStart = performance.now();
      const startPct = currentPercent;
      function step(ts) {
        const t = Math.min((ts - decayStart) / DECAY_DURATION, 1);
        setPercent(startPct * (1 - t));
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          hitMilestones.clear();
        }
      }
      requestAnimationFrame(step);
      startLoop();
    }

    function press(e) {
      if (completed) return;
      if (e.cancelable) e.preventDefault();
      holding = true;
      startTime = performance.now();
      heartBtn.classList.add('pressed');
      startLoop();
    }

    function release() {
      if (!holding) return;
      holding = false;
      heartBtn.classList.remove('pressed');
      if (!completed) decayBack();
    }

    heartBtn.addEventListener('touchstart', press, { passive: false });
    heartBtn.addEventListener('touchend', release);
    heartBtn.addEventListener('touchcancel', release);
    heartBtn.addEventListener('mousedown', press);
    window.addEventListener('mouseup', release);

    if (overlayClose) {
      overlayClose.addEventListener('click', () => {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          completed = false;
          hitMilestones.clear();
          setPercent(0);
        }, 400);
      });
    }
  })();

  // =========================================
  // PIXEL PET COMPANION
  // =========================================
  (function initPixelPet() {
    const sprite = document.getElementById('petSprite');
    const frame = document.getElementById('petFrame');
    const bubble = document.getElementById('petBubble');
    const bubbleText = document.getElementById('petBubbleText');
    const widget = document.getElementById('pixelPet');

    if (!sprite || !frame) return;

    // EDIT: swap these for your own sweet nothings
    const messages = [
      "hi! i'm your little companion 💗",
      "He's the luckiest, and so are you.",
      "have you told him you love him today?",
      "Do you know how much he loves you? a lot.",
      "He is probably thinking about you right now. I can tell.",
      "*wiggles happily*",
      "two years down, forever to go.",
      "psst... scroll up and hug the heart!",
      "zzz... just resting my paws.",
      "Did you know? hugs release oxytocin, the love hormone!",
      "Sanu keeps telling me how much he loves you. I believe him.",
      "you make him smile. keep doing that."
    ];

    let msgIndex = 0;
    let idleTimer = null;
    let typingTimer = null;

    function setPetState(state) {
      frame.className = 'pet-frame pet-' + state;
    }

    function typewriter(text) {
      clearInterval(typingTimer);
      bubbleText.textContent = '';
      let i = 0;
      typingTimer = setInterval(() => {
        bubbleText.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(typingTimer);
      }, 28);
    }

    function showBubble(text) {
      typewriter(text);
      bubble.classList.add('show');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        bubble.classList.remove('show');
      }, 3200);
    }

    function popHearts() {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const h = document.createElement('span');
          h.className = 'pet-heart-pop';
          h.textContent = '💗';
          h.style.left = (18 + Math.random() * 10) + 'px';
          h.style.top = '4px';
          h.style.setProperty('--px', (Math.random() * 30 - 15) + 'px');
          widget.appendChild(h);
          setTimeout(() => h.remove(), 1000);
        }, i * 90);
      }
    }

    sprite.addEventListener('click', () => {
      sprite.classList.remove('bounce');
      void sprite.offsetWidth;
      sprite.classList.add('bounce');
      setPetState('jump');
      popHearts();
      showBubble(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
      setTimeout(() => setPetState('idle'), 600);
    });

    // random idle behaviors every 10-15s
    const idleStates = ['idle', 'sleep', 'wiggle', 'idle'];
    setInterval(() => {
      const random = idleStates[Math.floor(Math.random() * idleStates.length)];
      setPetState(random);
      setTimeout(() => setPetState('idle'), 2500);
    }, 10000 + Math.random() * 5000);
  })();

  // =========================================
  // FINGER-TRAIL SECRET NOTE CANVAS
  // =========================================
  (function initTrailCanvas() {
    const canvas = document.getElementById('trailCanvas');
    const wrap = document.querySelector('.trail-canvas-wrap');
    const sparkleField = document.getElementById('trailSparkleField');
    const clearBtn = document.getElementById('trailClearBtn');

    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    let drawing = false;
    let lastPoint = null;
    const BRUSH_RADIUS = 26;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fillCover();
    }

    function fillCover() {
      const rect = wrap.getBoundingClientRect();
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, '#ffcbd6');
      gradient.addColorStop(0.5, '#fff2e6');
      gradient.addColorStop(1, '#d9c4f0');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }

    function eraseTo(x, y, fromX, fromY) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = BRUSH_RADIUS;

      // soft feathered edge using a radial gradient stamp
      const grad = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = grad;

      ctx.beginPath();
      if (fromX !== null) {
        const midX = (fromX + x) / 2;
        const midY = (fromY + y) / 2;
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(midX, midY, x, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.01, y + 0.01);
      }
      ctx.stroke();
    }

    function spawnSparkle(x, y) {
      if (!sparkleField) return;
      const s = document.createElement('span');
      s.className = 'trail-sparkle';
      s.textContent = Math.random() > 0.5 ? '✦' : '❤';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--sx', (Math.random() * 20 - 10) + 'px');
      s.style.setProperty('--sy', (30 + Math.random() * 30) + 'px');
      sparkleField.appendChild(s);
      setTimeout(() => s.remove(), 1500);
    }

    function start(e) {
      if (e.cancelable) e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      lastPoint = pos;
      eraseTo(pos.x, pos.y, null, null);
      spawnSparkle(pos.x, pos.y);
    }

    function move(e) {
      if (!drawing) return;
      if (e.cancelable) e.preventDefault();
      const pos = getPos(e);
      eraseTo(pos.x, pos.y, lastPoint.x, lastPoint.y);
      if (Math.random() < 0.5) spawnSparkle(pos.x, pos.y);
      lastPoint = pos;
    }

    function end() {
      drawing = false;
      lastPoint = null;
    }

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchcancel', end);
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearBtn.classList.remove('fade-pulse');
        void clearBtn.offsetWidth;
        clearBtn.classList.add('fade-pulse');
        fillCover();
      });
    }
  })();
});
