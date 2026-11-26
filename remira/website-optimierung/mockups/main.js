/* REMIRA Relaunch-Mockups (Konzeptentwurf, intern) – gemeinsames Script, kein Build.
   Enthält: globaler Header mit Mega-Menü + Handy-Menü, Footer, Modul-Labels + Schalter,
   Ring-Signature (Canvas 2D), Tilt-Karten, magnetische Buttons, Tabs, Slider, Hover Swap,
   Verbindungs-Grafik, Zähler, Countdown, Scroll Swap, Formulare, Playlist, Sticky-CTA. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, body = d.body;
  html.classList.add('js');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqDesk = window.matchMedia('(min-width: 1100px)');
  var reduce = function () { return mqReduce.matches; };
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var ic = function (n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };

  /* ---------- Icon-Sprite (Phosphor light 2.1.1, MIT) ---------- */
  if (window.REMIRA_ICONS) {
    var holder = d.createElement('div');
    holder.style.display = 'none';
    holder.innerHTML = window.REMIRA_ICONS;
    body.insertBefore(holder, body.firstChild);
  }

  var page = body.getAttribute('data-page') || '';

  /* ---------- Navigation (Daten) ---------- */
  var NAV = [
    { id: 'commerce', label: 'Commerce', cols: [
      { h: 'Omnichannel Commerce', dot: 'var(--r-blue)', links: [
        ['commerce.html', 'storefront', 'Omnichannel Commerce Übersicht', 'Online-Shop, Marktplätze und Filialen verbinden'],
        ['#', 'cash-register', 'Point of Sale', 'Kassensystem, fiskalisiert für DE und AT'],
        ['#', 'package', 'Warenwirtschaft', 'Basis für Filialen und Omnichannel-Prozesse'],
        ['produkt-oms.html', 'arrows-split', 'Order Management', 'Aufträge über alle Vertriebskanäle steuern']
      ] },
      { h: 'Filiale und Kunde', dot: 'var(--r-petrol)', links: [
        ['#', 'device-mobile', 'Mobile Store Management', 'App für Kasse, Bestand und Filiale auf der Fläche'],
        ['#', 'credit-card', 'Payment', 'Zahlungen in der Filiale und online'],
        ['#', 'users-three', 'Customer Hub', 'Marketing, Loyalty und Kundenverwaltung']
      ] }
    ], teaser: { eb: 'Showroom Dortmund', t: 'Omnichannel zum Anfassen', p: 'RFID, Digital Signage, interaktive Belege und Mobile Store Management vor Ort testen.', href: 'kontakt.html#showroom', cta: 'Termin anfragen' } },
    { id: 'supply', label: 'Supply Chain', cols: [
      { h: 'Planung', dot: 'var(--r-green)', links: [
        ['#', 'chart-line-up', 'IBP & S&OP', 'Absatz- und Produktionsplanung'],
        ['#', 'trend-up', 'Absatzprognose & Bestandsmanagement', 'KI-Absatzprognosen und automatische Bestellvorschläge']
      ] },
      { h: 'Zusammenarbeit und Inventur', dot: 'var(--r-yellow)', links: [
        ['#', 'handshake', 'Lieferantenmanagement', 'Digitale Zusammenarbeit mit Lieferanten'],
        ['#', 'barcode', 'Stichprobeninventur', 'Inventuraufwand um bis zu 99 % senken']
      ] }
    ], teaser: { eb: 'REMIRA PLATFORM', t: 'Supply Chain und Commerce auf einer Plattform', p: 'On-Premise, SaaS oder Hybrid, je nach Bedarf.', href: '#', cta: 'Plattform ansehen' } },
    { id: 'plattform', label: 'Plattform', href: '#' },
    { id: 'branchen', label: 'Branchen', cols: [
      { h: 'Handel', dot: 'var(--r-orange)', links: [
        ['#', 'storefront', 'Einzelhandel', ''],
        ['branche-fashion.html', 't-shirt', 'Fashion & Schuhe', ''],
        ['#', 'basketball', 'Sport & Spiel', ''],
        ['#', 'couch', 'Möbel & Deko', ''],
        ['#', 'hammer', 'Baumarkt & DIY', ''],
        ['#', 'television', 'Elektronik', ''],
        ['#', 'sparkle', 'Lifestyle', '']
      ] },
      { h: 'Produktion & Großhandel', dot: 'var(--r-red)', links: [
        ['#', 'factory', 'Produktion', ''],
        ['#', 'warehouse', 'Großhandel', ''],
        ['#', 'basket', 'Lebensmittel', ''],
        ['#', 'wrench', 'Kfz-Ersatzteile', ''],
        ['#', 'flask', 'Pharma & Chemie', '']
      ] }
    ], teaser: { eb: 'Branche im Fokus', t: 'Fashion & Schuhe', p: 'Saisonale Trends, schnell wechselnde Bestände und komplexe Lieferketten im Griff.', href: 'branche-fashion.html', cta: 'Zur Branchenseite' } },
    { id: 'referenzen', label: 'Referenzen', href: '#' },
    { id: 'wissen', label: 'Wissen', cols: [
      { h: 'Lernen', dot: 'var(--r-blue)', links: [
        ['webinar.html', 'presentation-chart', 'Webinare & Events', 'Live und on demand, kostenfrei'],
        ['#', 'newspaper', 'Blog', 'Case Studies und Fachartikel'],
        ['#', 'book-open-text', 'Glossar', 'Begriffe aus Supply Chain und Commerce']
      ] },
      { h: 'Mitnehmen', dot: 'var(--r-green)', links: [
        ['#', 'files', 'Whitepaper', 'Zum Herunterladen'],
        ['#', 'envelope-simple', 'Newsletter', 'Neuigkeiten per E-Mail']
      ] }
    ], teaser: { eb: 'Nächstes Webinar', t: 'Vom Warenchaos zur Klarheit', p: 'Der Weg zu einem schlanken, kundenorientierten Store-Betrieb ohne Wartezeiten.', href: 'webinar.html', cta: 'Zur Anmeldung' } },
    { id: 'unternehmen', label: 'Unternehmen', cols: [
      { h: 'REMIRA', dot: 'var(--r-petrol)', links: [
        ['#', 'buildings', 'Über uns', ''],
        ['#', 'list-numbers', 'Fakten', ''],
        ['#', 'graduation-cap', 'Karriere', ''],
        ['kontakt.html', 'chat-circle-text', 'Kontakt', '']
      ] }
    ], teaser: { eb: 'Fakten', t: 'Rund 1.500 Kunden, 12 Standorte', p: 'Hauptsitz in Dortmund. Quelle: remira.com/de/fakten.', href: '#', cta: 'Alle Fakten' } }
  ];
  var CUR = { 'commerce': 'commerce', 'produkt-oms': 'commerce', 'branche-fashion': 'branchen', 'webinar': 'wissen', 'kontakt': 'unternehmen' }[page];

  function megaHTML(item) {
    var cols = item.cols.map(function (c) {
      return '<div class="mega-col"><h4><span style="width:8px;height:8px;border-radius:50%;background:' + c.dot + '"></span>' + c.h + '</h4>' +
        c.links.map(function (l) {
          return '<a class="mlink" href="' + l[0] + '">' + ic(l[1]) + '<span><b>' + l[2] + '</b>' + (l[3] ? '<small>' + l[3] + '</small>' : '') + '</span></a>';
        }).join('') + '</div>';
    }).join('');
    if (item.cols.length === 1) cols += '<div></div>';
    var t = item.teaser;
    return '<div class="mega" id="mega-' + item.id + '" role="region" aria-label="' + item.label + '">' +
      '<div class="wrap mega-in">' + cols +
      '<a class="mega-teaser" href="' + t.href + '"><span class="eyebrow">' + t.eb + '</span><b>' + t.t + '</b><p>' + t.p + '</p><span class="tlink">' + t.cta + ' ' + ic('arrow-right') + '</span></a>' +
      '<span class="mod" data-k="a">Mega-Menü</span></div></div>';
  }

  function headerHTML() {
    var lis = NAV.map(function (n) {
      var cur = n.id === CUR ? ' cur' : '';
      if (n.href) return '<li><a class="nav-top' + cur + '" href="' + n.href + '">' + n.label + '</a></li>';
      return '<li><button class="nav-top' + cur + '" type="button" aria-expanded="false" aria-controls="mega-' + n.id + '" data-mega="' + n.id + '">' + n.label + ic('caret-down') + '</button></li>';
    }).join('');
    var megas = NAV.filter(function (n) { return n.cols; }).map(megaHTML).join('');
    var macc = NAV.map(function (n, i) {
      if (n.href) return '<div class="macc"><a href="' + n.href + '">' + n.label + ic('arrow-right') + '</a></div>';
      var links = [];
      n.cols.forEach(function (c) { c.links.forEach(function (l) { links.push('<a href="' + l[0] + '">' + ic(l[1]) + l[2] + '</a>'); }); });
      return '<div class="macc"><button type="button" aria-expanded="false" aria-controls="macc-' + i + '">' + n.label + ic('caret-down') + '</button><div class="macc-panel" id="macc-' + i + '"><div>' + links.join('') + '</div></div></div>';
    }).join('');
    return '<a class="skip" href="#main">Zum Inhalt springen</a>' +
      '<div class="concept">Konzeptentwurf, intern, nicht veröffentlicht <span>· Mockup Relaunch remira.com, Theme CLEAN Pro (Annahme)</span></div>' +
      '<header class="hdr" id="hdr"><div class="wrap hdr-in">' +
      '<a class="logo" href="start.html" aria-label="REMIRA Startseite"><img src="assets/REMIRA_Logo_white.png" width="480" height="88" alt="REMIRA"></a>' +
      '<ul class="nav" aria-label="Hauptnavigation">' + lis + '</ul>' +
      '<div class="hdr-r"><a class="lang" href="#" aria-label="Sprache wechseln, aktuell Deutsch">' + ic('globe-simple') + 'DE</a>' +
      '<a class="btn btn-p btn-demo magnet" href="kontakt.html"><span>Demo anfragen</span></a>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menü öffnen">' + ic('list', 'i-open') + ic('x', 'i-close') + '</button></div>' +
      '</div>' + megas + '</header>' +
      '<nav class="mnav" id="mnav" aria-label="Mobiles Menü"><span class="mod" data-k="a">Mobiles Menü (Akkordeon)</span>' + macc +
      '<div class="mnav-cta"><a class="btn btn-p" href="kontakt.html">Demo anfragen</a><a class="btn btn-g" href="#">' + ic('globe-simple') + 'English</a></div></nav>';
  }

  function footerHTML() {
    return '<footer class="ftr"><span class="mod" data-k="a">Footer global</span><div class="wrap">' +
      '<div class="ftr-grid">' +
      '<div><a class="flogo" href="start.html"><img src="assets/REMIRA_Logo_Claim_white.png" width="480" height="111" alt="REMIRA" loading="lazy"></a>' +
      '<address>REMIRA GmbH<br>Phoenixplatz 2<br>44263 Dortmund<br><a href="#">+49 231 997 82-0</a><br><a href="#">info@remira.com</a></address></div>' +
      '<div><h4>Commerce</h4><ul><li><a href="commerce.html">Übersicht</a></li><li><a href="#">Point of Sale</a></li><li><a href="#">Warenwirtschaft</a></li><li><a href="produkt-oms.html">Order Management</a></li><li><a href="#">Mobile Store Management</a></li><li><a href="#">Payment</a></li><li><a href="#">Customer Hub</a></li></ul></div>' +
      '<div><h4>Supply Chain</h4><ul><li><a href="#">IBP & S&OP</a></li><li><a href="#">Absatzprognose & Bestandsmanagement</a></li><li><a href="#">Lieferantenmanagement</a></li><li><a href="#">Stichprobeninventur</a></li></ul></div>' +
      '<div><h4>Wissen</h4><ul><li><a href="webinar.html">Webinare & Events</a></li><li><a href="#">Blog</a></li><li><a href="#">Glossar</a></li><li><a href="#">Whitepaper</a></li><li><a href="#">Newsletter</a></li></ul></div>' +
      '<div><h4>Unternehmen</h4><ul><li><a href="#">Über uns</a></li><li><a href="#">Fakten</a></li><li><a href="#">Karriere</a></li><li><a href="kontakt.html">Kontakt</a></li></ul></div>' +
      '</div><div class="ftr-bot"><span>© REMIRA GmbH · Microsoft Solutions Partner für Digital- und App-Innovationen Azure</span><nav><a href="#">Impressum</a><a href="#">Datenschutz</a><a href="#">Cookie-Einstellungen</a></nav></div></div></footer>';
  }

  var hdrSlot = $('#site-header'), ftrSlot = $('#site-footer');
  if (hdrSlot) hdrSlot.outerHTML = headerHTML();
  if (ftrSlot) ftrSlot.outerHTML = footerHTML();

  /* ---------- Modul-Labels ---------- */
  var CAT = { a: 'HubSpot-Editor/Theme-Modul', b: 'eigenes Modul/Template', c: 'Entwickler/Agentur' };
  $$('.mod[data-k]').forEach(function (m) {
    var ks = m.getAttribute('data-k').split('+');
    var badges = ks.map(function (k) { return '<b class="' + k + '" title="' + CAT[k] + '">' + k + '</b>'; }).join('');
    var name = m.innerHTML;
    m.innerHTML = badges + '<span>' + name + ' <em>· ' + ks.map(function (k) { return '(' + k + ') ' + CAT[k]; }).join(' + ') + '</em></span>';
    m.setAttribute('aria-hidden', 'true');
  });
  var modOn = true;
  try { if (localStorage.getItem('remira-mods') === 'off') modOn = false; } catch (e) {}
  var bar = d.createElement('div');
  bar.className = 'modbar';
  bar.innerHTML = '<span class="leg"><span><i style="background:var(--r-blue)"></i>a Theme</span><span><i style="background:var(--r-green)"></i>b eigenes Modul</span><span><i style="background:var(--r-orange)"></i>c Entwickler</span></span>' +
    '<button class="switch" type="button" role="switch" aria-checked="true"><span>Module anzeigen</span><span class="tr"></span></button>';
  body.appendChild(bar);
  var sw = $('.switch', bar);
  function setMods(on) { modOn = on; html.classList.toggle('mods-off', !on); sw.setAttribute('aria-checked', on ? 'true' : 'false'); try { localStorage.setItem('remira-mods', on ? 'on' : 'off'); } catch (e) {} }
  setMods(modOn);
  sw.addEventListener('click', function () { setMods(!modOn); });

  /* ---------- Mega-Menü (Desktop: Hover + Klick) ---------- */
  var hdr = $('#hdr');
  var openId = null, tOpen = 0, tClose = 0;
  function setMega(id) {
    openId = id;
    $$('[data-mega]').forEach(function (b) { b.setAttribute('aria-expanded', b.getAttribute('data-mega') === id ? 'true' : 'false'); });
    $$('.mega').forEach(function (m) { m.classList.toggle('open', m.id === 'mega-' + id); });
  }
  $$('[data-mega]').forEach(function (b) {
    var id = b.getAttribute('data-mega');
    b.addEventListener('click', function () { setMega(openId === id ? null : id); });
    b.addEventListener('mouseenter', function () { if (!mqFine.matches) return; clearTimeout(tClose); clearTimeout(tOpen); tOpen = setTimeout(function () { setMega(id); }, openId ? 0 : 90); });
    b.addEventListener('mouseleave', function () { clearTimeout(tOpen); });
  });
  if (hdr) {
    hdr.addEventListener('mouseleave', function () { if (!mqFine.matches) return; clearTimeout(tOpen); tClose = setTimeout(function () { setMega(null); }, 220); });
    hdr.addEventListener('mouseenter', function () { clearTimeout(tClose); });
    $$('.nav-top:not([data-mega])').forEach(function (a) { a.addEventListener('mouseenter', function () { if (mqFine.matches) setMega(null); }); });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (openId) { var b = $('[data-mega="' + openId + '"]'); setMega(null); if (b) b.focus(); }
      if (html.classList.contains('menu-open')) toggleMenu(false);
    }
  });
  d.addEventListener('click', function (e) { if (openId && hdr && !hdr.contains(e.target)) setMega(null); });

  /* ---------- Handy-Menü ---------- */
  var burger = $('.burger');
  function toggleMenu(on) {
    if (hdr) html.style.setProperty('--mtop', Math.max(0, hdr.getBoundingClientRect().bottom) + 'px');
    html.classList.toggle('menu-open', on);
    if (burger) { burger.setAttribute('aria-expanded', on ? 'true' : 'false'); burger.setAttribute('aria-label', on ? 'Menü schließen' : 'Menü öffnen'); }
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(!html.classList.contains('menu-open')); });
  $$('.macc > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-expanded') !== 'true';
      $$('.macc > button').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  });
  mqDesk.addEventListener('change', function () { toggleMenu(false); setMega(null); });

  /* ---------- Reveal ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce()) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rvs.forEach(function (el) { io.observe(el); });
  } else rvs.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Tilt-Karten + Glanz (nur Maus) ---------- */
  function bindTilt(el) {
    var raf = 0, tx = 0, ty = 0;
    el.addEventListener('pointermove', function (e) {
      if (!mqFine.matches || reduce()) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      if (!el.classList.contains('tilt')) return;
      tx = (0.5 - py) * 7; ty = (px - 0.5) * 7;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; el.style.transform = 'perspective(900px) rotateX(' + tx.toFixed(2) + 'deg) rotateY(' + ty.toFixed(2) + 'deg) translateZ(0)'; });
    });
    el.addEventListener('pointerleave', function () {
      if (!el.classList.contains('tilt')) return;
      el.style.transition = 'transform .6s var(--ease)';
      el.style.transform = '';
      setTimeout(function () { el.style.transition = ''; }, 600);
    });
  }
  $$('.tilt, .way').forEach(bindTilt);

  /* ---------- Magnetische Buttons ---------- */
  $$('.magnet').forEach(function (el) {
    var inner = el.firstElementChild;
    el.addEventListener('pointermove', function (e) {
      if (!mqFine.matches || reduce()) return;
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = 'translate(' + (dx * 0.18).toFixed(1) + 'px,' + (dy * 0.28).toFixed(1) + 'px)';
      if (inner) inner.style.transform = 'translate(' + (dx * 0.12).toFixed(1) + 'px,' + (dy * 0.16).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', function () {
      el.style.transition = 'transform .5s var(--ease), background-color .2s';
      el.style.transform = '';
      if (inner) { inner.style.transition = 'transform .5s var(--ease)'; inner.style.transform = ''; }
      setTimeout(function () { el.style.transition = ''; if (inner) inner.style.transition = ''; }, 500);
    });
  });

  /* ---------- Flexi-Tabs ---------- */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
    function sel(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = d.getElementById(x.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; p.classList.toggle('in', on); }
      });
      if (focus) t.focus();
      var list = t.parentElement;
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: t.offsetLeft - 16, behavior: reduce() ? 'auto' : 'smooth' });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return;
        e.preventDefault(); sel(tabs[(n + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- Logo-Scroller: Spur verdoppeln ---------- */
  $$('.logos-track').forEach(function (t) {
    $$('.logo-ph', t).forEach(function (n) { var c = n.cloneNode(true); c.classList.add('dup'); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); });
  });

  /* ---------- Content Slider ---------- */
  $$('[data-slider]').forEach(function (w) {
    var s = $('.slider', w);
    $$('[data-dir]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        var card = s.firstElementChild; var step = card ? card.getBoundingClientRect().width + 16 : 300;
        s.scrollBy({ left: step * Number(b.getAttribute('data-dir')), behavior: reduce() ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------- Hover Swap: am Handy erster Tipp zeigt Rückseite ---------- */
  $$('.swap').forEach(function (s) {
    s.addEventListener('click', function (e) {
      if (mqFine.matches) return;
      if (!s.classList.contains('on')) { e.preventDefault(); $$('.swap.on').forEach(function (o) { o.classList.remove('on'); }); s.classList.add('on'); }
    });
  });

  /* ---------- Zähler (Zahlen von remira.com/de/fakten) ---------- */
  var nums = $$('[data-count]');
  function fmt(n) { return Math.round(n).toLocaleString('de-DE'); }
  if (nums.length) {
    var runCount = function (el) {
      var to = Number(el.getAttribute('data-count'));
      if (reduce()) { el.textContent = fmt(to); return; }
      var t0 = performance.now(), dur = 1400;
      (function f(t) { var p = Math.min(1, (t - t0) / dur); var e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(f); })(t0);
    };
    if ('IntersectionObserver' in window) {
      var ioc = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); ioc.unobserve(e.target); } }); }, { threshold: 0.5 });
      nums.forEach(function (n) { ioc.observe(n); });
    } else nums.forEach(runCount);
  }

  /* ---------- Countdown (Platzhalter-Datum) ---------- */
  $$('[data-countdown]').forEach(function (cd) {
    var target = new Date(); target.setDate(target.getDate() + 12); target.setHours(10, 0, 0, 0);
    var attr = cd.getAttribute('data-countdown'); if (attr) target = new Date(attr);
    var f = { d: $('[data-u="d"]', cd), h: $('[data-u="h"]', cd), m: $('[data-u="m"]', cd), s: $('[data-u="s"]', cd) };
    function tick() {
      var ms = Math.max(0, target - new Date());
      var s = Math.floor(ms / 1000);
      f.d.textContent = String(Math.floor(s / 86400));
      f.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, '0');
      f.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
      f.s.textContent = String(s % 60).padStart(2, '0');
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---------- Formulare (ohne Funktion) ---------- */
  $$('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); f.classList.add('done'); var ok = $('.form-ok', f); if (ok) { ok.setAttribute('tabindex', '-1'); ok.focus(); } });
    var again = $('[data-again]', f);
    if (again) again.addEventListener('click', function () { f.classList.remove('done'); f.reset(); });
  });

  /* ---------- Kontakt: zwei Wege ---------- */
  var ways = $$('[data-way]');
  if (ways.length) {
    var setWay = function (w) {
      ways.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-way') === w ? 'true' : 'false'); });
      $$('[data-only]').forEach(function (el) {
        var on = el.getAttribute('data-only') === w;
        el.hidden = !on;
        $$('input,select,textarea', el).forEach(function (i) { i.disabled = !on; });
      });
    };
    ways.forEach(function (b) { b.addEventListener('click', function () { setWay(b.getAttribute('data-way')); }); });
    setWay(location.hash === '#frage' ? 'frage' : 'demo');
  }

  /* ---------- Video Playlist ---------- */
  $$('[data-playlist]').forEach(function (pl) {
    var player = $('.player', pl), items = $$('.pl-item', pl);
    items.forEach(function (it) {
      it.addEventListener('click', function () {
        items.forEach(function (o) { o.setAttribute('aria-current', o === it ? 'true' : 'false'); });
        $('.cap b', player).textContent = it.getAttribute('data-title');
        $('.cap span', player).textContent = it.getAttribute('data-meta');
        $('.bg', player).className = 'bg ' + it.getAttribute('data-ph');
      });
    });
  });

  /* ---------- Scroll Swap ---------- */
  $$('[data-sswap]').forEach(function (w) {
    var items = $$('.sswap-item', w), panels = $$('.sswap-panel', w);
    function act(i) { items.forEach(function (x, j) { x.classList.toggle('on', j === i); }); panels.forEach(function (x, j) { x.classList.toggle('on', j === i); }); }
    act(0);
    if (!('IntersectionObserver' in window)) return;
    var ios = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) act(items.indexOf(e.target)); }); }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(function (x) { ios.observe(x); x.addEventListener('mouseenter', function () { act(items.indexOf(x)); }); });
  });

  /* ---------- Sticky-CTA am Handy ---------- */
  var sticky = $('.sticky-cta');
  if (sticky) {
    body.classList.add('has-sticky');
    var heroEl = $('.hero'), endEl = $('.cta-band') || $('.ftr');
    var upd = function () {
      var y = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      var e = endEl ? endEl.getBoundingClientRect().top : 1e9;
      var on = y < 0 && e > window.innerHeight * 0.9;
      sticky.classList.toggle('show', on); body.classList.toggle('sticky-on', on);
    };
    window.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- Verbindungs-Grafik (Commerce, eigenes Modul) ---------- */
  var conn = $('[data-conn]');
  if (conn) {
    var svg = $('svg', conn), btns = $$('.svc button', conn), cap = $('.svc-cap', conn);
    var SV = {
      cc: { n: ['shop', 'filiale'], t: '<b>Click & Collect:</b> online bestellen, in der Filiale abholen.' },
      sfs: { n: ['shop', 'filiale'], t: '<b>Ship-from-Store:</b> die Online-Bestellung geht direkt aus der Filiale raus.' },
      ea: { n: ['filiale', 'app', 'lager'], t: '<b>Endless Aisle:</b> was in der Filiale fehlt, per App aus einem anderen Standort bestellen.' },
      ret: { n: ['shop', 'kasse', 'filiale'], t: '<b>Retoure in der Filiale:</b> online gekauft, im Laden zurückgegeben und an der Kasse erstattet.' },
      mp: { n: ['markt', 'lager', 'shop'], t: '<b>Marktplätze:</b> Artikel, Bestände, Preise und Aufträge zentral steuern, ohne Überverkäufe.' }
    };
    var keys = Object.keys(SV), cur = 0, auto = null, pulses = [], praf = 0;
    var NS = 'http://www.w3.org/2000/svg';
    function show(k) {
      var s = SV[k];
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-svc') === k ? 'true' : 'false'); });
      $$('.node', svg).forEach(function (n) { n.classList.toggle('on', s.n.indexOf(n.getAttribute('data-n')) > -1); });
      $$('.lh', svg).forEach(function (l) { l.classList.toggle('on', s.n.indexOf(l.getAttribute('data-n')) > -1); });
      cap.innerHTML = s.t;
      pulses.forEach(function (p) { p.el.remove(); }); pulses = [];
      if (reduce()) return;
      s.n.forEach(function (n, i) {
        var path = $('.lh[data-n="' + n + '"]', svg); if (!path) return;
        var c = d.createElementNS(NS, 'circle'); c.setAttribute('r', '5'); c.setAttribute('class', 'pulse');
        svg.insertBefore(c, svg.querySelector('.hub'));
        pulses.push({ el: c, path: path, len: path.getTotalLength(), off: i * 0.33, dir: i === 0 ? 1 : -1 });
      });
      if (!praf) praf = requestAnimationFrame(loopP);
    }
    function loopP(t) {
      praf = 0; if (!pulses.length) return;
      pulses.forEach(function (p) {
        var u = ((t / 1600) + p.off) % 1; if (p.dir < 0) u = 1 - u;
        var pt = p.path.getPointAtLength(u * p.len);
        p.el.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
      });
      praf = requestAnimationFrame(loopP);
    }
    function startAuto() { stopAuto(); if (reduce()) return; auto = setInterval(function () { cur = (cur + 1) % keys.length; show(keys[cur]); }, 4200); }
    function stopAuto() { if (auto) clearInterval(auto); auto = null; }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { stopAuto(); cur = i; show(keys[i]); });
      b.addEventListener('mouseenter', function () { if (!mqFine.matches) return; stopAuto(); cur = i; show(keys[i]); });
    });
    $$('.node', svg).forEach(function (n) {
      n.addEventListener('mouseenter', function () {
        stopAuto();
        var id = n.getAttribute('data-n');
        for (var i = 0; i < keys.length; i++) { var j = (cur + 1 + i) % keys.length; if (SV[keys[j]].n.indexOf(id) > -1) { cur = j; show(keys[j]); break; } }
      });
    });
    conn.addEventListener('mouseleave', function () { if (mqFine.matches) startAuto(); });
    show(keys[0]);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? startAuto() : stopAuto(); }).observe(conn);
  }

  /* ---------- Ring-Signature (Canvas 2D) ----------
     Abstraktes Hintergrund-Element nach der Form der Bildmarke: sechs gefächerte Linienbänder
     in den Ringfarben, spiralförmig nach innen. Desktop: langsame Drehung + träge Maus-Parallaxe.
     Handy / reduzierte Bewegung: ein ruhiges Standbild. Kein Logo-Ersatz. */
  var COLS = [
    ['#28ABBA', '#076B79'], ['#FF5869', '#E10600'], ['#F7EA48', '#FFCD24'],
    ['#A1D884', '#43B02A'], ['#FFB25B', '#FF8200'], ['#41B6E6', '#005EB8']
  ];
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  $$('canvas[data-ring]').forEach(function (cv) {
    var mode = cv.getAttribute('data-ring');
    var g = cv.getContext('2d'); if (!g) return;
    var W = 0, H = 0, dpr = 1, rot = 0, mx = 0, my = 0, tmx = 0, tmy = 0, vis = true, raf = 0, last = 0;
    var live = function () { return mode === 'full' && mqFine.matches && window.innerWidth >= 900 && !reduce(); };
    function size() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr; cv.height = H * dpr;
      draw();
    }
    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.4;
      var LINES = mode === 'full' ? 16 : 11, SEG = 48;
      for (var b = 0; b < 6; b++) {
        var a0 = (-120 + b * 60) * Math.PI / 180 + rot;
        var span = 118 * Math.PI / 180;
        for (var k = 0; k < LINES; k++) {
          var q = k / (LINES - 1) - 0.5;
          var par = (k / LINES) * 14;
          var ox = mx * par, oy = my * par;
          g.beginPath();
          for (var s = 0; s <= SEG; s++) {
            var t = s / SEG;
            var th = a0 + t * span;
            var w = R * 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.85) * (1 - 0.35 * t);
            var r = R * (1.02 - 0.42 * t) + q * w;
            var x = cx + Math.cos(th) * r + ox * (1 - t * 0.5), y = cy + Math.sin(th) * r + oy * (1 - t * 0.5);
            if (s === 0) g.moveTo(x, y); else g.lineTo(x, y);
          }
          var c = COLS[b];
          var gr = g.createLinearGradient(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R, cx + Math.cos(a0 + span) * R * 0.6, cy + Math.sin(a0 + span) * R * 0.6);
          var al = 0.22 + 0.5 * (1 - Math.abs(q) * 1.6);
          gr.addColorStop(0, hexA(c[0], 0));
          gr.addColorStop(0.18, hexA(c[0], al));
          gr.addColorStop(0.75, hexA(c[1], al * 0.9));
          gr.addColorStop(1, hexA(c[1], 0));
          g.strokeStyle = gr;
          g.lineWidth = k % 4 === 0 ? 1.6 : 1;
          g.stroke();
        }
      }
    }
    function loop(t) {
      raf = 0;
      if (!vis || !live()) return;
      var dt = last ? Math.min(50, t - last) : 16; last = t;
      rot += dt * 0.000045;
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
      draw();
      raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && vis && live()) { last = 0; raf = requestAnimationFrame(loop); } }
    window.addEventListener('pointermove', function (e) {
      if (!live()) return;
      tmx = (e.clientX / window.innerWidth - 0.5) * 2; tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    var rT = 0; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { size(); kick(); }, 120); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; kick(); }).observe(cv);
    d.addEventListener('visibilitychange', function () { vis = !d.hidden; kick(); });
    mqReduce.addEventListener('change', function () { draw(); kick(); });
    /* Erst sichtbar, dann schwer: nach dem ersten Bild starten */
    requestAnimationFrame(function () { size(); kick(); });
  });
})();
