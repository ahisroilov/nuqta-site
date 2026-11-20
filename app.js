// Nuqta site: scaled illustrations, scroll reveals and the small live bits
// (hero Command bar typing, notch timer). No libraries.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Illustrations drawn at a fixed design size, scaled to their box.
  function fitAll() {
    document.querySelectorAll('.fit').forEach(function (el) {
      var m = el.firstElementChild;
      if (!m) return;
      var w = +el.dataset.w || m.offsetWidth;
      var h = +el.dataset.h || m.offsetHeight;
      var max = +el.dataset.max || 1;
      var crop = +el.dataset.crop || 0;
      var cropped = crop && el.clientWidth < 700;
      var s = Math.min(max, el.clientWidth / (cropped ? crop : w));
      var centred = el.classList.contains('c');
      var shift = cropped ? 'translateX(' + (-(w - crop) / 2) * s + 'px) ' : '';
      m.style.transform = shift + (centred ? 'translateX(-50%) ' : '') + 'scale(' + s + ')';
      el.style.overflow = cropped ? 'hidden' : '';
      el.style.borderRadius = cropped ? '16px' : '';
      if (centred) m.style.transformOrigin = '50% 0';
      el.style.height = Math.ceil(h * s) + 'px';
    });
  }

  // ---- Repeat glyph (the app draws ↻ itself; Geist has none).
  var REP = '<svg class="rp" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 6.5A5.2 5.2 0 0 0 3.6 4.6M3 9.5a5.2 5.2 0 0 0 9.4 1.9"/><path d="M3.2 2.2v2.7h2.7M12.8 13.8v-2.7h-2.7"/></svg>';
  document.querySelectorAll('[data-rep]').forEach(function (e) { e.insertAdjacentHTML('afterbegin', REP); });

  // ---- Week view: the hub's 24h grid from 07:30, 44px per hour.
  function week(el) {
    var H = 44, from = 7.5, colW = (el.clientWidth || 704) - 62;
    colW = colW / 7;
    var days = [['MON', 16, '3h 10m'], ['TUE', 17, '2h 40m'], ['WED', 18, '2h 25m'], ['THU', 19, '3h 05m'], ['FRI', 20, '1h 01m'], ['SAT', 21, ''], ['SUN', 22, '']];
    var head = '', cols = '', hrs = '', hours = '';
    days.forEach(function (d, i) {
      head += '<div class="' + (i === 4 ? 'today' : '') + '">' + d[0] + '<b>' + d[1] + '</b><small>' + d[2] + '</small></div>';
      cols += '<div class="col' + (i === 4 ? ' today' : '') + '" style="left:' + (i * colW) + 'px;width:' + colW + 'px"></div>';
    });
    for (var h = 8; h <= 20; h++) {
      hrs += '<div class="hr" style="top:' + (h - from) * H + 'px"></div>';
      hours += '<span style="top:' + (h - from) * H + 'px">' + (h < 10 ? '0' : '') + h + ':00</span>';
    }
    // [day, start, end, kind, title, time line]
    var B = [
      [0, 7.5, 8, 'done', 'Read 20 pages'], [0, 8.25, 8.5, 'ev', 'Standup'], [0, 9, 9.75, 'done', 'Weekly planning'],
      [0, 10, 11.4, 'done multi', 'Write the launch email', '10:00 - 11:24 · 2 sessions'], [0, 14, 14.7, 'done', 'Review pull requests'],
      [1, 7.5, 8, 'done', 'Read 20 pages'], [1, 9, 10.8, 'done multi', 'Design the pricing page', '09:00 - 10:48 · 2 sessions'], [1, 14, 15, 'ev', 'Design review', '14:00 - 15:00'], [1, 15.2, 15.7, 'done', 'Reply to design notes'],
      [2, 7.5, 8, 'done', 'Read 20 pages'], [2, 8.5, 8.75, 'ev', 'Standup'], [2, 9.25, 10.9, 'done multi', 'Fix the sync bug', '09:15 - 10:54'], [2, 16, 16.45, 'done', 'Client call notes'],
      [3, 7.5, 8, 'done', 'Read 20 pages'], [3, 9, 10.5, 'done multi', 'Record the demo', '09:00 - 10:30'], [3, 12.5, 13.5, 'ev', 'Lunch with Sam', '12:30 - 13:30'], [3, 13.6, 14.1, 'done', 'Update the changelog'], [3, 15, 15.75, 'done', 'Plan the workshop'],
      [4, 7.5, 8, 'done', 'Read 20 pages'], [4, 11.5, 12.25, 'ev', 'Product sync', '11:30 - 12:15'], [4, 14.8, 15.17, 'act', 'Write the quarterly report'],
      [4, 16.5, 17.25, 'plan', 'Prepare the slides', '16:30 - 17:15'], [4, 17.5, 18, 'plan', 'Call the bank'], [4, 18.5, 19.5, 'plan rep', 'Gym', '18:30 - 19:30'],
      [5, 10, 10.75, 'plan', 'Plan next week'], [6, 9.5, 10.25, 'plan', 'Long walk']
    ];
    var blocks = '';
    B.forEach(function (b) {
      var top = (b[1] - from) * H + 1, ht = Math.max(24, (b[2] - b[1]) * H - 3);
      var t = (b[3].indexOf('rep') > -1 ? REP + ' ' : '') + b[4];
      var sub = b[5] && ht >= 56 ? '<small>' + b[5] + '</small>' : '';
      blocks += '<div class="blk ' + b[3] + '" style="left:' + (b[0] * colW + 3) + 'px;top:' + top + 'px;width:' + (colW - 6) + 'px;height:' + ht + 'px">' + t + sub + '</div>';
    });
    var now = (15.17 - from) * H;
    blocks += '<div class="nowl" style="left:' + (4 * colW) + 'px;width:' + colW + 'px;top:' + now + 'px"></div>';
    el.innerHTML = '<div class="cal-head">' + head + '</div><div class="cal-hours">' + hours + '<b class="nowpill" style="top:' + now + 'px">15:10</b></div><div class="cal-grid">' + cols + hrs + blocks + '</div>';
  }
  document.querySelectorAll('[data-week]').forEach(week);

  // ---- Month: November 2026, Monday first, today = Fri 20.
  function month(el) {
    var wd = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    var out = wd.map(function (d) { return '<div class="wd">' + d + '</div>'; }).join('');
    var done = ['Read 20 pages', 'Draft the blog post', 'Fix the onboarding bug', 'Write API docs', 'Interview notes', 'Plan the sprint', 'Answer emails'];
    for (var i = 0; i < 35; i++) {
      var day = i - 5; // Oct 26 = -5 .. Nov 29 = 29
      var label = day < 1 ? 26 + i : day;
      var out_ = day < 1, cls = 'cell' + (out_ ? ' out' : '') + (day === 20 ? ' td' : '');
      var dow = i % 7, chips = '', focus = '';
      if (!out_ && day < 20) {
        focus = dow < 5 ? '2h 55m' : '30m';
        chips += '<span class="mc dn">Read 20 pages</span>';
        if (dow < 5) chips += '<span class="mc dn">' + done[day % done.length] + '</span>';
        if (day === 12) chips = '<span class="mc dn">Read 20 pages</span><span class="mc dr">Old idea</span>';
        if (dow === 0 || dow === 2) chips += '<span class="m-more">+1 more</span>';
      } else if (day === 20) {
        focus = '1h 01m';
        chips = '<span class="mc fo"><span class="t">now</span> Quarterly report</span><span class="mc"><span class="t">16:30</span> Slides</span><span class="m-more">+3 more</span>';
      } else if (!out_) {
        if (day === 23) chips += '<span class="mc"><span class="t">09:00</span> Newsletter</span>';
        if (day === 24) chips += '<span class="mc ev"><span class="t">11:30</span> Dentist</span>';
        if (day === 25) chips += '<span class="mc ev">Conference</span>';
        if (dow === 0 || dow === 2 || dow === 4) chips += '<span class="mc up"><span class="t">18:30</span> Gym</span>';
      }
      out += '<div class="' + cls + '"><div class="d">' + (day === 20 ? '<b>20</b>' : label) + (focus ? '<small>' + focus + '</small>' : '') + '</div>' + chips + '</div>';
    }
    el.innerHTML = out;
  }
  document.querySelectorAll('[data-month]').forEach(month);

  // ---- Focus map: weekdays × 07-22, sharpest Tue-Thu mornings.
  function heat(el) {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var html = '<span></span>';
    for (var h = 7; h <= 22; h++) html += '<span class="hh">' + (h % 3 === 1 ? (h < 10 ? '0' : '') + h : '') + '</span>';
    days.forEach(function (d, i) {
      html += '<span>' + d + '</span>';
      for (var h = 7; h <= 22; h++) {
        var v = 0;
        if (i < 5) {
          if (h === 7) v = 3;
          else if (h >= 9 && h <= 11) v = i >= 1 && i <= 3 ? (h === 9 ? 4 : 5) : 3;
          else if (h === 12) v = 2;
          else if (h >= 14 && h <= 16) v = 2;
          else if (h === 17 && i === 2) v = 3;
        } else if (h === 7 || (i === 5 && (h === 10 || h === 11))) v = h === 7 ? 3 : 2;
        html += '<i class="' + (v ? 'h' + v : '') + '"></i>';
      }
    });
    el.innerHTML = html;
  }
  document.querySelectorAll('[data-heat]').forEach(heat);

  // ---- Medal strip: duplicate the track so it loops.
  document.querySelectorAll('.medal-strip').forEach(function (s) {
    var t = s.querySelector('.medal-track');
    if (t && !reduce) { var c = t.cloneNode(true); c.setAttribute('aria-hidden', 'true'); s.appendChild(c); }
  });

  // ---- Notch timers (count up, mm:ss).
  document.querySelectorAll('[data-timer]').forEach(function (el) {
    var p = el.dataset.timer.split(':'), s = +p[0] * 60 + +p[1];
    if (reduce) return;
    setInterval(function () {
      s += 1;
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }, 1000);
  });

  // ---- Hero Command bar: types real Nuqta phrases and shows the live tokens.
  var typed = document.querySelector('[data-typer]');
  if (typed) {
    var ph = document.querySelector('.cb-in .ph');
    var toks = document.querySelector('.cb-tokens');
    var phrases = [
      { text: 'Review the pull request ~45m', tokens: '<span class="chip acc">Today</span><span class="chip">45 min</span>' },
      { text: 'Gym ~60m every mon wed fri', tokens: '<span class="chip">1h</span><span class="chip acc">' + REP + ' Mon Wed Fri</span>' },
      { text: 'Call the bank', tokens: '<span class="chip">Inbox</span><span class="hint">Try "~45m" or "every mon"</span>' }
    ];
    var pi = 0;
    var show = function (txt) {
      typed.textContent = txt;
      ph.style.display = txt ? 'none' : '';
    };
    var run = function () {
      var p = phrases[pi % phrases.length], i = 0;
      toks.classList.remove('on'); toks.innerHTML = '';
      var step = function () {
        i += 1;
        show(p.text.slice(0, i));
        if (i < p.text.length) setTimeout(step, 55 + Math.random() * 60);
        else {
          toks.innerHTML = p.tokens; toks.classList.add('on');
          setTimeout(function () { show(''); toks.classList.remove('on'); pi += 1; setTimeout(run, 900); }, 2600);
        }
      };
      setTimeout(step, 500);
    };
    if (reduce) { show(phrases[0].text); toks.innerHTML = phrases[0].tokens; toks.classList.add('on'); }
    else run();
  }

  // ---- Full-screen demo: shortcut → Command bar → type → Enter → Esc, looped
  // while on screen (a still frame with reduced motion).
  document.querySelectorAll('[data-fs]').forEach(function (root) {
    // A code editor in full screen: deterministic coloured "tokens".
    var code = root.querySelector('[data-code]'), map = root.querySelector('[data-map]');
    var kinds = ['kw', 'fn', 'vr', 'st', 'vr', 'nm', 'vr', 'fn'], html = '', mh = '';
    for (var l = 0; l < 29; l++) {
      var ind = [0, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1, 1, 0, 0, 1, 1, 2, 2, 1, 0, 0, 1, 2, 1, 0][l];
      var line = '<div class="fs-ln' + (l === 13 ? ' cur' : '') + '"><span class="no">' + (41 + l) + '</span><i style="width:' + ind * 30 + 'px;background:none;margin:0"></i>';
      if (l % 7 === 4 || l === 0) line += '<i class="cm" style="width:' + (180 + (l * 37) % 160) + 'px"></i>';
      else if (l % 9 !== 7) {
        var n = 2 + (l * 5) % 4;
        for (var t = 0; t < n; t++) line += '<i class="' + kinds[(l + t * 3) % kinds.length] + '" style="width:' + (28 + ((l * 13 + t * 29) % 7) * 14) + 'px"></i>';
      }
      if (l === 13) line += '<i class="cur-caret"></i>';
      html += line + '</div>';
      mh += '<i style="width:' + (20 + (l * 23) % 60) + 'px;opacity:' + (0.4 + (l % 3) * 0.2) + '"></i>';
    }
    code.innerHTML = html;
    map.innerHTML = mh + mh;

    var section = root.closest('section');
    var steps = section ? section.querySelectorAll('.fs-steps li') : [];
    var typed = root.querySelector('.fs-typed'), ph = root.querySelector('.fs-bar .ph'), toks = root.querySelector('.fs-tokens');
    var key = function (k) { return root.querySelector('[data-k="' + k + '"]'); };
    var grp = function (g) { return root.querySelector('[data-g="' + g + '"]'); };
    var text = 'Call the bank ~15m';
    var step = function (n) { steps.forEach(function (s) { s.classList.toggle('on', +s.dataset.s === n); }); };
    var setText = function (s) { typed.textContent = s; ph.style.display = s ? 'none' : ''; };
    var tokens = function (on) {
      toks.innerHTML = on ? '<span class="chip acc">Today</span><span class="chip">15 min</span>' : '';
      toks.classList.toggle('on', on);
    };
    var reset = function () {
      root.classList.remove('open', 'typing', 'added');
      setText(''); tokens(false); step(0);
      root.querySelectorAll('.key').forEach(function (k) { k.classList.remove('down'); });
      root.querySelectorAll('.grp').forEach(function (g) { g.classList.remove('show'); });
    };
    if (reduce) {
      root.classList.add('open', 'typing'); setText(text); tokens(true);
      return;
    }
    var timers = [], running = false;
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var run = function () {
      reset();
      at(400, function () { step(1); grp('a').classList.add('show'); });
      at(900, function () { key('ctrl').classList.add('down'); });
      at(1150, function () { key('shift').classList.add('down'); });
      at(1400, function () { key('space').classList.add('down'); root.classList.add('open'); });
      at(1750, function () { ['ctrl', 'shift', 'space'].forEach(function (k) { key(k).classList.remove('down'); }); });
      at(2150, function () { grp('a').classList.remove('show'); step(2); root.classList.add('typing'); });
      for (var i = 1; i <= text.length; i++) (function (i) { at(2250 + i * 72, function () { setText(text.slice(0, i)); }); })(i);
      at(2250 + text.length * 72 + 150, function () { tokens(true); });
      at(4300, function () { step(3); grp('b').classList.add('show'); });
      at(4750, function () { key('enter').classList.add('down'); root.classList.add('added'); root.classList.remove('typing'); setText(''); tokens(false); });
      at(5050, function () { key('enter').classList.remove('down'); });
      at(5900, function () { grp('b').classList.remove('show'); step(4); grp('c').classList.add('show'); });
      at(6350, function () { key('esc').classList.add('down'); root.classList.remove('open'); });
      at(6650, function () { key('esc').classList.remove('down'); });
      at(7500, function () { grp('c').classList.remove('show'); step(0); });
      at(8600, function () { timers = []; if (running) run(); });
    };
    var start = function () { if (!running) { running = true; run(); } };
    var stop = function () { running = false; timers.forEach(clearTimeout); timers = []; reset(); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0.35 }).observe(root.parentElement);
    } else start();
  });

  // ---- Reveal on scroll.
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (r) { io.observe(r); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (r) { r.classList.add('in'); });
  }

  fitAll();
  window.addEventListener('resize', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
