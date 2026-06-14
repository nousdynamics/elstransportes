/* ELS Transportes — minimal interactions */
(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
})();
