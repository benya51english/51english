/* Облачное сохранение прогресса и вход (Supabase-совместимый сервер).
   Пока config.js пустой, модуль ничего не делает: никаких форм входа и внешних запросов. */
(function () {
  var C = window.CONFIG || {}, S = Store.s, UID = '51english-uid';
  var sb = null, user = null, timer = null, mode = 'in', synced = false, syncing = false, failed = false, warned = false;
  var Cloud = window.Cloud = { enabled: !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY) };
  var $ = function (id) { return document.getElementById(id); };
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, del: function (k) { try { localStorage.removeItem(k); } catch (e) {} } };
  var navLink = document.querySelector('nav a[href="#cabinet"]');
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function note(t) {
    var n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role', 'status'); n.textContent = t;
    document.body.appendChild(n); setTimeout(function () { n.classList.add('on'); }, 30); setTimeout(function () { n.remove(); }, 4200);
  }
  if (!Cloud.enabled) { if (navLink) navLink.textContent = 'Кабинет'; return; }

  // ---------- слияние локального и облачного прогресса ----------
  function merge(r) {
    r = r && typeof r === 'object' ? r : {};
    var d = r.done || {}; for (var k in d) if (k !== '__proto__' && typeof d[k] === 'number' && (!S.done[k] || d[k] < S.done[k])) S.done[k] = d[k];
    ['fav', 'weak'].forEach(function (f) { var o = r[f] || {}; for (var k in o) if (k !== '__proto__') S[f][k] = 1; });
    (Array.isArray(r.errors) ? r.errors : []).forEach(function (e) { if (e && !S.errors.some(function (x) { return x.l === e.l && x.i === e.i; })) S.errors.push({ l: String(e.l), i: +e.i }); });
    var seen = {}, all = S.log.concat(Array.isArray(r.log) ? r.log : []).filter(function (h) { var k = h && h.id + '|' + h.t; if (!h || seen[k]) return false; return seen[k] = 1; });
    S.log = all.sort(function (a, b) { return b.t - a.t; }).slice(0, 50);
    S.xp = (window.LESSONS || []).reduce(function (a, l) { return a + (S.done[l.id] ? l.xp : 0); }, 0);   // XP считаем по пройденным урокам
  }
  function push() {
    if (!user || !sb) return Promise.resolve();
    return sb.from('progress').upsert({ user_id: user.id, data: S }).then(function (r) { if (r.error) throw r.error; });
  }
  function saveQuiet() { var h = Store.onSave; Store.onSave = null; Store.save(); Store.onSave = h; }
  // Пока не удалось прочитать облако, ничего не отправляем: иначе локальный прогресс затёр бы облачный.
  async function sync() {
    if (!user || !sb || syncing) return; syncing = true;
    try {
      var last = ls.get(UID);
      if (last && last !== user.id) Store.reset();                 // данные другого аккаунта не смешиваем
      var r = await sb.from('progress').select('data').eq('user_id', user.id).maybeSingle();
      if (r.error) throw r.error;
      merge(r.data && r.data.data);
      ls.set(UID, user.id); synced = true; saveQuiet();
      await push(); warned = false;
      if (window.refreshUI) refreshUI();
    } catch (e) { console.warn(e); note(synced ? 'Не удалось сохранить в облако. Прогресс сохранён на устройстве.' : 'Облако недоступно. Прогресс сохранён на этом устройстве.'); }
    finally { syncing = false; }
  }
  Store.onSave = function () {
    if (!user) return; clearTimeout(timer);
    timer = setTimeout(function () {
      if (!synced) return sync();
      push().then(function () { warned = false; }).catch(function (e) { console.warn(e); if (!warned) { warned = true; note('Не удалось сохранить в облако. Повторим при следующем действии.'); } });
    }, 1500);
  };

  // ---------- окно входа ----------
  var m = document.createElement('div'); m.style.cssText = 'display:none;position:fixed;inset:0;z-index:100;background:rgba(16,28,53,.88);place-items:center;padding:20px';
  var LK = 'background:none;border:0;text-decoration:underline;cursor:pointer;font:inherit;color:inherit;padding:2px';
  m.innerHTML = '<div role="dialog" aria-modal="true" aria-labelledby="cT" style="background:#F3E8CE;color:#101C35;border:2px solid #101C35;border-radius:16px;padding:24px;width:100%;max-width:380px;display:grid;gap:12px;box-shadow:6px 6px 0 #9BD66B">' +
    '<h3 id="cT" style="margin:0"></h3><input class="ans" id="cE" type="email" placeholder="Email" autocomplete="email" style="margin:0"><input class="ans" id="cP" type="password" placeholder="Пароль (от 8 символов)" style="margin:0">' +
    '<label id="cCW" style="font-size:13px;display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="cC" style="margin-top:3px"><span>Согласен(на) на обработку данных для входа (email, пароль) и учебного прогресса (пройденные уроки, XP, избранные слова, ошибки) согласно <a href="/privacy.html" target="_blank" rel="noopener">политике конфиденциальности</a></span></label>' +
    '<p id="cM" role="alert" style="margin:0;min-height:1.2em;font-size:14px"></p><button class="btn" id="cG" type="button">Продолжить</button>' +
    '<button id="cS" type="button" style="' + LK + '"></button><button id="cR" type="button" style="' + LK + '">Забыли пароль?</button><button id="cX" type="button" style="' + LK + '">Закрыть</button></div>';
  document.body.appendChild(m);
  function msg(t, ok) { $('cM').textContent = t; $('cM').style.color = ok ? '#2f6b1a' : '#D9573B'; }
  function close() { m.style.display = 'none'; }
  function open(md) {
    if (!sb) { note('Облачный модуль не загружен. Прогресс сохраняется на этом устройстве.'); return; }
    mode = md; msg('');
    $('cT').textContent = { in: 'Вход', up: 'Регистрация', reset: 'Восстановление пароля', recovery: 'Новый пароль' }[md];
    $('cE').style.display = md === 'recovery' ? 'none' : ''; $('cP').style.display = md === 'reset' ? 'none' : '';
    $('cP').autocomplete = md === 'in' ? 'current-password' : 'new-password';
    $('cCW').style.display = md === 'up' ? 'flex' : 'none'; $('cR').style.display = md === 'in' ? '' : 'none';
    $('cS').textContent = md === 'in' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти';
    $('cS').style.display = md === 'recovery' ? 'none' : '';
    m.style.display = 'grid'; setTimeout(function () { ($(md === 'recovery' ? 'cP' : 'cE')).focus(); }, 30);
  }
  function errText(x) {
    var t = String(x && x.message || '');
    if (/fetch|network|timeout/i.test(t)) return 'Нет соединения. Проверьте интернет и попробуйте ещё раз.';
    if (/invalid login/i.test(t)) return 'Неверный email или пароль';
    if (/not confirmed/i.test(t)) return 'Сначала подтвердите email по ссылке из письма';
    if (/already registered/i.test(t)) return 'Этот email уже зарегистрирован';
    if (/rate limit|too many/i.test(t)) return 'Слишком много попыток, подождите немного';
    console.warn(x); return 'Не получилось. Проверьте данные и попробуйте ещё раз.';
  }
  async function go() {
    if (!sb) return msg('Нет соединения с облаком');
    var e = $('cE').value.trim(), p = $('cP').value;
    if (mode !== 'recovery' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return msg('Проверьте email');
    if ((mode === 'up' || mode === 'recovery') && p.length < 8) return msg('Пароль: от 8 символов');
    if (mode === 'in' && !p) return msg('Введите пароль');
    if (mode === 'up' && !$('cC').checked) return msg('Нужно согласие на обработку данных');
    $('cG').disabled = true;
    try {
      var r;
      if (mode === 'in') { r = await sb.auth.signInWithPassword({ email: e, password: p }); if (r.error) throw r.error; close(); }
      else if (mode === 'up') { r = await sb.auth.signUp({ email: e, password: p, options: { emailRedirectTo: location.origin } }); if (r.error) throw r.error; if (r.data.session) close(); else msg('Мы отправили письмо. Подтвердите email по ссылке и войдите.', 1); }
      else if (mode === 'reset') { r = await sb.auth.resetPasswordForEmail(e, { redirectTo: location.origin }); if (r.error) throw r.error; msg('Если такой аккаунт есть, мы отправили письмо со ссылкой.', 1); }
      else { r = await sb.auth.updateUser({ password: p }); if (r.error) throw r.error; msg('Пароль изменён.', 1); setTimeout(close, 1200); }
    } catch (x) { msg(errText(x)); } finally { $('cG').disabled = false; }
  }
  $('cG').onclick = go; $('cX').onclick = close; $('cR').onclick = function () { open('reset'); };
  $('cS').onclick = function () { open(mode === 'in' ? 'up' : 'in'); };
  m.onclick = function (ev) { if (ev.target === m) close(); };
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); if (ev.key === 'Enter' && m.style.display === 'grid' && ev.target.tagName === 'INPUT' && ev.target.type !== 'checkbox') go(); });

  // ---------- блок аккаунта в кабинете и ссылка «Войти» ----------
  var BTN = 'color:var(--ink);border-color:var(--ink)';
  function ui() {
    if (navLink) navLink.textContent = (user || failed) ? 'Кабинет' : 'Войти';
    var a = $('acct'); if (!a) return;
    if (failed) { a.innerHTML = ''; return; }
    a.innerHTML = '<div class="card" style="margin-bottom:16px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">' + (user
      ? '<p style="margin:0">Вы вошли как <b>' + esc(user.email) + '</b>. Прогресс сохраняется в облаке.</p><span class="row"><button class="btn sm ghost" id="aOut" type="button" style="' + BTN + '">Выйти</button><button class="btn sm ghost" id="aDel" type="button" style="' + BTN + '">Удалить аккаунт</button></span>'
      : '<p style="margin:0">Прогресс хранится только на этом устройстве. Войдите, чтобы сохранить его в облаке и продолжить с другого устройства.</p><button class="btn sm" id="aIn" type="button">Войти или зарегистрироваться</button>') + '</div>';
    if ($('aIn')) $('aIn').onclick = function () { open('in'); };
    if ($('aOut')) $('aOut').onclick = async function () {
      clearTimeout(timer);
      var saved = false; if (synced) { try { await push(); saved = true; } catch (e) { console.warn(e); } }
      if (!saved && !confirm('Не удалось сохранить последние изменения в облаке. Если выйти сейчас, они пропадут. Выйти?')) return;
      await signOut(); wipe();
    };
    if ($('aDel')) $('aDel').onclick = async function () {
      if (!confirm('Удалить аккаунт и весь облачный прогресс? Это нельзя отменить.')) return;
      clearTimeout(timer);
      try { var r = await sb.rpc('delete_my_account'); if (r.error) throw r.error; }
      catch (e) { console.warn(e); return note('Не удалось удалить аккаунт. Проверьте соединение и попробуйте ещё раз.'); }
      await signOut(true); wipe(); note('Аккаунт удалён.');
    };
  }
  async function signOut(local) {
    try { var r = await sb.auth.signOut(local ? { scope: 'local' } : undefined); if (r && r.error) await sb.auth.signOut({ scope: 'local' }); }
    catch (e) { try { await sb.auth.signOut({ scope: 'local' }); } catch (_) {} }
  }
  function wipe() { clearTimeout(timer); user = null; synced = false; Store.reset(); ls.del(UID); ui(); if (window.refreshUI) refreshUI(); }
  if (navLink) navLink.addEventListener('click', function (ev) { if (!user && sb) { ev.preventDefault(); open('in'); } });
  window.addEventListener('hashchange', function () { if (location.hash === '#cabinet') ui(); });

  // ---------- подключение библиотеки ----------
  var sc = document.createElement('script');
  sc.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  sc.onerror = function () { failed = true; ui(); note('Облачный модуль не загрузился. Сайт работает локально, прогресс сохраняется на устройстве.'); };
  sc.onload = function () {
    try { sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY); } catch (e) { console.warn(e); sb = null; failed = true; ui(); return; }
    sb.auth.onAuthStateChange(function (ev, sess) {
      if (ev === 'PASSWORD_RECOVERY') { open('recovery'); return; }
      var u = sess && sess.user || null;
      if (u && (!user || user.id !== u.id)) { user = u; synced = false; setTimeout(sync, 0); }
      else if (!u) { user = null; synced = false; }
      ui();
    });
  };
  document.head.appendChild(sc);
  ui();
})();
