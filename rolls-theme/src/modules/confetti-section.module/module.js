// Confetti Section Module
// Triggers confetti when the section scrolls into view

function launchConfetti() {
  const duration = 1000;
  const end = Date.now() + duration;

  (function frame() {
    // Launch from left side
    confetti({
      particleCount: 2,
      spread: 80,
      startVelocity: 12,
      scalar: 1,
      gravity: 0.3,
      ticks: 250,
      colors: ["#0960F6", "#FF290C", "#FFD500"],
      origin: { x: Math.random() * 0.3, y: 0.5 + Math.random() * 0.3 }
    });

    // Launch from right side
    confetti({
      particleCount: 2,
      spread: 80,
      startVelocity: 12,
      scalar: 1,
      gravity: 0.3,
      ticks: 250,
      colors: ["#0960F6", "#FF290C", "#FFD500"],
      origin: { x: 0.7 + Math.random() * 0.3, y: 0.5 + Math.random() * 0.3 }
    });

    // Launch from center
    confetti({
      particleCount: 1,
      spread: 120,
      startVelocity: 10,
      scalar: 1.0,
      gravity: 0.3,
      ticks: 250,
      colors: ["#0960F6", "#FF290C", "#FFD500"],
      origin: { x: 0.3 + Math.random() * 0.4, y: 0.5 + Math.random() * 0.3 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function initConfettiSections() {
  const sections = document.querySelectorAll('[data-confetti-section]');
  
  if (sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reset the flag when it leaves viewport so it can trigger again
        if (!entry.target.dataset.triggered) {
          entry.target.dataset.triggered = 'true';
          launchConfetti();
        }
      } else {
        // Allow re-triggering when section leaves and re-enters viewport
        entry.target.dataset.triggered = '';
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

// Initialize when confetti library is ready
function waitForConfetti() {
  if (typeof confetti === 'function') {
    initConfettiSections();
  } else {
    setTimeout(waitForConfetti, 100);
  }
}

if (document.readyState === 'complete') {
  waitForConfetti();
} else {
  window.addEventListener('load', waitForConfetti);
}
