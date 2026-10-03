/* ─────────────────────────────────────────
   FAVOR BIRTHDAY SITE — issue.js v3 (Perfection Edition)
   ───────────────────────────────────────── */

// ─────────────────────────────────────────────────────────────────
// ⚙️ CONFIGURATION
// ─────────────────────────────────────────────────────────────────
const CONFIG = {
  // Birthday date for live day counter (October 3, 2006 -> 20 years old)
  birthdayDate: '2006-10-03',

  // Anniversary sealed section: unlock date
  anniversaryDate: '2027-10-03',

  // Secret password accepted variations (lowercase)
  validPasswords: ['ife', 'ife mi', 'ifemi', 'favor', 'babe', 'my love'],

  // Special places for Leaflet map
  mapPlaces: [
    { lat: 6.5244, lng: 3.3792, label: 'Where we first met', note: 'The quiet beginning of everything.' },
    { lat: 6.5355, lng: 3.3087, label: 'Our favourite spot', note: 'Hours felt like minutes here.' },
    { lat: 6.4698, lng: 3.5852, label: 'Where it all became real', note: 'Something shifted here forever.' },
  ],

  // Romantic love songs playlist
  songs: [
    {
      id: '5FG7Tl93LdH117jEKYl3Cm',
      title: 'Essence \u2022 Wizkid ft. Tems',
      name: 'Essence 🇳🇬'
    },
    {
      id: '47hsUYxvbTlBAN3sP9dEOd',
      title: 'Love Me JeJe \u2022 Tems',
      name: 'Love Me JeJe 🤍'
    },
    {
      id: '25Y23PZ6oN3Xo3W3Qz5H4Y',
      title: 'Die With A Smile \u2022 Bruno Mars & Lady Gaga',
      name: 'Die With A Smile ✨'
    }
  ]
};

// ── 1. SCROLL REVEAL ──────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
reveals.forEach(el => revealObs.observe(el));

// ── 2. HEADER HIDE/SHOW ON SCROLL ─────────────────────────────────
let lastY = 0;
const header = document.querySelector('header');
if (header) {
  header.style.transition = 'transform .3s ease';
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header.style.transform = y > lastY ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });
}

// ── 3. DAYS COUNTER ANIMATION ─────────────────────────────────────
const daysEl = document.getElementById('daysCount');
if (daysEl) {
  const birth = new Date(CONFIG.birthdayDate);
  const today = new Date();
  const targetDays = Math.max(7305, Math.floor((today - birth) / (1000 * 60 * 60 * 24)));
  
  let counterAnimated = false;
  const counterObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counterAnimated) {
      counterAnimated = true;
      counterObs.disconnect();
      
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * targetDays);
        daysEl.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else daysEl.textContent = targetDays.toLocaleString();
      }
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.3 });
  counterObs.observe(daysEl);
}

// ── 4. FLOATING HEARTS ────────────────────────────────────────────
const heartsBox = document.getElementById('hearts');
const heartEmojis = ['❤️', '💙', '🩵', '💛', '✨', '🎂', '💝', '🕊️'];
function spawnHeart() {
  if (!heartsBox) return;
  const h = document.createElement('div');
  h.className = 'heart-el';
  h.setAttribute('aria-hidden', 'true');
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  const dur = 6 + Math.random() * 5;
  h.style.cssText = `
    left: ${Math.random() * 96 + 2}vw;
    font-size: ${0.75 + Math.random() * 0.8}rem;
    animation-duration: ${dur}s;
  `;
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}
for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 400);
setInterval(spawnHeart, 2600);

// ── 5. OUR STORY TABS ─────────────────────────────────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => {
      p.classList.remove('active');
      p.hidden = true;
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(target);
    if (panel) {
      panel.classList.add('active');
      panel.hidden = false;
    }
  });
});

