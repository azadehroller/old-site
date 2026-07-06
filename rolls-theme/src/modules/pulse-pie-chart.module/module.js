// Pulse Pie Chart Module JavaScript
(function() {
  'use strict';

  class PulsePieChart {
    constructor(container) {
      this.container = container;
      this.chart = container.querySelector('.pulse-pie-chart');
      this.svg = container.querySelector('.chart-svg');
      this.segments = container.querySelectorAll('.pie-segment');
      this.legendItems = container.querySelectorAll('.legend-item');
      this.tooltip = container.querySelector('.pie-tooltip');
      
      this.animationDuration = parseInt(this.chart.dataset.animationDuration) || 2000;
      this.showPercentages = this.chart.dataset.showPercentages === 'true';
      this.hoverEffect = this.chart.dataset.hoverEffect === 'true';
      this.totalValue = parseFloat(this.chart.dataset.totalValue);
      this.donutMode = this.chart.dataset.donutMode === 'true';
      this.isAnimated = false;
      
      this.centerX = parseInt(this.svg.getAttribute('width')) / 2;
      this.centerY = parseInt(this.svg.getAttribute('height')) / 2;
      this.outerRadius = this.centerX * 0.85;
      this.innerRadius = this.donutMode ? this.centerX * 0.4 : 0;
      
      this.init();
    }

    init() {
      // Generate segment paths
      this.generateSegmentPaths();
      
      // Set up intersection observer for scroll-triggered animation
      this.setupIntersectionObserver();
      
      // Add hover interactions
      if (this.hoverEffect) {
        this.setupHoverInteractions();
      }
      
      // Set up legend interactions
      this.setupLegendInteractions();
      
      // Set CSS custom properties for animation
      this.setupAnimationProperties();
    }

    generateSegmentPaths() {
      this.segments.forEach((segment, index) => {
        const startAngle = parseFloat(segment.dataset.startAngle);
        const endAngle = parseFloat(segment.dataset.endAngle);
        const path = segment.querySelector('.segment-path');
        const label = segment.querySelector('.segment-label');
        
        // Generate SVG path for the segment
        const pathData = this.createArcPath(
          this.centerX, this.centerY,
          this.innerRadius, this.outerRadius,
          startAngle, endAngle
        );
        
        path.setAttribute('d', pathData);
        
        // Calculate label position if percentages are shown
        if (this.showPercentages && label) {
          const midAngle = (startAngle + endAngle) / 2;
          const labelRadius = this.innerRadius + (this.outerRadius - this.innerRadius) * 0.7;
          const labelX = this.centerX + Math.cos(this.degreesToRadians(midAngle)) * labelRadius;
          const labelY = this.centerY + Math.sin(this.degreesToRadians(midAngle)) * labelRadius;
          
          label.setAttribute('x', labelX);
          label.setAttribute('y', labelY);
        }
        
        // Calculate arc length for animation
        const arcLength = this.calculateArcLength(this.outerRadius, startAngle, endAngle);
        path.style.setProperty('--segment-length', arcLength);
      });
    }

    createArcPath(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle) {
      const startAngleRad = this.degreesToRadians(startAngle);
      const endAngleRad = this.degreesToRadians(endAngle);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      
      const x1 = centerX + Math.cos(startAngleRad) * outerRadius;
      const y1 = centerY + Math.sin(startAngleRad) * outerRadius;
      
      const x2 = centerX + Math.cos(endAngleRad) * outerRadius;
      const y2 = centerY + Math.sin(endAngleRad) * outerRadius;
      
      if (innerRadius === 0) {
        // Regular pie chart
        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      } else {
        // Donut chart
        const x3 = centerX + Math.cos(endAngleRad) * innerRadius;
        const y3 = centerY + Math.sin(endAngleRad) * innerRadius;
        
        const x4 = centerX + Math.cos(startAngleRad) * innerRadius;
        const y4 = centerY + Math.sin(startAngleRad) * innerRadius;
        
        return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
      }
    }

    calculateArcLength(radius, startAngle, endAngle) {
      const angleInRadians = this.degreesToRadians(Math.abs(endAngle - startAngle));
      return radius * angleInRadians;
    }

    degreesToRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    setupIntersectionObserver() {
      const options = {
        threshold: 0.3, // Trigger when 30% of the chart is visible
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isAnimated) {
            this.animateSegments();
            this.isAnimated = true;
          }
        });
      }, options);

      observer.observe(this.chart);
    }

    setupAnimationProperties() {
      // Set animation duration as CSS custom property
      this.chart.style.setProperty('--animation-duration', `${this.animationDuration}ms`);
    }

    animateSegments() {
      this.segments.forEach((segment, index) => {
        const path = segment.querySelector('.segment-path');
        const label = segment.querySelector('.segment-label');
        const delay = index * 200; // Stagger the animations
        
        setTimeout(() => {
          path.classList.add('animate');
          
          if (label && this.showPercentages) {
            label.classList.add('animate');
          }
        }, delay);
      });
    }

    setupHoverInteractions() {
      this.segments.forEach((segment) => {
        const path = segment.querySelector('.segment-path');
        
        segment.addEventListener('mouseenter', (e) => {
          this.showTooltip(e, segment);
          path.style.transform = 'scale(1.05)';
          path.style.transformOrigin = `${this.centerX}px ${this.centerY}px`;
        });

        segment.addEventListener('mousemove', (e) => {
          this.updateTooltipPosition(e);
        });

        segment.addEventListener('mouseleave', () => {
          this.hideTooltip();
          path.style.transform = 'scale(1)';
        });

        // Touch support for mobile
        segment.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.showTooltip(e, segment);
          
          // Hide tooltip after 2 seconds on mobile
          setTimeout(() => {
            this.hideTooltip();
          }, 2000);
        });
      });
    }

    setupLegendInteractions() {
      this.legendItems.forEach((item, index) => {
        const segmentLabel = item.dataset.segmentLabel;
        const correspondingSegment = Array.from(this.segments).find(
          segment => segment.dataset.label === segmentLabel
        );
        
        item.addEventListener('mouseenter', () => {
          if (correspondingSegment) {
            const path = correspondingSegment.querySelector('.segment-path');
            path.style.transform = 'scale(1.05)';
            path.style.transformOrigin = `${this.centerX}px ${this.centerY}px`;
          }
        });

        item.addEventListener('mouseleave', () => {
          if (correspondingSegment) {
            const path = correspondingSegment.querySelector('.segment-path');
            path.style.transform = 'scale(1)';
          }
        });

        item.addEventListener('click', () => {
          if (correspondingSegment) {
            // Highlight the segment
            this.highlightSegment(correspondingSegment);
          }
        });
      });
    }

    showTooltip(event, segment) {
      if (!this.tooltip) return;
      
      const value = segment.dataset.value;
      const label = segment.dataset.label;
      const percentage = segment.dataset.percentage;
      
      const content = this.tooltip.querySelector('.tooltip-content');
      content.innerHTML = `
        <div class="font-semibold">${label}</div>
        <div class="text-xs mt-1">${value} (${percentage}%)</div>
      `;
      
      this.tooltip.style.opacity = '1';
      this.updateTooltipPosition(event);
    }

    updateTooltipPosition(event) {
      if (!this.tooltip) return;
      
      const rect = this.chart.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      this.tooltip.style.left = `${x}px`;
      this.tooltip.style.top = `${y - 10}px`;
    }

    hideTooltip() {
      if (this.tooltip) {
        this.tooltip.style.opacity = '0';
      }
    }

    highlightSegment(segment) {
      // Remove highlight from all segments
      this.segments.forEach(seg => {
        seg.querySelector('.segment-path').style.opacity = '0.5';
      });
      
      // Highlight the selected segment
      const path = segment.querySelector('.segment-path');
      path.style.opacity = '1';
      path.style.transform = 'scale(1.1)';
      
      // Reset after 2 seconds
      setTimeout(() => {
        this.segments.forEach(seg => {
          const p = seg.querySelector('.segment-path');
          p.style.opacity = '0.9';
          p.style.transform = 'scale(1)';
        });
      }, 2000);
    }

    // Public method to re-animate the chart
    replay() {
      this.isAnimated = false;
      
      // Reset all segments
      this.segments.forEach((segment) => {
        const path = segment.querySelector('.segment-path');
        const label = segment.querySelector('.segment-label');
        
        path.classList.remove('animate');
        if (label) label.classList.remove('animate');
      });
      
      // Re-animate after a short delay
      setTimeout(() => {
        this.animateSegments();
        this.isAnimated = true;
      }, 100);
    }

    // Public method to update chart data (for dynamic updates)
    updateData(newData) {
      if (!Array.isArray(newData)) return;
      
      // Calculate new total
      const newTotal = newData.reduce((sum, item) => sum + item.value, 0);
      this.totalValue = newTotal;
      
      // Update segments data and regenerate paths
      this.segments.forEach((segment, index) => {
        if (newData[index]) {
          const percentage = (newData[index].value / newTotal) * 100;
          segment.dataset.value = newData[index].value;
          segment.dataset.percentage = percentage.toFixed(1);
          
          // Update colors if provided
          if (newData[index].color) {
            const path = segment.querySelector('.segment-path');
            path.setAttribute('fill', newData[index].color);
          }
        }
      });
      
      // Regenerate paths and re-animate
      this.generateSegmentPaths();
      this.replay();
    }
  }

  // Auto-initialize when DOM is ready
  function initializePulsePieCharts() {
    const charts = document.querySelectorAll('.pulse-pie-chart-container');
    
    charts.forEach(container => {
      // Avoid double initialization
      if (container.dataset.initialized === 'true') return;
      
      new PulsePieChart(container);
      container.dataset.initialized = 'true';
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePulsePieCharts);
  } else {
    initializePulsePieCharts();
  }

  // Re-initialize on dynamic content changes (for HubSpot preview mode)
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const charts = node.querySelectorAll ? 
                           node.querySelectorAll('.pulse-pie-chart-container') : 
                           [];
              
              charts.forEach(container => {
                if (container.dataset.initialized !== 'true') {
                  new PulsePieChart(container);
                  container.dataset.initialized = 'true';
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

  // Expose PulsePieChart class globally for external usage
  window.PulsePieChart = PulsePieChart;
})();