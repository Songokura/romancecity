/* Герой 3 - лента: по прокрутке лента едет влево, кадры проходят линию и наполняются мебелью */
(function () {
  var W = window, doc = document;
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = doc.querySelector(".hx3"), rail = doc.getElementById("rail"), track = doc.getElementById("track"), line = doc.getElementById("line");
  if (!hero || !track) return;
  var frs = [].slice.call(track.querySelectorAll(".hx3-fr"));
  frs.forEach(function (f, i) { f.style.setProperty("--i", i); });
  var gut = 32, shift = 0, lineX = 0, railL = 0, ticking = false, lastTx = null;
  var lefts = [], fw = 0;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mobile() { return W.matchMedia("(max-width:760px)").matches; }
  /* замер в покое: линия встаёт в зазор после второго кадра (на телефоне - после первого) */
  function measure() {
    track.style.setProperty("--tx", "0px");
    var rr = rail.getBoundingClientRect();
    railL = rr.left;
    gut = parseFloat(getComputedStyle(track).paddingLeft) || 32;
    lefts = frs.map(function (f) { return f.getBoundingClientRect().left - rr.left; });
    fw = frs[0].getBoundingClientRect().width;
    var gap = frs.length > 1 ? lefts[1] - lefts[0] - fw : 18;
    var k = mobile() ? 1 : 2;
    lineX = lefts[k] - gap / 2;
    if (line) line.style.setProperty("--lx", lineX.toFixed(1) + "px");
    var trackW = lefts[lefts.length - 1] + fw + gut;
    shift = Math.max(0, trackW - rr.width);
  }
  function apply(p, sy) {
    var tx = -shift * p;
    if (lastTx !== tx) { lastTx = tx; track.style.setProperty("--tx", tx.toFixed(1) + "px"); }
    hero.style.setProperty("--sy", sy.toFixed(1));
    for (var i = 0; i < frs.length; i++) {
      var left = lefts[i] + tx;
      var w = clamp((lineX - left) / fw);
      var f = frs[i];
      if (f._w !== w) {
        f._w = w;
        f.style.setProperty("--w", w.toFixed(3));
        var after = w >= 0.5;
        if (f._a !== after) { f._a = after; f.classList.toggle("is-after", after); }
      }
    }
  }
  function update() {
    ticking = false;
    var y = W.pageYOffset, H = W.innerHeight;
    var p = clamp(y / (H * 0.85));
    apply(p, Math.min(y, H));
  }
  function onScroll() { if (!ticking) { ticking = true; W.requestAnimationFrame(update); } }

  var VW = W.innerWidth;
  measure(); apply(0, 0);
  W.addEventListener("resize", function () {
    if (W.innerWidth !== VW) { VW = W.innerWidth; lastTx = null; measure(); update(); }
  });
  if (REDUCED) { hero.classList.add("on"); update(); return; }
  W.addEventListener("scroll", onScroll, { passive: true });
  var skip = location.hash.length > 1 || W.pageYOffset > 80, done = false;
  function go() {
    if (done) return; done = true;
    W.requestAnimationFrame(function () { W.requestAnimationFrame(function () { measure(); hero.classList.add("on"); update(); }); });
  }
  if (skip) { hero.classList.add("on"); done = true; update(); return; }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(go);
  setTimeout(go, 600);
})();
