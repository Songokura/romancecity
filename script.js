/* Romance City. Ванильный JS: плиты, сигнатура «план заселяется», меню, якоря, язык, лента, форма в WhatsApp. */
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
      "default": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию по флиппингу. Мой бюджет и город: ",
      "hero": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию по флиппингу. Мой бюджет и город: ",
      "menu": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию. Мой вопрос: ",
      "sticky": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию. Мой вопрос: ",
      "kontakty": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу бесплатную консультацию. Мой бюджет и город: ",
      "obo": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу обсудить сотрудничество. Мой бюджет и город: ",
      "flipping": "Здравствуйте, Сауле! Интересует флиппинг под ключ. Бюджет и город: ",
      "soprovozhdenie": "Здравствуйте, Сауле! Интересует сопровождение или наставничество по флиппингу. Моя ситуация: ",
      "investicii": "Здравствуйте, Сауле! Интересуют инвестиции в недвижимость Астаны. Бюджет и срок: ",
      "pereprodazha": "Здравствуйте, Сауле! Нужно продать квартиру. ЖК, район и состояние квартиры: ",
      "remont": "Здравствуйте, Сауле! Интересует ремонт под ключ. Объект, площадь и город: ",
      "kval": "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу обсудить инвестиции в недвижимость."
    },
    en: {
      "default": "Hello Saule! I am writing from the Romance City website. I would like a free consultation on flipping. My budget and city: ",
      "hero": "Hello Saule! I am writing from the Romance City website. I would like a free consultation on flipping. My budget and city: ",
      "menu": "Hello Saule! I am writing from the Romance City website. I would like a free consultation. My question: ",
      "sticky": "Hello Saule! I am writing from the Romance City website. I would like a free consultation. My question: ",
      "kontakty": "Hello Saule! I am writing from the Romance City website. I would like a free consultation. My budget and city: ",
      "obo": "Hello Saule! I am writing from the Romance City website. I would like to discuss working together. My budget and city: ",
      "flipping": "Hello Saule! I am interested in turnkey flipping. Budget and city: ",
      "soprovozhdenie": "Hello Saule! I am interested in deal support or mentoring in flipping. My situation: ",
      "investicii": "Hello Saule! I am interested in investing in Astana real estate. Budget and timeline: ",
      "pereprodazha": "Hello Saule! I need to sell an apartment. Complex, district and condition: ",
      "remont": "Hello Saule! I am interested in turnkey renovation. Property, area and city: ",
      "kval": "Hello Saule! I am writing from the Romance City website. I would like to discuss real estate investment."
    }
  };
  var KV = {
    ru: { b: "Бюджет", c: "Цель", none: "Выберите бюджет и цель - сообщение соберётся автоматически. Пн-сб 09:00-20:00.", ready: "В сообщении: " },
    en: { b: "Budget", c: "Goal", none: "Choose a budget and a goal - the message is assembled automatically. Mon-Sat 09:00-20:00.", ready: "In the message: " }
  };
  function kvPick(k) { var b = doc.querySelector('.chips [data-kv="' + k + '"][aria-checked="true"]'); return b ? b.textContent.trim() : ""; }
  function kvText() {
    var L = KV[LANG] || KV.ru, parts = [], b = kvPick("b"), c = kvPick("c");
    if (b) parts.push(L.b + ": " + b);
    if (c) parts.push(L.c + ": " + c);
    return parts.join(". ");
  }
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
    if (key === "kval") { var kv = kvText(); text = text + (kv ? " " + kv + "." : "") + " "; }
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

  /* ---------- Сигнатура «план заселяется»: --open на .ph, остальное делает CSS ----------
     0 - комнаты плана закрыты тоном, стены не вычерчены; 1 - кадр чистый. */
  function setO(ph, o, force) {
    o = clamp(o);
    if (!force && ph._o !== undefined && Math.abs(ph._o - o) < 0.002) return;
    ph._o = o;
    ph.style.setProperty("--open", o.toFixed(4));
  }
  var phs = [].slice.call(doc.querySelectorAll(".ph[data-plan]"));
  phs.forEach(function (ph) { setO(ph, REDUCED ? 1 : 0, true); });

  /* ---------- Плиты ---------- */
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
    var kf = 1 - Math.pow(1 - 0.15, dt / 16.7);
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
      else open = REDUCED ? 1 : (flow ? clamp((enter - 0.2) / 0.5) : clamp((enter - 0.3) / 0.55));
      if (s.open < 0 || REDUCED || isHero) s.open = open;
      else {
        s.open += (open - s.open) * kf;
        if (Math.abs(open - s.open) > 0.002) moving = true; else s.open = open;
      }
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", (isHero ? easeOut(stay) : stay).toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      var plate = pw.firstElementChild;
      if (!s.ph) s.ph = [].slice.call(pw.querySelectorAll(".ph[data-plan]"));
      for (var c = 0; c < s.ph.length; c++) setO(s.ph[c], smooth(s.open));
      if (plate) plate.classList.toggle("gone", exit >= 1 && !flow);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt, .hero-txt");
      var on = isHero ? INTRO > 0.25 : (flow ? enter > 0.22 : enter > 0.6);
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
      lentaState();
    } else if (!TOUCH) { VH = W.innerHeight; }
    onScroll();
  });
  /* интро героя: план вычерчивается и заселяется за 1.6 с; пропускается при хэше или прокрутке */
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = smooth((ts - introStart) / 1600);
    update(ts);
    if (INTRO < 1) requestAnimationFrame(runIntro); else { INTRO = 1; update(); }
  }

  /* ---------- Герой: до/после одной квартиры. Ручка тянется пальцем, мышью и клавиатурой ---------- */
  var cmp = doc.getElementById("cmp"), cmpH = cmp && cmp.querySelector(".cmp-handle"), cmpDrag = false;
  function setCmp(x) {
    if (!cmp) return;
    x = clamp(x, 0, 100);
    cmp.style.setProperty("--x", x.toFixed(2) + "%");
    cmpH.setAttribute("aria-valuenow", String(Math.round(x)));
  }
  function cmpMove(e) {
    var r = cmp.getBoundingClientRect();
    setCmp((e.clientX - r.left) / r.width * 100);
  }
  if (cmp) {
    cmp.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      cmpDrag = true; cmp.classList.add("drag");
      try { cmp.setPointerCapture(e.pointerId); } catch (err) {}
      cmpMove(e); e.preventDefault();
    });
    cmp.addEventListener("pointermove", function (e) { if (cmpDrag) cmpMove(e); });
    var cmpUp = function () { cmpDrag = false; cmp.classList.remove("drag"); };
    cmp.addEventListener("pointerup", cmpUp); cmp.addEventListener("pointercancel", cmpUp); cmp.addEventListener("lostpointercapture", cmpUp);
    cmpH.addEventListener("keydown", function (e) {
      var x = parseFloat(cmpH.getAttribute("aria-valuenow")) || 0, step = 4;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") setCmp(x - step);
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") setCmp(x + step);
      else if (e.key === "PageDown") setCmp(x - 15);
      else if (e.key === "PageUp") setCmp(x + 15);
      else if (e.key === "Home") setCmp(0);
      else if (e.key === "End") setCmp(100);
      else return;
      e.preventDefault();
    });
    /* подсказка жеста при первом показе: ручка сама проезжает 50 -> 75 -> 35 -> 50 за 1,6 с (ease-in-out);
       при хэше, прокрутке или reduced-motion - стоит посередине */
    setCmp(50);
    if (INTRO < 1 && !REDUCED) {
      var segs = [[50, 75, 500], [75, 35, 600], [35, 50, 500]], cmpT0 = 0, easeIO = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
      var cmpHint = function (ts) {
        if (cmpDrag) return;
        if (!cmpT0) cmpT0 = ts;
        var t = ts - cmpT0 - 400, acc = 0, done = true;
        for (var i = 0; i < segs.length; i++) {
          if (t < acc) { setCmp(segs[i][0]); done = false; break; }
          if (t < acc + segs[i][2]) { setCmp(segs[i][0] + (segs[i][1] - segs[i][0]) * easeIO((t - acc) / segs[i][2])); done = false; break; }
          acc += segs[i][2];
        }
        if (done) setCmp(50); else requestAnimationFrame(cmpHint);
      };
      requestAnimationFrame(cmpHint);
    }
  }

  /* ---------- Квалификатор: чипы бюджета и цели, итог - в текст WhatsApp ---------- */
  var kvSum = doc.getElementById("kv-sum");
  function kvUpdate() {
    if (!kvSum) return;
    var L = KV[LANG] || KV.ru, t = kvText();
    kvSum.textContent = t ? L.ready + t + "." : L.none;
  }
  doc.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.chips [role="radio"]') : null;
    if (!b) return;
    var k = b.getAttribute("data-kv"), on = b.getAttribute("aria-checked") === "true";
    [].forEach.call(doc.querySelectorAll('.chips [data-kv="' + k + '"]'), function (x) { x.setAttribute("aria-checked", "false"); });
    if (!on) b.setAttribute("aria-checked", "true");
    kvUpdate();
  });

  /* ---------- Видео: немая петля по видимости, полный ролик по клику в модалке ---------- */
  var vbox = doc.querySelector(".vid-box"), vloop = vbox && vbox.querySelector(".vid-loop");
  if (vbox && vloop && "IntersectionObserver" in W) {
    vloop.addEventListener("playing", function () { vbox.classList.add("is-live"); });
    new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) {
          if (!vloop.getAttribute("src")) vloop.setAttribute("src", vloop.getAttribute("data-src"));
          var p = vloop.play(); if (p && p.catch) p.catch(function () {});
        } else { vloop.pause(); }
      });
    }, { threshold: 0.55 }).observe(vbox);
  }
  var vmodal = doc.getElementById("vmodal"), vfull = doc.getElementById("vfull"), vplay = doc.querySelector(".vid-play"), vLast = null;
  function vClose() {
    if (!vmodal || !vmodal.classList.contains("open")) return;
    vmodal.classList.remove("open"); vmodal.setAttribute("aria-hidden", "true"); doc.body.classList.remove("modal-open");
    if (vfull) { vfull.pause(); vfull.removeAttribute("src"); vfull.load(); }
    if (vLast) { try { vLast.focus({ preventScroll: true }); } catch (e) {} }
  }
  if (vplay && vmodal && vfull) {
    vplay.addEventListener("click", function () {
      vLast = vplay;
      vfull.setAttribute("src", vplay.getAttribute("data-full"));
      vmodal.classList.add("open"); vmodal.setAttribute("aria-hidden", "false"); doc.body.classList.add("modal-open");
      var p = vfull.play(); if (p && p.catch) p.catch(function () {});
      setTimeout(function () { try { vfull.focus({ preventScroll: true }); } catch (e) {} }, 50);
    });
    vmodal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) vClose(); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") vClose(); });
  }

  /* ---------- Кадры вне плит (обо мне): раскрытие по видимости ---------- */
  var secPh = phs.filter(function (ph) { return !ph.closest(".pw"); });
  function openPh(ph) {
    if (ph._anim || (ph._o !== undefined && ph._o >= 0.999)) return;
    ph._anim = true;
    var t0 = 0;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = smooth((ts - t0) / 1500);
      setO(ph, p);
      if (p < 1) requestAnimationFrame(step); else ph._anim = false;
    }
    requestAnimationFrame(step);
  }

  /* ---------- fitText: обе строки заголовка героя одним кеглем ---------- */
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
    var min = Infinity;
    fits.forEach(function (el) { fitOne(el); var s = parseFloat(el.style.fontSize || getComputedStyle(el).fontSize); if (s < min) min = s; });
    fits.forEach(function (el) { el.style.fontSize = min.toFixed(1) + "px"; });
  }

  /* ---------- Лента объектов: шаг - одна карточка, стрелки гаснут на краях ---------- */
  var lenta = doc.getElementById("lenta");
  var larrs = [].slice.call(doc.querySelectorAll(".larr"));
  function lentaStep() {
    var li = lenta.querySelector("li");
    if (!li) return 300;
    var gap = parseFloat(getComputedStyle(lenta).columnGap || getComputedStyle(lenta).gap) || 0;
    return li.getBoundingClientRect().width + gap;
  }
  function lentaState() {
    if (!lenta) return;
    var max = lenta.scrollWidth - lenta.clientWidth;
    var none = max <= 1;
    larrs.forEach(function (b) {
      b.hidden = none;
      var d = +b.getAttribute("data-dir");
      b.disabled = d < 0 ? lenta.scrollLeft <= 1 : lenta.scrollLeft >= max - 1;
    });
  }
  if (lenta) {
    larrs.forEach(function (b) {
      b.addEventListener("click", function () {
        lenta.scrollBy({ left: lentaStep() * (+b.getAttribute("data-dir")), behavior: REDUCED ? "auto" : "smooth" });
      });
    });
    lenta.addEventListener("scroll", function () { if (!lenta._t) lenta._t = setTimeout(function () { lenta._t = 0; lentaState(); }, 80); }, { passive: true });
    lentaState();
  }

  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  I18N.en = {
    "meta.title": "Turnkey apartment flipping in Astana - Saule Isatayeva | Romance City",
    "meta.desc": "Turnkey apartment flipping: I find an apartment for your budget, renovate, furnish and sell it. You come only to buy and to close the sale. Apartments from 30 million KZT, a deal cycle from 3 months. Astana, investors from other cities are supported online.",
    "nav.fl": "Flipping",
    "nav.so": "Mentoring",
    "nav.in": "Investment",
    "nav.ob": "Properties",
    "nav.kak": "How it works",
    "nav.me": "About me",
    "nav.re": "Renovation",
    "nav.kont": "Contacts",
    "nav.gar": "Safety",
    "up.aria": "Romance City - to the top",
    "tel.aria": "Call +7 747 222 76 64",
    "ig.aria": "Saule Isatayeva on Instagram",
    "menu.aria": "Menu",
    "lenta.prev": "Previous",
    "lenta.next": "Next",
    "menu.wa": "Free consultation",
    "menu.note": "Astana, 4 Shamshi Kaldayakov St. Mon-Sat 09:00-20:00. Investors from other cities are supported online.",
    "hero.kicker": "Romance City real estate agency",
    "hero.t1": "Apartment flipping",
    "hero.t2": "turnkey in&nbsp;Astana",
    "hero.lead": "I find an apartment for your budget, renovate, furnish and sell it. You come only twice: when you buy the apartment and when you sell it.",
    "hero.cta1": "Free consultation",
    "hero.cta2": "How it works",
    "hero.ig": "My properties on Instagram →",
    "hero.alt": "Living room after renovation in Grand Monaco: crystal chandelier, light sofa, large window, herringbone parquet",
    "strip.a": "15 years in flipping",
    "strip.b": "a deal cycle from 3 months",
    "strip.c": "apartments from 30&nbsp;million&nbsp;KZT",
    "strip.d": "no upfront payment",
    "ga.h": "Your safety as an investor",
    "ga1.t": "The apartment is in your name",
    "ga1.d": "You buy it in your own name and remain the owner at every stage.",
    "ga2.t": "No money upfront",
    "ga2.d": "I take no prepayment for my work: I work for the result.",
    "ga3.t": "The documents stay with you",
    "ga3.d": "The apartment documents are not handed over to anyone.",
    "ga4.t": "No need to supervise the renovation",
    "ga4.d": "My team and I handle the renovation, furniture and viewings.",
    "dk.h": "I do not work with everyone.",
    "dk.h2": "I take on an apartment only when I am sure of the result.",
    "dk.lead": "In flipping, money is made not on a beautiful renovation but on sound decisions. That is why before the purchase I assess the layout, floor, location and renovation budget.",
    "dk1.t": "Investors",
    "dk1.d": "You do not want to keep your money on a deposit. You buy the apartment, I take care of the rest.",
    "dk1.l": "Turnkey flipping",
    "dk2.t": "Flippers",
    "dk2.d": "You already resell apartments and want to scale. I help you choose properties, calculate costs and profit, and control the renovation.",
    "dk2.l": "Mentoring",
    "dk3.t": "Beginners",
    "dk3.d": "You want to learn flipping yourself. We go through your first deal together: from choosing the apartment to the sale.",
    "dk3.l": "Mentoring",
    "dk4.t": "From other cities",
    "dk4.d": "You do not live in Astana. I find an apartment for your budget, you fly in to buy it and to close the sale.",
    "dk4.l": "How it works",
    "fl.kicker": "Turnkey flipping",
    "fl.h": "From a bare apartment to a profitable sale",
    "fl.lead": "You buy an apartment with a bare finish. My team and I renovate it, furnish it and prepare it for sale, and when a buyer appears, we call you in for the deal.",
    "fl.l1": "Sourcing in complexes where buying for resale pays best",
    "fl.l2": "Renovation - usually 1-2 months",
    "fl.l3": "Made-to-order furniture, textiles and decor",
    "fl.l4": "Finding a buyer and negotiating",
    "fl.btn": "Ask about terms",
    "fl.link": "Five steps",
    "fl.cap": "Evolution residential complex, Astana: a one-bedroom apartment after renovation and furnishing",
    "fl.alt": "Kitchen-living room in the Evolution complex: ring chandelier, corner sofa, dining table, herringbone parquet",
    "so.h": "Deal support and mentoring",
    "so.lead": "For those who want to flip apartments on their own. One mistake in choosing a property can eat up all the profit before the renovation even starts, so we go through the first deal together.",
    "so.l1": "How to choose an apartment and buy at a good price",
    "so.l2": "Calculating costs and profit before the purchase",
    "so.l3": "Renovation control",
    "so.l4": "Preparing for sale and negotiating with buyers",
    "so.l5": "Online flipping master classes",
    "so.btn": "Discuss support",
    "so.cap": "Meeting a client: going through the complex floor plans",
    "so.alt": "Saule Isatayeva with a client at a round table in a sales office: brochures and floor plans",
    "in.h": "Investing in Astana real estate",
    "in.lead": "Astana builds more than any other city in Kazakhstan, which is why people invest here from other regions and from abroad. Choose a budget and a goal - WhatsApp opens with a ready message.",
    "kv.b": "Your budget",
    "kv.b1": "30-50 million KZT",
    "kv.b2": "50-80 million KZT",
    "kv.b3": "80+ million KZT",
    "kv.c": "Your goal",
    "kv.c1": "Earn on an apartment",
    "kv.c2": "Learn flipping",
    "kv.c3": "Scale my flipping",
    "kv.btn": "Discuss on WhatsApp",
    "kv.sum": "Choose a budget and a goal - the message is assembled automatically. Mon-Sat 09:00-20:00.",
    "kak.alt": "Kitchen-living room after renovation: crystal chandelier, floor-to-ceiling cabinets, herringbone parquet",
    "kak.kicker": "How it works",
    "kak.h": "Five steps from sourcing to sale",
    "kak.lead": "The whole deal cycle takes from 3 months. You take part in only two steps.",
    "s1.w": "Me",
    "s1.t": "I find the apartment",
    "s1.d": "For your budget, in a complex and location where it pays best to buy for resale.",
    "s2.w": "You",
    "s2.t": "You buy it in your name",
    "s2.d": "From that day the apartment is yours.",
    "s3.w": "Me",
    "s3.t": "I renovate",
    "s3.d": "Together with my team, usually in 1-2 months.",
    "s4.w": "Me",
    "s4.t": "I furnish and sell",
    "s4.d": "Furniture, textiles, decor. I list the apartment and show it to buyers.",
    "s5.w": "You",
    "s5.t": "You come to the deal and take the profit",
    "s5.d": "The apartment is sold, the profit is yours.",
    "kak.note": "I make the calculation for your budget before the purchase, at a free consultation.",
    "pe.h": "Selling apartments",
    "pe.lead": "I sell an apartment after renovation fully equipped: with furniture and appliances, so the buyer can bring their suitcases and move in. I show it myself and negotiate until the deal.",
    "pe.p1": "Partnership with BAZIS-A",
    "pe.p2": "No commission: 0&nbsp;KZT for the client",
    "pe.btn": "Discuss a sale",
    "vid.alt": "An apartment after renovation in Grand Monaco: living room with a crystal chandelier",
    "vid.aria": "Watch the tour of an apartment in Grand Monaco",
    "vid.btn": "Watch the tour",
    "vid.cap": "Grand Monaco, Astana: an apartment after renovation and furnishing",
    "vid.modal": "Apartment tour in Grand Monaco",
    "vid.close": "Close",
    "ob.h": "Properties after renovation",
    "ob.lead": "Apartments in Astana that we renovated, furnished and prepared for sale.",
    "ob.ig": "More properties on Instagram",
    "ob.ig2": "Agency: @romancecity.home",
    "ob1.c": "Evolution: kitchen-living room",
    "ob1.alt": "Evolution: kitchen-living room with a ring chandelier, light sofa and large windows",
    "ob2.c": "Evolution: kitchen",
    "ob2.alt": "Evolution: kitchen with mint fronts, built-in appliances and open shelving",
    "ob3.c": "Evolution: bedroom",
    "ob3.alt": "Evolution: bedroom with an upholstered bed and a floor-to-ceiling wardrobe",
    "ob4.c": "Evolution: bathroom",
    "ob4.alt": "Evolution: bathroom with a lit wall-hung vanity and a round mirror",
    "ob5.c": "Living room",
    "ob5.alt": "Living room: light sofa, floor-length curtains, crystal chandelier",
    "ob6.c": "Kitchen",
    "ob6.alt": "Kitchen: white floor-to-ceiling fronts, built-in oven, dining table",
    "ob7.c": "Bedroom",
    "ob7.alt": "Bedroom: ring chandelier, dressed bed, patterned wallpaper",
    "ob8.c": "Hallway",
    "ob8.alt": "Hallway: floor-to-ceiling cabinets, mouldings, checkerboard tiles",
    "ob9.c": "Grand Monaco: bedroom",
    "ob9.alt": "Bedroom: ring chandelier, large window overlooking the residential quarter",
    "ob10.c": "Grand Monaco: bathroom",
    "ob10.alt": "Bathroom: marble-look tiles, blue vanity, bathtub",
    "me.h": "Your guide in real estate",
    "me.lead": "I am Saule Isatayeva, founder of the Romance City real estate agency. I live in this residential complex myself and do renovations here.",
    "me.q": "In real estate it matters not just to buy an apartment but to see its potential before everyone else.",
    "me.l1": "35 years in business, 15 of them in flipping",
    "me.l2": "About 50 apartments a year",
    "me.l3": "Office in Astana, 4 Shamshi Kaldayakov St.",
    "me.cap": "Saule Isatayeva, founder of the Romance City agency",
    "me.alt": "Saule Isatayeva: black jacket, burgundy scarf",
    "me.btn": "Discuss working together",
    "me.ig": "My Instagram",
    "re.h": "Turnkey renovation",
    "re.lead": "Apartments, non-residential and commercial premises - from a bare finish to the finished result. Furniture is made to order.",
    "re.l1": "The full range of renovation work",
    "re.l2": "Electrics, plumbing, tiling, painting",
    "re.l3": "Cost and timing by agreement",
    "re.btn": "Get a renovation quote",
    "re.ig": "Renovations on Instagram →",
    "re.cap": "On site: checking the furniture against the design",
    "re.alt": "Saule Isatayeva and a craftsman on site checking the furniture drawings",
    "faq.h": "Frequently asked questions",
    "faq.alt": "Saule Isatayeva, portrait",
    "q1": "What budget do I need to start?",
    "a1": "Apartments from 30&nbsp;million&nbsp;KZT. I calculate the renovation and furniture budget for a specific apartment at a free consultation.",
    "q2": "How much can I earn?",
    "a2": "With the right approach, the profit on one apartment starts from 5&nbsp;million&nbsp;KZT. I make the calculation for your budget before the purchase.",
    "q3": "How long does a deal take?",
    "a3": "From 3 months from purchase to sale, of which the renovation usually takes 1-2 months. The cycle can be repeated several times a year.",
    "q4": "Do I need to pay upfront?",
    "a4": "No. I do not take money upfront: I work for the result.",
    "q5": "Whose name is the apartment in?",
    "a5": "Yours. The documents stay with you, and you are the owner at every stage.",
    "q6": "I do not live in Astana. Can we work together?",
    "a6": "Yes. I consult online and find an apartment for your budget. You fly in to buy it and to close the sale.",
    "kont.kicker": "Contacts",
    "kont.h": "Free consultation",
    "kont.lead": "Message me on WhatsApp or leave your number. We will go through your situation and budget and set out the next steps.",
    "kont.wa": "Message on WhatsApp",
    "kont.ig": "My Instagram",
    "kont.2gis": "Office on 2GIS",
    "kont.addr.t": "Address",
    "kont.addr": "Astana, 4 Shamshi Kaldayakov St.",
    "kont.hours.t": "Hours",
    "kont.hours": "Mon-Sat 09:00-20:00, Sunday closed",
    "kont.geo.t": "Coverage",
    "kont.online": "Astana, other cities online",
    "form.h": "Leave a request",
    "form.who": "Saule will reply personally",
    "form.name": "Name",
    "form.name.ph": "How should I address you",
    "form.phone": "Phone",
    "form.err": "Enter a phone number, at least 10 digits.",
    "form.msg": "Interested in",
    "form.msg.ph": "Turnkey flipping, budget 35 million KZT, Astana",
    "form.btn": "Send via WhatsApp",
    "form.note": "The request opens in WhatsApp with a ready text.",
    "thanks.h": "Thank you!",
    "thanks.p": "Your request has been sent to WhatsApp. I will reply during working hours: Mon-Sat, 09:00-20:00.",
    "foot.tag": "Turnkey apartment flipping in Astana - from sourcing to sale.",
    "foot.copy": "Saule Isatayeva",
    "sticky.call": "Call"
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
    if (typeof kvUpdate === "function") kvUpdate();
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
        if (W.SITE_KK_KV) KV.kk = W.SITE_KK_KV;
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
    [].forEach.call(el.querySelectorAll(".ph[data-plan]"), openPh);
  }
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (!x.isIntersecting) return; reveal(x.target); io.unobserve(x.target); });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    secPh.forEach(function (ph) { io.observe(ph); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) reveal(el); }); }, 1500);
  } else { rv.forEach(function (el) { el.classList.add("in"); }); secPh.forEach(function (ph) { setO(ph, 1, true); }); }

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
      setTimeout(function () { goTo(id, true); update(); }, 40);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(start); else start();
  W.addEventListener("load", function () { fitAll(); update(); lentaState(); });
})();
