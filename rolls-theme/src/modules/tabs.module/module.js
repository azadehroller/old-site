(function() {
  'use strict';

  /**
   * TAB LOGIC (regular tabs, not jobs)
   * ------------------------------------------------------------------
   */
  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container:not(.open-jobs)');

    tabContainers.forEach((container) => {
      const tabButtons = container.querySelectorAll('.tab-button');
      const tabPanels  = container.querySelectorAll('.tab-content');

      tabButtons.forEach((button) => {
        button.addEventListener('click', function() {
          const tabIndex = this.getAttribute('data-tab-index');

          tabButtons.forEach((btn) => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });

          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');

          tabPanels.forEach((panel) => {
            panel.classList.remove('active');
          });

          const targetPanel = container.querySelector(
            `[data-tab-panel="${tabIndex}"]`
          );
          if (targetPanel) {
            targetPanel.classList.add('active');

            const stackInPanel = targetPanel.querySelector('.stack-container');
            if (stackInPanel) {
              reinitStackSpread(stackInPanel);
            }
          }
        });

        button.addEventListener('keydown', function(e) {
          const currentIndex = Array.from(tabButtons).indexOf(this);
          let newIndex;

          switch (e.key) {
            case 'ArrowRight':
              newIndex =
                currentIndex + 1 >= tabButtons.length ? 0 : currentIndex + 1;
              tabButtons[newIndex].focus();
              tabButtons[newIndex].click();
              e.preventDefault();
              break;

            case 'ArrowLeft':
              newIndex =
                currentIndex - 1 < 0
                  ? tabButtons.length - 1
                  : currentIndex - 1;
              tabButtons[newIndex].focus();
              tabButtons[newIndex].click();
              e.preventDefault();
              break;

            case 'Home':
              tabButtons[0].focus();
              tabButtons[0].click();
              e.preventDefault();
              break;

            case 'End':
              tabButtons[tabButtons.length - 1].focus();
              tabButtons[tabButtons.length - 1].click();
              e.preventDefault();
              break;
          }
        });
      });
    });
  }

  /**
   * STACKED IMAGES LOGIC
   * ------------------------------------------------------------------
   */
  const stackConfig = {
    sensitivity: 100,
    randomRotation: false,
    stackDelay: 150 // ms
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function getRowDistribution(count, maxCols) {
    const layouts = {
      3:  [3],
      4:  [2, 2],
      5:  [3, 2],
      6:  [3, 3],
      7:  [4, 3],
      8:  [4, 4],
      9:  [3, 3, 3],
      10: [4, 3, 3],
      11: [4, 4, 3],
      12: [4, 4, 4]
    };

    if (!maxCols && layouts[count]) {
      return layouts[count];
    }

    const cols = maxCols
      ? Math.min(maxCols, count)
      : Math.ceil(Math.sqrt(count * 1.3));
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

  function calculateSpreadPositions(
    count,
    containerWidth,
    containerHeight,
    cards,
    maxScale = 0.75
  ) {
    const positions = [];
    const isMobile = window.innerWidth < 768;
    const gap = 4;
    const padding = isMobile ? 0 : 24;

    let maxCardW = 0;
    let maxCardH = 0;
    cards.forEach((card) => {
      maxCardW = Math.max(maxCardW, card.offsetWidth);
      maxCardH = Math.max(maxCardH, card.offsetHeight);
    });

    const rowDistribution = getRowDistribution(count, null);
    const numRows = rowDistribution.length;
    const gridCols = Math.max(...rowDistribution);

    const availW = containerWidth - padding * 2;
    const optimalScale =
      (availW - (gridCols - 1) * gap) / (gridCols * maxCardW);
    const effectiveScale = Math.min(optimalScale, maxScale);

    const fCellW = maxCardW * effectiveScale;
    const fCellH = maxCardH * effectiveScale;
    const fGap   = gap;

    const fGridW = gridCols * fCellW + (gridCols - 1) * fGap;
    const fGridH = numRows * fCellH + (numRows - 1) * fGap;

    const gridStartX = (containerWidth  - fGridW) / 2;
    const gridStartY = (containerHeight - fGridH) / 2;

    let cardIndex = 0;
    rowDistribution.forEach((colsInRow, row) => {
      const rowW = colsInRow * fCellW + (colsInRow - 1) * fGap;
      const rowStartX = gridStartX + (fGridW - rowW) / 2;

      for (let col = 0; col < colsInRow; col++) {
        const cellCenterX =
          rowStartX + col * (fCellW + fGap) + fCellW / 2;
        const cellCenterY =
          gridStartY + row * (fCellH + fGap) + fCellH / 2;

        const card = cards[cardIndex];
        positions.push({
          x: cellCenterX - card.offsetWidth / 2,
          y: cellCenterY - card.offsetHeight / 2,
          scale: effectiveScale
        });

        cardIndex++;
      }
    });

    return {
      positions,
      neededHeight: fGridH + padding * 2
    };
  }

  function initStack(stackEl) {
    const getCards = () => Array.from(stackEl.querySelectorAll('.card'));
    const cards = getCards();
    if (!cards.length) return;

    const instance = {
      hasAnimated: false,
      isInteractive: false,
      active: null,
      initialRotations: null,
      initialCardOrder: null
    };
    stackEl._stackInstance = instance;

    function layoutSpread() {
      const cards = getCards();
      const len   = cards.length;
      const rect  = stackEl.getBoundingClientRect();
      const cw    = rect.width;
      const ch    = rect.height;
      const spreadScale = 0.75;
      const isFirstSpread = !instance.initialRotations;

      if (isFirstSpread) {
        instance.initialRotations = cards.map(
          () => (Math.random() - 0.5) * 10
        );
        instance.initialCardOrder = cards.slice();
      }

      if (!isFirstSpread && instance.initialCardOrder) {
        instance.initialCardOrder.forEach((card) =>
          stackEl.appendChild(card)
        );
      }

      const orderedCards = instance.initialCardOrder || cards;

      let result = calculateSpreadPositions(
        len,
        cw,
        ch,
        orderedCards,
        spreadScale
      );

      if (result.neededHeight > ch) {
        stackEl.style.minHeight =
          Math.min(result.neededHeight, 400) + 'px';
        const newRect = stackEl.getBoundingClientRect();
        result = calculateSpreadPositions(
          len,
          newRect.width,
          newRect.height,
          orderedCards,
          spreadScale
        );
      }

      orderedCards.forEach((card, index) => {
        const pos = result.positions[index];
        const rotation = instance.initialRotations[index];

        card.style.zIndex = index + 1;
        card.style.transform = `
          translate(${pos.x}px, ${pos.y}px)
          rotateZ(${rotation}deg)
          scale(${pos.scale})
        `;
      });

      stackEl.classList.add('is-spread');
    }

    function layoutStack() {
      const cards = getCards();
      const len   = cards.length;
      const rect  = stackEl.getBoundingClientRect();

      let maxCardW = 0;
      let maxCardH = 0;
      cards.forEach((card) => {
        maxCardW = Math.max(maxCardW, card.offsetWidth);
        maxCardH = Math.max(maxCardH, card.offsetHeight);
      });

      const targetRatio = 0.5;
      const fitW = (rect.width  * targetRatio) / maxCardW;
      const fitH = (rect.height * targetRatio) / maxCardH;
      const topScale = Math.min(fitW, fitH, 1.2);

      cards.forEach((card, index) => {
        const offset = len - index - 1;
        const randomRotate = stackConfig.randomRotation
          ? Math.random() * 10 - 5
          : 0;
        const baseRotateZ = offset * 4 + randomRotate;
        const baseScale   = topScale - offset * 0.02;

        const cardWidth  = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        const centerX    = (rect.width  - cardWidth)  / 2;
        const centerY    = (rect.height - cardHeight) / 2;

        card.dataset.baseRotateZ = baseRotateZ;
        card.dataset.baseScale   = baseScale;
        card.dataset.centerX     = centerX;
        card.dataset.centerY     = centerY;

        card.style.zIndex = index + 1;
        card.style.transform = `
          translate(${centerX}px, ${centerY}px)
          rotateZ(${baseRotateZ}deg)
          scale(${baseScale})
        `;
      });
    }

    function animateToStack() {
      if (instance.hasAnimated) return;
      instance.hasAnimated = true;

      stackEl.classList.add('is-animating');
      stackEl.classList.remove('is-spread');

      layoutStack();

      setTimeout(() => {
        stackEl.classList.remove('is-animating');
        stackEl.classList.add('is-stacked');
        instance.isInteractive = true;
        bind();

        if (instance._outsideClickHandler) {
          document.removeEventListener(
            'click',
            instance._outsideClickHandler
          );
        }

        instance._outsideClickHandler = (e) => {
          const targetCard =
            e.target.closest && e.target.closest('.card');
          const isOnOwnCard =
            targetCard && stackEl.contains(targetCard);

          if (!isOnOwnCard) {
            document.removeEventListener(
              'click',
              instance._outsideClickHandler
            );
            instance._outsideClickHandler = null;
            reinitStackSpread(stackEl);
          }
        };

        document.addEventListener('click', instance._outsideClickHandler);
      }, 850);
    }

    function sendToBack(card) {
      stackEl.insertBefore(card, stackEl.firstChild);
    }

    function onDown(e) {
      if (!instance.isInteractive) return;

      instance.active = {
        card:   e.currentTarget,
        startX: e.clientX,
        startY: e.clientY,
        dx: 0,
        dy: 0
      };

      instance.active.card.classList.add('is-dragging');
      instance.active.card.setPointerCapture(e.pointerId);
    }

    function onMove(e) {
      if (!instance.active || !instance.isInteractive) return;

      instance.active.dx = e.clientX - instance.active.startX;
      instance.active.dy = e.clientY - instance.active.startY;

      const cx = clamp(instance.active.dx, -100, 100);
      const cy = clamp(instance.active.dy, -100, 100);

      const rotateX = -0.6 * cy;
      const rotateY =  0.6 * cx;

      const baseRotateZ = instance.active.card.dataset.baseRotateZ;
      const baseScale   = instance.active.card.dataset.baseScale;
      const centerX     = parseFloat(instance.active.card.dataset.centerX) || 0;
      const centerY     = parseFloat(instance.active.card.dataset.centerY) || 0;

      instance.active.card.style.transform = `
        translate(${centerX + instance.active.dx}px, ${centerY + instance.active.dy}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${baseRotateZ}deg)
        scale(${baseScale})
      `;
    }

    function onUp() {
      if (!instance.active || !instance.isInteractive) return;

      const card = instance.active.card;
      const dx   = instance.active.dx;
      const dy   = instance.active.dy;

      card.classList.remove('is-dragging');

      if (
        Math.abs(dx) > stackConfig.sensitivity ||
        Math.abs(dy) > stackConfig.sensitivity
      ) {
        sendToBack(card);
        requestAnimationFrame(layoutStack);
      } else {
        layoutStack();
      }

      instance.active = null;
    }

    function bind() {
      if (!instance.isInteractive) return;

      getCards().forEach((card) => {
        if (card.dataset.bound === '1') return;
        card.dataset.bound = '1';

        card.addEventListener('pointerdown',  onDown);
        card.addEventListener('pointermove',  onMove);
        card.addEventListener('pointerup',    onUp);
        card.addEventListener('pointercancel', onUp);
      });
    }

    function setupInteractionTrigger() {
      if (stackEl._clickToStackHandler) {
        stackEl.removeEventListener('click', stackEl._clickToStackHandler);
      }

      const clickToStack = () => {
        if (instance.hasAnimated) return;
        setTimeout(animateToStack, stackConfig.stackDelay);
      };

      stackEl._clickToStackHandler = clickToStack;
      stackEl.addEventListener('click', clickToStack);
    }

    instance.layoutSpread = layoutSpread;
    instance.setupInteractionTrigger = setupInteractionTrigger;

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (stackEl.classList.contains('is-spread')) {
          layoutSpread();
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    layoutSpread();
    setupInteractionTrigger();
  }

  function reinitStackSpread(stackEl) {
    if (!stackEl._stackInstance) {
      initStack(stackEl);
      return;
    }

    const instance = stackEl._stackInstance;
    instance.hasAnimated = false;
    instance.isInteractive = false;

    if (instance._outsideClickHandler) {
      document.removeEventListener('click', instance._outsideClickHandler);
      instance._outsideClickHandler = null;
    }

    stackEl.classList.remove('is-stacked', 'is-animating');
    stackEl.classList.add('is-spread');

    instance.layoutSpread();
    instance.setupInteractionTrigger();
  }

  function initStacks() {
    const stacks = document.querySelectorAll('.stack-container');
    stacks.forEach(initStack);
  }

  /**
   * OPEN JOBS (GREENHOUSE) – HARD-CODED 5 GROUPS
   * ------------------------------------------------------------------
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function createJobTabButton(label, id, isActive) {
    const btn = document.createElement('button');
    btn.className = `tab-button${isActive ? ' active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.setAttribute('data-tab-index', id);
    btn.setAttribute('type', 'button');
    btn.textContent = label;
    return btn;
  }

  function createJobPanel(id, jobs, isActive, noJobsMsg) {
    const panel = document.createElement('div');
    panel.className = `open-jobs__panel${isActive ? ' active' : ''}`;
    panel.setAttribute('data-tab-panel', id);
    panel.setAttribute('role', 'tabpanel');

    if (!jobs || jobs.length === 0) {
      panel.innerHTML =
        `<div class="open-jobs__no-jobs">${escapeHtml(noJobsMsg)}</div>`;
      return panel;
    }

    const list = document.createElement('ul');
    list.className = 'open-jobs__list';

    jobs.forEach((job) => {
      const location = job.location ? job.location.name : '';
      const li = document.createElement('li');
      li.className = 'open-jobs__item';
      li.innerHTML = `
        <div class="open-jobs__info">
          <p class="open-jobs__title">${escapeHtml(job.title)}</p>
          ${location
            ? `<p class="open-jobs__location">${escapeHtml(location)}</p>`
            : ''}
        </div>
        <a class="open-jobs__link"
           href="${escapeHtml(job.absolute_url)}"
           target="_blank"
           rel="noopener">
          More details
          <span class="open-jobs__link-arrow">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24"
                 viewBox="0 0 24 24" fill="none">
              <path d="M9.99984 6L8.58984 7.41L13.1698 12L8.58984 16.59L9.99984 18L15.9998 12L9.99984 6Z"
                    fill="#033180"/>
            </svg>
          </span>
        </a>`;
      list.appendChild(li);
    });

    panel.appendChild(list);
    return panel;
  }

  function applyJobTabLabelOverrides(container) {
    const staticPanels = container.querySelectorAll('.open-jobs__static');

    staticPanels.forEach((panel) => {
      const panelId = panel.getAttribute('data-tab-panel');
      const overrideLabel = panel.getAttribute('data-tab-label');
      if (!overrideLabel || !panelId) return;

      const selector =
        `.tabs-selector .tab-button[data-tab-index="${panelId}"]`;
      const btn = container.querySelector(selector);
      if (btn) {
        btn.textContent = overrideLabel;
      }
    });
  }

  function setupJobTabSwitching(container) {
    const tabButtons = container.querySelectorAll('.tab-button');
    const rightPanels = container.querySelectorAll('.open-jobs__panel');
    const leftPanels  = container.querySelectorAll('.open-jobs__static');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', function() {
        const tabIndex = this.getAttribute('data-tab-index');

        tabButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        rightPanels.forEach((p) => p.classList.remove('active'));
        const rightTarget = container.querySelector(
          `.open-jobs__panel[data-tab-panel="${tabIndex}"]`
        );
        if (rightTarget) rightTarget.classList.add('active');

        leftPanels.forEach((p) => p.classList.remove('active'));
        const leftTarget = container.querySelector(
          `.open-jobs__static[data-tab-panel="${tabIndex}"]`
        );
        if (leftTarget) leftTarget.classList.add('active');
      });

      btn.addEventListener('keydown', function(e) {
        const allBtns = Array.from(tabButtons);
        const currentIndex = allBtns.indexOf(this);
        let newIndex;

        switch (e.key) {
          case 'ArrowRight':
            newIndex =
              currentIndex + 1 >= allBtns.length ? 0 : currentIndex + 1;
            allBtns[newIndex].focus();
            allBtns[newIndex].click();
            e.preventDefault();
            break;

          case 'ArrowLeft':
            newIndex =
              currentIndex - 1 < 0
                ? allBtns.length - 1
                : currentIndex - 1;
            allBtns[newIndex].focus();
            allBtns[newIndex].click();
            e.preventDefault();
            break;

          case 'Home':
            allBtns[0].focus();
            allBtns[0].click();
            e.preventDefault();
            break;

          case 'End':
            allBtns[allBtns.length - 1].focus();
            allBtns[allBtns.length - 1].click();
            e.preventDefault();
            break;
        }
      });
    });
  }

  function roundRobinJobs(buckets, bucketOrder, limit) {
    const result = [];
    const max = limit > 0 ? limit : Infinity;
    const indices = {};
    bucketOrder.forEach((key) => {
      indices[key] = 0;
    });

    let hasMore = true;
    while (result.length < max && hasMore) {
      hasMore = false;

      for (const key of bucketOrder) {
        if (result.length >= max) break;
        const arr = buckets[key] || [];
        if (indices[key] < arr.length) {
          result.push(arr[indices[key]]);
          indices[key]++;
          if (indices[key] < arr.length) {
            hasMore = true;
          }
        }
      }
    }

    return result;
  }

  function initOpenJobs() {
    const containers = document.querySelectorAll('.tabs-container.open-jobs');
    const noJobsMessage = 'No open positions at this time.';

    // Map from editor’s multi-select values → internal group keys
    // Make sure these LEFT-HAND values match your job_category_groups option VALUES
    const editorToGroupKey = {
      sales: 'sales',
      gtm: 'gtm',
      product: 'product',
      engineering: 'engineering',
      corporate: 'corporate'
    };

    // Hard-coded group definitions and the department names that feed them
    const groupDefs = [
      {
        key: 'sales',
        label: 'Sales',
        deptNames: ['Sales'],
        // If Sales has no jobs, fall back to Finance
        fallbackTo: 'finance'
      },
      {
        key: 'gtm',
        label: 'GTM',
         deptNames: [
            'GTM',
            'COO Office',

            'Customer Experience',
            'Customer Success',
            'Customer Success Leadership',
            'Customer Support',
            'Customer Support Leadership',
            'Training & Implementation',

            'GTM Shared Services',
            'Customer Experience Leadership',
            'Strategy & Operations',
            'Systems & Infrastructure',

            'Marketing'
          ]
      },
      {
        key: 'product',
        label: 'Product',
        deptNames: [
          'Product',
          'Design',
          'Payments',
          'Learning Experience',
          'P&T',
          'Research',
          'Data'
        ]
      },
      {
        key: 'engineering',
        label: 'Engineering',
        deptNames: [
          // Engineering
          'Engineering',
          'Backend Engineering',
          'Data Engineering',
          'Engineering Leadership',
          'Frontend Engineering',
          'Quality & Assurance',
          'Site Reliability Engineering',

          // IT
          'IT',
          'IT Support'
        ]
      },
      {
        key: 'corporate',
        label: 'Corporate',
        deptNames: [
          // People & Culture
          'People & Culture',
          'CPO Office',
          'Learning & Development',
          'People Operations',
          'People Partnering',
          'Talent Acquisition',

          // Corporate
          'Corporate',
          'CEO Office',
          'Chief of Staffs',
          'Chief of Staff - Global',
          'Chief of Staff - GTM',
          'Chief of Staff - Product & Tech',

          // Finance
          'Finance',
          'CFO Office',
          'Finance Operations',
          'Payroll',
          'Financial Control',
          'Control',
          'Tax',
          'Financial Planning & Analysis',
          'Financial Planning & Analysis Leadership',
          'Legal & Commercial'
        ]
      }
    ];

    containers.forEach((container) => {
      const boardToken = container.dataset.boardToken;
      const jobsLimit = parseInt(container.dataset.jobsLimit, 10) || 0;
      const allFilterLabel =
        container.dataset.allFilterLabel || 'All';

      const panelsContainer = container.querySelector('.open-jobs__panels');
      const tablist = container.querySelector('.tabs-selector');

      if (!boardToken || !panelsContainer) return;

      fetch(
        `https://boards-api.greenhouse.io/v1/boards/${boardToken}/departments`
      )
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch departments');
          return res.json();
        })
        .then((data) => {
          const allDepartments = data.departments || [];
          const withJobs = allDepartments.filter(
            (dept) => dept.jobs && dept.jobs.length > 0
          );

          if (withJobs.length === 0) {
            panelsContainer.innerHTML =
              `<div class="open-jobs__no-jobs">${escapeHtml(
                noJobsMessage
              )}</div>`;
            return;
          }

          // Helper: find departments by name (case-insensitive, partial match)
          const findDeptsByName = (name) => {
          const target = name.toLowerCase();

          return withJobs.filter((d) => {
            const deptName = (d.name || '').toLowerCase();

            // Exact match OR word boundary match
            return (
              deptName === target ||
              deptName.startsWith(target + ' ') ||
              deptName.endsWith(' ' + target) ||
              deptName.includes(' ' + target + ' ')
            );
          });
        };

          // Build jobs per group
          const groupJobs = {};
          groupDefs.forEach((g) => {
            let jobs = [];

            g.deptNames.forEach((name) => {
              const depts = findDeptsByName(name);
              depts.forEach((dept) => {
                if (Array.isArray(dept.jobs)) {
                  jobs = jobs.concat(dept.jobs);
                }
              });
            });

            // Special case: Sales falls back to Finance if no jobs
            if (jobs.length === 0 && g.key === 'sales' && g.fallbackTo === 'finance') {
              const financeDepts = findDeptsByName('Finance');
              financeDepts.forEach((dept) => {
                if (Array.isArray(dept.jobs)) {
                  jobs = jobs.concat(dept.jobs);
                }
              });
            }

            groupJobs[g.key] = jobs;
          });

          // Decide which groups actually render tabs: those with jobs
          let activeGroups = groupDefs.filter(
            (g) => (groupJobs[g.key] || []).length > 0
          );

          // Apply editor-defined order if provided via data-group-order
          const orderAttr = container.dataset.groupOrder; // e.g. "gtm,sales,product"
          if (orderAttr && orderAttr.trim().length > 0) {
            const rawOrder = orderAttr
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0);

            // Map editor values to internal keys
            const order = rawOrder
              .map((v) => editorToGroupKey[v] || null)
              .filter((v) => !!v);

            if (order.length > 0) {
              activeGroups = activeGroups
                .filter((g) => order.includes(g.key))
                .sort(
                  (a, b) =>
                    order.indexOf(a.key) - order.indexOf(b.key)
                );
            }
          }

          if (activeGroups.length === 0) {
            panelsContainer.innerHTML =
              `<div class="open-jobs__no-jobs">${escapeHtml(
                noJobsMessage
              )}</div>`;
            return;
          }

          const limitJobs = (list) =>
            jobsLimit > 0 ? list.slice(0, jobsLimit) : list;

          // Build a round-robin "All" list from each group's jobs
          const bucketsForAll = {};
          const bucketOrder = [];
          activeGroups.forEach((g) => {
            bucketsForAll[g.key] = groupJobs[g.key];
            bucketOrder.push(g.key);
          });

          const allJobs = roundRobinJobs(
            bucketsForAll,
            bucketOrder,
            jobsLimit
          );

          // Build tab buttons
          if (tablist) {
            tablist.innerHTML = '';

            // Parse group label overrides from data-group-labels (if present)
            let labelOverrides = {};
            const labelsAttr = container.dataset.groupLabels;
            if (labelsAttr) {
              try {
                labelOverrides = JSON.parse(labelsAttr);
              } catch (e) {
                labelOverrides = {};
              }
            }

            // All tab
            tablist.appendChild(
              createJobTabButton(allFilterLabel, 'all', true)
            );

            // Group tabs with overrides: fall back to default label if no override
            activeGroups.forEach((g) => {
              const overrideLabel =
                (labelOverrides && labelOverrides[g.key]) || '';
              const finalLabel = overrideLabel || g.label;

              tablist.appendChild(
                createJobTabButton(finalLabel, g.key, false)
              );
            });
          }

          // Build panels
          panelsContainer.innerHTML = '';
          panelsContainer.appendChild(
            createJobPanel('all', allJobs, true, noJobsMessage)
          );
          activeGroups.forEach((g) => {
            panelsContainer.appendChild(
              createJobPanel(
                g.key,
                limitJobs(groupJobs[g.key]),
                false,
                noJobsMessage
              )
            );
          });

          applyJobTabLabelOverrides(container);
          setupJobTabSwitching(container);
        })
        .catch(() => {
          panelsContainer.innerHTML =
            '<div class="open-jobs__error">Unable to load open positions. Please try again later.</div>';
        });
    });
  }

  /**
   * INITIALISE
   * ------------------------------------------------------------------
   */
  function init() {
    initTabs();
    initStacks();
    initOpenJobs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();