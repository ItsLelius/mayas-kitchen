/* =============================================
   MAYA'S KITCHEN SECRETS — MAIN JS
   - Lucide icons init
   - Hero image fade alternator
   - Buyers counter (increments every 1–2 hrs, caps at random reasonable number)
   - Carousel with swipe + dots + keyboard
   - Nav shadow on scroll
   - Scroll reveal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- LUCIDE ICONS ---- */
  if (window.lucide) lucide.createIcons();

  /* ---- HALF STAR SVG GRADIENT ---- */
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.setAttribute('style', 'width:0;height:0;position:absolute');
  svgDefs.innerHTML = `
    <defs>
      <linearGradient id="half-grad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" stop-color="#F5A623"/>
        <stop offset="50%" stop-color="#E5E4E0"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svgDefs);

  /* ---- NAV SHADOW ON SCROLL ---- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 8
        ? '0 2px 16px rgba(0,0,0,0.09)'
        : 'none';
    }, { passive: true });
  }

  /* ---- HERO IMAGE FADE ALTERNATOR ---- */
  const imgBook = document.getElementById('img-book');
  const imgMaya = document.getElementById('img-maya');
  if (imgBook && imgMaya) {
    let showingBook = true;
    setInterval(() => {
      if (showingBook) {
        imgBook.classList.remove('active');
        imgMaya.classList.add('active');
      } else {
        imgMaya.classList.remove('active');
        imgBook.classList.add('active');
      }
      showingBook = !showingBook;
    }, 5000);
  }

  /* ---- BUYERS COUNTER ---- */
  const buyersEl = document.getElementById('buyers-count');
  if (buyersEl) {
    // Cap is a random number between 823 and 983 (displayed as X,XXX format)
    const CAP = Math.floor(Math.random() * 160 + 823) + 1000; // e.g. 1823 - 1983
    const STORAGE_KEY = 'mks_buyers';
    const TS_KEY = 'mks_buyers_ts';

    const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
    const savedTs = parseInt(localStorage.getItem(TS_KEY) || '0');

    // Start count between 1200–1400 if not yet set
    let count = saved > 0 ? saved : Math.floor(Math.random() * 200 + 1200);
    const now = Date.now();

    // If more than 1 hour has passed since last update, increment
    if (savedTs > 0 && now - savedTs > 3600000) {
      const hoursElapsed = Math.floor((now - savedTs) / 3600000);
      for (let i = 0; i < hoursElapsed; i++) {
        if (count < CAP) {
          count += Math.floor(Math.random() * 2 + 1); // +1 or +2
        }
      }
    }

    count = Math.min(count, CAP);
    localStorage.setItem(STORAGE_KEY, count);
    localStorage.setItem(TS_KEY, now);

    buyersEl.textContent = count.toLocaleString();

    // Live increment during session — every 60–90 mins pick a random moment
    const sessionDelay = Math.floor(Math.random() * 30 + 60) * 60 * 1000;
    setTimeout(() => {
      if (count < CAP) {
        count += Math.floor(Math.random() * 2 + 1);
        count = Math.min(count, CAP);
        localStorage.setItem(STORAGE_KEY, count);
        buyersEl.textContent = count.toLocaleString();
      }
    }, sessionDelay);
  }

  /* ---- CAROUSEL (seamless infinite loop, auto-advances every 3s) ---- */
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const AUTOPLAY_MS = 3000;
  const TRANSITION_MS = 500;

  if (track && dotsWrap) {
    const originalSlides = Array.from(track.querySelectorAll('.carousel-slide'));
    const total = originalSlides.length;

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

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { prev(); restartAuto(); }
      if (e.key === 'ArrowRight') { next(); restartAuto(); }
    });

    // Recalc on resize (no animation, just re-measure)
    window.addEventListener('resize', () => render(false), { passive: true });

    render(false);
  }

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.cat-card, .value-card, .stat-item');
  if ('IntersectionObserver' in window && revealEls.length) {
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
  }

});