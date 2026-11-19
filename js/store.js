/* Хранилище прогресса. Сейчас localStorage (только на этом устройстве, без паролей).
   Позже тот же интерфейс (s, save) заменяется серверным (Supabase). */
(function () {
  var K = '51english-v1', d = { xp: 0, done: {}, errors: [], log: [], fav: {}, weak: {} };
  try {
    var r = JSON.parse(localStorage.getItem(K));
    if (r && typeof r === 'object') ['xp', 'done', 'errors', 'log', 'fav', 'weak'].forEach(function (k) { if (r[k] !== undefined) d[k] = r[k]; });
  } catch (e) {}
  window.Store = {
    s: d, onSave: null,
    save: function () { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} if (Store.onSave) Store.onSave(); },
    reset: function () { d.xp = 0; d.done = {}; d.errors = []; d.log = []; d.fav = {}; d.weak = {}; try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }
  };
})();
