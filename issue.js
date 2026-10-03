/* ─────────────────────────────────────────
   BOLAJI BIRTHDAY SITE — issue.js v2
   ───────────────────────────────────────── */

// ── Scroll reveal ──────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
reveals.forEach(el => revealObs.observe(el));

// ── Header hide/show on scroll ─────────────────────────────────────────────
let lastY = 0;
const header = document.querySelector('header');
if (header) {
  header.style.transition = 'transform .3s ease';
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) header.style.transform = y > lastY ? 'translateY(-100%)' : 'translateY(0)';
    else header.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive: true });
}

// ── Closing reveal button ──────────────────────────────────────────────────
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

// ── Floating hearts ────────────────────────────────────────────────────────
const heartsBox = document.getElementById('hearts');
const heartEmojis = ['❤️','💙','🩵','💛','✨','🎂','💝'];
function spawnHeart() {
  if (!heartsBox) return;
  const h = document.createElement('div');
  h.className = 'heart-el';
  h.setAttribute('aria-hidden', 'true');
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  const dur = 6 + Math.random() * 6;
  h.style.cssText = `
    left: ${Math.random() * 100}vw;
    font-size: ${0.7 + Math.random() * 0.9}rem;
    animation-duration: ${dur}s;
  `;
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}
// Spawn a gentle trickle — only a few at a time
for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 400);
setInterval(spawnHeart, 2800);

// ── Story Tabs ─────────────────────────────────────────────────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
    btn.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) { panel.classList.add('active'); panel.hidden = false; }
  });
});

// ── Gallery Filters ────────────────────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const memoryItems = document.querySelectorAll('.memory');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    memoryItems.forEach(item => {
      const cat = item.dataset.category || 'all';
      item.classList.toggle('hidden', filter !== 'all' && cat !== filter);
    });
  });
});

// ── Lightbox ───────────────────────────────────────────────────────────────
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbCounter = document.getElementById('lbCounter');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

// Collect all images in the memory grid (excluding childhood pair — they're small)
function getGalleryImages() {
  const imgs = [];
  document.querySelectorAll('.memory img').forEach(img => {
    const fig = img.closest('figure');
    const captionEl = fig ? fig.querySelector('figcaption span:last-child') : null;
    imgs.push({ src: img.src, alt: img.alt, caption: captionEl ? captionEl.textContent : '' });
  });
  return imgs;
}

let galleryImgs = [];
let currentIdx  = 0;

function openLightbox(idx) {
  galleryImgs = getGalleryImages();
  if (!galleryImgs.length || !lightbox) return;
  currentIdx = Math.max(0, Math.min(idx, galleryImgs.length - 1));
  showLbImage();
  lightbox.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function showLbImage() {
  const item = galleryImgs[currentIdx];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  lbCaption.textContent = item.caption;
  lbCounter.textContent = `${currentIdx + 1} / ${galleryImgs.length}`;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.setAttribute('hidden', '');
  document.body.style.overflow = '';
  lbImg.src = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click', () => { currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length; showLbImage(); });
if (lbNext)  lbNext.addEventListener('click', () => { currentIdx = (currentIdx + 1) % galleryImgs.length; showLbImage(); });

// Click backdrop to close
if (lightbox) {
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox || lightbox.hasAttribute('hidden')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length; showLbImage(); }
  if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % galleryImgs.length; showLbImage(); }
});

// Make memory images clickable
document.querySelectorAll('.memory img').forEach((img, i) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightbox(i));
});

