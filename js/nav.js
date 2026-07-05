/* =============================================
   NAV — scroll shadow + hamburger menu
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SHADOW ON SCROLL ---- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 8
        ? '0 2px 16px rgba(0,0,0,0.09)'
        : 'none';
    }, { passive: true });
  }

  /* ---- MOBILE NAV (hamburger menu) ---- */
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    const openMenu = () => {
      document.body.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      document.body.classList.contains('nav-open') ? closeMenu() : openMenu();
    });
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);
    navMobile.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
    // Safety: if the viewport grows past the mobile breakpoint while open, close it
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) closeMenu();
    }, { passive: true });
  }

});