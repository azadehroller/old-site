(function() {
  'use strict';

  // Initialize all open-jobs tab modules on the page
  document.querySelectorAll('.tabs-container.open-jobs').forEach(function(container) {
    initOpenJobsTabs(container);
  });

  function initOpenJobsTabs(container) {
    var boardToken = container.dataset.boardToken || 'roller';
    var jobsLimit = parseInt(container.dataset.jobsLimit, 10) || 4;
    var moreDetailsText = container.dataset.moreDetails || 'More details';
    var noJobsMessage = container.dataset.noJobs || 'No open positions at this time.';
    var loadingMessage = container.dataset.loading || 'Loading...';

    // Parse departments JSON if needed (not strictly required in JS now)
    var predefinedDepartments = [];
    try {
      var deptScript = container.querySelector('.open-jobs__departments-data');
      if (deptScript && deptScript.textContent) {
        var parsed = JSON.parse(deptScript.textContent);
        if (Array.isArray(parsed)) {
          predefinedDepartments = parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing departments:', e);
      predefinedDepartments = [];
    }

    var tabButtons = Array.prototype.slice.call(
      container.querySelectorAll('.tabs-selector .tab-button')
    );
    var tabPanels = Array.prototype.slice.call(
      container.querySelectorAll('.tab-content')
    );

    var allJobs = [];

    // Initial loading state in all panels
    tabPanels.forEach(function(panel) {
      var desc = panel.querySelector('.open-jobs__description');
      if (desc) {
        desc.textContent = loadingMessage;
      }
    });

    // Fetch jobs from Greenhouse API
    fetchJobs();

    function fetchJobs() {
      var apiUrl =
        'https://boards-api.greenhouse.io/v1/boards/' +
        boardToken +
        '/jobs?content=true';

      fetch(apiUrl)
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Failed to fetch jobs');
          }
          return response.json();
        })
        .then(function(data) {
          allJobs = data.jobs || [];

          // Bind click handlers to tabs so they filter jobs
          setupTabFilters();

          // Render jobs for the initially active tab
          var activeButton =
            tabButtons.find(function(btn) {
              return btn.classList.contains('active');
            }) || tabButtons[0];

          if (activeButton) {
            handleTabClick(activeButton);
          }
        })
        .catch(function(error) {
          console.error('Error fetching jobs:', error);
          renderErrorToAllPanels();
        });
    }

    function matchesDepartmentKeywords(job, keywords) {
      if (!keywords) {
        return true; // empty keywords = "All"
      }

      if (!job.departments || job.departments.length === 0) {
        return false;
      }

      var keywordList = keywords
        .split(',')
        .map(function(k) {
          return k.trim().toLowerCase();
        })
        .filter(Boolean);

      if (!keywordList.length) return true;

      return job.departments.some(function(dept) {
        var deptName = (dept.name || '').toLowerCase();
        return keywordList.some(function(keyword) {
          return deptName.indexOf(keyword) !== -1;
        });
      });
    }

    function setupTabFilters() {
      tabButtons.forEach(function(btn) {
        // We don't change the tab click behavior (initTabs already attached);
        // we *extend* it by filtering/rendering jobs after tab switch.
        btn.addEventListener('click', function() {
          handleTabClick(btn);
        });
      });
    }

    function handleTabClick(btn) {
      var keywords = btn.dataset.keywords || '';

      // Determine target panel by aria-controls
      var targetPanelId = btn.getAttribute('aria-controls');
      var activePanel = tabPanels.find(function(panel) {
        return panel.id === targetPanelId;
      });

      if (!activePanel) return;

      var desc = activePanel.querySelector('.open-jobs__description');
      if (!desc) return;

      // Filter jobs
      var filteredJobs = allJobs.filter(function(job) {
        return matchesDepartmentKeywords(job, keywords);
      });

      renderJobs(filteredJobs, desc);
    }

    function renderJobs(jobs, targetEl) {
      if (!targetEl) return;

      if (!jobs || jobs.length === 0) {
        targetEl.innerHTML =
          '<div class="open-jobs__no-jobs">' +
          escapeHtml(noJobsMessage) +
          '</div>';
        return;
      }

      // Apply jobs limit
      var displayJobs = jobsLimit > 0 ? jobs.slice(0, jobsLimit) : jobs;

      var html = '<ul class="open-jobs__list" role="list">';

      displayJobs.forEach(function(job) {
        var location = job.location ? job.location.name : '';

        // If there are multiple offices, join their locations
        if (job.offices && job.offices.length > 0) {
          var locations = job.offices
            .map(function(office) {
              return office.location || office.name;
            })
            .filter(function(loc, index, arr) {
              return arr.indexOf(loc) === index; // Remove duplicates
            });
          location = locations.join('; ');
        }

        html += '<li class="open-jobs__item">';
        html += '  <div class="open-jobs__info">';
        html +=
          '    <h3 class="open-jobs__title">' +
          escapeHtml(job.title) +
          '</h3>';
        if (location) {
          html +=
            '    <p class="open-jobs__location">' +
            escapeHtml(location) +
            '</p>';
        }
        html += '  </div>';
        html +=
          '  <a href="' +
          escapeHtml(job.absolute_url) +
          '" class="open-jobs__link" target="_blank" rel="noopener noreferrer">';
        html += '    ' + escapeHtml(moreDetailsText);
        html += '    <span class="open-jobs__link-arrow" aria-hidden="true">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">' +
        '<path d="M1.41 0L0 1.41L4.58 6L0 10.59L1.41 12L7.41 6L1.41 0Z" fill="#033180"/>' +
        '</svg>' +
        '</span>';
        html += '  </a>';
        html += '</li>';
      });

      html += '</ul>';

      targetEl.innerHTML = html;
    }

    function renderErrorToAllPanels() {
      tabPanels.forEach(function(panel) {
        var desc = panel.querySelector('.open-jobs__description');
        if (desc) {
          desc.innerHTML =
            '<div class="open-jobs__error">' +
            'Unable to load open positions. Please try again later.' +
            '</div>';
        }
      });
    }

    function escapeHtml(text) {
      if (!text) return '';
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }
})();