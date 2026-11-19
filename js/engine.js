/* Движок урока: читает window.LESSONS, не содержит учебного материала. */
(function () {
  var S = Store.s, L = window.LESSONS || [];
  var $ = function (i) { return document.getElementById(i); };
  var cur, list, i, sel, order, tries, okFirst, mode, checked, matched, misses;
  var PLAY = '<svg viewBox="0 0 20 20"><path d="M4 3l13 7-13 7z" fill="#101C35"/></svg>';

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // ’ с iPhone и разный регистр не должны делать верный ответ неверным
  function norm(v) { return String(v).toLowerCase().replace(/[’‘ʼ`]/g, "'").replace(/[.!?,¡¿]/g, '').replace(/\s+/g, ' ').trim(); }
  function find(id) { return L.filter(function (l) { return l.id === id; })[0]; }
  function next() { for (var k = 0; k < L.length; k++) if (!S.done[L[k].id]) return L[k]; return null; }

  function note(t) {
    var n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role', 'status'); n.textContent = t;
    document.body.appendChild(n); setTimeout(function () { n.classList.add('on'); }, 30); setTimeout(function () { n.remove(); }, 3800);
  }
  function speak(t) {
    if (!('speechSynthesis' in window)) return note('Озвучка недоступна в этом браузере');
    var u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85;
    u.onerror = function () { note('Не удалось воспроизвести звук на этом устройстве'); };
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }

  function intro() {
    var el = $('intro');
    if (mode === 'review' || mode === 'words') { el.innerHTML = mode === 'words' ? '<h2 style="margin:22px 0 14px">Повторение слов</h2><div class="card"><p>Выбери правильный английский вариант. Слова, в которых ты ошибся, попадут в «Сложные» и будут встречаться чаще.</p></div>' : '<h2 style="margin:22px 0 14px">Повторение ошибок</h2><div class="card"><p>Здесь задания, в которых ты ошибся. Ответишь верно — задание уйдёт из списка.</p></div>'; return; }
    el.innerHTML = '<h2 style="margin:22px 0 14px">' + esc(cur.title) + '</h2>' +
      (cur.reviewed ? '' : '<p class="mono" style="color:var(--or);font-size:13px;margin:-6px 0 12px">Черновик: материал ожидает проверки</p>') +
      '<div class="card"><h3>Твоя задача</h3><p>' + esc(cur.goal) + '</p></div>' +
      '<div class="card" style="margin-top:12px"><h3>Объяснение</h3><p>' + esc(cur.explain) + '</p></div>' +
      (cur.vocab.length ? '<div class="card" style="margin-top:12px"><h3>Слова и фразы</h3>' : '') + cur.vocab.map(function (v) {
        return '<div class="sent"><button class="play" type="button" data-s="' + esc(v.say || v.en) + '" aria-label="Озвучить">' + PLAY + '</button><div><em>' + esc(v.en) + '</em><small>' + esc(v.ru) + '</small></div></div>';
      }).join('') + (cur.vocab.length ? '</div>' : '');
    el.querySelectorAll('.play').forEach(function (b) { b.onclick = function () { speak(b.dataset.s); }; });
  }

  function shuf(a) { return a.slice().sort(function () { return Math.random() - .5; }); }
  function clean(t) { return t.replace(/\s*\(.*\)/, ''); }
  function words() {
    var seen = {}, all = [];
    L.forEach(function (l) { if (S.done[l.id]) l.vocab.forEach(function (v) { if (!seen[v.en]) { seen[v.en] = 1; all.push(v); } }); });
    return all;
  }
  // Повторение слов: сначала «сложные», затем избранные, затем остальные
  function wordList() {
    var all = words(); if (all.length < 3) return [];
    var weak = all.filter(function (w) { return S.weak[w.en]; }), fav = all.filter(function (w) { return S.fav[w.en] && !S.weak[w.en]; });
    var rest = shuf(all.filter(function (w) { return !S.weak[w.en] && !S.fav[w.en]; }));
    return shuf(weak).concat(shuf(fav), rest).slice(0, 10).map(function (w) {
      var d = shuf(all.filter(function (x) { return x.en !== w.en && clean(x.ru) !== clean(w.ru); })).slice(0, 2).map(function (x) { return x.en; });
      return { w: w.en, ex: { type: 'choice', q: 'Как по-английски: «' + clean(w.ru) + '»?', options: shuf(d.concat(w.en)), answer: w.en, explain: w.en + ' — ' + w.ru + '.' } };
    });
  }

  function start(m) {
    mode = m === 'review' || m === 'words' ? m : 'lesson';
    if (mode === 'words') { list = wordList(); }
    else if (mode === 'review') {
      list = S.errors.map(function (e) { var l = find(e.l); return l && { ex: l.exercises[e.i], l: e.l, i: e.i }; }).filter(Boolean);
    } else {
      cur = (Engine.pick && find(Engine.pick)) || next() || L[L.length - 1]; Engine.pick = null;
      list = cur.exercises.map(function (ex, n) { return { ex: ex, l: cur.id, i: n }; });
    }
    i = 0; tries = 0; okFirst = 0; intro();
    if (!list.length) { $('cnt').textContent = ''; $('pg').style.width = '0'; $('ex').innerHTML = (mode === 'words' ? '<h3>Пока нечего повторять</h3><p style="margin:8px 0 16px">Слова появятся после первого пройденного урока.</p>' : '<h3>Ошибок нет</h3><p style="margin:8px 0 16px">Всё, что ты проходил, выполнено верно.</p>') + '<a class="btn" href="#cabinet">В кабинет</a>'; return; }
    draw();
  }

  function draw() {
    var e = list[i].ex; sel = null; order = []; checked = false;
    $('cnt').textContent = (mode === 'review' ? 'Ошибка ' : mode === 'words' ? 'Слово ' : 'Задание ') + (i + 1) + ' из ' + list.length;
    $('pg').style.width = (i / list.length * 100) + '%';
    var h = '<h3>Практика</h3><div class="q">' + esc(e.q) + '</div>';
    if (e.type === 'listen') h += '<button class="play" id="lp" type="button" aria-label="Прослушать" style="width:56px;height:56px;margin-bottom:12px">' + PLAY + '</button>';
    if (e.type === 'choice' || e.type === 'listen') h += '<div class="opts">' + e.options.map(function (x) { return '<button class="opt" type="button">' + esc(x) + '</button>'; }).join('') + '</div>';
    else if (e.type === 'text') h += '<input class="ans" id="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Напиши ответ по-английски" aria-label="Ответ">';
    else if (e.type === 'match') h += matchHtml(e);
    else h += '<div class="answer-line" id="al"></div><div class="word-bank">' + e.words.map(function (x, n) { return '<button class="word" type="button" data-w="' + n + '">' + esc(x) + '</button>'; }).join('') + '</div><button class="btn sm ghost" id="rs" type="button" style="color:var(--ink);border-color:var(--ink)">Сбросить</button>';
    $('ex').innerHTML = h + '<div style="margin-top:14px"><button class="btn" id="chk" type="button">Проверить</button></div><div class="fb" id="fb" role="status"></div>';
    $('ex').querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { $('ex').querySelectorAll('.opt').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); sel = b.textContent; }; });
    if (e.type === 'listen') $('lp').onclick = function () { speak(e.say); };
    if (e.type === 'match') {
      var L1 = null; matched = 0; misses = 0;
      $('ml').querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { if (b.disabled) return; $('ml').querySelectorAll('.opt').forEach(function (x) { if (!x.disabled) x.classList.remove('sel'); }); b.classList.add('sel'); L1 = b; }; });
      $('mr').querySelectorAll('.opt').forEach(function (b) { b.onclick = function () {
        if (b.disabled || !L1) return;
        if (L1.dataset.l === b.dataset.r) { L1.disabled = b.disabled = true; b.classList.add('sel'); L1 = null; matched++; if (matched === e.pairs.length) check(); }
        else { misses++; note('Не та пара, попробуй ещё'); }
      }; });
    }
    if (e.type === 'text') $('in').onkeydown = function (ev) { if (ev.key === 'Enter') check(); };
    if (e.type === 'order') {
      var paintLine = function () { $('al').innerHTML = order.length ? order.map(function (n) { return '<span class="word">' + esc(e.words[n]) + '</span>'; }).join('') : '<span style="opacity:.55">Выбери слова в правильном порядке</span>'; };
      paintLine();
      $('ex').querySelectorAll('[data-w]').forEach(function (b) { b.onclick = function () { order.push(+b.dataset.w); b.disabled = true; paintLine(); }; });
      $('rs').onclick = function () { order = []; $('ex').querySelectorAll('[data-w]').forEach(function (b) { b.disabled = false; }); paintLine(); };
    }
    $('chk').onclick = check;
  }

  function matchHtml(e) {
    var r = e.pairs.map(function (p, n) { return [p[1], n]; }).sort(function () { return Math.random() - .5; });
    return '<div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div id="ml" style="flex:1;display:grid;gap:8px">' + e.pairs.map(function (p, n) { return '<button class="opt" type="button" data-l="' + n + '">' + esc(p[0]) + '</button>'; }).join('') +
      '</div><div id="mr" style="flex:1;display:grid;gap:8px">' + r.map(function (x) { return '<button class="opt" type="button" data-r="' + x[1] + '">' + esc(x[0]) + '</button>'; }).join('') + '</div></div>';
  }
  function value(e) { return e.type === 'match' ? (matched === e.pairs.length ? 'ok' : '') : (e.type === 'choice' || e.type === 'listen') ? (sel || '') : e.type === 'text' ? $('in').value : order.map(function (n) { return e.words[n]; }).join(' '); }

  function check() {
    if (checked) return;
    var p = list[i], e = p.ex, v = value(e), fb = $('fb');
    if (!norm(v)) { fb.className = 'fb bad'; fb.textContent = (e.type === 'match' ? 'Сначала соедини все пары.' : 'Сначала выбери или введи ответ.'); return; }
    var acc = e.type === 'match' ? ['ok'] : [].concat(e.answer), ok = acc.some(function (a) { return norm(a) === norm(v); });
    checked = true; $('chk').style.display = 'none';
    var k = S.errors.map(function (x) { return x.l + ':' + x.i; }).indexOf(p.l + ':' + p.i);
    if (e.type === 'match') tries = misses;
    if (ok) { if (!tries) okFirst++; if (mode === 'words') delete S.weak[p.w]; else if (mode === 'review' && k > -1) S.errors.splice(k, 1); }
    else { tries++; if (mode === 'words') S.weak[p.w] = 1; else if (k < 0) S.errors.push({ l: p.l, i: p.i }); }
    Store.save();
    fb.className = 'fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<b>' + (ok ? 'Верно!' : 'Почти. Правильный ответ: ' + esc(e.show || acc[0])) + '</b><br>' + esc(e.explain) +
      '<div class="row" style="margin-top:12px">' + (ok ? '' : '<button class="btn sm ghost" id="again" type="button" style="color:var(--ink);border-color:var(--ink)">Ещё раз</button>') +
      '<button class="btn sm" id="nx" type="button">' + (i < list.length - 1 ? 'Дальше' : 'Завершить') + '</button></div>';
    if (!ok) $('again').onclick = draw;
    $('nx').onclick = function () { if (i < list.length - 1) { i++; tries = 0; draw(); } else finish(); };
  }

  function finish() {
    $('pg').style.width = '100%'; $('cnt').textContent = 'Готово';
    var h;
    if (mode === 'words') h = '<h3>Повторение слов завершено</h3><p style="margin:8px 0 16px">С первой попытки верно: ' + okFirst + ' из ' + list.length + '. Слов в «Сложных»: ' + Object.keys(S.weak).length + '.</p>';
    else if (mode === 'review') h = '<h3>Повторение завершено</h3><p style="margin:8px 0 16px">Ошибок осталось: ' + S.errors.length + '.</p>';
    else {
      var fresh = !S.done[cur.id];
      if (fresh) {
        S.done[cur.id] = Date.now();
        S.log.unshift({ id: cur.id, t: Date.now(), ok: okFirst, n: list.length }); S.log = S.log.slice(0, 50);
        Store.save(); if (Engine.award) Engine.award(cur.xp);
      }
      h = '<h3>Урок пройден</h3><p style="margin:8px 0">С первой попытки верно: ' + okFirst + ' из ' + list.length + '. ' +
        (fresh ? 'Начислено ' + cur.xp + ' XP.' : 'XP за этот урок уже получены, повторное прохождение опыт не добавляет.') + '</p>' +
        (cur.summary ? '<p style="margin-bottom:16px">' + esc(cur.summary) + '</p>' : '');
    }
    $('ex').innerHTML = h + '<a class="btn" href="#cabinet">В кабинет</a>';
  }

  window.Engine = { start: start, next: next, find: find, award: null, pick: null, words: words, speak: speak };
})();
