/* ============================================================
   Interactive Hero — HubSpot Module JS
   Transition from initial "grow" animation to continuous
   "breathing" animation on each orb.
   ============================================================ */
(function () {
  'use strict';

  var GROW_COMPLETE_MS = 4800; // 3.3s grow-in + 1.5s pause

  function startBreathing(root) {
    var orbs = root.querySelectorAll('.interactive-hero__orb');
    if (!orbs.length) return;
    orbs.forEach(function (orb) {
      orb.classList.add('is-breathing');
    });
  }

  function initModule(root) {
    if (!root || root.dataset.interactiveHeroInit === 'true') return;
    root.dataset.interactiveHeroInit = 'true';

    // Respect reduced-motion: skip the breathing transition entirely.
    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    window.setTimeout(function () {
      startBreathing(root);
    }, GROW_COMPLETE_MS);
  }

  function initAll() {
    var modules = document.querySelectorAll('.interactive-hero-module');
    modules.forEach(initModule);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
