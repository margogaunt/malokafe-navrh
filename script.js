/* Malö kafe – návrh úvodní stránky */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Otevírací doba: 0 = neděle */
  var HOURS = {
    0: [9 * 60, 18 * 60 + 30],
    1: [7 * 60 + 30, 18 * 60 + 30],
    2: [7 * 60 + 30, 18 * 60 + 30],
    3: [7 * 60 + 30, 18 * 60 + 30],
    4: [7 * 60 + 30, 18 * 60 + 30],
    5: [7 * 60 + 30, 18 * 60 + 30],
    6: [9 * 60, 18 * 60 + 30]
  };
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return h + ':' + (mm < 10 ? '0' : '') + mm; }

  var now = new Date();
  var day = now.getDay();
  var mins = now.getHours() * 60 + now.getMinutes();
  var today = HOURS[day];
  var isOpen = mins >= today[0] && mins < today[1];
  var label;
  if (isOpen) {
    label = 'Právě máme otevřeno do ' + fmt(today[1]);
  } else if (mins < today[0]) {
    label = 'Zavřeno, otevíráme v ' + fmt(today[0]);
  } else {
    label = 'Zavřeno, zítra od ' + fmt(HOURS[(day + 1) % 7][0]);
  }
  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.classList.toggle('is-open', isOpen);
    var t = el.querySelector('.status__text');
    if (t) t.textContent = label;
  });

  /* Mobilní menu */
  var btn = document.querySelector('.menu-btn');
  var scrim = document.querySelector('.scrim');
  function setNav(open) {
    doc.classList.toggle('nav-open', open);
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    }
  }
  if (btn) btn.addEventListener('click', function () { setNav(!doc.classList.contains('nav-open')); });
  if (scrim) scrim.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && doc.classList.contains('nav-open')) { setNav(false); if (btn) btn.focus(); }
  });
  document.querySelectorAll('.rail__nav a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });

  /* Úvod */
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  });

  /* Objevení při scrollu */
  var revealEls = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Cedulka Hledáme posilu: spadne, 1,5 s visí, pak odjede nahoru.
     Znovu se ukáže až po novém načtení stránky. */
  var sign = document.querySelector('.sign');
  if (sign) {
    var DROP = reduce ? 0 : 1100, STAY = 1500;
    setTimeout(function () {
      sign.classList.add('is-shown');
      setTimeout(function () {
        sign.classList.remove('is-shown');
        if (reduce) return;
        sign.classList.add('is-hiding');
        setTimeout(function () { sign.classList.remove('is-hiding'); }, 520);
      }, DROP + STAY);
    }, reduce ? 0 : 600);
  }

  /* Rok v patičce */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = now.getFullYear();
})();
