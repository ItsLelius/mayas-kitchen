/* =============================================
   CAROUSEL — seamless infinite loop,
   auto-advances every 3 seconds.
   Works on any number of carousels: finds every
   ".carousel-block" on the page and initializes
   it independently (no IDs required).
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel-block').forEach(initCarousel);
});

function initCarousel(block) {
  const track = block.querySelector('.carousel-track');
  const dotsWrap = block.querySelector('.carousel-dots');
  const prevBtn = block.querySelector('.carousel-prev');
  const nextBtn = block.querySelector('.carousel-next');
  const AUTOPLAY_MS = 3000;
  const TRANSITION_MS = 500;

  if (!track || !dotsWrap) return;

  const originalSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  const total = originalSlides.length;
  if (!total) return;

  // Clone the full set once and append, so the track can scroll
  // past the "end" seamlessly before snapping back invisibly.
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  const allSlides = track.querySelectorAll('.carousel-slide');

  let pos = 0; // can exceed `total`; wraps invisibly
  track.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`;

  // Build dots (one per real slide)
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => { goTo(i); restartAuto(); });
    dotsWrap.appendChild(d);
  }
  const dots = dotsWrap.querySelectorAll('.dot');

  function slideWidth() {
    return allSlides[0].offsetWidth + 14; // width + gap
  }

  function render(withTransition) {
    track.style.transition = withTransition
      ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`
      : 'none';
    track.style.transform = `translateX(-${pos * slideWidth()}px)`;
    const realIndex = ((pos % total) + total) % total;
    dots.forEach((d, i) => d.classList.toggle('active', i === realIndex));
  }

  // Jump straight to a real slide index (used by dot clicks)
  function goTo(idx) {
    const realIndex = ((pos % total) + total) % total;
    const forwardSteps = (idx - realIndex + total) % total;
    pos += forwardSteps;
    render(true);
  }

  function next() {
    pos += 1;
    render(true);
    // Once we've scrolled onto the cloned set, snap back to the
    // real set at the same visual spot — invisibly, no transition.
    if (pos >= total) {
      window.setTimeout(() => {
        pos -= total;
        render(false);
      }, TRANSITION_MS);
    }
  }

  function prev() {
    if (pos <= 0) {
      pos += total;
      render(false);
      // force reflow so the instant jump applies before animating
      void track.offsetHeight;
    }
    pos -= 1;
    render(true);
  }

  let autoTimer = setInterval(next, AUTOPLAY_MS);
  function clearAuto() { clearInterval(autoTimer); }
  function restartAuto() { clearAuto(); autoTimer = setInterval(next, AUTOPLAY_MS); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAuto(); });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      restartAuto();
    }
  }, { passive: true });

  // Keyboard — only when this carousel is the one currently in view,
  // so multiple carousels on one page don't fight over arrow keys.
  document.addEventListener('keydown', e => {
    const rect = block.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') { prev(); restartAuto(); }
    if (e.key === 'ArrowRight') { next(); restartAuto(); }
  });

  // Recalc on resize (no animation, just re-measure)
  window.addEventListener('resize', () => render(false), { passive: true });

  render(false);
}