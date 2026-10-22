/* schofee — site interactions & animation */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp floating button ---------- */
  /* Replace with your number: country code + number, digits only (e.g. 919876543210) */
  var WHATSAPP_NUMBER = '919824909700';

  /* Form enquiries: open WhatsApp in a new tab with the submitted details pre-filled.
     Called only after a form passes validation. fields = [[inputName, label], ...] */
  var sendToWhatsApp = function (title, form, fields) {
    try {
      /* WhatsApp formatting: *bold* for headings and labels, one detail per line */
      var lines = ['*New Enquiry from schofee.com*', '', '*Form:* ' + title, '--------------------'];
      fields.forEach(function (f) {
        var el = form.elements[f[0]], v = el ? String(el.value || '').trim() : '';
        if (v) lines.push('*' + f[1] + ':* ' + v.replace(/\s*\n\s*/g, ' '));
      });
      lines.push('--------------------', '_Sent via schofee.com_');
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    } catch (err) { /* never block the form's own success message */ }
  };
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
          var show = f === 'all' || (' ' + c.getAttribute('data-cat') + ' ').indexOf(' ' + f + ' ') > -1;
          c.classList.toggle('is-hidden', !show);
          if (show && !reduce) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = 'heroIn .6s ' + (i % 3) * 0.08 + 's both'; }
        });
      });
    });
  }

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
      sendToWhatsApp('Contact Enquiry', cf, [['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['city', 'City'], ['role', 'I am a'], ['institution', 'Institution'], ['message', 'Message']]);
      cf.reset(); syncInst();
    });
  }

  /* ---------- Partner modal (For Schools, Partnership Models) ---------- */
  var pm = document.getElementById('partner-modal');
  if (pm && typeof pm.showModal === 'function') {
    var pf = document.getElementById('partner-form'), done = pm.querySelector('.modal__done'), pmsg = pf.querySelector('.form-msg');
    var openPm = function (e) {
      if (e) e.preventDefault();
      pf.hidden = false; done.hidden = true;
      pm.showModal(); document.body.classList.add('modal-open');
    };
    var closePm = function () { if (pm.open) pm.close(); };
    [].slice.call(document.querySelectorAll('[data-open-partner]')).forEach(function (b) { b.addEventListener('click', openPm); });
    [].slice.call(pm.querySelectorAll('[data-close-partner]')).forEach(function (b) { b.addEventListener('click', closePm); });
    pm.addEventListener('close', function () { document.body.classList.remove('modal-open'); });
    pm.addEventListener('click', function (e) { if (e.target === pm) closePm(); });

    var setErr = function (box, msg) {
      box.classList.toggle('has-error', !!msg);
      var err = box.querySelector('.err'); if (err) err.textContent = msg || '';
    };
    pf.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null, ok = true;
      var mark = function (box, el, msg) { setErr(box, msg); if (msg) { ok = false; if (!first) first = el; } };
      [['pf-name', function (v) { return v.trim().length >= 2; }, 'Please enter the contact person name.'],
       ['pf-institution', function (v) { return v.trim().length >= 2; }, 'Please enter your institution name.'],
       ['pf-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email address.'],
       ['pf-phone', function (v) { return /^[+]?[\d\s-]{10,15}$/.test(v.trim()); }, 'Please enter a valid mobile number.'],
       ['pf-city', function (v) { return v.trim().length >= 2; }, 'Please enter your city.']
      ].forEach(function (r) {
        var el = document.getElementById(r[0]), good = r[1](el.value);
        mark(el.closest('.field'), el, good ? '' : r[2]);
        el.setAttribute('aria-invalid', !good);
      });
      [].slice.call(pf.querySelectorAll('fieldset[data-required]')).forEach(function (fs) {
        mark(fs, fs.querySelector('input'), fs.querySelector('input:checked') ? '' : 'Please choose one option.');
      });
      if (!ok) { pmsg.className = 'form-msg bad'; pmsg.textContent = 'Please correct the highlighted fields.'; if (first) first.focus(); return; }
      pmsg.className = 'form-msg'; pmsg.textContent = '';
      sendToWhatsApp('Educational Institution', pf, [['name', 'Contact person'], ['institution', 'Institution'], ['email', 'Email'], ['phone', 'Mobile'], ['city', 'City'], ['students', 'Number of students'], ['collection', 'Existing fee collection']]);
      pf.reset(); pf.hidden = true; done.hidden = false; pm.querySelector('.modal__box').scrollTop = 0;
      done.querySelector('.btn').focus();
    });
    pf.addEventListener('input', function (e) {
      var box = e.target.closest('.field'); if (box && box.classList.contains('has-error')) setErr(box, '');
    });
  }

  /* ---------- Lending partner modal (Contact Us) ---------- */
  var lm = document.getElementById('lender-modal');
  if (lm && typeof lm.showModal === 'function') {
    var lf = document.getElementById('lender-form'), ldone = lm.querySelector('.modal__done'), lmsg = lf.querySelector('.form-msg');
    var openLm = function (e) {
      if (e) e.preventDefault();
      lf.hidden = false; ldone.hidden = true;
      lm.showModal(); document.body.classList.add('modal-open');
    };
    var closeLm = function () { if (lm.open) lm.close(); };
    [].slice.call(document.querySelectorAll('[data-open-lender]')).forEach(function (b) { b.addEventListener('click', openLm); });
    [].slice.call(lm.querySelectorAll('[data-close-lender]')).forEach(function (b) { b.addEventListener('click', closeLm); });
    lm.addEventListener('close', function () { document.body.classList.remove('modal-open'); });
    lm.addEventListener('click', function (e) { if (e.target === lm) closeLm(); });

    var setLErr = function (box, msg) {
      box.classList.toggle('has-error', !!msg);
      var err = box.querySelector('.err'); if (err) err.textContent = msg || '';
    };
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null, ok = true;
      [['lf-name', function (v) { return v.trim().length >= 2; }, 'Please enter the contact person name.'],
       ['lf-company', function (v) { return v.trim().length >= 2; }, 'Please enter your NBFC / company name.'],
       ['lf-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email address.'],
       ['lf-phone', function (v) { return /^[+]?[\d\s-]{10,15}$/.test(v.trim()); }, 'Please enter a valid mobile number.'],
       ['lf-city', function (v) { return v.trim().length >= 2; }, 'Please enter your city.']
      ].forEach(function (r) {
        var el = document.getElementById(r[0]), good = r[1](el.value);
        setLErr(el.closest('.field'), good ? '' : r[2]);
        el.setAttribute('aria-invalid', !good);
        if (!good) { ok = false; if (!first) first = el; }
      });
      if (!ok) { lmsg.className = 'form-msg bad'; lmsg.textContent = 'Please correct the highlighted fields.'; if (first) first.focus(); return; }
      lmsg.className = 'form-msg'; lmsg.textContent = '';
      sendToWhatsApp('NBFC / Financing Partner', lf, [['name', 'Contact person'], ['company', 'NBFC / Company'], ['email', 'Email'], ['phone', 'Mobile'], ['city', 'City'], ['message', 'Message']]);
      lf.reset(); lf.hidden = true; ldone.hidden = false; lm.querySelector('.modal__box').scrollTop = 0;
      ldone.querySelector('.btn').focus();
    });
    lf.addEventListener('input', function (e) {
      var box = e.target.closest('.field'); if (box && box.classList.contains('has-error')) setLErr(box, '');
    });
  }

  /* ---------- Policy pages: collapsible "On this page" on small screens ---------- */
  var tocBox = document.querySelector('.policy__toc details');
  if (tocBox && window.matchMedia) {
    var tocMq = window.matchMedia('(max-width: 980px)');
    var syncToc = function () { tocBox.open = !tocMq.matches; };
    syncToc();
    if (tocMq.addEventListener) tocMq.addEventListener('change', syncToc);
    [].slice.call(tocBox.querySelectorAll('a')).forEach(function (a) {
      a.addEventListener('click', function () { if (tocMq.matches) tocBox.open = false; });
    });
    // on desktop the list is always visible; stop the summary from collapsing it
    tocBox.querySelector('summary').addEventListener('click', function (e) { if (!tocMq.matches) e.preventDefault(); });
  }

  /* ---------- Tables: label each cell so rows can stack as cards on phones ---------- */
  [].slice.call(document.querySelectorAll('.policy__table table')).forEach(function (t) {
    var heads = [].slice.call(t.querySelectorAll('thead th')).map(function (h) { return h.textContent.trim(); });
    [].slice.call(t.querySelectorAll('tbody tr')).forEach(function (tr) {
      [].slice.call(tr.children).forEach(function (c, i) { if (c.tagName === 'TD') c.setAttribute('data-label', heads[i] || ''); });
    });
  });

  /* ---------- Reviews auto slider ---------- */
  var rs = document.querySelector('.reviews-slider');
  if (rs) {
    var track = rs.querySelector('.reviews'), dotsBox = rs.querySelector('.reviews__dots');
    var slides = [].slice.call(track.children), n = slides.length, idx = 0, timer = null, paused = false;
    var perView = function () { return window.innerWidth >= 1024 ? 3 : 1; };
    var pp = perView();
    // clones of the first slides so the loop never shows a gap
    slides.slice(0, 3).forEach(function (s) { var c = s.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.setAttribute('data-clone', ''); track.appendChild(c); });
    rs.classList.add('is-ready');
    var dots = slides.map(function (s, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show review ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); }); dotsBox.appendChild(b); return b;
    });
    // dots (and sliding) are only needed when there are more reviews than fit on screen
    var needsSlider = function () { return n > perView(); };
    var syncDots = function () { dotsBox.style.display = needsSlider() ? '' : 'none'; };
    syncDots();
    var step = function () { var all = track.children; return all.length > 1 ? all[1].offsetLeft - all[0].offsetLeft : 0; };
    var render = function (jump) {
      track.classList.toggle('is-jump', !!jump);
      track.style.transform = 'translateX(' + (needsSlider() ? -idx * step() : 0) + 'px)';
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx % n); });
    };
    var go = function (i) { idx = i; render(false); };
    var next = function () {
      idx += 1; render(false);
      if (idx >= n) { // landed on the clone of slide 0: jump back silently
        setTimeout(function () { if (idx < n) return; idx = 0; render(true); void track.offsetWidth; track.classList.remove('is-jump'); }, 720);
      }
    };
    var tick = function () { if (needsSlider() && !paused && !document.hidden) next(); };
    var restart = function () { clearInterval(timer); if (!reduce) timer = setInterval(tick, 5000); };
    rs.addEventListener('mouseenter', function () { paused = true; });
    rs.addEventListener('mouseleave', function () { paused = false; });
    rs.addEventListener('focusin', function () { paused = true; });
    rs.addEventListener('focusout', function () { paused = false; });
    window.addEventListener('resize', function () {
      var p = perView(); if (p !== pp) { pp = p; rs.style.setProperty('--pp', p); }
      syncDots(); if (!needsSlider()) idx = 0;
      render(true); void track.offsetWidth; track.classList.remove('is-jump');
    });
    // swipe
    var sx = null;
    rs.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') sx = e.clientX; });
    rs.addEventListener('pointerup', function (e) {
      if (sx === null) return; var d = e.clientX - sx; sx = null;
      if (!needsSlider()) return;
      if (Math.abs(d) > 40) { go(d < 0 ? (idx + 1) % n : (idx - 1 + n) % n); restart(); }
    });
    render(true); void track.offsetWidth; track.classList.remove('is-jump');
    restart();
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
