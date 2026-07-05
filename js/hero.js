/* =============================================
   HERO — image alternator, buyers counter
   (with a subtle "+N" pop when it ticks up),
   and a gentle mouse-tilt on the book visual.
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

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
  const buyersPopWrap = document.querySelector('.buyers-pop');

  function popIncrement(amount) {
    if (!buyersPopWrap || !buyersEl) return;
    const badge = document.createElement('span');
    badge.className = 'buyers-pop-badge';
    badge.textContent = '+' + amount;
    buyersPopWrap.appendChild(badge);
    buyersEl.classList.add('buyers-flash');
    window.setTimeout(() => buyersEl.classList.remove('buyers-flash'), 260);
    window.setTimeout(() => badge.remove(), 1150);
  }

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

    // If more than 1 hour has passed since last update, catch up quietly
    // (no pop animation — the visitor wasn't watching for this one)
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

    function updateBuyerCount(amount) {
      if (count >= CAP) return;
      count = Math.min(count + amount, CAP);
      buyersEl.textContent = count.toLocaleString();
      localStorage.setItem(STORAGE_KEY, count);
      localStorage.setItem(TS_KEY, Date.now());
      popIncrement(amount);
    }

    const incrementInterval = window.setInterval(() => {
      if (count >= CAP) {
        window.clearInterval(incrementInterval);
        return;
      }
      const bump = Math.floor(Math.random() * 3) + 1; // +1 to +3
      updateBuyerCount(bump);
    }, 5000);
  }

  /* ---- BOOK VISUAL: GENTLE MOUSE TILT ---- */
  const heroVisual = document.getElementById('heroVisual');
  const visualFrame = document.getElementById('visualFrame');
  const MAX_TILT = 6; // degrees — kept subtle on purpose

  if (heroVisual && visualFrame && window.matchMedia('(hover: hover)').matches) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0 -> 1
      const py = (e.clientY - rect.top) / rect.height;  // 0 -> 1
      const rotateY = (px - 0.5) * (MAX_TILT * 2);
      const rotateX = (0.5 - py) * (MAX_TILT * 2);
      visualFrame.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      visualFrame.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

});