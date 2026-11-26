(() => {
  const track = document.getElementById('concepts');
  const controls = document.querySelector('.work-controls');
  const [previous, next] = controls.querySelectorAll('button');
  function sync() {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollWidth - track.clientWidth - track.scrollLeft <= 2;
  }
  function move(direction) {
    const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
    track.scrollBy({
      left: direction * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  controls.hidden = false;
  sync();
})();