// ── 6. PLACES MAP (Leaflet with custom pins) ──────────────────────
const mapEl = document.getElementById('placesMap');
if (mapEl && typeof L !== 'undefined') {
  const center = [CONFIG.mapPlaces[0].lat, CONFIG.mapPlaces[0].lng];
  const map = L.map('placesMap', {
    scrollWheelZoom: false,
    tap: !L.Browser.mobile,
  }).setView(center, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: '<div style="background:#1a3a6b;width:16px;height:16px;border-radius:50%;border:3px solid #faf8f3;box-shadow:0 3px 10px rgba(26,58,107,.45)"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  CONFIG.mapPlaces.forEach(p => {
    L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong style="font-family:serif;color:#1a3a6b;font-size:1rem">${p.label}</strong><br><em style="color:#555;font-size:.85rem">${p.note}</em>`);
  });

  // Ensure map tiles redraw crisply when scrolled into view
  const mapObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      map.invalidateSize();
      mapObs.disconnect();
    }
  }, { threshold: 0.2 });
  mapObs.observe(mapEl);
}

// ── 7. GALLERY FILTERS & LIGHTBOX ─────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const memoryItems = document.querySelectorAll('.memory');
let activeFilter  = 'all';

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    memoryItems.forEach(item => {
      const cat = item.dataset.category || 'all';
      const matches = activeFilter === 'all' || cat === activeFilter;
      item.classList.toggle('hidden', !matches);
    });
  });
});

// Lightbox
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbCounter = document.getElementById('lbCounter');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

function getVisibleGalleryImages() {
  const imgs = [];
  document.querySelectorAll('.memory:not(.hidden) img').forEach(img => {
    const fig = img.closest('figure');
    const cap = fig ? fig.querySelector('figcaption span:last-child') : null;
    imgs.push({
      el: img,
      src: img.src,
      alt: img.alt,
      caption: cap ? cap.textContent.trim() : (img.alt || '')
    });
  });
  return imgs;
}

let galleryImgs = [];
let currentLbIdx = 0;

function openLightboxForImage(targetImg) {
  galleryImgs = getVisibleGalleryImages();
  if (!galleryImgs.length || !lightbox) return;
  const foundIdx = galleryImgs.findIndex(item => item.el === targetImg);
  currentLbIdx = foundIdx >= 0 ? foundIdx : 0;
  showLbImage();
  lightbox.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  if (lbClose) lbClose.focus();
}

function showLbImage() {
  if (!galleryImgs[currentLbIdx]) return;
  const item = galleryImgs[currentLbIdx];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  if (lbCaption) lbCaption.textContent = item.caption;
  if (lbCounter) lbCounter.textContent = `${currentLbIdx + 1} / ${galleryImgs.length}`;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.setAttribute('hidden', '');
  document.body.style.overflow = '';
  lbImg.src = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click', () => {
  currentLbIdx = (currentLbIdx - 1 + galleryImgs.length) % galleryImgs.length;
  showLbImage();
});
if (lbNext)  lbNext.addEventListener('click', () => {
  currentLbIdx = (currentLbIdx + 1) % galleryImgs.length;
  showLbImage();
});

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || lightbox.hasAttribute('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    currentLbIdx = (currentLbIdx - 1 + galleryImgs.length) % galleryImgs.length;
    showLbImage();
  }
  if (e.key === 'ArrowRight') {
    currentLbIdx = (currentLbIdx + 1) % galleryImgs.length;
    showLbImage();
  }
});

// Lightbox swipe gesture for mobile
let lbTouchStartX = 0;
if (lightbox) {
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - lbTouchStartX;
    if (diff > 45) {
      currentLbIdx = (currentLbIdx - 1 + galleryImgs.length) % galleryImgs.length;
      showLbImage();
    } else if (diff < -45) {
      currentLbIdx = (currentLbIdx + 1) % galleryImgs.length;
      showLbImage();
    }
  }, { passive: true });
}

// Attach click to all memory images
document.querySelectorAll('.memory img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightboxForImage(img));
});

// ── 8. MEMORY JAR (3D Flip Cards) ─────────────────────────────────
document.querySelectorAll('.jar-card').forEach(card => {
  const front = card.querySelector('.jar-front');
  const back  = card.querySelector('.jar-back');
  if (front && back && !card.querySelector('.jar-card-inner')) {
    const inner = document.createElement('div');
    inner.className = 'jar-card-inner';
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
  }
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// ── 9. FUN STATS ANIMATION ────────────────────────────────────────
const statsSection = document.getElementById('fun-stats');
let statsAnimated = false;

function animateStats() {
  document.querySelectorAll('.stat-item').forEach(item => {
    const numEl = item.querySelector('.stat-num');
    if (!numEl) return;
    const txt = numEl.textContent.trim();
    if (txt === '20') {
      let val = 0;
      const t = setInterval(() => {
        val++;
        numEl.textContent = val;
        if (val >= 20) clearInterval(t);
      }, 45);
    } else if (txt.includes('100')) {
      let val = 0;
      const t = setInterval(() => {
        val += 5;
        numEl.innerHTML = `${val}<small>%</small>`;
        if (val >= 100) clearInterval(t);
      }, 35);
    } else if (txt.includes('365')) {
      let val = 0;
      const t = setInterval(() => {
        val += 25;
        if (val >= 365) {
          numEl.innerHTML = `365<small>+</small>`;
          clearInterval(t);
        } else {
          numEl.innerHTML = `${val}<small>+</small>`;
        }
      }, 35);
    }
  });
}

if (statsSection) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statsObs.disconnect();
      animateStats();
    }
  }, { threshold: 0.25 });
  statsObs.observe(statsSection);
}

// ── 10. REASONS CAROUSEL ──────────────────────────────────────────
const reasonCards    = document.querySelectorAll('.reason-card');
const reasonPrev     = document.getElementById('reasonPrev');
const reasonNext     = document.getElementById('reasonNext');
const reasonProgress = document.getElementById('reasonProgress');
let currentReason    = 0;

function showReason(idx) {
  reasonCards.forEach(c => { c.classList.remove('active'); c.hidden = true; });
  reasonCards[idx].classList.add('active');
  reasonCards[idx].hidden = false;
  if (reasonProgress) reasonProgress.textContent = `${idx + 1} \u2014 ${reasonCards.length}`;
  if (reasonPrev) reasonPrev.disabled = idx === 0;
  if (reasonNext) reasonNext.disabled = idx === reasonCards.length - 1;
}

if (reasonCards.length) {
  showReason(0);
  if (reasonPrev) reasonPrev.addEventListener('click', () => { if (currentReason > 0) showReason(--currentReason); });
  if (reasonNext) reasonNext.addEventListener('click', () => { if (currentReason < reasonCards.length - 1) showReason(++currentReason); });

  // Touch swipe support for reasons
  const reasonsWrap = document.querySelector('.reasons-wrap');
  let reasonStartX = 0;
  if (reasonsWrap) {
    reasonsWrap.addEventListener('touchstart', (e) => {
      reasonStartX = e.touches[0].clientX;
    }, { passive: true });
    reasonsWrap.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - reasonStartX;
      if (diff > 50 && currentReason > 0) showReason(--currentReason);
      else if (diff < -50 && currentReason < reasonCards.length - 1) showReason(++currentReason);
    }, { passive: true });
  }
}

// ── 11. SECRET PASSWORD ───────────────────────────────────────────
const secretInput   = document.getElementById('secretInput');
const secretSubmit  = document.getElementById('secretSubmit');
const secretLock    = document.getElementById('secretLock');
const secretContent = document.getElementById('secretContent');
const secretHint    = document.getElementById('secretHint');

function tryUnlockSecret() {
  if (!secretInput) return;
  const val = secretInput.value.trim().toLowerCase();
  
  if (CONFIG.validPasswords.includes(val)) {
    secretLock.style.display = 'none';
    secretContent.removeAttribute('hidden');
    secretContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof confetti === 'function') {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  } else {
    if (secretHint) {
      secretHint.textContent = "Not quite\u2026 Hint: It's his favourite 3-letter nickname for you (starts with 'i') 💙";
    }
    secretInput.classList.remove('shake');
    void secretInput.offsetWidth; // retrigger reflow
    secretInput.classList.add('shake');
    secretInput.value = '';
    secretInput.focus();
    setTimeout(() => secretInput.classList.remove('shake'), 600);
  }
}

if (secretSubmit) secretSubmit.addEventListener('click', tryUnlockSecret);
if (secretInput)  secretInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlockSecret(); });

// ── 12. ANNIVERSARY COUNTDOWN (With Seconds) ──────────────────────
const annivDaysEl  = document.getElementById('annivDays');
const annivHrsEl   = document.getElementById('annivHours');
const annivMinsEl  = document.getElementById('annivMins');
const annivSecsEl  = document.getElementById('annivSecs');
const annivSealed  = document.getElementById('annivSealed');
const annivContent = document.getElementById('annivContent');

function updateAnniversaryTimer() {
  const unlock = new Date(CONFIG.anniversaryDate);
  const now    = new Date();
  const diff   = unlock - now;
  
  if (diff <= 0) {
    if (annivSealed)  annivSealed.setAttribute('hidden', '');
    if (annivContent) annivContent.removeAttribute('hidden');
    return;
  }
  
  const totalSeconds = Math.floor(diff / 1000);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const days = Math.floor(totalSeconds / 86400);

  if (annivDaysEl) annivDaysEl.textContent = String(days).padStart(2, '0');
  if (annivHrsEl)  annivHrsEl.textContent  = String(hours).padStart(2, '0');
  if (annivMinsEl) annivMinsEl.textContent = String(mins).padStart(2, '0');
  if (annivSecsEl) annivSecsEl.textContent = String(secs).padStart(2, '0');
}
if (annivDaysEl) {
  updateAnniversaryTimer();
  setInterval(updateAnniversaryTimer, 1000);
}

// ── 13. LETTER SECTION (Typing + Staggered Fade) ───────────────────
const salutation = document.querySelector('.salutation');
const letterParas = document.querySelectorAll('.letter-body p:not(.salutation)');

if (salutation && letterParas.length) {
  letterParas.forEach(p => p.classList.add('letter-para-hidden'));

  // Safety timer: ensure letter paragraphs are always visible after 4 seconds
  setTimeout(() => {
    letterParas.forEach(p => p.classList.add('letter-para-visible'));
  }, 4500);

  let letterAnimated = false;
  const letterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !letterAnimated) {
        letterAnimated = true;
        letterObs.disconnect();
        const text = salutation.textContent;
        salutation.textContent = '';
        let i = 0;
        const type = () => {
          if (i < text.length) {
            salutation.textContent += text[i++];
            setTimeout(type, 35);
          } else {
            letterParas.forEach((p, idx) => {
              setTimeout(() => p.classList.add('letter-para-visible'), idx * 160);
            });
          }
        };
        setTimeout(type, 200);
      }
    });
  }, { threshold: 0.35 });
  letterObs.observe(salutation);
}

// ── 14. CLOSING REVEAL BUTTON ─────────────────────────────────────
const revealBtn = document.getElementById('reveal-answer');
const revealAns = document.getElementById('honest-answer');
if (revealBtn && revealAns) {
  revealBtn.addEventListener('click', () => {
    const open = revealBtn.getAttribute('aria-expanded') === 'true';
    if (!open) {
      revealAns.removeAttribute('hidden');
      revealBtn.setAttribute('aria-expanded', 'true');
      revealBtn.textContent = "okay, let's not make it weird. 💙";
    } else {
      revealAns.setAttribute('hidden', '');
      revealBtn.setAttribute('aria-expanded', 'false');
      revealBtn.innerHTML = 'Read it <svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 19 19 5M8 5h11v11"/></svg>';
    }
  });
}

// ── 15. PERFECTED ROMANTIC MUSIC SUITE ────────────────────────────
const musicToggle    = document.getElementById('musicToggle');
const musicEmbed     = document.getElementById('musicEmbed');
const musicClose     = document.getElementById('musicClose');
const spotifyFrame   = document.getElementById('spotifyFrame');
const songTabs       = document.querySelectorAll('.song-tab');
const nowPlayingText = document.getElementById('musicNowPlaying');
const ambientToggle  = document.getElementById('ambientToggle');

let currentTrackId = '5FG7Tl93LdH117jEKYl3Cm'; // Default: Essence

// Spotify Embed Toggle
if (musicToggle && musicEmbed) {
  function openMusicPlayer() {
    musicEmbed.removeAttribute('hidden');
    musicToggle.classList.add('playing');
    if (spotifyFrame && !spotifyFrame.src) {
      spotifyFrame.src = `https://open.spotify.com/embed/track/${currentTrackId}?utm_source=generator&theme=0`;
    }
  }

  function closeMusicPlayer() {
    musicEmbed.setAttribute('hidden', '');
    if (!isAmbientPlaying) {
      musicToggle.classList.remove('playing');
    }
  }

  musicToggle.addEventListener('click', () => {
    if (musicEmbed.hasAttribute('hidden')) openMusicPlayer();
    else closeMusicPlayer();
  });

  if (musicClose) musicClose.addEventListener('click', closeMusicPlayer);

  // Song tab switcher
  songTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      songTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const trackId = tab.dataset.track;
      const title   = tab.dataset.title;
      currentTrackId = trackId;
      if (nowPlayingText) nowPlayingText.innerHTML = title;
      if (spotifyFrame) {
        spotifyFrame.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
      }
    });
  });
}

