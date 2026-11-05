/* Romance City. Ванильный JS: плиты, герой «окно загорается, камера входит в дом», окна от прокрутки, меню, якоря, язык, лента, видео, форма в WhatsApp. */
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
  var PHONE = "77472227664";
  var WA = {
    ru: {
      "default": "Здравствуйте, Сауле. Пишу с сайта Romance City, хочу бесплатную консультацию по флиппингу.",
      "sticky": "Здравствуйте, Сауле. Пишу с сайта Romance City, хочу бесплатную консультацию по флиппингу.",
      "hero": "Здравствуйте, Сауле. Хочу расчёт по флиппингу под ключ в Астане. Мой бюджет: ___. Город: ___.",
      "podbor": "Здравствуйте, Сауле. Интересует подбор квартиры под перепродажу в Астане. Бюджет: ___.",
      "remont": "Здравствуйте, Сауле. Нужен расчёт ремонта под ключ. Объект: ___, площадь: ___.",
      "prodazha": "Здравствуйте, Сауле. Хочу обсудить продажу квартиры после ремонта. ЖК: ___.",
      "soprovozhdenie": "Здравствуйте, Сауле. Уже занимаюсь флиппингом, интересует сопровождение сделок. Город: ___.",
      "nastavnichestvo": "Здравствуйте, Сауле. Хочу научиться флиппингу, прошу записать меня на консультацию.",
      "obo": "Здравствуйте, Сауле. Хочу обсудить сотрудничество по флиппингу под ключ."
    },
    en: {
      "default": "Hello Saule. I am writing from the Romance City website and would like a free consultation on flipping.",
      "sticky": "Hello Saule. I am writing from the Romance City website and would like a free consultation on flipping.",
      "hero": "Hello Saule. I would like an estimate for turnkey flipping in Astana. My budget: ___. City: ___.",
      "podbor": "Hello Saule. I am interested in selecting an apartment for resale in Astana. Budget: ___.",
      "remont": "Hello Saule. I need an estimate for a turnkey renovation. Property: ___, area: ___.",
      "prodazha": "Hello Saule. I would like to discuss selling an apartment after renovation. Complex: ___.",
      "soprovozhdenie": "Hello Saule. I already flip apartments and am interested in deal support. City: ___.",
      "nastavnichestvo": "Hello Saule. I would like to learn flipping, please book me for a consultation.",
      "obo": "Hello Saule. I would like to discuss working together on turnkey flipping."
    }
  };
  var FORM_LABELS = {
    ru: { head: "Здравствуйте, Сауле. Заявка с сайта.", name: "Имя", phone: "Телефон", budget: "Бюджет и город" },
    en: { head: "Hello Saule. Request from the website.", name: "Name", phone: "Phone", budget: "Budget and city" }
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
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 460);
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
    if (el.classList.contains("pw")) return el.classList.contains("pw-hero") ? 0 : (flowPlate(el) ? r - HDR() : r);
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    var y = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, y); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: y, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (!doc.getElementById(id)) return;
    e.preventDefault();
    setMenu(false, false);
    setTimeout(function () {
      goTo(id, false);
      try { history.pushState(null, "", "#" + id); } catch (err) {}
    }, doc.body.classList.contains("menu-open") ? 120 : 0);
  });

  /* ---------- Герой: дом в сумерках, одно окно горит. По прокрутке камера входит в окно (--o 0..1) ---------- */
  var hero = doc.querySelector(".hero"), facade = doc.getElementById("facade"), herobig = doc.getElementById("herobig");
  var heroTxt = doc.querySelector(".hero-txt");
  /* горящее окно на кадре фасада: доли ширины и высоты кадра (десктопный кадр и мобильный кроп) */
  var WIN_D = { l: 0.832, t: 0.536, r: 0.864, b: 0.589 }, WIN_M = { l: 0.6975, t: 0.3657, r: 0.755, b: 0.4629 };
  var IW = 1500, IH = 2000; /* кадр гостиной */
  var herobg = doc.getElementById("herobg");
  function measureHero() {
    if (!hero || !facade || !herobg) return;
    var pw = hero.clientWidth, ph = hero.clientHeight;
    var hr = hero.getBoundingClientRect(), br = herobg.getBoundingClientRect();
    var bw = br.width, bh = br.height;
    if (!pw || !ph || !bw || !bh) return;
    var mob = (facade.currentSrc || "").indexOf("-m.") > -1;
    var WIN = mob ? WIN_M : WIN_D;
    var nw = facade.naturalWidth || (mob ? 800 : 1280), nh = facade.naturalHeight || (mob ? 1400 : 2276);
    var pos = getComputedStyle(facade).objectPosition.split(" ");
    var px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] || "50%") / 100;
    if (isNaN(px)) px = 0.5; if (isNaN(py)) py = 0.5;
    var sc = Math.max(bw / nw, bh / nh), dw = nw * sc, dh = nh * sc;
    var ox = (bw - dw) * px, oy = (bh - dh) * py;
    /* окно в координатах ленты фасада (для подсветки) и в координатах героя (для кадра гостиной) */
    var gl = ox + WIN.l * dw, gt = oy + WIN.t * dh, ww = (WIN.r - WIN.l) * dw, wh = (WIN.b - WIN.t) * dh;
    var wl = gl + (br.left - hr.left), wt = gt + (br.top - hr.top);
    var cx = wl + ww / 2, cy = wt + wh / 2;
    var ss = Math.max(ww / IW, wh / IH), sf = Math.max(pw / IW, ph / IH);
    var st = hero.style;
    st.setProperty("--gl", gl.toFixed(1) + "px"); st.setProperty("--gt", gt.toFixed(1) + "px");
    st.setProperty("--wl", wl.toFixed(1) + "px"); st.setProperty("--wt", wt.toFixed(1) + "px");
    st.setProperty("--wr", (pw - wl - ww).toFixed(1) + "px"); st.setProperty("--wb", (ph - wt - wh).toFixed(1) + "px");
    st.setProperty("--ww", ww.toFixed(1) + "px"); st.setProperty("--wh", wh.toFixed(1) + "px");
    st.setProperty("--wx", ((gl + ww / 2) / bw * 100).toFixed(2) + "%"); st.setProperty("--wy", ((gt + wh / 2) / bh * 100).toFixed(2) + "%");
    st.setProperty("--k", (ss / sf).toFixed(5));
    st.setProperty("--iw", (IW * sf).toFixed(1) + "px"); st.setProperty("--ih", (IH * sf).toFixed(1) + "px");
    st.setProperty("--dx", (cx - pw / 2).toFixed(1) + "px"); st.setProperty("--dy", (cy - ph / 2).toFixed(1) + "px");
  }
  if (facade) { if (facade.complete) measureHero(); else facade.addEventListener("load", measureHero); }

  /* ---------- Окна: загораются от прокрутки. В sticky-плитах - по --enter плиты (0.55), остальные - по видимости (50%);
     гаснут, только когда окно целиком ушло из экрана, - так эффект повторяется при возврате, но не мигает у границы ---------- */
  var allWins = [].slice.call(doc.querySelectorAll(".win"));
  function setLit(w, on) { if (w._lit === on) return; w._lit = on; w.classList.toggle("lit", on); }
  function inStickyPlate(w) { var pw = w.closest(".pw"); return !!pw && !flowPlate(pw); }
  if (REDUCED || !("IntersectionObserver" in W)) allWins.forEach(function (w) { setLit(w, true); });
  else {
    var ioWin = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (inStickyPlate(x.target)) return;
        if (x.intersectionRatio >= 0.5) setLit(x.target, true);
        else if (!x.isIntersecting) setLit(x.target, false);
      });
    }, { threshold: [0, 0.5] });
    allWins.forEach(function (w) { ioWin.observe(w); });
  }

  /* ---------- Плиты ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO_SKIP = location.hash.length > 1 || W.pageYOffset > 80 || REDUCED;
  var ticking = false;
  var st = pws.map(function () { return { out: {} }; });
  function put(el, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; el.style.setProperty(k, v); } }
  function update() {
    ticking = false;
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      /* плита далеко от экрана: считаем один раз на сторону (ниже/выше), чтобы прыжок по якорю не оставил её в старом состоянии */
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      var side = near ? 0 : (r.top > 0 ? 1 : -1);
      if (!near && s.side === side) continue;
      s.side = side;
      var flow = flowPlate(pw);
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = (nxtTops[i] !== null && !flow) ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      var plate = pw.firstElementChild;
      if (isHero && plate) {
        var o = flow ? 0 : smooth((stay - 0.04) / 0.96);
        put(plate, s, "--o", o.toFixed(4));
        var flown = o > 0.45;
        if (s.flown !== flown) { s.flown = flown; plate.classList.toggle("flown", flown); }
      }
      if (plate) plate.classList.toggle("gone", exit >= 1 && !flow);
      if (!s.txts) { s.txts = pw.querySelectorAll(".txt"); s.wins = pw.querySelectorAll(".win"); }
      if (!isHero) {
        var on = flow ? enter > 0.22 : enter > 0.6;
        if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
        /* окно плиты: загорается на 0.55 въезда, гаснет, когда плита снова целиком под экраном */
        if (!flow && !REDUCED) {
          var lit = enter >= 0.55 ? true : (enter <= 0.02 ? false : null);
          if (lit !== null) for (var k = 0; k < s.wins.length; k++) setLit(s.wins[k], lit);
        }
      }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) {
      VW = W.innerWidth; VH = W.innerHeight; MOBILE = W.matchMedia("(max-width:760px)").matches;
      fitAll(); measureHero(); lentaState();
    } else if (!TOUCH) { VH = W.innerHeight; measureHero(); }
    onScroll();
  });

  /* интро: текст поднимается, затем окно на фасаде загорается и в нём видна гостиная. Пропускается при хэше или прокрутке */
  function runIntro() {
    if (!hero) return;
    if (INTRO_SKIP) { hero.classList.add("lit"); if (heroTxt) heroTxt.classList.add("on"); return; }
    setTimeout(function () { if (heroTxt) heroTxt.classList.add("on"); }, 150);
    setTimeout(function () { hero.classList.add("lit"); }, 1050);
  }

  /* ---------- fitText: обе строки заголовка героя одним кеглем ---------- */
  var fits = [].slice.call(doc.querySelectorAll(".fit"));
  function fitOne(el) {
    var box = el.parentElement, max = box.clientWidth;
    if (!max) return;
    el.style.fontSize = ""; el.style.whiteSpace = "nowrap";
    var size = parseFloat(getComputedStyle(el).fontSize), n = 0;
    while (el.scrollWidth > max && n < 14) { size *= 0.95; el.style.fontSize = size.toFixed(1) + "px"; n++; }
  }
  function fitAll() {
    if (!fits.length) return;
    if (MOBILE) { fits.forEach(function (el) { el.style.fontSize = ""; el.style.whiteSpace = ""; }); return; }
    var min = Infinity;
    fits.forEach(function (el) { fitOne(el); var s = parseFloat(el.style.fontSize || getComputedStyle(el).fontSize); if (s < min) min = s; });
    fits.forEach(function (el) { el.style.fontSize = min.toFixed(1) + "px"; });
  }

  /* ---------- Лента объектов: шаг - одна карточка, стрелки гаснут на краях ---------- */
  var lenta = doc.getElementById("lenta");
  var larrs = [].slice.call(doc.querySelectorAll(".larr"));
  function lentaStep() {
    var card = lenta ? lenta.querySelector(".obj") : null;
    if (!card) return 300;
    var gap = parseFloat(getComputedStyle(lenta).columnGap || getComputedStyle(lenta).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }
  function lentaState() {
    if (!lenta) return;
    var max = lenta.scrollWidth - lenta.clientWidth, x = lenta.scrollLeft;
    var none = max <= 1;
    larrs.forEach(function (b) {
      b.hidden = none;
      b.disabled = b.classList.contains("larr-prev") ? x <= 1 : x >= max - 1;
    });
  }
  if (lenta) {
    larrs.forEach(function (b) {
      b.addEventListener("click", function () {
        lenta.scrollBy({ left: (b.classList.contains("larr-prev") ? -1 : 1) * lentaStep(), behavior: REDUCED ? "auto" : "smooth" });
      });
    });
    lenta.addEventListener("scroll", function () { if (!lenta._t) lenta._t = setTimeout(function () { lenta._t = 0; lentaState(); }, 80); }, { passive: true });
  }

  /* ---------- Видео: немая петля по видимости, полный ролик по клику в модалке ---------- */
  var vbox = doc.getElementById("vbox"), vloop = doc.getElementById("vloop");
  if (vbox && vloop && "IntersectionObserver" in W) {
    vloop.addEventListener("playing", function () { vbox.classList.add("is-live"); });
    new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) { var p = vloop.play(); if (p && p.catch) p.catch(function () {}); }
        else vloop.pause();
      });
    }, { threshold: 0.25 }).observe(vbox);
  }
  var vplay = doc.getElementById("vplay"), vmodal = doc.getElementById("vmodal"), vfull = doc.getElementById("vfull");
  function vClose() {
    if (!vmodal || vmodal.hidden) return;
    vmodal.hidden = true; doc.body.classList.remove("modal-open");
    if (vfull) vfull.pause();
    if (vplay) vplay.focus({ preventScroll: true });
  }
  if (vplay && vmodal && vfull) {
    vplay.addEventListener("click", function () {
      vmodal.hidden = false; doc.body.classList.add("modal-open");
      var p = vfull.play(); if (p && p.catch) p.catch(function () {});
      setTimeout(function () { try { vfull.focus({ preventScroll: true }); } catch (e) {} }, 50);
    });
    vmodal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) vClose(); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") vClose(); });
  }

  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  I18N.en = {
    "meta.title": "Turnkey Apartment Flipping in Astana - Saule Isatayeva | Romance City",
    "meta.desc": "Turnkey apartment flipping in Astana: I select an apartment for your budget from 30 million tenge, renovate and furnish it, and sell it. The apartment is registered in your name, no prepayment. Renovation 1-2 months, full cycle from 3 months. Investors from other cities are handled online.",
    "up.aria": "Romance City - to the top",
    "nav.kak": "How it works", "nav.podbor": "Selection", "nav.remont": "Renovation", "nav.prodazha": "Sale", "nav.obekty": "Properties", "nav.me": "About me", "nav.faq": "FAQ", "nav.kont": "Contacts", "nav.bez": "Security",
    "tel.aria": "Call +7 747 222 76 64", "ig.aria": "Saule Isatayeva on Instagram", "hdr.wa": "Message on WhatsApp", "menu.aria": "Menu",
    "menu.note": "Astana, 4 Shamshi Kaldayakov St. Mon-Sat 09:00-20:00. Investors from other cities are handled online.", "menu.call": "Call",
    "hero.kicker": "ASTANA · TURNKEY FLIPPING · SINCE 2011",
    "hero.t1": "Turnkey apartment flipping in Astana",
    "hero.t2": "from bare walls to a profitable sale",
    "hero.lead": "You buy an apartment in your own name in a new building in Astana. My team and I renovate it in <span class=\"nw\">1-2&nbsp;months</span>, furnish it and sell it. <span class=\"m-less\">The full cycle takes from 3&nbsp;months, and you come only twice: to buy and to sell.</span>",
    "hero.cta1": "Get an estimate on WhatsApp", "hero.cta2": "How it works", "hero.ig": "My apartments on Instagram →", "hero.hint": "Scroll: step inside the apartment",
    "wall.aria": "Apartments after renovation",
    "hero.a1": "Facade of the Gorodskoy Romans residential quarter in Astana",
    "hero.a2": "Kitchen-living room after renovation in Evolution: ring chandelier, grey sofa",
    "hero.cap": "Grand Monaco, Astana: living room after renovation and furnishing",
    "hero.a3": "Living room after renovation in Grand Monaco: crystal chandelier, light sofa, herringbone parquet, large window",
    "hero.a4": "Living room of a finished apartment: beige sofa, floor-length curtains, crystal chandelier",
    "hero.a5": "Bedroom in Grand Monaco: bed with an upholstered headboard, window to the courtyard",
    "kak.h": "How it works",
    "kak.s1": "I select an apartment", "kak.s2": "You buy it in your name", "kak.s3": "I renovate", "kak.s4": "I furnish and prepare for sale", "kak.s5": "I sell, you receive the profit",
    "kak.note": "Renovation usually takes 1-2&nbsp;months, the full deal cycle from 3&nbsp;months. I calculate the deal for your budget before the purchase, at a free consultation.",
    "pb.k": "--- SELECTION", "pb.h": "Selecting an apartment for resale",
    "pb.lead": "I choose an apartment from the developer at the construction stage, while the best floors and layouts are still available. By the time the building is handed over, such options remain only with those who came in earlier.",
    "pb.l1": "Residential complexes and locations in Astana where an apartment is most profitable to buy for resale",
    "pb.l2": "Layout, floor and renovation budget - assessed before the purchase",
    "pb.l3": "One- and two-bedroom apartments with a kitchen-living room: that is where the demand is now",
    "pb.l4": "Apartments from 30&nbsp;million tenge, bare-wall finish from the developer",
    "pb.partner": "Partnership with the developer BAZIS-A: Grand Monaco apartments in bare-wall finish with documents, no commission for the client.",
    "pb.btn": "Select an apartment",
    "pb.alt": "Saule Isatayeva in front of the Gorodskoy Romans residential quarter in Astana",
    "pb.cap": "Gorodskoy Romans, Astana: I live in this quarter and do renovations here",
    "re.alt": "Saule Isatayeva and a craftsman checking furniture drawings in an apartment under renovation",
    "re.cap": "On site: checking the furniture against the project",
    "re.k": "--- RENOVATION AND FURNITURE", "re.h": "Renovation and furnishing in <span class=\"nw\">1-2&nbsp;months</span>",
    "re.lead": "My team and I run the renovation. Furniture is made to order for the apartment's design, followed by textiles, decor and cleaning - the apartment is ready for viewings.",
    "re.l1": "Full range of renovation work: electrics, plumbing, tiling, painting",
    "re.l2": "Kitchen, wardrobes and walk-in closets - made to order for the layout",
    "re.l3": "Sofa, bed, textiles, decor: the apartment is sold fully furnished",
    "re.l4": "You do not need to visit the site",
    "re.sep": "I also do turnkey renovation as a separate service: apartments, non-residential and commercial premises, from bare walls to the finished result. Cost and timing are agreed individually.",
    "re.btn": "Get a renovation estimate",
    "pr.k": "--- SALE", "pr.h": "Selling a finished apartment with furniture and appliances",
    "pr.lead": "After the renovation I sell the apartment fully furnished: the buyer takes their suitcases and moves in. I list it on Krisha.kz and other platforms, show the apartment and negotiate until the deal is closed.",
    "pr.l1": "Listing, viewings and negotiations with buyers - my job",
    "pr.l2": "You come to the sale closing and receive the profit",
    "pr.l3": "In my deals the profit per apartment is from 5&nbsp;million tenge; this income is not guaranteed, I calculate each apartment separately",
    "pr.btn": "Discuss a sale", "pr.varia": "Watch the apartment tour in Grand Monaco", "pr.vbtn": "Watch the apartment tour",
    "pr.alt": "Kitchen-living room in Grand Monaco: crystal chandelier, floor-to-ceiling cabinets",
    "pr.cap": "Grand Monaco, Astana: apartment after renovation, for sale with furniture and appliances",
    "pr.vtitle": "Apartment tour in Grand Monaco",
    "ob.k": "--- PROPERTIES", "ob.h": "Apartments after renovation and furnishing",
    "ob.lead": "Apartments in Astana that my team and I have renovated, furnished and prepared for sale.",
    "lenta.prev": "Previous", "lenta.next": "Next", "ob.aria": "Apartments after renovation",
    "ob.e1": "Kitchen in Evolution: mint fronts, built-in appliances, herringbone parquet",
    "ob.e2": "Kitchen bar in Evolution: bar counter, two stools",
    "ob.e3": "Bedroom in Evolution: green headboard, floor-to-ceiling wardrobe",
    "ob.c1a": "Evolution", "ob.c1b": "one-bedroom 50&nbsp;m², 4th floor · with furniture and appliances",
    "ob.g1": "Kitchen-living room in Grand Monaco: crystal chandelier, floor-to-ceiling cabinets",
    "ob.g2": "Kitchen in Grand Monaco: built-in oven, herringbone parquet",
    "ob.g3": "Bathroom in Grand Monaco: marble-look tiles, blue vanity, bathtub",
    "ob.c2a": "Grand Monaco", "ob.c2b": "business plus class · with furniture and appliances",
    "ob.t1": "Bedroom of a finished apartment: bed with light-blue textiles, patterned wallpaper",
    "ob.t2": "Kitchen of a finished apartment: white fronts, built-in appliances",
    "ob.t3": "Bathroom of a finished apartment: checkerboard tiles, green vanity",
    "ob.c3a": "Finished apartment", "ob.c3b": "living room, kitchen, bedroom, bathroom",
    "ob.u1": "Living room in AUEZ: floor-length curtains, crystal chandelier",
    "ob.u2": "Facade of the AUEZ residential complex in Astana",
    "ob.u3": "Bathroom in AUEZ: round mirror, green vanity",
    "ob.c4a": "AUEZ", "ob.c4b": "63&nbsp;m² · 5th floor of&nbsp;9",
    "ob.ig": "More apartments on Instagram", "ob.ig2": "Agency: @romancecity.home",
    "bz.k": "--- SECURITY", "bz.h": "What stays with you at every stage",
    "bz.t1": "The apartment is in your name", "bz.p1": "You buy it in your own name and remain the owner from purchase to sale.",
    "bz.t2": "The documents stay with you", "bz.p2": "The apartment documents are kept by the owner.",
    "bz.t3": "No money upfront", "bz.p3": "I take no prepayment for my work, I work for the result.",
    "bz.t4": "No need to supervise the renovation", "bz.p4": "Renovation, furniture and viewings are handled by my team and me.",
    "dk.k": "--- WHO IT IS FOR", "dk.h": "I do not work with everyone",
    "dk.lead": "I take an apartment on only when I am confident in the result: before the purchase I assess the layout, floor, location and renovation budget. In flipping, money is made not on a beautiful renovation but on sound decisions.",
    "dk.t1": "Investors", "dk.p1": "You do not want to keep money on deposit. Astana has more new buildings than any other city in Kazakhstan, and people invest here from other regions and from abroad. You buy the apartment, I take care of the rest.",
    "dk.a1": "Turnkey flipping →",
    "dk.t2": "Flippers", "dk.p2": "You already resell apartments and want to scale. I help you choose properties, calculate costs and profit before the purchase, supervise the renovation and prepare the apartment for a profitable sale.",
    "dk.a2": "Discuss deal support →",
    "dk.t3": "Beginners", "dk.p3": "You want to flip apartments yourself. We go through the first deal together - from choosing the apartment to the sale. I hold personal consultations and online master classes.",
    "dk.a3": "Book a consultation →",
    "dk.t4": "From other cities", "dk.p4": "You do not live in Astana. I consult online and select an apartment for your budget; you fly in for the purchase and for the sale closing.",
    "dk.a4": "How it works →",
    "me.alt": "Saule Isatayeva: studio portrait, black jacket and burgundy scarf",
    "me.cap": "Saule Isatayeva, founder of the Gorodskoy Romans agency",
    "me.k": "--- ABOUT ME", "me.h": "Saule Isatayeva, founder of the Gorodskoy Romans real estate agency",
    "me.lead": "In flipping since 2011; about 50&nbsp;apartments a year pass through my team and me. I live in the Gorodskoy Romans quarter myself and do renovations here.",
    "me.l1": "35&nbsp;years in business, 15&nbsp;of them in flipping",
    "me.l2": "About 50&nbsp;apartments a year: selection, renovation, furnishing, sale",
    "me.l3": "Office in Astana, 4 Shamshi Kaldayakov St.",
    "me.q": "“In real estate what matters is not just buying an apartment, but seeing its potential before everyone else.”",
    "me.btn": "Discuss working together", "me.ig": "My Instagram",
    "fq.k": "--- FAQ", "fq.h": "Frequently asked questions from investors",
    "fq.q1": "What is the minimum amount to start with?", "fq.a1": "Apartments priced from 30&nbsp;million tenge. I calculate the renovation and furniture budget for the specific apartment at a free consultation.",
    "fq.q2": "How much can I earn?", "fq.a2": "In my deals the profit per apartment is from 5&nbsp;million tenge. This income is not guaranteed: it depends on the apartment, the renovation and the market, so I calculate each apartment before the purchase.",
    "fq.q3": "How long does a deal take?", "fq.a3": "From 3&nbsp;months from purchase to sale, of which the renovation usually takes 1-2&nbsp;months. The cycle can be repeated several times a year.",
    "fq.q4": "Is a prepayment required?", "fq.a4": "No. I take no money upfront, I work for the result.",
    "fq.q5": "Whose name is the apartment registered in?", "fq.a5": "Yours. You are the owner of the apartment at every stage, and the documents stay with you.",
    "fq.q6": "I do not live in Astana. Can I work with you?", "fq.a6": "Yes. I consult online and select an apartment for your budget; you fly in for the purchase and for the sale closing.",
    "fq.q7": "What do you do yourself, and what does the team do?", "fq.a7": "Apartment selection, calculation and sale are handled by me. Renovation, furniture and viewings - by my team and me.",
    "kt.k": "--- CONTACTS", "kt.h": "Free consultation",
    "kt.lead": "Message me on WhatsApp or leave your number. We will go through your situation and budget and define the next steps.",
    "form.name": "Name", "form.name.ph": "How should I address you", "form.phone": "Phone", "form.err": "Enter a phone number: at least 10 digits.",
    "form.budget": "Budget and city", "form.budget.ph": "Optional", "form.btn": "Send via WhatsApp", "form.note": "After sending, WhatsApp will open with a ready message.",
    "thanks.h": "Thank you", "thanks.p": "Your request has gone to WhatsApp. I will reply during working hours: Mon-Sat, 09:00-20:00.",
    "kt.wa": "Message on WhatsApp", "kt.ig": "My Instagram", "kt.gis": "Office on 2GIS",
    "kt.adr.t": "Address", "kt.adr": "Astana, 4 Shamshi Kaldayakov St.", "kt.hrs.t": "Hours", "kt.hrs": "Mon-Sat 09:00-20:00, Sunday closed", "kt.geo.t": "Coverage", "kt.geo": "Astana; other cities - online",
    "foot.tag": "Turnkey apartment flipping in Astana: selection, renovation, furnishing, sale.",
    "foot.copy": "Saule Isatayeva, Gorodskoy Romans real estate agency",
    "sticky.call": "Call", "sticky.aria": "Quick contact", "close.aria": "Close"
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
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitAll(); measureHero(); }); else { fitAll(); measureHero(); }
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

  /* ---------- Проявление секций; окна вне плит загораются по видимости ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  function reveal(el) { el.classList.add("in"); }
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (!x.isIntersecting) return; reveal(x.target); io.unobserve(x.target); });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) reveal(el); }); }, 1500);
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

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
      var parts = [L.head];
      if (name) parts.push(L.name + ": " + name + ".");
      parts.push(L.phone + ": " + phone + ".");
      var budget = f.budget.value.trim();
      if (budget) parts.push(L.budget + ": " + budget + ".");
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(parts.join(" "));
      fireConv("form");
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    fitAll(); measureHero();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      setTimeout(function () { goTo(id, true); update(); }, 40);
    }
    update();
    runIntro();
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(start); else start();
  W.addEventListener("load", function () { fitAll(); measureHero(); update(); lentaState(); });

})();
