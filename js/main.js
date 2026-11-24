// Accessible navigation shared by the homepage and legacy information pages.
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!menuToggle || !navLinks) return;
  const setMenu = function (open) {
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    const english = document.documentElement.lang === 'en';
    menuToggle.setAttribute('aria-label', open ? (english ? 'Close menu' : 'Menu sluiten') : (english ? 'Open menu' : 'Menu openen'));
  };
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', function (event) {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
  });
});
