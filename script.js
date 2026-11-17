(function () {
  "use strict";
  var D = document, W = window, H = D.documentElement;
  var $ = function (s, c) { return (c || D).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); };
  var RM = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VER = (function () { var s = (D.currentScript && D.currentScript.src) || ""; var m = s.match(/[?&]v=([^&]+)/); return m ? m[1] : ""; })();
  var gsap = W.gsap, ST = W.ScrollTrigger, lenis = null;
  var PHONE = "77472227664";
  if (gsap && ST) gsap.registerPlugin(ST);

  /* ---------- тексты WhatsApp и формы ---------- */
  var WA = {
    ru: {
      "default": "Здравствуйте, Сауле. Пишу с сайта Romance City, хочу бесплатную консультацию по флиппингу.",
      "hero": "Здравствуйте, Сауле. Хочу расчёт по флиппингу под ключ в Астане. Мой бюджет: ___. Город: ___.",
      "podbor": "Здравствуйте, Сауле. Интересует подбор квартиры под перепродажу в Астане. Бюджет: ___.",
      "remont": "Здравствуйте, Сауле. Нужен расчёт ремонта под ключ. Объект: ___, площадь: ___.",
      "prodazha": "Здравствуйте, Сауле. Хочу обсудить продажу квартиры после ремонта. ЖК: ___.",
      "soprovozhdenie": "Здравствуйте, Сауле. Уже занимаюсь флиппингом, интересует сопровождение сделок. Город: ___.",
      "nastavnichestvo": "Здравствуйте, Сауле. Хочу научиться флиппингу, прошу записать меня на консультацию.",
      "obo": "Здравствуйте, Сауле. Хочу обсудить сотрудничество по флиппингу под ключ."
    }
  };
  var FORM = { ru: { head: "Здравствуйте, Сауле. Заявка с сайта.", name: "Имя", phone: "Телефон", budget: "Бюджет и город" } };

  /* ---------- язык: RU в разметке, KZ и EN отдельными файлами по выбору ---------- */
  var DICT = { ru: {} }, cur = "ru";
  var ATTRS = [["data-i18n-alt", "alt"], ["data-i18n-aria", "aria-label"], ["data-i18n-ph", "placeholder"]];
  function snapshot() {
    $$("[data-i18n]").forEach(function (el) { var k = el.getAttribute("data-i18n"); if (!(k in DICT.ru)) DICT.ru[k] = el.innerHTML; });
    ATTRS.forEach(function (a) {
      $$("[" + a[0] + "]").forEach(function (el) { var k = el.getAttribute(a[0]); if (!(k in DICT.ru)) DICT.ru[k] = el.getAttribute(a[1]) || ""; });
    });
    DICT.ru["meta.title"] = D.title;
    var md = $('meta[name="description"]'); DICT.ru["meta.desc"] = md ? md.content : "";
  }
  function dictOf(l) { return l === "kk" ? W.SITE_KK : l === "en" ? W.SITE_EN : DICT.ru; }
  function t(k) { var d = dictOf(cur) || {}; return (k in d) ? d[k] : DICT.ru[k]; }
  function setWa() {
    var m = cur === "kk" ? W.SITE_KK_WA : cur === "en" ? W.SITE_EN_WA : WA.ru; m = m || WA.ru;
    $$("a[data-wa]").forEach(function (a) {
      var k = a.getAttribute("data-wa"), msg = m[k] || m["default"] || WA.ru[k] || WA.ru["default"];
      a.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
    });
  }
  function apply(l) {
    cur = l;
    $$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n")); if (v == null) return;
      el.innerHTML = v;
      if (el.hasAttribute("data-split")) split(el);
    });
    ATTRS.forEach(function (a) {
      $$("[" + a[0] + "]").forEach(function (el) { var v = t(el.getAttribute(a[0])); if (v != null) el.setAttribute(a[1], v); });
    });
    D.title = t("meta.title") || D.title;
    var md = $('meta[name="description"]'); if (md && t("meta.desc")) md.content = t("meta.desc");
    H.lang = l;
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l)); });
    setWa();
    refreshAll();
  }
  function setLang(l, save) {
    if (save) { try { localStorage.setItem("rc-lang", l); } catch (e) {} }
    if (l === "ru" || dictOf(l)) { apply(l); return; }
    var s = D.createElement("script");
    s.src = "assets/lang/" + l + ".js" + (VER ? "?v=" + VER : "");
    s.onload = function () { apply(l); };
    D.head.appendChild(s);
  }

  /* ---------- слова заголовков ---------- */
  function split(el) {
    var i = 0;
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = D.createDocumentFragment();
          c.nodeValue.split(/([ \n\t]+)/).forEach(function (p) {
            if (!p) return;
            if (/^[ \n\t]+$/.test(p)) { f.appendChild(D.createTextNode(" ")); return; }
            var w = D.createElement("span"), wi = D.createElement("span");
            w.className = "w"; wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = p;
            w.appendChild(wi); f.appendChild(w);
          });
          n.replaceChild(f, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
      });
    })(el);
  }

  function refreshAll() {
    carousels.forEach(function (c) { c.update(); });
    if (ST) ST.refresh();
  }

  /* ---------- листаемые ленты со стрелками ---------- */
  var carousels = [];
  $$(".arrows[data-for]").forEach(function (box) {
    var el = D.getElementById(box.getAttribute("data-for")); if (!el) return;
    var prev = $(".ar-p", box), next = $(".ar-n", box);
    function items() { return Array.prototype.slice.call(el.children); }
    function max() { return el.scrollWidth - el.clientWidth; }
    function pos() { var it = items(), base = it[0].offsetLeft; return it.map(function (c) { return Math.min(c.offsetLeft - base, max()); }); }
    function go(d) {
      var p = pos(), x = el.scrollLeft, k = 0, b = 0;
      p.forEach(function (v, i) { if (Math.abs(v - x) < Math.abs(p[b] - x)) b = i; }); k = b;
      if (d > 0) { while (k < p.length - 1 && p[k] <= x + 4) k++; } else { while (k > 0 && p[k] >= x - 4) k--; }
      el.scrollTo({ left: p[k], behavior: RM ? "auto" : "smooth" });
    }
    function update() {
      var m = max(), fits = m <= 4;
      prev.hidden = next.hidden = fits;
      prev.disabled = el.scrollLeft <= 4; next.disabled = el.scrollLeft >= m - 4;
    }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    el.addEventListener("scroll", update, { passive: true });
    el.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } });
    carousels.push({ update: update });
  });

  /* ---------- старт ---------- */
  snapshot();
  $$("[data-split]").forEach(split);
  setWa();
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  var qs = (location.search.match(/[?&]lang=(ru|kk|en)\b/) || [])[1], saved = null;
  try { saved = localStorage.getItem("rc-lang"); } catch (e) {}
  var startLang = qs || (/^(ru|kk|en)$/.test(saved || "") ? saved : "ru");
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); }); });

  /* плавная прокрутка - только там, где есть мышь */
  if (W.Lenis && gsap && !RM && W.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    lenis = new W.Lenis({ lerp: 0.11 });
    if (ST) lenis.on("scroll", ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* появление */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  $$("[data-rv],[data-ph],[data-split]").forEach(function (el) { io.observe(el); });
  H.classList.add("ready");

  /* ---------- сцены прокрутки ---------- */
  var path = $("#path");
  if (gsap && ST && !RM) {
    ST.config({ ignoreMobileResize: true });
    var mm = gsap.matchMedia();
    if (path) {
      path.style.setProperty("--p", 0);
      ST.create({ trigger: path, start: "top 78%", end: "bottom 62%", scrub: 0.5, onUpdate: function (s) { path.style.setProperty("--p", s.progress.toFixed(4)); } });
    }
    mm.add("(min-width: 900px)", function () {
      gsap.fromTo("#heroPh picture", { yPercent: 0 }, { yPercent: -9, ease: "none", scrollTrigger: { trigger: "#heroPh", start: "top 40%", end: "bottom top", scrub: true } });
      $$(".ob-name").forEach(function (el, i) {
        gsap.fromTo(el, { xPercent: i % 2 ? 4 : -4 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 45%", scrub: 0.6 } });
      });
      gsap.fromTo(".tr1", { y: 40 }, { y: -30, ease: "none", scrollTrigger: { trigger: ".trio", start: "top bottom", end: "bottom top", scrub: 0.6 } });
      gsap.fromTo(".tr3", { y: 70 }, { y: -50, ease: "none", scrollTrigger: { trigger: ".trio", start: "top bottom", end: "bottom top", scrub: 0.6 } });
      gsap.fromTo(".pr-ph2", { y: 60 }, { y: -60, ease: "none", scrollTrigger: { trigger: ".pr-grid", start: "top bottom", end: "bottom top", scrub: 0.6 } });
      gsap.fromTo(".pb-sm", { y: 50 }, { y: -30, ease: "none", scrollTrigger: { trigger: ".pb-vis", start: "top bottom", end: "bottom top", scrub: 0.6 } });
      return function () { gsap.set(".ob-name,.tr1,.tr3,.pr-ph2,.pb-sm,#heroPh picture", { clearProps: "transform" }); };
    });
    W.addEventListener("load", function () { ST.refresh(); });
  }
  carousels.forEach(function (c) { c.update(); });
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(refreshAll);
  var rw = W.innerWidth;
  W.addEventListener("resize", function () { if (W.innerWidth === rw) return; rw = W.innerWidth; carousels.forEach(function (c) { c.update(); }); });
  if (startLang !== "ru") setLang(startLang, false);

  /* ---------- шапка, меню, якоря ---------- */
  var BP = 1360; /* тот же порог, что у строки навигации в styles.css */
  var hdr = $("#hdr"), lastY = 0, menu = $("#menu"), burger = $("#burger");
  function onScroll() {
    var y = W.scrollY || 0;
    hdr.classList.toggle("sol", y > 30);
    if (!H.classList.contains("menu-open")) hdr.classList.toggle("hide", y > 320 && y > lastY + 2 ? true : (y < lastY - 2 ? false : hdr.classList.contains("hide")));
    lastY = y;
  }
  W.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function toggleMenu(open) {
    H.classList.toggle("menu-open", open);
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    D.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { toggleMenu(menu.hidden); });
  D.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) toggleMenu(false); });
  W.addEventListener("resize", function () { if (W.innerWidth >= BP && !menu.hidden) toggleMenu(false); });
  function scrollToY(y, fast) {
    if (lenis) lenis.scrollTo(y, { duration: fast ? 0.01 : 1.3, force: true });
    else W.scrollTo({ top: y, behavior: RM || fast ? "auto" : "smooth" });
  }
  function goId(id, fast) {
    var el = id ? D.getElementById(id) : null; if (!el) return false;
    var y = 0;
    if (id !== "top") {
      var cs = getComputedStyle(el), pad = el.tagName === "SECTION" ? Math.max(0, parseFloat(cs.paddingTop) - 28) : -16;
      y = el.getBoundingClientRect().top + W.scrollY + pad;
      if (y < W.scrollY) y -= hdr.offsetHeight; /* вверх - шапка вернётся */
    }
    scrollToY(Math.max(0, Math.round(y)), fast);
    return true;
  }
  D.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null; if (!a) return;
    var id = a.getAttribute("href").slice(1); if (!D.getElementById(id)) return;
    e.preventDefault();
    if (!menu.hidden) toggleMenu(false);
    goId(id);
    if (history.replaceState) history.replaceState(null, "", id === "top" ? location.pathname + location.search : "#" + id);
  });
  if (location.hash.length > 1) W.addEventListener("load", function () { setTimeout(function () { if (ST) ST.refresh(); goId(location.hash.slice(1), true); }, 120); });

  /* ---------- вопросы ---------- */
  $$("#qa .q").forEach(function (q) {
    var b = $("button", q);
    b.addEventListener("click", function () {
      var on = !q.classList.contains("on");
      q.classList.toggle("on", on); b.setAttribute("aria-expanded", String(on));
      if (ST) setTimeout(function () { ST.refresh(); }, 450);
    });
  });

  /* ---------- видео: играет, пока в кадре ---------- */
  var v = $("#gmLoop");
  if (v && "IntersectionObserver" in W) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!v.src) v.src = v.getAttribute("data-src"); if (!RM) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.2 }).observe(v);
  }

  /* ---------- форма ---------- */
  var form = $("#form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, digits = (f.phone.value || "").replace(/\D/g, ""), err = $("#formErr"), ok = $("#formOk");
    if (digits.length < 10) { err.hidden = false; f.phone.focus(); return; }
    err.hidden = true;
    var L = (cur === "kk" ? W.SITE_KK_FORM : cur === "en" ? W.SITE_EN_FORM : FORM.ru) || FORM.ru;
    var msg = L.head + (f.name.value ? " " + L.name + ": " + f.name.value.trim() + "." : "") + " " + L.phone + ": " + f.phone.value.trim() + "." + (f.budget.value ? " " + L.budget + ": " + f.budget.value.trim() + "." : "");
    W.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    ok.hidden = false;
  });
})();
