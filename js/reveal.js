/* =============================================
   SCROLL REVEAL — fades/slides cards and stats
   in as they enter the viewport
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const revealEls = document.querySelectorAll('.cat-card, .value-card, .stat-item');
  if (!('IntersectionObserver' in window) || !revealEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform.replace('translateY(18px)', 'translateY(0)');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.38s ease ${i * 0.04}s, transform 0.38s ease ${i * 0.04}s`;
    io.observe(el);
  });

});