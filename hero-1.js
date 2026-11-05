/* Герой 1 - витрина в глубине: вход кадров на загрузке, параллакс от курсора и прокрутки */
(function () {
  var W = window, doc = document, root = doc.documentElement;
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = doc.querySelector(".hx1"), stage = doc.getElementById("stage"), txt = doc.getElementById("htxt");
  if (!hero || !stage) return;
  var FINE = W.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var mx = 0, my = 0, tx = 0, ty = 0, sy = 0, raf = false, alive = true;

  function frame() {
    raf = false;
    tx += (mx - tx) * 0.08; ty += (my - ty) * 0.08;
    stage.style.setProperty("--mx", tx.toFixed(3));
    stage.style.setProperty("--my", ty.toFixed(3));
    stage.style.setProperty("--sy", sy.toFixed(1));
    if (txt) txt.style.setProperty("--sy", sy.toFixed(1));
    if (Math.abs(mx - tx) > 0.002 || Math.abs(my - ty) > 0.002) tick();
  }
  function tick() { if (!raf) { raf = true; W.requestAnimationFrame(frame); } }

  function onScroll() {
    var y = W.pageYOffset, H = W.innerHeight;
    sy = Math.min(y, H * 1.2);
    tick();
  }
  if (!REDUCED) {
    W.addEventListener("scroll", onScroll, { passive: true });
    if (FINE) {
      W.addEventListener("pointermove", function (e) {
        if (W.pageYOffset > W.innerHeight) return;
        mx = (e.clientX / W.innerWidth - 0.5) * 2;
        my = (e.clientY / W.innerHeight - 0.5) * 2;
        tick();
      }, { passive: true });
    }
    onScroll();
  }

  /* интро: сначала текст, кадры догоняют по своим задержкам; при хэше или прокрутке - сразу */
  var skip = REDUCED || location.hash.length > 1 || W.pageYOffset > 80;
  function go() { hero.classList.add("on"); }
  if (skip) { go(); return; }
  var done = false;
  function once() { if (!done) { done = true; W.requestAnimationFrame(function () { W.requestAnimationFrame(go); }); } }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(once);
  setTimeout(once, 600);
})();