/* ═══════════════════════════════════════════
   NEW FEATURES v3
   ═══════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
// ⚙️  CONFIG — MUSTY: edit these values
// ─────────────────────────────────────────────────────────────────
const CONFIG = {
  // Days counter: set to her date of birth or the day you started dating
  birthdayDate: '2006-10-03',   // CHANGE THIS → her birthday (YYYY-MM-DD)

  // Anniversary sealed section: set the date to unlock
  anniversaryDate: '2027-10-03', // CHANGE THIS → the unlock date (YYYY-MM-DD)

  // Secret password (lowercase)
  secretPassword: 'ife',         // CHANGE THIS → her nickname or your word

  // Map: set coordinates of your special places
  mapPlaces: [
    { lat: 6.5244, lng: 3.3792, label: 'Where we first met', note: 'The very beginning.' },
    { lat: 6.5355, lng: 3.3087, label: 'Our favourite spot', note: 'This place is ours.' },
    { lat: 6.4698, lng: 3.5852, label: 'Where it all became real', note: 'Something shifted here.' },
  ],
};
// ─────────────────────────────────────────────────────────────────

// ── DAYS COUNTER ──────────────────────────────────────────────────
const daysEl = document.getElementById('daysCount');
if (daysEl) {
  const birth = new Date(CONFIG.birthdayDate);
  const today = new Date();
  const days  = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
  daysEl.textContent = days > 0 ? days.toLocaleString() : '20';
}

// ── MUSIC PLAYER ──────────────────────────────────────────────────
const musicToggle = document.getElementById('musicToggle');
const bgMusic     = document.getElementById('bgMusic');
const musicPlayer = document.getElementById('musicPlayer');
if (musicToggle && bgMusic) {
  let playing = false;
  musicToggle.addEventListener('click', () => {
    if (playing) {
      bgMusic.pause();
      musicToggle.querySelector('.music-icon').innerHTML = '&#9654;';
      musicToggle.classList.remove('playing');
    } else {
      bgMusic.play().catch(() => {});
      musicToggle.querySelector('.music-icon').innerHTML = '&#9646;&#9646;';
      musicToggle.classList.add('playing');
    }
    playing = !playing;
  });
}

// ── PLACES MAP ────────────────────────────────────────────────────
const mapEl = document.getElementById('placesMap');
if (mapEl && typeof L !== 'undefined') {
  const center = [CONFIG.mapPlaces[0].lat, CONFIG.mapPlaces[0].lng];
  const map = L.map('placesMap', { scrollWheelZoom: false }).setView(center, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);
  const icon = L.divIcon({
    className: '',
    html: '<div style="background:#1a3a6b;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  CONFIG.mapPlaces.forEach(p => {
    L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong style="font-family:serif;color:#1a3a6b">${p.label}</strong><br><em>${p.note}</em>`);
  });
}

// ── MEMORY JAR ────────────────────────────────────────────────────
document.querySelectorAll('.jar-card').forEach(card => {
  // Wrap inner content in a flip container
  const front = card.querySelector('.jar-front');
  const back  = card.querySelector('.jar-back');
  const inner = document.createElement('div');
  inner.className = 'jar-card-inner';
  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// ── REASONS CAROUSEL ──────────────────────────────────────────────
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
}

// ── SECRET PASSWORD ───────────────────────────────────────────────
const secretInput   = document.getElementById('secretInput');
const secretSubmit  = document.getElementById('secretSubmit');
const secretLock    = document.getElementById('secretLock');
const secretContent = document.getElementById('secretContent');
const secretHint    = document.getElementById('secretHint');

function tryUnlock() {
  if (!secretInput) return;
  const val = secretInput.value.trim().toLowerCase();
  if (val === CONFIG.secretPassword) {
    secretLock.style.display = 'none';
    secretContent.removeAttribute('hidden');
    secretContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    if (secretHint) secretHint.textContent = 'not quite\u2026 try again. you know this one \uD83D\uDE09';
    secretInput.value = '';
    secretInput.focus();
    secretInput.style.borderColor = '#c0392b';
    setTimeout(() => { if (secretInput) secretInput.style.borderColor = ''; }, 1200);
  }
}
if (secretSubmit) secretSubmit.addEventListener('click', tryUnlock);
if (secretInput) secretInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

// ── ANNIVERSARY COUNTDOWN ─────────────────────────────────────────
const annivDaysEl  = document.getElementById('annivDays');
const annivHrsEl   = document.getElementById('annivHours');
const annivMinsEl  = document.getElementById('annivMins');
const annivSealed  = document.getElementById('annivSealed');
const annivContent = document.getElementById('annivContent');

function updateAnniv() {
  const unlock = new Date(CONFIG.anniversaryDate);
  const now    = new Date();
  const diff   = unlock - now;
  if (diff <= 0) {
    // Unlock!
    if (annivSealed)  annivSealed.setAttribute('hidden', '');
    if (annivContent) annivContent.removeAttribute('hidden');
    return;
  }
  const totalMins  = Math.floor(diff / 60000);
  const mins  = totalMins % 60;
  const hours = Math.floor(totalMins / 60) % 24;
  const days  = Math.floor(totalMins / 60 / 24);
  if (annivDaysEl) annivDaysEl.textContent = String(days).padStart(2, '0');
  if (annivHrsEl)  annivHrsEl.textContent  = String(hours).padStart(2, '0');
  if (annivMinsEl) annivMinsEl.textContent = String(mins).padStart(2, '0');
}
if (annivDaysEl) { updateAnniv(); setInterval(updateAnniv, 30000); }

// ── LETTER TYPING ANIMATION ───────────────────────────────────────
const salutation = document.querySelector('.salutation');
const letterParas = document.querySelectorAll('.letter-body p:not(.salutation)');

if (salutation && letterParas.length) {
  // Hide all paragraphs initially
  letterParas.forEach(p => p.classList.add('letter-para-hidden'));

  // Type out the salutation when it scrolls into view
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
            setTimeout(type, 38);
          } else {
            // Fade in paragraphs one by one
            letterParas.forEach((p, idx) => {
              setTimeout(() => p.classList.add('letter-para-visible'), idx * 180);
            });
          }
        };
        setTimeout(type, 300);
      }
    });
  }, { threshold: 0.5 });
  if (salutation) letterObs.observe(salutation);
}
