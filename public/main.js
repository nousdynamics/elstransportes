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
