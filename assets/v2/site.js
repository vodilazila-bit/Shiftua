/*! WEBWORK site interactions: header, menu, scroll effects, price shortcuts. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('site-menu');
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    }
    if (open && panel) {
      var first = panel.querySelector('a');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    }
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) setMenu(false); });
  }

  /* ---------- statement: words light up as you read ---------- */
  var statement = document.querySelector('[data-statement]');
  var words = [];
  if (statement && !reduce) {
    var text = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    text.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = w;
      statement.appendChild(span);
      if (i < text.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(span);
    });
    statement.classList.add('is-split');
  }

  /* ---------- tagline drifts sideways with scroll ---------- */
  var rows = [].slice.call(document.querySelectorAll('[data-drift]'));

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      root.classList.toggle('is-scrolled', y > 24);
      if (words.length) {
        var r = statement.getBoundingClientRect();
        var p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
        var on = Math.round(Math.max(0, Math.min(1, p)) * words.length);
        for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < on);
      }
      if (!reduce) {
        for (var k = 0; k < rows.length; k++) {
          var box = rows[k].parentElement.getBoundingClientRect();
          if (box.bottom < -50 || box.top > vh + 50) continue;
          var q = (vh - box.top) / (vh + box.height);
          rows[k].style.transform = 'translate3d(' + (4 + Number(rows[k].getAttribute('data-drift')) * q * 30).toFixed(2) + '%,0,0)';
        }
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- price cards prefill the form ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-service]');
    if (!a) return;
    var select = document.getElementById('f-service');
    if (select) select.value = a.getAttribute('data-service');
  });

  /* ---------- live screenshot of a client site: typographic fallback if it fails ---------- */
  [].forEach.call(document.querySelectorAll('[data-shot]'), function (box) {
    var img = box.querySelector('img');
    if (!img) return;
    function bad() { box.classList.add('is-fallback'); }
    img.addEventListener('error', bad);
    img.addEventListener('load', function () { if (img.naturalWidth < 400) bad(); });
    if (img.complete && img.naturalWidth > 0 && img.naturalWidth < 400) bad();
  });
})();
