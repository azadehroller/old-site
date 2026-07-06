// (function() {
//   'use strict';

//   function initLocationAccordions() {
//     var accordionContainers = document.querySelectorAll('.location-accordions');

//     accordionContainers.forEach(function(container) {
//       var details = container.querySelectorAll('details');

//       details.forEach(function(detail) {
//         detail.addEventListener('toggle', function() {
//           if (this.open) {
//             details.forEach(function(otherDetail) {
//               if (otherDetail !== detail && otherDetail.open) {
//                 otherDetail.open = false;
//               }
//             });
//           }
//         });
//       });
//     });
//   }

//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initLocationAccordions);
//   } else {
//     initLocationAccordions();
//   }
// })();
const paragraph = document.querySelector('.location-description p');
const allChars = [];

/* ---------- Walk & wrap text nodes ---------- */
const walker = document.createTreeWalker(
  paragraph,
  NodeFilter.SHOW_TEXT,
  {
    acceptNode(node) {
      // skip empty text
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  }
);

const textNodes = [];
let node;

// collect first (important!)
while ((node = walker.nextNode())) {
  textNodes.push(node);
}

// wrap each text node
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

      // initial styles
      if (isLink) {
        span.style.color = '#3A80F8';
        span.style.opacity = '0.7';
      } else {
        span.style.color = '#9ca3af';
        span.style.opacity = '0.7';
      }

      fragment.appendChild(span);
      allChars.push(span);
    }
  });

  parent.replaceChild(fragment, textNode);
});

/* ---------- Scroll animation ---------- */
const section = document.querySelector('.location-module');

window.addEventListener('scroll', () => {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;

  // Animation begins after scrolling 40% of the viewport past the module entering view
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
      // revealed
      char.style.color = isLink ? '#074DC5' : '#ffffff';
      char.style.opacity = '1';
    } else {
      // unrevealed
      char.style.color = isLink ? '#3A80F8' : '#074DC5';
      char.style.opacity = '0.7';
    }
  });
});
