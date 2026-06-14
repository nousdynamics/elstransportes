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

  // Hero slideshow
  var slides = document.querySelectorAll(".hero__slide");
  var dots = document.querySelectorAll(".hero__dot");
  if (slides.length > 1) {
    var current = 0;
    var timer = null;
    var setSlide = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === current); });
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === current); });
    };
    var start = function () {
      stop();
      timer = setInterval(function () { setSlide(current + 1); }, 5500);
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { setSlide(n); start(); });
    });
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) start();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (!reduce) start();
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
