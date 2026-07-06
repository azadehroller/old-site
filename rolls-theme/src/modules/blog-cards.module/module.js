const groupContainer = document.querySelector('.blog-group-container');
  const postGroups = document.querySelectorAll('.blog-post-group');
  const menuButtons = document.querySelectorAll('ul.blog-group-menu button[data-select]');
  const allButtons = document.querySelectorAll('button[data-select]');
  const header = document.getElementById('header');
  const menu = document.querySelector('.blog-group-menu');

  function scrollToMenu() {
    const headerHeight = header ? header.offsetHeight : 0;
    const menuTop = menu.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    document.querySelector('ul.blog-group-menu button.active')
      .scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    
    window.scrollTo({
      top: menuTop,
      behavior: 'smooth'
    });

  }

  allButtons.forEach(button => {
    button.addEventListener('click', function () {
      const target = this.dataset.select;

      // Toggle content visibility
      if (target === "all") {
        groupContainer.classList.remove("hidden");
        postGroups.forEach(pg => pg.classList.add("hidden"));
      } else {
        groupContainer.classList.add("hidden");
        postGroups.forEach(pg => {
          pg.classList.toggle("hidden", pg.dataset.item !== target);
        });
      }

      // Toggle active menu state
      menuButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.select === target);
      });

      // Scroll to menu with offset
      scrollToMenu();
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.truncatable').forEach(truncatable => {
    const button = truncatable.querySelector('.toggle-more');
    const moreText = truncatable.querySelector('.more-text');
    const ellipsis = truncatable.querySelector('.ellipsis');

    if (button && moreText) {
      button.addEventListener('click', () => {
        truncatable.classList.add('show-full-text');
      });
    }
  });
});