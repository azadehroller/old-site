(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const waveContainers = document.querySelectorAll('.pulse-wave-container');
    
    waveContainers.forEach(container => {
      const lines = container.querySelectorAll('.pulse-wave-line');
      
      // Add mousemove interaction
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const centerX = rect.width / 2;
        
        lines.forEach((line, index) => {
          const lineRect = line.getBoundingClientRect();
          const lineX = lineRect.left - rect.left + lineRect.width / 2;
          const distance = Math.abs(x - lineX);
          const maxDistance = rect.width;
          const intensity = 1 - (distance / maxDistance);
          
          // Create wave effect based on mouse position
          line.style.transform = `scaleY(${0.5 + intensity * 0.8})`;
          line.style.opacity = `${0.3 + intensity * 0.7}`;
        });
      });
      
      // Reset on mouse leave
      container.addEventListener('mouseleave', () => {
        lines.forEach(line => {
          line.style.transform = '';
          line.style.opacity = '';
        });
      });
      
      // Add scroll-based parallax effect
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        container.style.transform = `translateY(${rate}px)`;
      });
    });
  });
})();