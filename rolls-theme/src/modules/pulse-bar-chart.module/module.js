// Pulse Bar Chart Module JavaScript
(function() {
  'use strict';

  function initPulseBarCharts() {
    const charts = document.querySelectorAll('.pulse-bar-chart');
    
    charts.forEach(chart => {
      if (chart.dataset.initialized === 'true') return;
      
      // Observer for the main fade-in-up animation
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      // Observer for chart container animations
      const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation delays to bars
            const bars = entry.target.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
              bar.style.animationDelay = `${index * 100}ms`;
            });
            
            chartObserver.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      // Observe the main fade-in-up element
      fadeObserver.observe(chart);
      
      // Observe chart containers for bar animations
      const chartContainers = chart.querySelectorAll('.chart-container');
      chartContainers.forEach(container => {
        chartObserver.observe(container);
      });
      
      chart.dataset.initialized = 'true';
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPulseBarCharts);
  } else {
    initPulseBarCharts();
  }

  // Re-initialize on dynamic content changes (for HubSpot preview mode)
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const charts = node.querySelectorAll ? 
                           node.querySelectorAll('.pulse-bar-chart') : 
                           [];
              
              charts.forEach(chart => {
                if (chart.dataset.initialized !== 'true') {
                  initPulseBarCharts();
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();