document.querySelectorAll('.monthly-features-mask .feature-link').forEach(el => {
  el.addEventListener('click', function (e) {
    // remove active from others if needed
    document.querySelectorAll('.feature-link.active').forEach(el2 => {
      if (el2 !== el) el2.classList.remove('active');
    });

    el.classList.toggle('active');
  });
});
