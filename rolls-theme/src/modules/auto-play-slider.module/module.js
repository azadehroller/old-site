(() => {
  if (window.hsInEditor) return;

  const root = document.getElementById('aps-{{ module._uid }}');
  if (!root) return;

  const track = root.querySelector('.aps__track');
  const slides = [...root.querySelectorAll('.aps__slide')];
  const speed = Number(root.dataset.speed) || 1000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SWIPE_THRESHOLD = 50;
  const totalReal = slides.length;

  if (totalReal < 2) return;

  // Clone first slide and append for seamless looping
  const clone = slides[0].cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  let current = 0;
  let timer = null;
  let paused = false;
  let transitioning = false;

  const moveTo = (index, animate = true) => {
    transitioning = animate;
    track.style.transition = animate
      ? 'transform var(--aps-transition-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
    current = index;
  };

  // When transition to the clone ends, instantly jump to the real first slide
  track.addEventListener('transitionend', () => {
    if (current >= totalReal) {
      moveTo(0, false);
    }
    transitioning = false;
  });

  const next = () => {
    if (transitioning) return;
    moveTo(current + 1);
  };

  const prev = () => {
    if (transitioning) return;
    if (current === 0) {
      // Jump to clone position instantly, then animate to last real slide
      moveTo(totalReal, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          moveTo(totalReal - 1);
        });
      });
    } else {
      moveTo(current - 1);
    }
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const play = () => {
    if (prefersReducedMotion) return;
    stop();
    timer = setInterval(() => {
      if (!paused) next();
    }, speed);
  };

  root.addEventListener('mouseenter', () => { paused = true; });
  root.addEventListener('mouseleave', () => { paused = false; });
  root.addEventListener('focusin', () => { paused = true; });
  root.addEventListener('focusout', () => { paused = false; });

  /* Dot controls — commented out for now
  const dots = [...root.querySelectorAll('.aps__dot')];
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      moveTo(Number(dot.dataset.index));
      play();
    });
  });
  */

  let touchStartX = 0;

  root.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  root.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? next() : prev();
      play();
    }
  }, { passive: true });

  const observer = new IntersectionObserver(
    ([entry]) => {
      entry.isIntersecting ? play() : stop();
    },
    { threshold: 0.25 }
  );
  observer.observe(root);

  play();
})();
