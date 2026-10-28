/* Romance City. Ванильный JS: плиты, укладка кадров «ёлочкой», меню, якоря, язык, лента, форма в WhatsApp. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var LANG = "ru";
  var MOBILE = W.matchMedia("(max-width:760px)").matches;
  var TOUCH = W.matchMedia("(pointer:coarse)").matches;
  var VW = W.innerWidth, VH = W.innerHeight;

  /* ---------- WhatsApp: один номер, текст по ключу кнопки и языку ---------- */
  var PHONE = "77076997664";
  var WA = {
    ru: {
      "default": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию по флиппингу. Мой бюджет и город: ",
      hero: "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию по флиппингу. Мой бюджет и город: ",
      menu: "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию. Мой вопрос: ",
      sticky: "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию. Мой вопрос: ",
      kontakty: "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию. Мой бюджет и город: ",
      obo: "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу обсудить сотрудничество. Мой бюджет и город: ",
      flipping: "Здравствуйте, Сауле! Интересует флиппинг под ключ. Бюджет и город: ",
      soprovozhdenie: "Здравствуйте, Сауле! Интересует сопровождение моего объекта или обучение флиппингу. Моя ситуация: ",
      investicii: "Здравствуйте, Сауле! Интересуют инвестиции в недвижимость. Бюджет и срок: ",
      pereprodazha: "Здравствуйте, Сауле! Нужно продать квартиру. Город, район и состояние квартиры: ",
      remont: "Здравствуйте, Сауле! Интересует ремонт под ключ. Объект, площадь и город: "
    },
    en: {
      "default": "Hello Saule! I am writing from the Romance City website. I would like a free consultation on flipping. My budget and city: ",
      hero: "Hello Saule! I am writing from the Romance City website. I would like a free consultation on flipping. My budget and city: ",
      menu: "Hello Saule! I am writing from the Romance City website. I would like a free consultation. My question: ",
      sticky: "Hello Saule! I am writing from the Romance City website. I would like a free consultation. My question: ",
      kontakty: "Hello Saule! I am writing from the Romance City website. I would like a free consultation. My budget and city: ",
      obo: "Hello Saule! I am writing from the Romance City website. I would like to discuss working together. My budget and city: ",
      flipping: "Hello Saule! I am interested in turnkey flipping. Budget and city: ",
      soprovozhdenie: "Hello Saule! I am interested in deal support or learning flipping on my own property. My situation: ",
      investicii: "Hello Saule! I am interested in real estate investment. Budget and timeline: ",
      pereprodazha: "Hello Saule! I need to sell an apartment. City, district and condition: ",
      remont: "Hello Saule! I am interested in turnkey renovation. Property, area and city: "
    }
  };
  var FORM_LABELS = {
    ru: { head: "Заявка с сайта Romance City", name: "Имя", phone: "Телефон", msg: "Что интересует" },
    en: { head: "Request from the Romance City website", name: "Name", phone: "Phone", msg: "Interested in" }
  };
  /* ссылка WhatsApp собирается в фазе захвата на window - LeadBot дописывает свой код после */
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var dict = WA[LANG] || WA.ru;
    var text = dict[key] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- Конверсии Google Ads: gtag подключается на этапе деплоя, здесь только вызовы ---------- */
  function fireConv(key) {
    if (typeof W.gtag_report_conversion !== "function" || !W.AW_CONV) return;
    var sendTo = W.AW_CONV[key];
    if (sendTo) W.gtag_report_conversion(undefined, sendTo);
  }
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"], a[href*="wa.me"]') : null;
    if (!a) return;
    fireConv(a.getAttribute("href").indexOf("tel:") === 0 ? "phone" : "contact");
  }, true);

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 400);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 72; };
  function flowPlate(pw) {
    var plate = pw.firstElementChild;
    return !plate || getComputedStyle(plate).position !== "sticky";
  }
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return flowPlate(el) ? r - HDR() : r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Укладка «ёлочкой»: кадр собирается из плашек паркета ----------
     Кадр .ph: снизу база (.before или тон темы), сверху плашки с фрагментами кадра «после».
     Плашки - параллелограммы шеврона (французская ёлка): колонки, наклон 45° чередуется.
     --o на .ph: 0 - ничего не уложено, 1 - кадр чистый (плашки убраны, img.after показан). */
  function layPlanks(ph) {
    var img = ph.querySelector("img.after");
    if (!img) return;
    if (!img.naturalWidth) {
      if (!ph._wait) { ph._wait = true; img.addEventListener("load", function () { ph._wait = false; ph._W = 0; layPlanks(ph); if (ph._o !== undefined) setO(ph, ph._o, true); }, { once: true }); }
      return;
    }
    var Wd = ph.clientWidth, Hd = ph.clientHeight;
    if (!Wd || !Hd) return;
    if (ph._W === Wd && ph._H === Hd) return;
    ph._W = Wd; ph._H = Hd;
    var old = ph.querySelector(".pks"); if (old) old.remove();
    var iw = img.naturalWidth, ih = img.naturalHeight, sc = Math.max(Wd / iw, Hd / ih), dw = iw * sc, dh = ih * sc;
    var pos = (getComputedStyle(img).objectPosition || "50% 50%").split(/\s+/);
    var px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] || "50%") / 100;
    if (isNaN(px)) px = .5; if (isNaN(py)) py = .5;
    var ox = (Wd - dw) * px, oy = (Hd - dh) * py;
    var n = Wd < 520 ? 3 : 4, cw = Wd / n, pth = Math.round(cw * (Wd < 520 ? .62 : .5));
    var url = 'url("' + (img.currentSrc || img.src) + '")';
    var bs = dw.toFixed(1) + "px " + dh.toFixed(1) + "px";
    var wrap = doc.createElement("div"); wrap.className = "pks";
    var frag = doc.createDocumentFragment();
    for (var k = 0; k < n; k++) {
      var x0 = k * cw, t = (k % 2) ? -1 : 1;
      for (var y = -cw; y < Hd; y += pth) {
        var el = doc.createElement("i");
        var h = cw + pth;
        var poly = t > 0
          ? "0 0, 100% " + cw.toFixed(1) + "px, 100% " + h.toFixed(1) + "px, 0 " + pth + "px"
          : "0 " + cw.toFixed(1) + "px, 100% 0, 100% " + pth + "px, 0 " + h.toFixed(1) + "px";
        /* порядок укладки: снизу вверх, с лёгким сдвигом слева направо */
        var d = clamp((1 - (y + h / 2) / Hd) * .7 + (x0 / Wd) * .3, 0, 1) * .76;
        el.style.cssText = "left:" + x0.toFixed(1) + "px;top:" + y.toFixed(1) + "px;width:" + (cw + .8).toFixed(1) + "px;height:" + h.toFixed(1) + "px;clip-path:polygon(" + poly + ");background-image:" + url + ";background-size:" + bs + ";background-position:" + (ox - x0).toFixed(1) + "px " + (oy - y).toFixed(1) + "px;--d:" + d.toFixed(3);
        frag.appendChild(el);
      }
    }
    wrap.appendChild(frag);
    ph.appendChild(wrap);
    ph.classList.add("lay");
  }
  function setO(ph, o, force) {
    if (REDUCED) o = 1;
    o = clamp(o);
    if (!force && ph._o === o) return;
    ph._o = o;
    var open = o >= .995;
    if (!open) layPlanks(ph);
    ph.style.setProperty("--o", o.toFixed(4));
    if (ph._open !== open) { ph._open = open; ph.classList.toggle("open", open); }
  }
  var phs = [].slice.call(doc.querySelectorAll(".ph[data-lay]"));

  /* ---------- Плиты: enter / stay / exit ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;
  var st = pws.map(function () { return { open: -1, out: {} }; });
  var lastTs = 0;
  function put(el, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; el.style.setProperty(k, v); } }
  function update(ts) {
    ticking = false;
    var now = typeof ts === "number" ? ts : performance.now();
    var dt = lastTs ? Math.min(64, now - lastTs) : 16.7; lastTs = now;
    var kf = 1 - Math.pow(1 - 0.16, dt / 16.7);
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    var moving = false;
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      if (!near && s.out["--enter"] !== undefined && !s.reset) { s.reset = true; } else if (near) s.reset = false;
      if (!near && s.reset) continue;
      var flow = flowPlate(pw);
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = (nxtTops[i] !== null && !flow) ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      var open;
      if (isHero) open = REDUCED ? 1 : INTRO;
      else open = REDUCED ? 1 : (flow ? clamp((enter - 0.18) / 0.5) : clamp((enter - 0.28) / 0.55));
      if (s.open < 0 || REDUCED || isHero) s.open = open;
      else {
        s.open += (open - s.open) * kf;
        if (Math.abs(open - s.open) > 0.002) moving = true; else s.open = open;
      }
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", (isHero ? easeOut(stay) : stay).toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      var plate = pw.firstElementChild;
      if (!s.ph) s.ph = [].slice.call(pw.querySelectorAll(".ph[data-lay]"));
      for (var c = 0; c < s.ph.length; c++) setO(s.ph[c], smooth(s.open));
      if (plate) plate.classList.toggle("gone", exit >= 1 && !flow);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt, .hero-txt");
      var on = isHero ? INTRO > 0.2 : (flow ? enter > 0.22 : enter > 0.6);
      if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
    if (moving) onScroll();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) {
      VW = W.innerWidth; VH = W.innerHeight; MOBILE = W.matchMedia("(max-width:760px)").matches;
      fitAll();
      phs.forEach(function (ph) { ph._W = 0; if (ph._o !== undefined && ph._o < .995) layPlanks(ph); });
      lentaState();
    } else if (!TOUCH) { VH = W.innerHeight; }
    onScroll();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = smooth((ts - introStart) / 1500);
    update(ts);
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Кадры каталожных секций: укладка при появлении ---------- */
  var secPh = phs.filter(function (ph) { return !ph.closest(".pw"); });
  secPh.forEach(function (ph) { setO(ph, REDUCED ? 1 : 0, true); });
  function openPh(ph) {
    if (ph._done) return;
    ph._done = true;
    var t0 = 0;
    function step(ts) {
      if (!t0) t0 = ts;
      var o = clamp((ts - t0) / 1600);
      setO(ph, smooth(o));
      if (o < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Петля видео: играет только на экране, после укладки кадра ---------- */
  var loops = [].slice.call(doc.querySelectorAll("video.loop"));
  if (loops.length && !REDUCED && "IntersectionObserver" in W) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting) {
          if (!v._src) { v._src = true; v.load(); }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { v.pause(); }
      });
    }, { threshold: 0.25 });
    loops.forEach(function (v) {
      v.addEventListener("playing", function () { v.classList.add("playing"); });
      vio.observe(v);
    });
  }

  /* ---------- Подгонка дисплейных строк: кегль вниз шагом 5%, пока не влезает ---------- */
  var fits = [].slice.call(doc.querySelectorAll(".fit"));
  function fitOne(el) {
    el.style.fontSize = "";
    if (MOBILE) return;
    var box = el.parentElement;
    var size = parseFloat(getComputedStyle(el).fontSize), guard = 0;
    while (el.scrollWidth > box.clientWidth + 1 && guard < 12) { size *= 0.95; el.style.fontSize = size.toFixed(1) + "px"; guard++; }
  }
  function fitAll() {
    var h1 = doc.querySelector(".hero h1");
    fits.forEach(function (el) { el.style.fontSize = ""; });
    if (MOBILE || !h1) return;
    /* обе строки заголовка держим одним кеглем: берём меньший из подогнанных */
    var min = Infinity;
    fits.forEach(function (el) { fitOne(el); var s = parseFloat(el.style.fontSize || getComputedStyle(el).fontSize); if (s < min) min = s; });
    fits.forEach(function (el) { el.style.fontSize = min.toFixed(1) + "px"; });
  }

  /* ---------- Лента объектов: шаг - одна карточка, стрелки гаснут на краях ---------- */
  var lenta = doc.getElementById("lenta");
  var larrs = [].slice.call(doc.querySelectorAll(".larr"));
  function lentaStep() {
    var card = lenta ? lenta.querySelector(".ob") : null;
    if (!card) return 300;
    var gap = parseFloat(getComputedStyle(lenta).columnGap || getComputedStyle(lenta).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }
  function lentaState() {
    if (!lenta) return;
    var max = lenta.scrollWidth - lenta.clientWidth;
    var none = max <= 1;
    larrs.forEach(function (b) {
      b.hidden = none;
      var dir = parseInt(b.getAttribute("data-dir"), 10);
      b.disabled = dir < 0 ? lenta.scrollLeft <= 1 : lenta.scrollLeft >= max - 1;
    });
  }
  if (lenta) {
    larrs.forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = parseInt(b.getAttribute("data-dir"), 10);
        lenta.scrollBy({ left: dir * lentaStep(), behavior: REDUCED ? "auto" : "smooth" });
      });
    });
    lenta.addEventListener("scroll", function () { if (!lenta._t) lenta._t = setTimeout(function () { lenta._t = 0; lentaState(); }, 80); }, { passive: true });
    lentaState();
  }

  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  I18N.en = {
    "meta.title": "Turnkey apartment flipping in Astana - Romance City, Saule Isatayeva",
    "meta.desc": "Turnkey apartment flipping: sourcing a liquid property, renovation, staging and sale through Krisha.kz. Mentoring for flippers, real estate investment from 20 million KZT. 15 years in flipping, about 50 apartments a year. Astana and all of Kazakhstan online. Free consultation.",
    "nav.fl": "Flipping", "nav.so": "Mentoring", "nav.in": "Investment", "nav.pe": "Resale", "nav.re": "Renovation", "nav.kak": "How it works", "nav.kont": "Contacts",
    "up.aria": "Romance City - to the top", "tel.aria": "Call +7 707 699 7664", "ig.aria": "Romance City on Instagram", "menu.aria": "Menu",
    "lenta.prev": "Previous", "lenta.next": "Next",
    "menu.wa": "Free consultation",
    "menu.note": "Astana, 4 Shamshi Kaldayakov St. Mon-Sat 09:00-20:00. Across Kazakhstan - online.",
    "hero.alt": "Apartment after flipping: herringbone parquet, chandelier, soft furniture. Before renovation - bare shell",
    "hero.kicker": "Astana · <span class=\"m-hide\">all of Kazakhstan </span>online · since 2011",
    "hero.t1": "Turnkey apartment", "hero.t2": "flipping",
    "hero.lead": "You buy an apartment from 20&nbsp;million&nbsp;KZT - I source the property, renovate and sell it. 15&nbsp;years in flipping, about 50&nbsp;apartments a year.",
    "hero.cta1": "Free consultation", "hero.cta2": "How it works", "hero.ig": "Before and after on Instagram →",
    "fl.kicker": "Turnkey flipping", "fl.h": "You invest - I run the property up to the sale",
    "fl.lead": "A liquid apartment, renovation by my own crew, furniture and staging, sale through Krisha.kz. You only come to the closing.",
    "fl.l1": "Properties from 20&nbsp;million&nbsp;KZT in Astana and across Kazakhstan", "fl.l2": "The apartment is bought and registered in your name", "fl.l3": "Cycle on past properties: 3&#8209;6&nbsp;months",
    "fl.btn": "Get the terms", "fl.cap": "Before: shell finish. After: renovation, furniture, staging for sale.",
    "fl.alt": "Apartment after renovation and staging: wood wall panels, chandelier, lighting",
    "so.kicker": "Mentoring", "so.h": "For those who want to flip themselves or scale up",
    "so.lead": "We go through your property together: choice, bargaining, renovation, sale. You learn on your own apartment, not on someone else's examples.",
    "so.l1": "Property check and profit estimate before the purchase", "so.l2": "Negotiations with the seller and buyers", "so.l3": "Crew, budget and renovation control",
    "so.btn": "Discuss a property", "so.alt": "Saule Isatayeva at a desk with apartment plans in the office, Astana",
    "in.kicker": "Real estate investment", "in.h": "A clear cycle: buy, improve, sell",
    "in.lead": "You enter with a budget from 20&nbsp;million&nbsp;KZT and the apartment is registered in your name. I run the property from sourcing to closing and show the costs at every step.",
    "in.l1": "On past properties: +30&#8209;40% in 3&#8209;6&nbsp;months", "in.l2": "Profit estimate before the purchase, not after", "in.l3": "Budget and timeline report at every stage",
    "in.note": "The figures are an example from past properties, not a guarantee: the result depends on the property and the market.",
    "in.btn": "Get an estimate", "in.alt": "Hallway of a finished apartment: built-in wardrobe, herringbone parquet",
    "pe.kicker": "Apartment resale", "pe.h": "I sell the finished apartment at market price and without downtime",
    "pe.lead": "Staging, photos, listing and promotion on Krisha.kz, viewings and bargaining - up to the deal at the notary.",
    "pe.l1": "Furniture, decor and professional photos for the sale", "pe.l2": "I run the viewings and the bargaining myself", "pe.l3": "Deal partner - BAZIS-A agency, 0&nbsp;KZT commission for the client",
    "pe.btn": "Sell an apartment", "pe.alt": "Gorodskoy Romans residential complex in Astana from above: buildings with green roofs",
    "ob.kicker": "Properties", "ob.h": "Apartments after renovation and staging",
    "ob.lead": "Shots from properties in Astana: renovation, furniture, preparation for sale. Real apartments, not renders.",
    "ob.ig": "More properties on Instagram",
    "ob1.alt": "Hallway after renovation: white doors, brass hardware, herringbone parquet", "ob2.alt": "Bedroom with a chandelier overlooking new Astana neighbourhoods", "ob3.alt": "Bedroom after staging: bed, mirror, armchair", "ob4.alt": "Grand Monaco lobby: marble floor, reception, golden chandelier", "ob5.alt": "Mirror, armchairs and console in a finished apartment", "ob6.alt": "Keys to a finished apartment in hand, kitchen behind",
    "kak.kicker": "How it works", "kak.h": "Six steps from choosing the apartment to the profit",
    "kak.lead": "No renovation on your side, no buyer search, no extra hassle.",
    "s1.t": "I source the apartment", "s1.d": "I analyse the market and pick a liquid property with price growth potential.",
    "s2.t": "You buy", "s2.d": "Closing and registration in your name. The apartment is yours from day one.",
    "s3.t": "You hand me the keys", "s3.d": "Keys and documents - from here I run the property.",
    "s4.t": "Renovation, furniture, staging", "s4.d": "My own crew, furnishing, decor and preparation for the sale.",
    "s5.t": "I sell through Krisha.kz", "s5.d": "Listing, promotion, viewings and negotiations with buyers.",
    "s6.t": "Closing and profit", "s6.d": "You come to the closing and take the result.",
    "me.kicker": "Saule Isatayeva", "me.h": "15 years in flipping. I only take properties I am sure about",
    "me.lead": "Since 2011 I have walked the whole path with investors, from sourcing to closing. I do not work with everyone: properties from 20&nbsp;million&nbsp;KZT with clear potential - that keeps the result predictable for both of us.",
    "st1.n": "since 2011", "st1.t": "in flipping", "st2.n": "~50", "st2.t": "apartments a year", "st3.n": "from 20M KZT", "st3.t": "property threshold",
    "me.btn": "Free consultation", "me.alt": "Saule Isatayeva, flipper with 15 years of experience",
    "re.kicker": "Turnkey renovation", "re.h": "Turnkey renovation as a separate service",
    "re.lead": "Apartments, non-residential and commercial premises: from shell finish to the final result by the same crew that prepares my properties for sale.",
    "re.l1": "Electrics, plumbing, tiling, painting", "re.l2": "Budget and deadlines are fixed before the start", "re.l3": "Terms of work - by agreement",
    "re.btn": "Estimate a renovation", "re.ig": "More projects on Instagram →",
    "re.alt": "Bathroom after renovation: marble, brass fittings, blue vanity",
    "faq.kicker": "Questions", "faq.h": "What people ask before the first consultation",
    "q1": "How much money do I need to start?", "a1": "I take properties from 20 million KZT. Plus a budget for renovation and staging - we calculate it at the consultation for the specific apartment.",
    "q2": "Whose name is the apartment registered in?", "a2": "Yours. You are the buyer and the owner; I run the property under a contract and bring it to the sale.",
    "q3": "How long is the cycle?", "a3": "On past properties, 3-6 months from purchase to sale. The timing depends on the renovation scope and the market.",
    "q4": "What return can I expect?", "a4": "On past properties, plus 30-40% on the investment. This is an example, not a guarantee: I calculate your apartment before the purchase.",
    "q5": "I am not in Astana. Can we work online?", "a5": "Yes, I work with investors from any city in Kazakhstan: calls, photo reports and documents online, you come once for the closing.",
    "kont.kicker": "Contacts", "kont.h": "Let us start with a free consultation",
    "kont.lead": "Write on WhatsApp or leave your number: I will tell you whether your budget and property fit flipping.",
    "kont.wa": "Write on WhatsApp", "kont.ig": "Instagram", "kont.2gis": "Office on 2GIS",
    "kont.addr": "Astana, 4 Shamshi Kaldayakov St.", "kont.hours": "Mon-Sat 09:00-20:00, Sunday off", "kont.online": "Investors from other cities - online",
    "form.h": "Leave a request", "form.name": "Name", "form.name.ph": "How should I address you", "form.phone": "Phone", "form.err": "Enter a phone number of at least 10 digits.",
    "form.msg": "Interested in", "form.msg.ph": "Turnkey flipping, budget 25 million, Astana", "form.btn": "Send via WhatsApp", "form.note": "The request opens in WhatsApp with a ready text. Saule replies.",
    "thanks.h": "Thank you!", "thanks.p": "The request has gone to WhatsApp. I will reply during working hours, Mon-Sat 09:00-20:00.",
    "foot.tag": "Turnkey apartment flipping. Astana and all of Kazakhstan.", "foot.copy": "Saule Isatayeva", "sticky.call": "Call"
  };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { var k = el.getAttribute("data-i"); if (RU[k] == null) RU[k] = el.innerHTML; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) el.innerHTML = v; });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("romancecity-lang", lang); } catch (e) {}
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitAll); else fitAll();
  }
  function loadLang(lang, done) {
    if (I18N[lang] || lang !== "kk") return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      if (W.SITE_KK) {
        I18N.kk = W.SITE_KK;
        if (W.SITE_KK_WA) WA.kk = W.SITE_KK_WA;
        if (W.SITE_KK_FORM) FORM_LABELS.kk = W.SITE_KK_FORM;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    /* ?lang= в адресе главнее сохранённого выбора: реклама ведёт на ?lang=ru */
    var forced = (location.search.match(/[?&]lang=(ru|kk|en)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("romancecity-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  function reveal(el) {
    el.classList.add("in");
    if (el.classList.contains("ph")) openPh(el);
    [].forEach.call(el.querySelectorAll(".ph[data-lay]"), openPh);
  }
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (!x.isIntersecting) return; reveal(x.target); io.unobserve(x.target); });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) reveal(el); }); }, 1500);
  } else { rv.forEach(function (el) { el.classList.add("in"); }); secPh.forEach(function (ph) { setO(ph, 1); }); }

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badPhone = phone.replace(/\D/g, "").length < 10;
      f.phone.classList.toggle("bad", badPhone);
      f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badPhone) { if (ferr) ferr.hidden = false; f.phone.focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head];
      if (name) lines.push(L.name + ": " + name);
      lines.push(L.phone + ": " + phone);
      var msg = f.msg.value.trim();
      if (msg) lines.push(L.msg + ": " + msg);
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n"));
      fireConv("form");
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    fitAll();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    lentaState();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitAll(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
