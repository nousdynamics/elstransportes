/* ELS Transportes — minimal interactions */
(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // WhatsApp click tracking (dataLayer / GTM)
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (!a) return;
    var loc = "other";
    if (a.classList.contains("fab")) loc = "fab";
    else {
      var s = a.closest("section[id]");
      if (s) loc = s.id;
      else if (a.closest(".header")) loc = "header";
      else if (a.closest(".footer")) loc = "footer";
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "whatsapp_click", click_location: loc });
  }, true);

  // Mobile menu
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    var toggle = function (open) {
      var isOpen = open !== undefined ? open : !mobileNav.classList.contains("open");
      mobileNav.classList.toggle("open", isOpen);
      mobileNav.hidden = !isOpen;
      burger.setAttribute("aria-expanded", String(isOpen));
    };
    burger.addEventListener("click", function () { toggle(); });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
  }

  // Hero slideshow + top progress bars
  var slides = document.querySelectorAll(".hero__slide");
  var bars = document.querySelectorAll(".hero__bar");
  var fills = document.querySelectorAll(".hero__bar-fill");
  if (slides.length > 1) {
    var DURATION = 5500;
    var current = 0;
    var timer = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var paint = function () {
      fills.forEach(function (f, n) {
        f.style.transition = "none";
        f.style.width = n < current ? "100%" : "0%";
      });
      var cur = fills[current];
      if (!cur) return;
      if (reduce) { cur.style.width = "100%"; return; }
      void cur.offsetWidth; // reflow so the transition restarts
      cur.style.transition = "width " + DURATION + "ms linear";
      cur.style.width = "100%";
    };
    var setSlide = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === current); });
      paint();
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var start = function () {
      stop();
      if (reduce) return;
      timer = setInterval(function () { setSlide(current + 1); }, DURATION);
    };

    bars.forEach(function (b, n) {
      b.addEventListener("click", function () { setSlide(n); start(); });
    });

    setSlide(0);
    start();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Rotating word (Sobre heading)
  var rotator = document.querySelector(".word-rotator");
  if (rotator && rotator.dataset.rotate) {
    var words = rotator.dataset.rotate.split(",");
    var reduceR = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (words.length > 1 && !reduceR) {
      var wi = 0;
      setInterval(function () {
        rotator.classList.add("is-out");
        setTimeout(function () {
          wi = (wi + 1) % words.length;
          rotator.textContent = words[wi];
          rotator.classList.remove("is-out");
        }, 300);
      }, 2400);
    }
  }

  // Orçamento form -> webhook (Make) + WhatsApp via /obrigado
  var WEBHOOK = "https://hook.us2.make.com/2mv7ypjz47r8rrg8sl701fz7pkqj9j2x";
  var orcForm = document.getElementById("orcamento-form");
  if (orcForm) {
    orcForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof orcForm.reportValidity === "function" && !orcForm.reportValidity()) return;
      var data = new FormData(orcForm);
      var get = function (k) { return (data.get(k) || "").toString().trim(); };
      var payload = {
        nome: get("nome"), telefone: get("telefone"), email: get("email"),
        servico: get("servico"), origem: get("origem"), destino: get("destino"),
        mercadoria: get("mercadoria"), peso: get("peso"), volume: get("volume"),
        prazo: get("prazo"), frequencia: get("frequencia"), observacoes: get("observacoes"),
        page_variant: "com_formulario", origem_url: location.href,
        enviado_em: new Date().toISOString()
      };
      // 1) Webhook (Make) — fire-and-forget, sobrevive à navegação.
      // form-urlencoded = content-type "safelisted" -> sem preflight CORS; Make parseia em campos.
      try {
        var body = new URLSearchParams(payload);
        var sent = false;
        if (navigator.sendBeacon) {
          sent = navigator.sendBeacon(WEBHOOK, body);
        }
        if (!sent) {
          fetch(WEBHOOK, { method: "POST", body: body, mode: "no-cors", keepalive: true }).catch(function () {});
        }
      } catch (err) {}
      // 2) Mensagem WhatsApp pré-preenchida
      var line = function (label, v) { return v ? "*" + label + ":* " + v : ""; };
      var parts = [
        "*Novo orçamento — ELS Transportes*",
        "",
        line("Nome", payload.nome),
        line("Telefone", payload.telefone),
        line("E-mail", payload.email),
        line("Serviço", payload.servico),
        line("Origem", payload.origem),
        line("Destino", payload.destino),
        line("Mercadoria", payload.mercadoria),
        line("Peso", payload.peso),
        line("Volume", payload.volume),
        line("Prazo", payload.prazo),
        line("Frequência", payload.frequencia),
        line("Observações", payload.observacoes)
      ].filter(Boolean);
      var waUrl = "https://wa.me/5511964620149?text=" + encodeURIComponent(parts.join("\n"));
      // 3) Analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead", form_name: "orcamento", method: "whatsapp" });
      // 4) Página de obrigado (faz a contagem de 5s -> WhatsApp)
      try { sessionStorage.setItem("els_wa_url", waUrl); } catch (e2) {}
      window.location.href = "/obrigado/";
    });
  }

  // Página de obrigado: contador de 5s -> WhatsApp
  var thanks = document.getElementById("obrigado");
  if (thanks) {
    var waUrl2;
    try { waUrl2 = sessionStorage.getItem("els_wa_url"); } catch (e3) {}
    if (!waUrl2) {
      waUrl2 = "https://wa.me/5511964620149?text=" + encodeURIComponent("Olá! Acabei de solicitar um orçamento pelo site.");
    }
    var goBtn = document.getElementById("obrigado-go");
    if (goBtn) goBtn.setAttribute("href", waUrl2);
    var countEl = document.getElementById("obrigado-count");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_obrigado" });
    var n = 5;
    if (countEl) countEl.textContent = n;
    var t = setInterval(function () {
      n--;
      if (countEl) countEl.textContent = n < 0 ? 0 : n;
      if (n <= 0) { clearInterval(t); window.location.href = waUrl2; }
    }, 1000);
  }
})();
