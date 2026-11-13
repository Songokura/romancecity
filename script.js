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
    setWa(); fitH1();
    if (ST) ST.refresh();
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
      $$slice(n.childNodes).forEach(function (c) {
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
  function $$slice(l) { return Array.prototype.slice.call(l); }

  /* ---------- заголовок героя по ширине колонки ---------- */
  function fitH1() {
    var h = $("#h1"); if (!h) return;
    h.style.fontSize = "";
    var avail = h.clientWidth, max = 0;
    $$(".ln>span", h).forEach(function (s) { max = Math.max(max, s.offsetWidth); });
    if (max > avail && max > 0) h.style.fontSize = Math.floor(parseFloat(getComputedStyle(h).fontSize) * avail / max * 0.985) + "px";
  }

  /* ---------- старт ---------- */
  snapshot();
  $$("[data-split]").forEach(split);
  setWa();
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  var qs = (location.search.match(/[?&]lang=(ru|kk|en)\b/) || [])[1], saved = null;
  try { saved = localStorage.getItem("rc-lang"); } catch (e) {}
  var startLang = qs || (/^(ru|kk|en)$/.test(saved || "") ? saved : "ru");
  if (startLang !== "ru") setLang(startLang, false);
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); }); });

  /* плавная прокрутка */
  if (W.Lenis && gsap && !RM) {
    lenis = new W.Lenis({ lerp: 0.11 });
    if (ST) lenis.on("scroll", ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* появление */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$("[data-rv],[data-split],.ft-mark").forEach(function (el) { io.observe(el); });

  /* ---------- герой: паспарту раскрывается ---------- */
  var art = $("#heroArt") || D.createElement("div");
  function setR(v, animate) {
    $$(".hero-tog button").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-state") === v)); });
    if (gsap && animate && !RM) gsap.to(art, { "--r": v, duration: 1.3, ease: "power2.inOut", overwrite: "auto" });
    else art.style.setProperty("--r", v);
  }
  var started = false;
  function intro() {
    if (started) return; started = true;
    fitH1();
    H.classList.add("ready");
    if (!gsap || RM) { art.style.setProperty("--m0", 1); art.style.setProperty("--r", 1); return; }
    gsap.fromTo(art, { "--m0": W.innerWidth < 900 ? 1.7 : 1.9 }, { "--m0": 1, duration: 1.9, ease: "power3.out", delay: 0.1 });
    gsap.fromTo(art, { "--r": 0 }, { "--r": 1, duration: 1.7, ease: "power2.inOut", delay: 0.8 });
  }
  /* раскрытие стартует сразу, не дожидаясь шрифтов (LCP на телефоне); после загрузки шрифтов заголовок переподгоняется */
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", intro); else intro();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(fitH1);
  $$(".hero-tog button").forEach(function (b) { b.addEventListener("click", function () { setR(+b.getAttribute("data-state"), true); }); });

  /* ---------- герой: комнаты по очереди на телефоне ---------- */
  (function () {
    var gal = $("#heroGal"); if (!gal) return;
    var figs = $$(".hg", gal), bars = $$(".hg-bars i", gal), i = 0, t = null, DUR = 5000;
    gal.style.setProperty("--dur", DUR / 1000 + "s");
    function show(n) {
      i = (n + figs.length) % figs.length;
      figs.forEach(function (f, k) { f.classList.toggle("on", k === i); });
      bars.forEach(function (b, k) {
        b.classList.remove("on");
        b.classList.toggle("done", k < i);
        b.getBoundingClientRect();
        if (k === i) b.classList.add("on");
      });
    }
    function mobile() { return W.innerWidth < 900; }
    function run() { clearInterval(t); if (RM || !mobile()) return; t = setInterval(function () { if (!D.hidden) show(i + 1); }, DUR); }
    gal.addEventListener("click", function () { if (!mobile()) return; show(i + 1); run(); });
    var gw = W.innerWidth;
    W.addEventListener("resize", function () { if (W.innerWidth !== gw) { gw = W.innerWidth; run(); } });
    run();
  })();

  /* ---------- сцены прокрутки ---------- */
  var stepsEl = $("#steps"), sts = $$(".st", stepsEl), stImgs = $$("#kakStack img");
  function setStep(i) {
    sts.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    stImgs.forEach(function (s, k) { s.classList.toggle("on", k === i); });
  }

  if (gsap && ST && !RM) {
    gsap.fromTo(art, { "--m": 1 }, { "--m": 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 35%", scrub: 0.4 } });

    $$(".pp[data-pp]").forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-to") || "0");
      gsap.fromTo(el, { "--m": 1 }, { "--m": to, ease: "none", scrollTrigger: { trigger: el, start: "top 96%", end: "top 28%", scrub: 0.5 } });
    });

    sts.forEach(function (s, i) {
      ST.create({ trigger: s, start: "top 56%", end: "bottom 56%", onToggle: function (self) { if (self.isActive) setStep(i); } });
    });
    ST.create({ trigger: stepsEl, start: "top 56%", end: "bottom 56%", onUpdate: function (self) { stepsEl.style.setProperty("--p", self.progress.toFixed(4)); } });

    var mm = gsap.matchMedia(), cols = $$(".trip-c");
    mm.add("(min-width: 900px)", function () {
      var tl = gsap.timeline({ scrollTrigger: { trigger: "#tripStage", start: "top top", end: "+=140%", pin: true, scrub: 0.5, anticipatePin: 1 } });
      tl.fromTo(cols, { "--t": 1 }, { "--t": 0, ease: "power1.inOut", duration: 1, stagger: 0.07 }, 0)
        .fromTo(".trip-head", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -50, ease: "none", duration: 0.3 }, 0.08)
        .to({}, { duration: 0.12 });
      $$("[data-par]").forEach(function (el) {
        gsap.fromTo(el, { yPercent: 0 }, { yPercent: parseFloat(el.getAttribute("data-par")), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return function () { gsap.set(".trip-head", { clearProps: "all" }); gsap.set("[data-par]", { clearProps: "transform" }); };
    });
    mm.add("(max-width: 899px)", function () {
      cols.forEach(function (c) {
        gsap.fromTo(c, { "--t": 1 }, { "--t": 0, ease: "none", scrollTrigger: { trigger: c, start: "top 94%", end: "top 26%", scrub: 0.5 } });
      });
    });
    W.addEventListener("load", function () { ST.refresh(); });
  } else {
    $$(".pp[data-pp]").forEach(function (el) { el.style.setProperty("--m", el.getAttribute("data-to") || "0"); });
    art.style.setProperty("--m", 1);
    sts.forEach(function (s) { s.classList.add("on"); });
  }

  /* ---------- шапка, меню, якоря ---------- */
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
  W.addEventListener("resize", function () { if (W.innerWidth >= 1720 && !menu.hidden) toggleMenu(false); });
  D.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null; if (!a) return;
    var id = a.getAttribute("href").slice(1), el = id ? D.getElementById(id) : null; if (!el) return;
    e.preventDefault();
    if (!menu.hidden) toggleMenu(false);
    var y = id === "top" ? 0 : el.getBoundingClientRect().top + W.scrollY;
    var up = y < W.scrollY, off = id === "top" ? 0 : (up ? -(hdr.offsetHeight + 12) : -16);
    if (lenis) lenis.scrollTo(y + off, { duration: 1.5 });
    else W.scrollTo({ top: y + off, behavior: RM ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", id === "top" ? location.pathname + location.search : "#" + id);
  });

  var rw = W.innerWidth;
  W.addEventListener("resize", function () { if (W.innerWidth !== rw) { rw = W.innerWidth; fitH1(); } });

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
