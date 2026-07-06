/**
 * Syncs live <input type="range"> value into <output>. Min/max stay in HubL.
 */
(() => {
  const formatValue = (raw) =>
    `$${Math.round(Number(raw)).toLocaleString()}`;

  const bind = (input) => {
    const outputId = input.id.replace(/^range-slider-input-/, 'range-slider-out-');
    const output = document.getElementById(outputId);
    if (!output) return;

    const sync = () => {
      output.textContent = formatValue(input.value);
    };

    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    sync();
  };

  const init = () => {
    document.querySelectorAll('.range-slider__input').forEach(bind);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
