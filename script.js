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

  /* появление: текст, слова заголовков, раскрытие фото */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$("[data-rv],[data-split],.ph,.ft-mark").forEach(function (el) { io.observe(el); });

  /* ---------- герой: три акта сделки ---------- */
  (function () {
    var hero = $("#top"), acts = $$("#acts .act"), deals = $$("#deal li"); if (!acts.length) return;
    var i = 2, timer = null, DUR = 5200, seen = true;
    hero.style.setProperty("--dur", DUR / 1000 + "s");
    function show(n, run) {
      i = (n + acts.length) % acts.length;
      acts.forEach(function (a, k) { a.classList.toggle("on", k === i); });
      deals.forEach(function (li, k) {
        li.classList.remove("run");
        li.classList.toggle("on", k === i);
        var b = $("button", li); if (b) b.setAttribute("aria-pressed", String(k === i));
      });
      if (run) { deals[i].getBoundingClientRect(); deals[i].classList.add("run"); }
    }
    function play() {
      clearInterval(timer); if (RM) return;
      deals[i].classList.remove("run"); deals[i].getBoundingClientRect(); deals[i].classList.add("run");
      timer = setInterval(function () { if (!D.hidden && seen) show(i + 1, true); }, DUR);
    }
    function pick(n) { if (n === i) return; show(n, !RM); play(); }
    acts.forEach(function (a, k) { a.addEventListener("click", function () { pick(k); }); });
    deals.forEach(function (li, k) { var b = $("button", li); if (b) b.addEventListener("click", function () { pick(k); }); });
    if ("IntersectionObserver" in W) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: 0.2 }).observe(hero);
    H.classList.add("ready");
    W.setTimeout(play, 900);
  })();

  /* ---------- сцены прокрутки ---------- */
  var stepsEl = $("#steps"), sts = $$(".st", stepsEl), stImgs = $$("#kakStack img");
  function setStep(i) {
    sts.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    stImgs.forEach(function (s, k) { s.classList.toggle("on", k === i); });
  }
  if (gsap && ST && !RM) {
    sts.forEach(function (s, i) {
      ST.create({ trigger: s, start: "top 58%", end: "bottom 58%", onToggle: function (self) { if (self.isActive) setStep(i); } });
    });
    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      $$("[data-par]").forEach(function (el) {
        gsap.fromTo(el, { yPercent: 0 }, { yPercent: parseFloat(el.getAttribute("data-par")), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      return function () { gsap.set("[data-par]", { clearProps: "transform" }); };
    });
    W.addEventListener("load", function () { ST.refresh(); });
  } else {
    sts.forEach(function (s) { s.classList.add("on"); });
  }

  /* ---------- шапка, меню, якоря ---------- */
  var BP = 1240; /* тот же порог, что у строки навигации в styles.css */
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
