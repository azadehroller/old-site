(function () {
  // Don't run in HubSpot editor
  if (window.hsInEditor) return;

  const stackEl = document.getElementById("stack-{{ module._uid }}");
  if (!stackEl) return;

  const config = {
    sensitivity: 100,
    randomRotation: false,
    stackDelay: 150 // ms delay before stacking animation after interaction
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let hasAnimated = false;
  let isInteractive = false;

  function getCards() {
    return Array.from(stackEl.querySelectorAll(".card"));
  }

  // Calculate spread positions for images in a rectangular pattern
  function layoutSpread() {
    const cards = getCards();
    const len = cards.length;
    const containerRect = stackEl.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate grid layout - spread images around the container
    // Using a pattern that spreads cards outward from center
    const spreadPositions = calculateSpreadPositions(len, containerWidth, containerHeight, cards);

    cards.forEach((card, index) => {
      const pos = spreadPositions[index];
      const randomRotate = (Math.random() - 0.5) * 10; // Subtle rotation between -5 and 5 degrees

      card.style.zIndex = index + 1;
      card.style.transform = `
        translate(${pos.x}px, ${pos.y}px)
        rotateZ(${randomRotate}deg)
        scale(0.5)
      `;
    });

    stackEl.classList.add("is-spread");
  }

  // Calculate positions for spread layout - rectangular grid pattern
  function calculateSpreadPositions(count, containerWidth, containerHeight, cards) {
    const positions = [];

    // Get average card dimensions at FULL scale (before transform)
    let avgCardWidthFull = 0;
    let avgCardHeightFull = 0;
    cards.forEach(card => {
      avgCardWidthFull += card.offsetWidth;
      avgCardHeightFull += card.offsetHeight;
    });
    avgCardWidthFull = avgCardWidthFull / count;
    avgCardHeightFull = avgCardHeightFull / count;

    // Scaled dimensions (visual size after scale 0.5)
    const avgCardWidth = avgCardWidthFull * 0.5;
    const avgCardHeight = avgCardHeightFull * 0.5;

    // Determine optimal row distribution based on count
    const rowDistribution = getRowDistribution(count);
    const numRows = rowDistribution.length;
    const maxCols = Math.max(...rowDistribution);

    // Calculate gaps (adjust multiplier to change spacing)
    const gapX = avgCardWidth * 0.1;  // column gap
    const gapY = avgCardHeight * 0.2; // row gap

    // Calculate total grid size (visual size)
    const gridWidth = maxCols * avgCardWidth + (maxCols - 1) * gapX;
    const gridHeight = numRows * avgCardHeight + (numRows - 1) * gapY;

    // Center the grid in the container
    const gridStartX = (containerWidth - gridWidth) / 2;
    const gridStartY = (containerHeight - gridHeight) / 2;

    // Offset to compensate for scale transform (transform-origin is center)
    // When scaling 0.5 around center, the top-left shifts by cardWidth/4, cardHeight/4
    const scaleOffsetX = avgCardWidthFull * 0.25;
    const scaleOffsetY = avgCardHeightFull * 0.25;

    for (let row = 0; row < numRows; row++) {
      const colsInRow = rowDistribution[row];
      // Center this row within the grid width
      const rowWidth = colsInRow * avgCardWidth + (colsInRow - 1) * gapX;
      const rowStartX = gridStartX + (gridWidth - rowWidth) / 2;

      for (let col = 0; col < colsInRow; col++) {
        // Calculate where we want the scaled card to appear
        const visualX = rowStartX + col * (avgCardWidth + gapX);
        const visualY = gridStartY + row * (avgCardHeight + gapY);

        // Compensate for scale offset to get correct translate values
        const x = visualX - scaleOffsetX;
        const y = visualY - scaleOffsetY;

        positions.push({ x, y });
      }
    }

    return positions;
  }

  // Get optimal row distribution for a given count
  function getRowDistribution(count) {
    // Predefined layouts for common counts
    const layouts = {
      3: [3],
      4: [2, 2],
      5: [3, 2],
      6: [3, 3],
      7: [4, 3],
      8: [4, 4],
      9: [3, 3, 3],
      10: [4, 3, 3],
      11: [4, 4, 3],
      12: [4, 4, 4],
    };

    if (layouts[count]) {
      return layouts[count];
    }

    // Fallback for other counts: create balanced rows
    const cols = Math.ceil(Math.sqrt(count * 1.3));
    const rows = Math.ceil(count / cols);
    const distribution = [];
    let remaining = count;

    for (let i = 0; i < rows; i++) {
      const itemsInRow = Math.min(cols, remaining);
      distribution.push(itemsInRow);
      remaining -= itemsInRow;
    }

    return distribution;
  }

  function layoutStack() {
    const cards = getCards();
    const len = cards.length;
    const containerRect = stackEl.getBoundingClientRect();

    cards.forEach((card, index) => {
      const offset = len - index - 1;
      const randomRotate = config.randomRotation
        ? Math.random() * 10 - 5
        : 0;

      const baseRotateZ = offset * 4 + randomRotate;
      // Top card (offset=0) is scale 1.0, cards behind are slightly smaller
      const baseScale = 1 - offset * 0.02;

      // Calculate centering offset based on card and container sizes
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;
      const centerX = (containerRect.width - cardWidth) / 2;
      const centerY = (containerRect.height - cardHeight) / 2;

      card.dataset.baseRotateZ = baseRotateZ;
      card.dataset.baseScale = baseScale;
      card.dataset.centerX = centerX;
      card.dataset.centerY = centerY;

      card.style.zIndex = index + 1;
      card.style.transform = `
        translate(${centerX}px, ${centerY}px)
        rotateZ(${baseRotateZ}deg)
        scale(${baseScale})
      `;
    });
  }

  function animateToStack() {
    if (hasAnimated) return;
    hasAnimated = true;

    // Add is-animating to keep opacity at 1 with smooth transition, remove is-spread
    stackEl.classList.add("is-animating");
    stackEl.classList.remove("is-spread");
    layoutStack();

    // After animation completes, switch to is-stacked and enable interaction
    setTimeout(() => {
      stackEl.classList.remove("is-animating");
      stackEl.classList.add("is-stacked");
      isInteractive = true;
      bind();
    }, 850); // Slightly longer than the CSS transition (800ms)
  }

  function sendToBack(card) {
    stackEl.insertBefore(card, stackEl.firstChild);
  }

  let active = null;

  function bind() {
    if (!isInteractive) return;

    getCards().forEach(card => {
      if (card.dataset.bound === "1") return;
      card.dataset.bound = "1";

      card.addEventListener("pointerdown", onDown);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerup", onUp);
      card.addEventListener("pointercancel", onUp);
    });
  }

  function onDown(e) {
    if (!isInteractive) return;

    active = {
      card: e.currentTarget,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0
    };

    active.card.classList.add("is-dragging");
    active.card.setPointerCapture(e.pointerId);
  }

  function onMove(e) {
    if (!active || !isInteractive) return;

    active.dx = e.clientX - active.startX;
    active.dy = e.clientY - active.startY;

    const cx = clamp(active.dx, -100, 100);
    const cy = clamp(active.dy, -100, 100);

    const rotateX = -0.6 * cy;
    const rotateY = 0.6 * cx;

    const baseRotateZ = active.card.dataset.baseRotateZ;
    const baseScale = active.card.dataset.baseScale;
    const centerX = parseFloat(active.card.dataset.centerX) || 0;
    const centerY = parseFloat(active.card.dataset.centerY) || 0;

    active.card.style.transform = `
      translate(${centerX + active.dx}px, ${centerY + active.dy}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotateZ(${baseRotateZ}deg)
      scale(${baseScale})
    `;
  }

  function onUp() {
    if (!active || !isInteractive) return;

    const { card, dx, dy } = active;
    card.classList.remove("is-dragging");

    if (Math.abs(dx) > config.sensitivity || Math.abs(dy) > config.sensitivity) {
      sendToBack(card);
      requestAnimationFrame(() => layoutStack());
    } else {
      layoutStack();
    }

    active = null;
  }

  // Set up interaction triggers for stacking animation
  function setupInteractionTrigger() {
    const triggerStack = () => {
      if (hasAnimated) return;

      // Small delay before stacking for better feel
      setTimeout(() => {
        animateToStack();
      }, config.stackDelay);
    };

    // Only add interaction listeners to individual cards, not the container
    getCards().forEach(card => {
      card.addEventListener("mouseenter", triggerStack, { once: true });
      card.addEventListener("touchstart", triggerStack, { once: true, passive: true });
    });
  }

  // Initialize with spread layout
  layoutSpread();
  setupInteractionTrigger();
})();
