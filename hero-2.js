/* Герой 2 - створки: распахиваются на загрузке; по прокрутке за окном проходим гостиная -> кухня -> спальня */
(function () {
  var W = window, doc = document;
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = doc.getElementById("hx2"), run = doc.getElementById("top"), win = doc.getElementById("win"), cap = doc.getElementById("cap");
  if (!hero || !win) return;
  var rooms = cap ? [].slice.call(cap.querySelectorAll(".hx2-room b")) : [];
  var dots = cap ? [].slice.call(cap.querySelectorAll(".hx2-dots i")) : [];
  var N = 3, cur = -1, lastP = -1, ticking = false, timer = null;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t * t * (3 - 2 * t); }
  function setRoom(i) {
    if (i === cur) return;
    cur = i;
    for (var k = 0; k < rooms.length; k++) rooms[k].classList.toggle("is-on", k === i);
    for (k = 0; k < dots.length; k++) dots[k].classList.toggle("is-on", k === i);
  }
  /* p 0..1 -> положение ленты 0..2: на каждой комнате лента отдыхает, между ними - ровный проход */
  function apply(p) {
    var seg = p * (N - 1), i = Math.floor(seg), f = seg - i;
    if (i >= N - 1) { i = N - 1; f = 0; }
    var pos = i + ease(clamp((f - 0.28) / 0.44));
    var v = (pos / (N - 1)).toFixed(4);
    if (v !== lastP) { lastP = v; win.style.setProperty("--p", v); }
    setRoom(Math.round(pos));
  }
  function mobile() { return W.matchMedia("(max-width:760px)").matches; }
  function update() {
    ticking = false;
    if (mobile() || !run) return;
    var r = run.getBoundingClientRect(), H = W.innerHeight;
    var p = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
    apply(p);
  }
  function onScroll() { if (!ticking) { ticking = true; W.requestAnimationFrame(update); } }

  /* телефон: прокрутки-сцены нет - комнаты сменяются по времени, пока окно на экране */
  function startTimer() {
    if (timer || REDUCED) return;
    var idx = 0;
    timer = setInterval(function () {
      if (!mobile()) { clearInterval(timer); timer = null; return; }
      var r = win.getBoundingClientRect();
      if (r.bottom < 0 || r.top > W.innerHeight) return;
      idx = (idx + 1) % N;
      apply(idx / (N - 1));
    }, 3800);
  }

  setRoom(0);
  if (REDUCED) { hero.classList.add("on"); apply(0); return; }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () { lastP = -1; if (mobile()) { apply(cur < 0 ? 0 : cur / (N - 1)); startTimer(); } else onScroll(); });

  var skip = location.hash.length > 1 || W.pageYOffset > 80;
  var done = false;
  function go() {
    if (done) return; done = true;
    W.requestAnimationFrame(function () { W.requestAnimationFrame(function () {
      hero.classList.add("on");
      update();
      if (mobile()) setTimeout(startTimer, 2600);
    }); });
  }
  if (skip) { hero.classList.add("on"); done = true; update(); if (mobile()) startTimer(); return; }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(go);
  setTimeout(go, 600);
})();
