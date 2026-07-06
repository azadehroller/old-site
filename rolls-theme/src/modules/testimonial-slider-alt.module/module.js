// --- SELECTORS ---
const slider     = document.querySelector('.slider');
const slides     = Array.from(slider.querySelectorAll('.slide'));
const leftArrow  = document.querySelector('#js-button-previous');
const rightArrow = document.querySelector('#js-button-next');

if (!slider || !slides.length || !leftArrow || !rightArrow) {
  throw new Error('Slider, slides, or arrows not found.');
}

// --- CONSTANTS / HELPERS ---
const EPS = window.devicePixelRatio > 1 ? 3 : 2;          // tolerance for sub-pixels
const SNAP_TAIL = 16 * (window.devicePixelRatio || 1);    // if you're within ~16px of the end, snap
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function getMaxScrollLeft() {
  return Math.max(0, slider.scrollWidth - slider.clientWidth);
}
function leftOf(i) {
  return i === 0 ? 0 : slides[i].offsetLeft;
}
function centerOf(i) {
  const s = slides[i];
  return s.offsetLeft + s.offsetWidth / 2;
}
function getNearestIndex() {
  const cx = slider.scrollLeft + slider.clientWidth / 2;
  let best = 0, bestDist = Infinity;
  for (let i = 0; i < slides.length; i++) {
    const d = Math.abs(centerOf(i) - cx);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

/** Scroll to slide; last slide snaps to absolute end to avoid trailing gap. */
function scrollToSlide(index) {
  const i = clamp(index, 0, slides.length - 1);
  const max = getMaxScrollLeft();
  const left = (i === slides.length - 1) ? max : leftOf(i);
  slider.scrollTo({ left, behavior: 'smooth' });
}

/** Enable/disable arrows by pixel reachability, with tolerance. */
function updateArrows() {
  const max = getMaxScrollLeft();
  const scrollLeft = Math.max(0, Math.min(slider.scrollLeft, max));
  const remaining  = max - scrollLeft;

  const canScrollLeft  = scrollLeft > EPS;
  const canScrollRight = remaining > EPS;

  leftArrow.disabled  = !canScrollLeft;
  rightArrow.disabled = !canScrollRight;

  leftArrow.setAttribute('aria-disabled', String(!canScrollLeft));
  rightArrow.setAttribute('aria-disabled', String(!canScrollRight));
  leftArrow.classList.toggle('is-disabled', !canScrollLeft);
  rightArrow.classList.toggle('is-disabled', !canScrollRight);
}

/** If user swipes to the last slide or near the end, snap to maxScrollLeft. */
let _snapping = false;
function maybeSnapToEnd() {
  if (_snapping) return;
  const max = getMaxScrollLeft();
  const remaining = max - slider.scrollLeft;

  // Condition 1: last slide is the nearest
  const atLastByIndex = getNearestIndex() === slides.length - 1;
  // Condition 2: you're within a small trailing margin
  const nearEndByPixels = remaining <= SNAP_TAIL;

  if ((atLastByIndex || nearEndByPixels) && remaining > 0) {
    _snapping = true;
    // Smoothly finalize the end position; then clear the flag and update arrows.
    slider.scrollTo({ left: max, behavior: 'smooth' });
    // Give the smooth scroll a moment; then finalize state.
    setTimeout(() => {
      _snapping = false;
      updateArrows();
    }, 120);
  }
}

// --- EVENTS ---
leftArrow.addEventListener('click', () => {
  const i = getNearestIndex();
  const target = clamp(i - 1, 0, slides.length - 1);
  leftArrow.disabled = (target === 0);
  rightArrow.disabled = false;
  scrollToSlide(target);
});

rightArrow.addEventListener('click', () => {
  const i = getNearestIndex();
  const target = clamp(i + 1, 0, slides.length - 1);
  rightArrow.disabled = (target === slides.length - 1);
  leftArrow.disabled = false;
  scrollToSlide(target);
});

// Debounced scroll: update arrows and snap if appropriate after swipe/fling.
let t;
slider.addEventListener('scroll', () => {
  if (t) clearTimeout(t);
  t = setTimeout(() => {
    updateArrows();
    maybeSnapToEnd();
  }, 80);
});

// Keep in sync when sizes change (orientation, fonts, images).
const ro = new ResizeObserver(() => {
  updateArrows();
  // If we were effectively at the end before, re-snap to end after a resize.
  maybeSnapToEnd();
});
ro.observe(slider);

// Extra polish when supported
if ('onscrollend' in window) {
  slider.addEventListener('scrollend', () => {
    updateArrows();
    maybeSnapToEnd();
  });
}

// --- INIT after layout is actually ready ---
function init() {
  const imgs = Array.from(slider.querySelectorAll('img'));
  const pending = imgs.filter(img => !img.complete);
  if (pending.length) {
    let left = pending.length;
    const done = () => { if (--left === 0) { updateArrows(); maybeSnapToEnd(); } };
    pending.forEach(img => {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  } else {
    updateArrows();
    maybeSnapToEnd();
  }
}
if (document.readyState === 'complete') {
  requestAnimationFrame(init);
} else {
  window.addEventListener('load', () => requestAnimationFrame(init));
}
