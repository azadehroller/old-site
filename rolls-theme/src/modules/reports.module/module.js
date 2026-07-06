// Reports Module JavaScript
// Add any interactive functionality here if needed

document.addEventListener('DOMContentLoaded', function() {
  const reportLinks = document.querySelectorAll('.report-link');
  
  // Optional: Add custom tracking or interactions
  reportLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Add custom analytics tracking here if needed
      console.log('Report link clicked:', this.textContent.trim());
    });
  });
});
