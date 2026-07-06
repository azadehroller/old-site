(() => {
  'use strict';

  const section = document.querySelector('.video-hero');
  if (!section) return;

  // ── Background video ─────────────────────────────────────────────────────
  // Sources were rendered with data-src to keep them off the critical path.
  // We swap them in after window.load so video bytes never compete with the
  // poster image (the LCP element) for bandwidth.
  const bgVideo = section.querySelector('.video-hero__video');
  if (bgVideo) {
    const loadBgVideo = () => {
      bgVideo.querySelectorAll('source[data-src]').forEach(s => {
        s.src = s.dataset.src;
        s.removeAttribute('data-src');
      });
      bgVideo.load();
      bgVideo.play().catch(() => {});
    };

    if (document.readyState === 'complete') {
      loadBgVideo();
    } else {
      window.addEventListener('load', loadBgVideo, { once: true });
    }
  }

  // ── Modal video (Wistia) ─────────────────────────────────────────────────
  const watchBtn = section.querySelector('.video-hero__btn--watch');
  const modal    = document.getElementById('video-hero-modal');
  if (!watchBtn || !modal) return;

  const videoId  = watchBtn.dataset.videoId;
  const endCta   = modal.querySelector('.video-hero__end-cta');
  const replayBtn = endCta?.querySelector('.video-hero__end-cta-replay');

  let wistiaPlayer = null;
  let pendingPlay  = false;
  let wistiaLoaded = false;

  const loadWistiaScript = () => {
    if (wistiaLoaded) return;
    wistiaLoaded = true;

    // Push the _wq callback BEFORE injecting the script so Wistia processes
    // it on startup rather than relying on a later push.
    window._wq = window._wq || [];
    window._wq.push({
      id: videoId,
      options: { playerColor: '011840' },
      onReady(video) {
        // Guard: background and modal may share the same Wistia ID.
        // Only bind to the player inside the modal.
        if (!video.container.closest('#video-hero-modal')) return;

        wistiaPlayer = video;

        if (pendingPlay) {
          pendingPlay = false;
          video.play();
        }

        if (endCta) {
          video.bind('end', () => endCta.removeAttribute('hidden'));
        }
      },
    });

    const script   = document.createElement('script');
    script.src     = 'https://fast.wistia.com/assets/external/E-v1.js';
    script.async   = true;
    document.head.appendChild(script);
  };

  // Begin loading Wistia on hover/touch so the script is likely ready
  // (or near-ready) by the time the user clicks — eliminates perceived latency.
  watchBtn.addEventListener('mouseenter', loadWistiaScript, { once: true });
  watchBtn.addEventListener('touchstart', loadWistiaScript, { once: true, passive: true });

  const openModal = () => {
    loadWistiaScript(); // no-op if already loading/loaded

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.video-hero__modal-close')?.focus();

    if (wistiaPlayer) {
      wistiaPlayer.play();
    } else {
      pendingPlay = true;
    }
  };

  const closeModal = () => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    watchBtn.focus();
    endCta?.setAttribute('hidden', '');
    wistiaPlayer?.pause();
    wistiaPlayer?.time(0);
  };

  replayBtn?.addEventListener('click', () => {
    endCta.setAttribute('hidden', '');
    wistiaPlayer?.time(0);
    wistiaPlayer?.play();
  });

  watchBtn.addEventListener('click', openModal);
  modal.querySelector('.video-hero__modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.video-hero__modal-close').addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
})();
