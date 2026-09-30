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
