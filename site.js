(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* compact header once you scroll */
  function onScroll() {
    root.classList.toggle('scrolled', window.scrollY > 24);
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 600);
  }

  /* back to top button */
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 8h-4.5v6h-5v-6H5z"/></svg>';
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal things as they scroll in (only ones below the first screen, so nothing visible starts hidden) */
  if (!reduce && 'IntersectionObserver' in window) {
    var sel = '.game, .dl-card, .person, .sf, .soc-small a, .soc-tree, .way, .facts, .monsters figure, .shots img, .callout, .section > .sh, .logo-disc';
    var els = [].slice.call(document.querySelectorAll(sel));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    var vh = window.innerHeight;
    var groups = new Map();
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.95) return;
      var p = el.parentElement, n = groups.get(p) || 0;
      groups.set(p, n + 1);
      el.style.setProperty('--d', Math.min(n, 6) * 70 + 'ms');
      el.classList.add('rv');
      io.observe(el);
    });
  }

  /* soft glow that follows the mouse on cards */
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.game, .dl-card, .sf, .news');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* fade between pages */
  if (!reduce) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var href = a.getAttribute('href');
      if (!/^\/(?!\/)/.test(href)) return;
      if (href.split('#')[0] === location.pathname) return;
      e.preventDefault();
      root.classList.add('leaving');
      setTimeout(function () { location.href = a.href; }, 180);
    });
    window.addEventListener('pageshow', function () { root.classList.remove('leaving'); });
  }

  /* phone menu */
  var mb = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (mb && nav) {
    mb.addEventListener('click', function () {
      var open = !root.classList.contains('menu-open');
      root.classList.toggle('menu-open', open);
      mb.setAttribute('aria-expanded', open);
      mb.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) root.classList.remove('menu-open'); });
  }

  /* scroll progress bar under the header */
  var bar = document.createElement('div');
  bar.className = 'progress';
  var hdr = document.querySelector('header .hd');
  if (hdr) hdr.appendChild(bar);
  function prog() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
  }
  window.addEventListener('scroll', prog, { passive: true });
  prog();

  /* count up the home page numbers when they come into view */
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
        var start = end > 1000 ? end - 30 : 0, t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 900), v = Math.round(start + (end - start) * (1 - Math.pow(1 - k, 3)));
          el.textContent = v + suf;
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: .6 });
    nums.forEach(function (n) { cio.observe(n); });
  }

  /* images fade in once loaded instead of popping */
  [].slice.call(document.querySelectorAll('main img')).forEach(function (img) {
    if (img.complete) return;
    img.classList.add('loading');
    img.addEventListener('load', function () { img.classList.remove('loading'); }, { once: true });
    img.addEventListener('error', function () { img.classList.remove('loading'); }, { once: true });
  });
})();
