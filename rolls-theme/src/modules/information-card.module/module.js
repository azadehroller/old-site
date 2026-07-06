// ======================================================
// Split text into grapheme-safe spans
// ======================================================
document.querySelectorAll('.information-card .animate-text').forEach(el => {
  const text = el.textContent.trim();
  el.textContent = '';

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  for (const { segment } of segmenter.segment(text)) {
    const span = document.createElement('span');
    span.textContent = segment === ' ' ? '\u00A0' : segment;
    el.appendChild(span);
  }
});