// Web Audio API: Romantic Acoustic Piano Chords generator
// Plays a warm, emotional romantic chord progression directly in the browser!
let audioCtx = null;
let isAmbientPlaying = false;
let ambientInterval = null;

function createPianoChord(frequencies, startTime, duration) {
  if (!audioCtx) return;
  frequencies.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; // warm acoustic feel
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  });
}

// Romantic progression in C / Am (Cmaj7 -> Am9 -> Fmaj7 -> Gsus4)
const chordProgression = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
  [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
  [174.61, 261.63, 329.63, 349.23], // Fmaj7 (F3, C4, E4, F4)
  [196.00, 261.63, 293.66, 392.00], // Gsus4 (G3, C4, D4, G4)
];

function startAmbientChords() {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  isAmbientPlaying = true;
  if (ambientToggle) {
    ambientToggle.classList.add('active');
    ambientToggle.querySelector('.ambient-text').textContent = 'Pause Melody';
  }
  if (musicToggle) musicToggle.classList.add('playing');

  let chordIndex = 0;
  function playNextChord() {
    if (!isAmbientPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    createPianoChord(chordProgression[chordIndex], now, 3.4);
    chordIndex = (chordIndex + 1) % chordProgression.length;
  }

  playNextChord();
  ambientInterval = setInterval(playNextChord, 3500);
}

function stopAmbientChords() {
  isAmbientPlaying = false;
  if (ambientInterval) clearInterval(ambientInterval);
  ambientInterval = null;
  if (ambientToggle) {
    ambientToggle.classList.remove('active');
    ambientToggle.querySelector('.ambient-text').textContent = 'Play Romantic Melody';
  }
  if (musicToggle && (!spotifyFrame || !spotifyFrame.src)) {
    musicToggle.classList.remove('playing');
  }
}

if (ambientToggle) {
  ambientToggle.addEventListener('click', () => {
    if (isAmbientPlaying) stopAmbientChords();
    else startAmbientChords();
  });
}
