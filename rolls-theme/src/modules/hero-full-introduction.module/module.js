const MODULE_SELECTOR = '.hero-full-introduction';

const syncHeaderHeight = (header) => {
  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
};

const initHeaderAwareAnchors = () => {
  const header = document.getElementById('header');
  const moduleEl = document.querySelector(MODULE_SELECTOR);

  if (!header || !moduleEl) return;

  syncHeaderHeight(header);

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => syncHeaderHeight(header)).observe(header);
  } else {
    window.addEventListener('resize', () => syncHeaderHeight(header), { passive: true });
  }

  moduleEl.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderAwareAnchors);
} else {
  initHeaderAwareAnchors();
}
