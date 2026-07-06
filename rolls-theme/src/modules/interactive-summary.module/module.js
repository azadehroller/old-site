const paragraphs = document.querySelectorAll('.interactive-summary-description p');
const allChars = [];

if (paragraphs.length) {
  /* ---------- Walk & wrap text nodes ---------- */
  paragraphs.forEach(paragraph => {
    const walker = document.createTreeWalker(
      paragraph,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const parent = textNode.parentElement;
      const isLink = parent.closest('a') !== null;

      const fragment = document.createDocumentFragment();

      textNode.textContent.split('').forEach(char => {
        if (char === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          span.dataset.link = isLink ? 'true' : 'false';

          if (isLink) {
            span.style.color = '#3A80F8';
            span.style.opacity = '0.7';
          } else {
            span.style.color = '#3A80F8';
            span.style.opacity = '0.7';
          }

          fragment.appendChild(span);
          allChars.push(span);
        }
      });

      parent.replaceChild(fragment, textNode);
    });
  });
}

/* ---------- Header-aware anchor scroll ---------- */
(function () {
  var header = document.getElementById('header');
  if (!header) return;

  function syncHeight() {
    document.documentElement.style.setProperty(
      '--header-height',
      header.offsetHeight + 'px'
    );
  }

  syncHeight();

  if (window.ResizeObserver) {
    new ResizeObserver(syncHeight).observe(header);
  } else {
    window.addEventListener('resize', syncHeight);
  }

  var moduleEl = document.querySelector('.interactive-summary-module');
  if (!moduleEl) return;

  moduleEl.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href').slice(1);
    if (!id) return;

    var target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    var top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
})();

/* ---------- Scroll animation ---------- */
const section = document.querySelector('.interactive-summary-module');

if (section && allChars.length) {
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    const start = vh * 0.65;
    const end = vh * 0.1;

    const progress = Math.min(
      Math.max((start - rect.top) / (start - end), 0),
      1
    );

    const revealCount = Math.floor(progress * allChars.length);

    allChars.forEach((char, i) => {
      const isLink = char.dataset.link === 'true';

      if (i < revealCount) {
        char.style.color = isLink ? '#074DC5' : '#ffffff';
        char.style.opacity = '1';
      } else {
        char.style.color = isLink ? '#3A80F8' : '#074DC5';
        char.style.opacity = '0.7';
      }
    });
  });
}
