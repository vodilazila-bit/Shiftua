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

  /* ---------- "Як ми працюємо": the approach list slides out ---------- */
  var approachSec = document.getElementById('approach');
  var approachList = document.getElementById('approach-list');
  var approachBtn = approachSec && approachSec.querySelector('.approach-toggle');
  function setApproach(open, scroll) {
    if (!approachList) return;
    approachList.classList.toggle('is-open', open);
    approachList.toggleAttribute('inert', !open);
    if (approachBtn) {
      approachBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      approachBtn.querySelector('.approach-toggle-t').textContent = open ? 'Згорнути список' : 'Показати список';
    }
    if (scroll && approachSec && (open || approachSec.getBoundingClientRect().top < 0)) {
      approachSec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }
  if (approachList && root.classList.contains('js')) setApproach(location.hash === '#approach', false);
  if (approachBtn) approachBtn.addEventListener('click', function () {
    setApproach(!approachList.classList.contains('is-open'), true);
  });
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href="#approach"]');
    if (link) setApproach(true, false);
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

  /* ---------- ціни: картки виїжджають зліва одна за одною, коли блок з'являється на екрані ---------- */
  (function () {
    var cards = [].slice.call(document.querySelectorAll('.price-card'));
    if (!cards.length) return;
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || !('IntersectionObserver' in window)) { cards.forEach(function (c) { c.classList.add('slide-in'); }); return; }
    document.documentElement.classList.add('slide-ready');
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return cards.indexOf(a.target) - cards.indexOf(b.target); })
        .forEach(function (e) {
          e.target.style.transitionDelay = (n++ * 0.18) + 's';
          e.target.classList.add('slide-in');
          io.unobserve(e.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    cards.forEach(function (c) { io.observe(c); });
    // швидкий скрол може «перестрибнути» картку — тоді показуємо все, що вже вище за низ екрана
    function catchUp() {
      var left = 0;
      cards.forEach(function (c) {
        if (c.classList.contains('slide-in')) return;
        if (c.getBoundingClientRect().top < innerHeight) { c.classList.add('slide-in'); io.unobserve(c); } else left++;
      });
      if (!left) removeEventListener('scroll', catchUp);
    }
    addEventListener('scroll', catchUp, { passive: true });
  })();
})();
