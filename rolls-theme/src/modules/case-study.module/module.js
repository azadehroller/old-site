(function () {
  var header = document.getElementById('header');
  if (!header) return;

  function syncHeight() {
    document.documentElement.style.setProperty(
      '--case-study-header-height',
      header.offsetHeight + 'px'
    );
  }

  syncHeight();

  if (window.ResizeObserver) {
    new ResizeObserver(syncHeight).observe(header);
  } else {
    window.addEventListener('resize', syncHeight);
  }
})();
