/*! WEBWORK: стрічка кейсів — «креслярська лінійка» з повзунком, лічильник і стрілки замість системного скролбару. */
(() => {
  const track = document.getElementById('concepts');
  const nav = document.querySelector('.work-nav');
  if (!track || !nav) return;

  const cards = [...track.children];
  const rail = nav.querySelector('.work-rail');
  const thumb = nav.querySelector('.work-thumb');
  const current = nav.querySelector('.work-count b');
  const total = nav.querySelector('.work-count span');
  const [prev, next] = nav.querySelectorAll('.work-controls button');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const pad = (n) => String(n).padStart(2, '0');

  rail.style.setProperty('--n', cards.length);
  total.textContent = '/ ' + pad(cards.length);
  track.classList.add('has-rail');
  nav.hidden = false;

  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
  const behavior = () => (reduce.matches ? 'auto' : 'smooth');

  /* ---------- малюємо повзунок і лічильник (спершу читаємо розміри, потім пишемо стилі) ---------- */
  let queued = false;
  let label = '';
  function render() {
    queued = false;
    const max = maxScroll();
    const x = track.scrollLeft;
    const railW = rail.clientWidth;
    const thumbW = Math.max(36, railW * Math.min(1, track.clientWidth / (track.scrollWidth || 1)));
    const progress = max ? Math.min(1, Math.max(0, x / max)) : 0;
    const box = track.getBoundingClientRect();
    let first = -1;
    let last = -1;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const visible = Math.min(r.right, box.right) - Math.max(r.left, box.left);
      if (visible >= r.width * 0.55) {
        if (first < 0) first = i;
        last = i;
      }
    });
    if (first < 0) first = last = Math.round(progress * (cards.length - 1));
    const text = first === last ? pad(first + 1) : pad(first + 1) + '–' + pad(last + 1);

    thumb.style.width = thumbW + 'px';
    thumb.style.transform = 'translate3d(' + ((railW - thumbW) * progress).toFixed(1) + 'px,0,0)';
    if (text !== label) current.textContent = label = text;
    prev.disabled = x <= 2;
    next.disabled = x >= max - 2;
  }
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  };

  /* ---------- повзунок світиться, поки стрічка рухається ---------- */
  let movingTimer = 0;
  track.addEventListener('scroll', () => {
    schedule();
    rail.classList.add('is-moving');
    clearTimeout(movingTimer);
    movingTimer = setTimeout(() => rail.classList.remove('is-moving'), 380);
  }, { passive: true });

  /* ---------- стрілки ---------- */
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: behavior() }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: behavior() }));

  /* ---------- доводимо до найближчого кейсу ---------- */
  function snapTo(left, done) {
    const s = step();
    const target = Math.min(maxScroll(), Math.max(0, Math.round(left / s) * s));
    track.scrollTo({ left: target, behavior: behavior() });
    if (!done) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      track.removeEventListener('scrollend', finish);
      done();
    };
    track.addEventListener('scrollend', finish);
    setTimeout(finish, 700);
  }

  /* ---------- тягнемо повзунок або клікаємо по лінійці ---------- */
  let drag = null;
  rail.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const railBox = rail.getBoundingClientRect();
    const thumbW = thumb.offsetWidth;
    const free = Math.max(1, railBox.width - thumbW);
    if (e.target === thumb) {
      drag = { id: e.pointerId, x0: e.clientX, s0: track.scrollLeft, k: maxScroll() / free };
      rail.setPointerCapture(e.pointerId);
      rail.classList.add('is-active');
      track.classList.add('is-dragging');
    } else {
      const p = Math.min(1, Math.max(0, (e.clientX - railBox.left - thumbW / 2) / free));
      snapTo(p * maxScroll());
    }
  });
  rail.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    track.scrollLeft = drag.s0 + (e.clientX - drag.x0) * drag.k;
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null;
    rail.classList.remove('is-active');
    snapTo(track.scrollLeft, () => track.classList.remove('is-dragging'));
  };
  rail.addEventListener('pointerup', release);
  rail.addEventListener('pointercancel', release);

  window.addEventListener('resize', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(track);
  render();
})();
