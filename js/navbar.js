// Highlight active nav link based on current page

const links = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split('/').pop();

links.forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
