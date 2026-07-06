/**
 * Special Metric Module - Sequential Icon Animation
 * Animates icons from dark to bright color when visible
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    delayBetweenIcons: 16, // milliseconds between each icon animation (calculated to complete in 1300ms for 76 icons: last icon starts at 1200ms, finishes at 1300ms)
    observerThreshold: 0.2, // percentage of module that must be visible
    rootMargin: '0px'
  };

  /**
   * Initialize the special metric module
   */
  function initSpecialMetric() {
    const modules = document.querySelectorAll('.special-metric.fade-in-on-scroll');

    if (!modules.length) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: CONFIG.observerThreshold,
      rootMargin: CONFIG.rootMargin
    });

    // Observe each module
    modules.forEach(module => {
      observer.observe(module);
    });
  }

  /**
   * Handle intersection observer callback
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   */
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const module = entry.target;

        // Add is-visible class when element intersects
        module.classList.add('is-visible');

        // Only animate if not already animated
        if (!module.classList.contains('is-animated')) {
          animateIcons(module);
          module.classList.add('is-animated');

          // Optional: stop observing after animation
          observer.unobserve(module);
        }
      }
    });
  }

  /**
   * Animate icons sequentially from left to right, top to bottom
   * @param {HTMLElement} module - The special metric module element
   */
  function animateIcons(module) {
    const iconsWrapper = module.querySelector('.special-metric__icons-wrapper');

    if (!iconsWrapper) return;

    const icons = iconsWrapper.querySelectorAll('.special-metric__icon');

    if (!icons.length) return;

    // Animate each icon with a delay
    icons.forEach((icon, index) => {
      setTimeout(() => {
        icon.classList.add('is-animated');
      }, index * CONFIG.delayBetweenIcons);
    });
  }

  /**
   * Initialize when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpecialMetric);
  } else {
    initSpecialMetric();
  }

  // Re-initialize if content is dynamically added (for HubSpot preview)
  if (window.hsInEditor) {
    window.addEventListener('message', function(event) {
      if (event.data.type === 'hsModuleUpdate') {
        setTimeout(initSpecialMetric, 100);
      }
    });
  }
})();
