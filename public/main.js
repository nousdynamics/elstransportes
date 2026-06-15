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

  // Orçamento form -> WhatsApp prefilled message
  var orcForm = document.getElementById("orcamento-form");
  if (orcForm) {
    orcForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof orcForm.reportValidity === "function" && !orcForm.reportValidity()) return;
      var data = new FormData(orcForm);
      var get = function (k) { return (data.get(k) || "").toString().trim(); };
      var line = function (label, k) { var v = get(k); return v ? "*" + label + ":* " + v : ""; };
      var parts = [
        "*Novo orçamento — ELS Transportes*",
        "",
        line("Nome", "nome"),
        line("Telefone", "telefone"),
        line("E-mail", "email"),
        line("Serviço", "servico"),
        line("Origem", "origem"),
        line("Destino", "destino"),
        line("Mercadoria", "mercadoria"),
        line("Peso", "peso"),
        line("Volume", "volume"),
        line("Prazo", "prazo"),
        line("Frequência", "frequencia"),
        line("Observações", "observacoes")
      ].filter(Boolean);
      var msg = encodeURIComponent(parts.join("\n"));
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead", form_name: "orcamento", method: "whatsapp" });
      window.open("https://wa.me/5511964620149?text=" + msg, "_blank");
    });
  }
})();
