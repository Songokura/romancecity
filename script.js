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
      remont: "Здравствуйте, Сауле! Интересует ремонт под ключ. Объект, площадь и город: ",
      kval: "Здравствуйте, Сауле! Пишу с сайта Romance City. Хочу обсудить инвестиции в недвижимость."
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
      remont: "Hello Saule! I am interested in turnkey renovation. Property, area and city: ",
      kval: "Hello Saule! I am writing from the Romance City website. I would like to discuss real estate investment."
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
    "meta.title": "Turnkey apartment flipping in Astana - from sourcing to sale | Romance City",
    "meta.desc": "Turnkey apartment flipping from sourcing to sale: renovation, staging and sale on Krisha.kz. Properties from 30 million KZT, no upfront payment, a guaranteed result. 15 years in flipping, about 50 apartments a year. Astana and all of Kazakhstan online.",
    "nav.fl": "Flipping", "nav.so": "Mentoring", "nav.in": "Investment", "nav.ob": "Properties", "nav.kak": "How it works", "nav.me": "About me", "nav.re": "Renovation", "nav.kont": "Contacts",
    "up.aria": "Romance City - to the top", "tel.aria": "Call +7 707 699 7664", "ig.aria": "Romance City on Instagram", "menu.aria": "Menu",
    "lenta.prev": "Previous", "lenta.next": "Next",
    "menu.wa": "Free consultation",
    "menu.note": "Astana, 4 Shamshi Kaldayakov St. Mon-Sat 09:00-20:00. Across Kazakhstan - online.",
    "hero.kicker": "Astana and all of Kazakhstan · since&nbsp;2011",
    "hero.t1": "Apartment flipping", "hero.t2": "turnkey&nbsp;- from sourcing to&nbsp;sale",
    "hero.lead": "You buy an apartment from 30&nbsp;million&nbsp;KZT, I handle the renovation, staging and sale and guarantee the result. 15&nbsp;years in flipping, about 50&nbsp;apartments a year.",
    "hero.cta1": "Free consultation", "hero.cta2": "How it works", "hero.ig": "Properties on Instagram →",
    "strip.a": "Since 2011", "strip.b": "about 50 apartments a year", "strip.c": "properties from 30&nbsp;million&nbsp;KZT", "strip.d": "no upfront payment",
    "dk.h": "I do not work with everyone.", "dk.h2": "I take a property only when I am sure of the result.",
    "dk.lead": "I assess every apartment before the purchase. I take on properties from 30&nbsp;million&nbsp;KZT.",
    "dk1.t": "Investors", "dk1.d": "You want to invest in real estate and earn. You buy the apartment, I take it through to the sale.", "dk1.l": "Turnkey flipping",
    "dk2.t": "Flippers", "dk2.d": "You already resell apartments and want to scale: more properties, a crew, a move to a higher class of housing.", "dk2.l": "Mentoring",
    "dk3.t": "Beginners", "dk3.d": "You know nothing about flipping yet but want to learn to do it yourself. Full support on your first property.", "dk3.l": "Learning on your property",
    "fl.kicker": "Turnkey flipping", "fl.h": "A business of reselling apartments",
    "fl.lead": "You invest in real estate, I take on every stage: sourcing a liquid apartment, renovation, furniture and staging, sale on Krisha.kz and other platforms.",
    "fl.l1": "No renovation on your side", "fl.l2": "No searching for buyers", "fl.l3": "You only come to the closing",
    "fl.btn": "Get the terms", "fl.link": "Five steps of the work", "fl.cap": "Apartment in AUEZ residential complex, Astana, after renovation",
    "fl.alt": "Kitchen-dining room after renovation in AUEZ residential complex: light cabinets, ring chandelier, herringbone parquet",
    "so.h": "Mentoring for flippers and beginners",
    "so.lead": "For those who want to resell apartments themselves: I go through the whole property with you, from choosing the apartment to the closing.",
    "so.l1": "Help choosing the apartment", "so.l2": "A renovation crew", "so.l3": "Listing for sale and negotiations with buyers",
    "so.btn": "Discuss mentoring", "so.cap": "Meeting a client at the office, 4 Kaldayakov St.",
    "so.alt": "Saule Isatayeva with a client at a desk in the office: floor plans and residential complex brochures",
    "in.h": "Real estate investment",
    "in.lead": "Choose a budget and a goal - WhatsApp opens with a ready message. The consultation is free, I work with investors from all over Kazakhstan online.",
    "kv.b": "Your budget", "kv.b1": "30-50 million KZT", "kv.b2": "50-80 million KZT", "kv.b3": "80+ million KZT",
    "kv.c": "Your goal", "kv.c1": "Earn on an apartment", "kv.c2": "Learn flipping", "kv.c3": "Scale up",
    "kv.btn": "Discuss on WhatsApp", "kv.sum": "Choose a budget and a goal - the message is assembled automatically. Mon-Sat 09:00-20:00.",
    "kak.alt": "Bright living room with parquet, a rug and upholstered furniture",
    "kak.kicker": "How it works", "kak.h": "Five steps from sourcing to sale",
    "kak.lead": "Your part is buying the apartment and the closing. I run everything else, there is no need to supervise.",
    "s1.w": "Me", "s1.t": "I source the apartment", "s1.d": "I analyse the market and choose liquid properties with high profit potential.",
    "s2.w": "You", "s2.t": "You buy it in your name", "s2.d": "The apartment is your property from day one.",
    "s3.w": "Me", "s3.t": "I do the renovation, furniture and staging", "s3.d": "Renovation, furnishing, decor and preparation for the sale.",
    "s4.w": "Me", "s4.t": "I sell through Krisha.kz", "s4.d": "I list and promote the apartment on Krisha.kz and other platforms and negotiate with buyers.",
    "s5.w": "You", "s5.t": "You come to the closing and take the profit", "s5.d": "On past properties: <span class=\"nw\">+30-40%</span> in 3-6 months.",
    "kak.note": "The profit estimate for your apartment comes before the purchase, at a free consultation.",
    "pe.h": "Apartment resale",
    "pe.lead": "I list and promote the finished apartment on Krisha.kz and other platforms and run viewings and negotiations with buyers up to the closing.",
    "pe.p1": "Partnership with BAZIS-A agency", "pe.p2": "No commission: 0&nbsp;KZT for the client",
    "pe.btn": "Discuss a sale",
    "vid.alt": "Gorodskoy Romans residential complex in Astana: courtyard facade, green awnings", "vid.aria": "Watch the video from the property", "vid.btn": "Watch the video", "vid.cap": "Gorodskoy Romans, Astana: video from the property", "vid.modal": "Video from the property", "vid.close": "Close",
    "ob.h": "Properties after renovation and staging",
    "ob.lead": "A 63 m² apartment in AUEZ residential complex, Astana: renovation, furniture and preparation for sale.",
    "ob.ig": "More properties on Instagram",
    "ob2.alt": "Room: crystal chandelier, floor-length curtains, parquet", "ob2.c": "Room",
    "ob4.alt": "Hallway: white door, built-in wardrobe, light line", "ob4.c": "Hallway",
    "ob5.alt": "Kitchen: lit cabinets, mixer tap, worktop", "ob5.c": "Kitchen: cabinets and sink",
    "ob7.alt": "Bathroom: green vanity, round lit mirror", "ob7.c": "Bathroom",
    "me.h": "I work for the result",
    "me.lead": "Saule Isatayeva, a professional flipper. Since 2011 I have taken apartments from sourcing to sale, now about 50 properties a year.",
    "me.q": "Trust matters most to me. That is why I choose the properties and the people I work with, and I answer for the result.",
    "me.l1": "Investors from every city of Kazakhstan - we work online", "me.l2": "Office in Astana, 4 Shamshi Kaldayakov St.",
    "me.cap": "Saule Isatayeva, professional flipper since 2011", "me.2gis": "Office on 2GIS", "me.btn": "Discuss cooperation", "me.alt": "Saule Isatayeva, flipper with 15 years of experience: beige jacket, pearls",
    "re.h": "Turnkey renovation",
    "re.lead": "Apartments, non-residential and commercial premises - from shell finish to the final result.",
    "re.l1": "Full range of renovation work", "re.l2": "Electrics, plumbing, tiling, painting", "re.l3": "Terms by agreement",
    "re.btn": "Estimate a renovation", "re.ig": "Renovations on Instagram →", "re.cap": "Shell finish: the start of work",
    "re.alt": "A worker levelling a wall in an apartment at the shell finish stage",
    "faq.h": "Frequently asked questions", "faq.alt": "Saule Isatayeva, portrait in a round frame",
    "q1": "What amount can I start with?", "a1": "With apartments from 30&nbsp;million&nbsp;KZT. I calculate the renovation and staging budget for the specific property at a free consultation.",
    "q2": "Do I need to pay in advance?", "a2": "No. I take no upfront payment: I work for the result and guarantee it.",
    "q3": "Whose name is the apartment registered in?", "a3": "Yours. Documents and keys are not handed to anyone.",
    "q4": "How long is the cycle and what is the profit?", "a4": "On past properties: 3-6 months and <span class=\"nw\">+30-40%</span> on the investment. I calculate your apartment before the purchase.",
    "q5": "Can we work if I am not in Astana?", "a5": "Yes, I work with investors from all over Kazakhstan online.",
    "kont.kicker": "Contacts", "kont.h": "Free consultation",
    "kont.lead": "Write on WhatsApp or leave your number - I will assess your budget and property and explain how we will work.",
    "kont.wa": "Write on WhatsApp", "kont.2gis": "Office on 2GIS",
    "kont.addr.t": "Address", "kont.addr": "Astana, 4 Shamshi Kaldayakov St.", "kont.hours.t": "Hours", "kont.hours": "Mon-Sat 09:00-20:00, Sunday off", "kont.geo.t": "Geography", "kont.online": "Astana and all of Kazakhstan - online",
    "form.h": "Leave a request", "form.who": "Saule replies personally", "form.name": "Name", "form.name.ph": "How should I address you", "form.phone": "Phone", "form.err": "Enter a phone number of at least 10 digits.",
    "form.msg": "Interested in", "form.msg.ph": "Turnkey flipping, budget 35 million KZT, Astana", "form.btn": "Send via WhatsApp", "form.note": "The request opens in WhatsApp with a ready text.",
    "thanks.h": "Thank you!", "thanks.p": "The request has gone to WhatsApp. I will reply during working hours, Mon-Sat 09:00-20:00.",
    "foot.tag": "Turnkey apartment flipping - from sourcing to sale. Astana and all of Kazakhstan.", "foot.copy": "Saule Isatayeva", "sticky.call": "Call",
  "nav.gar": "Guarantees",
  "ga.h": "A guaranteed result and complete security",
  "ga1.t": "No upfront payment",
  "ga1.d": "There is no prepayment: I work for the result.",
  "ga2.t": "A guaranteed result",
  "ga2.d": "I only take on apartments whose result I am sure of.",
  "ga3.t": "Documents and keys stay with no one else",
  "ga3.d": "The apartment is registered in your name, nothing passes to third parties.",
  "ga4.t": "No need to supervise",
  "ga4.d": "I run the renovation, the sale and the negotiations with buyers myself.",
  "hero.alt": "Living room after renovation and staging: chandelier, light furniture, panoramic windows",
  "ob1.alt": "AUEZ residential complex in Astana: facade and courtyard",
  "ob1.c": "AUEZ residential complex, Astana",
  "ob3.alt": "Bedroom: ring chandelier, bed, floor-length curtains",
  "ob3.c": "Bedroom",
  "ob6.alt": "AUEZ residential complex lobby: marble wall",
  "ob6.c": "Residential complex lobby"

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
