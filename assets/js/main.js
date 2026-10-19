/* schofee — site interactions & animation */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp floating button ---------- */
  /* Replace with your number: country code + number, digits only (e.g. 919876543210) */
  var WHATSAPP_NUMBER = '910000000000';
  var wa = document.createElement('a');
  wa.className = 'whatsapp-float';
  wa.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hi schofee, I would like to know more about school fee financing.');
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Chat with schofee on WhatsApp');
  wa.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  document.body.appendChild(wa);
  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Scroll reveal ---------- */
  var items = [].slice.call(document.querySelectorAll('[data-reveal]'));
  // auto-stagger children of [data-stagger]
  [].slice.call(document.querySelectorAll('[data-stagger]')).forEach(function (group) {
    var step = parseFloat(group.getAttribute('data-stagger')) || 0.1;
    [].slice.call(group.children).forEach(function (child, i) {
      if (!child.hasAttribute('data-reveal')) { child.setAttribute('data-reveal', group.getAttribute('data-reveal-type') || ''); items.push(child); }
      child.style.setProperty('--d', (i * step).toFixed(2) + 's');
    });
  });
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
    // timeline dots light up as they pass the middle of the screen
    var tl = [].slice.call(document.querySelectorAll('.tl-item'));
    if (tl.length) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('is-in'); });
      }, { rootMargin: '0px 0px -45% 0px' });
      tl.forEach(function (el) { io2.observe(el); });
    }
  }

  /* ---------- Timeline progress line ---------- */
  var timeline = document.querySelector('.timeline');
  var bar = document.querySelector('.timeline__progress');
  if (timeline && bar) {
    var upd = function () {
      var r = timeline.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.55 - r.top) / r.height));
      bar.style.height = (p * 100) + '%';
    };
    window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  }

  /* ---------- Subtle parallax on hero visuals (desktop only) ---------- */
  var stage = document.querySelector('.hero__stage, .hero-visual');
  if (stage && !reduce && window.matchMedia('(hover:hover) and (min-width:1024px)').matches) {
    var hero = stage.closest('section');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      [].slice.call(stage.querySelectorAll('.hero__icon')).forEach(function (el, i) {
        var f = (i % 2 ? 14 : -10);
        el.style.transform = 'translate(' + (x * f) + 'px,' + (y * f) + 'px)';
      });
    });
    hero.addEventListener('mouseleave', function () {
      [].slice.call(stage.querySelectorAll('.hero__icon')).forEach(function (el) { el.style.transform = ''; });
    });
  }

  /* ---------- Compare slider: drag left/right to turn the grey traditional image into the blue schofee one ---------- */
  var cs = document.querySelector('.compare__slider');
  if (cs) {
    var handle = cs.querySelector('.compare__handle');
    var setPos = function (p) {
      p = Math.min(100, Math.max(0, p));
      cs.style.setProperty('--pos', p + '%');
      handle.setAttribute('aria-valuenow', Math.round(p));
    };
    var fromEvent = function (e) { var r = cs.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width * 100); };
    var dragging = false;
    cs.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; cs.setPointerCapture(e.pointerId); cs.classList.add('is-dragging'); fromEvent(e);
    });
    cs.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    var stop = function () { dragging = false; cs.classList.remove('is-dragging'); };
    cs.addEventListener('pointerup', stop);
    cs.addEventListener('pointercancel', stop);
    handle.addEventListener('keydown', function (e) {
      var cur = parseFloat(handle.getAttribute('aria-valuenow'));
      if (e.key === 'ArrowLeft') { setPos(cur - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(cur + 5); e.preventDefault(); }
    });
  }

  /* ---------- Blog filter ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.tab[data-filter]'));
  if (tabs.length) {
    var cards = [].slice.call(document.querySelectorAll('.post-card'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var f = t.getAttribute('data-filter');
        tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t); });
        cards.forEach(function (c, i) {
          var show = f === 'all' || c.getAttribute('data-cat') === f;
          c.classList.toggle('is-hidden', !show);
          if (show && !reduce) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = 'heroIn .6s ' + (i % 3) * 0.08 + 's both'; }
        });
      });
    });
  }

  /* ---------- Newsletter ---------- */
  var nl = document.getElementById('newsletter-form');
  if (nl) nl.addEventListener('submit', function (e) {
    e.preventDefault();
    var i = nl.querySelector('input'), m = nl.querySelector('.nl-msg');
    if (!i.checkValidity()) { m.textContent = 'Please enter a valid email address.'; i.focus(); return; }
    m.textContent = 'Thank you! You are subscribed.'; nl.reset();
  });

  /* ---------- Contact form ---------- */
  var cf = document.getElementById('contact-form');
  if (cf) {
    var inst = document.getElementById('cf-institution-field');
    var syncInst = function () {
      var v = (cf.querySelector('input[name="role"]:checked') || {}).value;
      inst.querySelector('label .req').hidden = v !== 'School / Institution';
    };
    [].slice.call(cf.querySelectorAll('input[name="role"]')).forEach(function (r) { r.addEventListener('change', syncInst); });
    // pre-select role from URL (?role=school|parent|lender)
    var q = (location.search.match(/role=(\w+)/) || [])[1];
    var map = { school: 'School / Institution', parent: 'Parent', lender: 'Lending Partner' };
    if (q && map[q]) { var r = cf.querySelector('input[value="' + map[q] + '"]'); if (r) r.checked = true; }
    syncInst();

    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null, msg = cf.querySelector('.form-msg');
      var role = (cf.querySelector('input[name="role"]:checked') || {}).value;
      var rules = [
        ['cf-name', function (v) { return v.trim().length >= 2; }, 'Please enter your name.'],
        ['cf-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email address.'],
        ['cf-phone', function (v) { return /^[+]?[\d\s-]{10,15}$/.test(v.trim()); }, 'Please enter a valid phone number.'],
        ['cf-institution', function (v) { return role !== 'School / Institution' || v.trim().length > 1; }, 'Please enter your institution name.'],
        ['cf-message', function (v) { return v.trim().length >= 10; }, 'Please tell us a little more (10+ characters).']
      ];
      rules.forEach(function (rule) {
        var el = document.getElementById(rule[0]), f = el.closest('.field'), err = f.querySelector('.err');
        var good = rule[1](el.value);
        f.classList.toggle('has-error', !good); err.textContent = good ? '' : rule[2];
        el.setAttribute('aria-invalid', !good);
        if (!good) { ok = false; if (!first) first = el; }
      });
      var roleField = cf.querySelector('fieldset.field');
      roleField.querySelector('.err').textContent = role ? '' : 'Please choose one option.';
      if (!role) { ok = false; }
      if (!ok) { msg.className = 'form-msg bad'; msg.textContent = 'Please correct the highlighted fields.'; if (first) first.focus(); return; }
      msg.className = 'form-msg ok';
      msg.textContent = 'Thank you! Your enquiry has been received. Our team will get in touch with you shortly.';
      cf.reset(); syncInst();
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
