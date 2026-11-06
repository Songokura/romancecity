/* Romance City. Герой «пустая -> обставленная» (наклонный разрез), до/после в ремонте, движение по прокрутке (GSAP + ScrollTrigger, Lenis на десктопе), меню, якоря, язык, лента, видео, форма в WhatsApp. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = W.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var LANG = "ru";
  var MOBILE = W.matchMedia("(max-width:760px)").matches;
  var VW = W.innerWidth;
  var G = W.gsap, ST = W.ScrollTrigger;
  var MOTION = !REDUCED && !!G && !!ST;
  if (MOTION) G.registerPlugin(ST);

  /* ---------- Плавная прокрутка: Lenis только для мыши ---------- */
  var lenis = null;
  if (MOTION && FINE && W.Lenis) {
    lenis = new W.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  }

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
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add("open"); }); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 80);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 470);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря: секция - от своего верха (шапка лежит на её верхнем отступе), блок внутри - под шапкой ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdrH")) || 84; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.id === "top") return 0;
    if (el.classList.contains("sec")) return r;
    return r - HDR() - 16;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    var y = Math.max(0, targetTop(el));
    if (lenis) { lenis.scrollTo(y, instant ? { immediate: true, force: true } : { duration: 1.2, force: true, easing: function (t) { return 1 - Math.pow(1 - t, 4); } }); return true; }
    if (instant || REDUCED) W.scrollTo(0, y);
    else W.scrollTo({ top: y, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id || !doc.getElementById(id)) return;
    e.preventDefault();
    var wasOpen = doc.body.classList.contains("menu-open");
    setMenu(false, false);
    setTimeout(function () {
      goTo(id, false);
      try { history.pushState(null, "", "#" + id); } catch (err) {}
    }, wasOpen ? 140 : 0);
  });

  /* ---------- Шапка, липкая панель ---------- */
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty"), hdr = doc.getElementById("hdr");
  var ticking = false;
  function onScrollUi() {
    ticking = false;
    var y = W.pageYOffset, H = W.innerHeight;
    if (sticky) {
      var show = y > H * 0.55;
      if (kont && kont.getBoundingClientRect().top < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", y > 12);
  }
  W.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScrollUi); } }, { passive: true });

  /* ---------- Заголовок героя: строк не больше нужного, длинное слово не вылезает (шаг 5%) ---------- */
  var h1m = doc.querySelector(".h1-main");
  function fitH1() {
    if (!h1m) return;
    h1m.style.fontSize = "";
    var size = parseFloat(getComputedStyle(h1m).fontSize), n = 0;
    var maxLines = MOBILE ? 5 : (W.innerWidth <= 1100 ? 3 : (LANG === "kk" ? 3 : 2));
    function bad() {
      var lh = parseFloat(getComputedStyle(h1m).lineHeight) || size;
      return h1m.scrollWidth > h1m.clientWidth + 1 || h1m.offsetHeight > lh * maxLines + 4;
    }
    while (bad() && n < 16) { size *= 0.95; h1m.style.fontSize = size.toFixed(1) + "px"; n++; }
  }
  /* телефон: лента комнат забирает всё место над кнопками героя, кнопки остаются в первом экране */
  function sizeBand() {
    var bandEl = doc.getElementById("band"), cta = doc.querySelector(".hero-cta");
    if (!bandEl || !cta) return;
    bandEl.style.minHeight = "";
    if (!MOBILE) return;
    var below = cta.getBoundingClientRect().bottom - bandEl.getBoundingClientRect().bottom;
    var free = W.innerHeight - below - 18;
    bandEl.style.minHeight = Math.round(Math.max(150, Math.min(free, W.innerHeight * 0.48))) + "px";
  }

  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  I18N.en = {
    "hero.ak": "Kitchen-living room in Grand Monaco: crystal chandelier, made-to-order kitchen, herringbone parquet",
    "hero.ab": "Bedroom in Grand Monaco: upholstered bed, window to the courtyard",
    "hero.r0": "Kitchen-living room",
    "hero.r1": "Living room",
    "hero.r2": "Bedroom",
    "hero.zk": "Grand Monaco, Astana: apartment after renovation and furnishing",
    "meta.title": "Turnkey Apartment Flipping in Astana - Saule Isatayeva | Romance City",
    "meta.desc": "Turnkey apartment flipping in Astana: I select an apartment for your budget from 30 million tenge, renovate and furnish it, and find a buyer. The apartment is registered in your name, no prepayment. Renovation 1-2 months, full cycle from 3 months. Investors from other cities are handled online.",
    "up.aria": "Romance City - to the top",
    "nav.kak": "How it works", "nav.podbor": "Selection", "nav.remont": "Renovation", "nav.prodazha": "Sale", "nav.obekty": "Properties", "nav.me": "About me", "nav.faq": "FAQ", "nav.kont": "Contacts", "nav.bez": "Security",
    "tel.aria": "Call +7 747 222 76 64", "ig.aria": "Saule Isatayeva on Instagram", "hdr.wa": "Message on WhatsApp", "menu.aria": "Menu",
    "menu.note": "Astana, 4 Shamshi Kaldayakov St. Mon-Sat 09:00-20:00. Investors from other cities are handled online.", "menu.call": "Call",
    "hero.kicker": "ASTANA · TURNKEY FLIPPING · SINCE 2011",
    "hero.t1": "<span class=\"w\">Turnkey</span> apartment flipping in&nbsp;Astana",
    "hero.t2": "from bare walls to a profitable sale",
    "hero.lead": "You buy an apartment in your own name in a new building in Astana. My team and I renovate it in <span class=\"nw\">1-2&nbsp;months</span>, furnish it and find a buyer. <span class=\"m-less\">The full cycle takes from 3&nbsp;months, and you come only twice: to buy and to sell.</span>",
    "hero.cta1": "Get an estimate on WhatsApp", "hero.cta2": "How it works", "hero.ig": "My apartments on Instagram →", "hero.hint": "Scroll: step inside the apartment",
    "wall.aria": "Apartments after renovation",
    "hero.a1": "Facade of the Gorodskoy Romans residential quarter in Astana",
    "hero.a2": "Kitchen-living room after renovation in Evolution: ring chandelier, grey sofa",
    "hero.cap": "Grand Monaco, Astana: living room after renovation and furnishing",
    "hero.a3": "Kitchen-living room after renovation in Grand Monaco: crystal chandelier, made-to-order kitchen, herringbone parquet",
    "hero.a4": "Living room of a finished apartment: beige sofa, floor-length curtains, crystal chandelier",
    "hero.a5": "Bedroom in Grand Monaco: bed with an upholstered headboard, window to the courtyard",
    "kak.h": "How it works",
    "kak.s1": "I select an apartment", "kak.s2": "You buy it in your name", "kak.s3": "I renovate", "kak.s4": "I furnish and prepare for sale", "kak.s5": "I find a buyer, you receive the profit",
    "kak.note": "Renovation usually takes 1-2&nbsp;months, the full deal cycle from 3&nbsp;months. I calculate the deal for your budget before the purchase, at a free consultation.",
    "pb.k": "--- SELECTION", "pb.h": "Selecting an apartment for resale",
    "pb.lead": "I choose an apartment from the developer at the construction stage, while the best floors and layouts are still available. By the time the building is handed over, such options remain only with those who came in earlier.",
    "pb.l1": "Residential complexes and locations in Astana where an apartment is most profitable to buy for resale",
    "pb.l2": "Layout, floor and renovation budget - assessed before the purchase",
    "pb.l3": "One- and two-bedroom apartments with a kitchen-living room: that is where the demand is now",
    "pb.l4": "Apartments from 30&nbsp;million tenge, bare-wall finish from the developer",
    "pb.partner": "Partnership with the developer BAZIS-A: Grand Monaco apartments in bare-wall finish with documents, no commission for the client.",
    "pb.btn": "Select an apartment",
    "pb.alt": "Saule Isatayeva at a table with a brochure and an apartment plan",
    "pb.cap": "At the meeting: the layout and the complex brochure before purchase",
    "re.alt": "A craftsman assembling made-to-order furniture in an apartment under renovation",
    "re.cap": "Assembling made-to-order furniture on site",
    "re.k": "--- RENOVATION AND FURNITURE", "re.h": "Renovation and furnishing in <span class=\"nw\">1-2&nbsp;months</span>",
    "re.lead": "My team and I run the renovation. Furniture is made to order for the apartment's design, followed by textiles, decor and cleaning - the apartment is ready for viewings.",
    "re.l1": "Full range of renovation work: electrics, plumbing, tiling, painting",
    "re.l2": "Kitchen, wardrobes and walk-in closets - made to order for the layout",
    "re.l3": "Sofa, bed, textiles, decor: the apartment is sold fully furnished",
    "re.l4": "You do not need to visit the site",
    "re.sep": "I also do turnkey renovation as a separate service: apartments, non-residential and commercial premises, from bare walls to the finished result. Cost and timing are agreed individually.",
    "re.btn": "Get a renovation estimate",
    "pr.k": "--- SALE", "pr.h": "I help you sell the finished apartment with furniture and appliances",
    "pr.lead": "After the renovation I find a buyer for the fully furnished apartment: they take their suitcases and move in. I list it on Krisha.kz and other platforms, show the apartment and negotiate until the deal is closed.",
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
    "me.alt": "Saule Isatayeva, portrait in an armchair by the window",
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
    "fq.q7": "What do you do yourself, and what does the team do?", "fq.a7": "Apartment selection, calculation and finding a buyer are handled by me. Renovation, furniture and viewings - by my team and me.",
    "kt.k": "--- CONTACTS", "kt.h": "Free consultation",
    "kt.lead": "Message me on WhatsApp or leave your number. We will go through your situation and budget and define the next steps.",
    "form.name": "Name", "form.name.ph": "How should I address you", "form.phone": "Phone", "form.err": "Enter a phone number: at least 10 digits.",
    "form.budget": "Budget and city", "form.budget.ph": "Optional", "form.btn": "Send via WhatsApp", "form.note": "After sending, WhatsApp will open with a ready message.",
    "thanks.h": "Thank you", "thanks.p": "Your request has gone to WhatsApp. I will reply during working hours: Mon-Sat, 09:00-20:00.",
    "kt.wa": "Message on WhatsApp", "kt.ig": "My Instagram", "kt.gis": "Office on 2GIS",
    "kt.adr.t": "Address", "kt.adr": "Astana, 4 Shamshi Kaldayakov St.", "kt.hrs.t": "Hours", "kt.hrs": "Mon-Sat 09:00-20:00, Sunday closed", "kt.geo.t": "Coverage", "kt.geo": "Astana; other cities - online",
    "foot.tag": "Turnkey apartment flipping in Astana: selection, renovation, furnishing, sale.",
    "foot.copy": "Saule Isatayeva, Gorodskoy Romans real estate agency",
    "sticky.call": "Call", "sticky.aria": "Quick contact", "close.aria": "Close",
    "cy.t1": "Purchase", "cy.p1": "You come: the deal in your name", "cy.t2": "Renovation and furniture", "cy.p2": "1-2&nbsp;months, no site visits needed", "cy.t3": "Sale", "cy.p3": "You come: the deal and your profit",
    "km.street": "Shamshi Kaldayakov St.", "km.house": "Romance City office, building 4", "km.aria": "Diagram: office at 4 Shamshi Kaldayakov St.",
    "hero.tag0": "Empty apartment",
    "hero.tag1": "Furnished and ready for sale",
    "hero.seal": "renovation 1-2 months · custom furniture · sale ·",
    "mq.t": "Selection · Renovation · Furniture · Sale · Turnkey flipping ·",
    "re.drag": "Drag the handle: before and after furnishing",
    "re.balt": "Living room after renovation, without furniture",
    "re.aalt": "Living room in Grand Monaco with furniture: light sofa, crystal chandelier, large window",
    "pb.facalt": "Courtyard of a residential complex in Astana",
    "kt.alt": "Saule Isatayeva full-length by a city-view panel"
  };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { var k = el.getAttribute("data-i"); if (RU[k] == null) RU[k] = el.innerHTML; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { var k = el.getAttribute("data-i-aria"); if (RU[k] == null) RU[k] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function strip(html) { var d = doc.createElement("div"); d.innerHTML = html; return d.textContent; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) { if (el.namespaceURI === "http://www.w3.org/2000/svg") el.textContent = strip(v); else el.innerHTML = v; } });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", strip(v)); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("romancecity-lang", lang); } catch (e) {}
    splitQuote();
    var after = function () { fitH1(); sizeBand(); lentaState(); if (MOTION) ST.refresh(); };
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(after); else after();
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

  /* ---------- Цитата: слова загораются по прокрутке ---------- */
  var quote = doc.getElementById("quote"), qWords = [];
  function splitQuote() {
    if (!quote) return;
    var txt = quote.textContent;
    quote.innerHTML = txt.split(/(\s+)/).map(function (w) { return /^\s+$/.test(w) || !w ? w : '<span class="qw">' + w + "</span>"; }).join("");
    qWords = [].slice.call(quote.querySelectorAll(".qw"));
    if (MOTION) quote.classList.add("q-on");
    paintQuote(quote._p || 0);
  }
  function paintQuote(p) {
    if (!quote) return;
    quote._p = p;
    var n = Math.round(p * qWords.length);
    for (var i = 0; i < qWords.length; i++) qWords[i].classList.toggle("on", i < n);
  }

  /* ---------- Герой: наклонный разрез проходит справа налево, пустые комнаты становятся обставленными ---------- */
  var hero = doc.getElementById("top"), band = doc.getElementById("band"), afterL = doc.getElementById("after");
  var blade = doc.getElementById("blade"), knob = band ? band.querySelector(".knob") : null;
  var fis = afterL ? [].slice.call(afterL.querySelectorAll(".fi")) : [];
  var HERO_SKIP = REDUCED || location.hash.length > 1 || W.pageYOffset > 80;
  function heroFinal() {
    if (afterL) afterL.style.clipPath = "none";
    if (blade) blade.style.opacity = 0;
    if (knob) knob.style.opacity = 0;
    fis.forEach(function (im) { im.style.transform = ""; });
  }
  function heroFrame(p) {
    var Wd = band.clientWidth, H = band.clientHeight;
    var SL = H * 0.34, bw = blade.offsetWidth || 26;
    var c0 = Wd + SL + 40, c1 = -40;
    var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    var c = c0 + (c1 - c0) * e;
    afterL.style.clipPath = "polygon(" + c.toFixed(1) + "px 0," + Wd + "px 0," + Wd + "px " + H + "px," + (c - SL).toFixed(1) + "px " + H + "px)";
    var ang = Math.atan(SL / (H + 40)) * 180 / Math.PI;
    blade.style.transform = "translateX(" + (c - SL / 2 - bw / 2).toFixed(1) + "px) skewX(" + (-ang).toFixed(2) + "deg)";
    knob.style.transform = "translateX(" + (c - SL / 2).toFixed(1) + "px)";
    var kv = 1 - clamp((p - 0.9) / 0.1);
    blade.style.opacity = kv; knob.style.opacity = kv;
    var mid = c - SL / 2;
    fis.forEach(function (im) {
      var room = im.parentNode;
      if (!room.offsetWidth) return;
      var right = room.offsetLeft + room.offsetWidth;
      var r = clamp((right - mid) / (room.offsetWidth * 1.15));
      var q = 1 - Math.pow(1 - r, 3);
      im.style.transform = "translateX(" + ((1 - q) * 90).toFixed(1) + "px) scale(" + (1.12 - 0.12 * q).toFixed(4) + ")";
    });
  }
  function runHero() {
    if (!hero) return;
    if (HERO_SKIP || !band || !afterL || !blade || !knob) { heroFinal(); hero.classList.add("on"); return; }
    heroFrame(0);
    var started = false;
    function go() {
      if (started) return; started = true;
      requestAnimationFrame(function () { hero.classList.add("on"); });
      var T0 = performance.now() + 700, DUR = 3400;
      (function f(now) {
        var p = clamp((now - T0) / DUR);
        heroFrame(p);
        if (p < 1) requestAnimationFrame(f); else heroFinal();
      })(performance.now());
    }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(go);
    setTimeout(go, 900);
  }

  /* ---------- Ремонт: до/после перетаскиваемым разрезом ---------- */
  var ba = doc.getElementById("ba"), baRange = doc.getElementById("barange");
  function setBa(v) { if (!ba) return; ba.style.setProperty("--c", v.toFixed(2) + "%"); if (baRange && Math.round(+baRange.value) !== Math.round(v)) baRange.value = Math.round(v); }
  if (ba && baRange) {
    baRange.addEventListener("input", function () { if (ba._tw) { ba._tw.kill(); ba._tw = null; } setBa(+baRange.value); });
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
  if (vbox && vloop && "IntersectionObserver" in W && !REDUCED) {
    vloop.addEventListener("playing", function () { vbox.classList.add("is-live"); });
    new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) { var p = vloop.play(); if (p && p.catch) p.catch(function () {}); }
        else vloop.pause();
      });
    }, { threshold: 0.25 }).observe(vbox);
  }
  var vmodal = doc.getElementById("vmodal"), vfull = doc.getElementById("vfull"), vOpener = null;
  function vClose() {
    if (!vmodal || vmodal.hidden) return;
    vmodal.hidden = true; doc.body.classList.remove("modal-open");
    if (lenis) lenis.start();
    if (vfull) vfull.pause();
    if (vOpener) vOpener.focus({ preventScroll: true });
  }
  function vOpen(btn) {
    if (!vmodal || !vfull) return;
    vOpener = btn;
    vmodal.hidden = false; doc.body.classList.add("modal-open");
    if (lenis) lenis.stop();
    var p = vfull.play(); if (p && p.catch) p.catch(function () {});
    setTimeout(function () { try { vfull.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }
  [doc.getElementById("vplay")].concat([].slice.call(doc.querySelectorAll("[data-play]"))).forEach(function (b) {
    if (b) b.addEventListener("click", function () { vOpen(b); });
  });
  if (vmodal) {
    vmodal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) vClose(); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") vClose(); });
  }

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

  /* ---------- Движение по прокрутке ---------- */
  function motion() {
    if (!MOTION) { paintQuote(1); return; }
    var mm = G.matchMedia();
    /* заголовки секций поднимаются из-под маски */
    G.utils.toArray(".h2.split").forEach(function (h) {
      G.fromTo(h, { y: 60, clipPath: "inset(0% 0% 100% 0%)" }, { y: 0, clipPath: "inset(0% 0% -20% 0%)", duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: h, start: "top 88%", once: true } });
    });
    /* остальной текст и карточки - пакетом */
    ST.batch(".rv, .sec .lead, .kicker", { start: "top 90%", once: true,
      onEnter: function (els) { G.fromTo(els, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: .08, overwrite: true }); } });
    /* шаги: карточки выезжают по очереди, цифры крупнеют */
    G.fromTo(".step", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: .1,
      scrollTrigger: { trigger: ".steps", start: "top 85%", once: true } });
    G.fromTo(".step .n", { scale: .6, transformOrigin: "left bottom" }, { scale: 1, duration: 1.1, ease: "back.out(2)", stagger: .1,
      scrollTrigger: { trigger: ".steps", start: "top 85%", once: true } });
    /* шкала цикла заливается бордо по прокрутке */
    G.fromTo("#cfill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".cycle", start: "top 92%", end: "top 45%", scrub: .6 } });
    G.fromTo(".cycle-bar i", { scale: 0 }, { scale: 1, ease: "back.out(3)", duration: .6, stagger: .35, scrollTrigger: { trigger: ".cycle", start: "top 85%", once: true } });
    /* бегущая строка едет вместе с прокруткой */
    var mq = doc.getElementById("mq");
    if (mq) G.fromTo(mq, { xPercent: 0 }, { xPercent: -33.333, ease: "none", scrollTrigger: { trigger: ".mq", start: "top bottom", end: "bottom top", scrub: .4 } });
    /* бордовые и голубые плоскости за фото выдвигаются от края экрана */
    G.utils.toArray(".slab").forEach(function (s) {
      G.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power4.inOut", scrollTrigger: { trigger: s.parentNode, start: "top 80%", once: true } });
    });
    /* сигнатура: кадры открываются наклонным разрезом */
    G.utils.toArray(".cut, .cutin").forEach(function (el, i) {
      G.fromTo(el, { "--r": 0 }, { "--r": 1, duration: 1.3, ease: "power3.inOut", delay: el.classList.contains("cut") ? (i % 4) * .08 : .25,
        scrollTrigger: { trigger: el, start: el.classList.contains("cut") ? "top 92%" : "top 82%", once: true } });
    });
    G.utils.toArray(".ph-inset, .ph-reno").forEach(function (el) {
      G.fromTo(el, { y: 80, opacity: 0, rotate: 4 }, { y: 0, opacity: 1, rotate: 0, duration: 1.1, ease: "power3.out", delay: .5, scrollTrigger: { trigger: el.parentNode, start: "top 75%", once: true } });
    });
    /* до/после: показ, что разрез тянется */
    if (ba) {
      var st = { v: 92 };
      setBa(92);
      ST.create({ trigger: ba, start: "top 70%", once: true, onEnter: function () {
        ba._tw = G.timeline({ onComplete: function () { ba._tw = null; } })
          .to(st, { v: 28, duration: 1.6, ease: "power2.inOut", onUpdate: function () { setBa(st.v); } })
          .to(st, { v: 55, duration: 1.1, ease: "power2.inOut", onUpdate: function () { setBa(st.v); } });
      } });
    }
    /* карточки безопасности и строки «для кого» */
    G.fromTo(".fact", { y: 80, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: 1, ease: "power3.out", stagger: .12,
      scrollTrigger: { trigger: ".facts", start: "top 85%", once: true } });
    G.utils.toArray(".who-row").forEach(function (r, i) {
      G.fromTo(r, { y: 50, opacity: 0 }, { y: 0, opacity: 1, delay: (i % 2) * .08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: r, start: "top 90%", once: true } });
    });
    /* цитата загорается словами */
    if (quote) ST.create({ trigger: quote, start: "top 85%", end: "bottom 45%", scrub: true, onUpdate: function (s) { paintQuote(s.progress); } });
    G.fromTo(".tel-big", { scale: .85, opacity: 0, transformOrigin: "left center" }, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: ".tel-big", start: "top 90%", once: true } });
    /* герой уезжает с лёгким параллаксом, только на десктопе */
    mm.add("(min-width:761px)", function () {
      G.to(".band .layer", { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      G.utils.toArray(".media .ph-main, .media .ph-v").forEach(function (p) {
        G.fromTo(p, { y: 50 }, { y: -50, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
  }

  /* ---------- Старт ---------- */
  (function initLang() {
    /* ?lang= в адресе главнее сохранённого выбора: реклама ведёт на ?lang=ru */
    var forced = (location.search.match(/[?&]lang=(ru|kk|en)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("romancecity-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
    else splitQuote();
  })();
  motion();
  runHero();
  onScrollUi();
  function onReady() {
    fitH1(); sizeBand(); lentaState();
    if (location.hash.length > 1) { var id = location.hash.slice(1); setTimeout(function () { goTo(id, true); }, 60); }
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(onReady); else onReady();
  W.addEventListener("load", function () { fitH1(); lentaState(); if (MOTION) ST.refresh(); });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth === VW) return;
    VW = W.innerWidth; MOBILE = W.matchMedia("(max-width:760px)").matches;
    fitH1(); sizeBand(); lentaState();
  });
})();
