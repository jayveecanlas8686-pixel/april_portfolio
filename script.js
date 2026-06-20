/* ========================================
   APRIL ROSE A. BIGTASIN — Portfolio JS
   ======================================== */

(function () {
  'use strict';

  // --- Scroll reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Navbar scroll effect ---
  var nav = document.querySelector('.nav');
  var lastScrollY = 0;

  function handleNavScroll() {
    var scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile nav toggle ---
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active nav link highlight on scroll ---
  var sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    var scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(function (a) {
          a.classList.remove('active');
        });
        var activeLink = document.querySelector('.nav-links a[href="#' + sectionId + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // --- Simple form handling (mailto fallback) ---
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = contactForm.querySelector('[name="name"]').value;
      var email = contactForm.querySelector('[name="email"]').value;
      var subject = contactForm.querySelector('[name="subject"]').value;
      var message = contactForm.querySelector('[name="message"]').value;

      var mailtoLink =
        'mailto:aprielleseventeen@gmail.com' +
        '?subject=' + encodeURIComponent(subject || 'Website Inquiry') +
        '&body=' + encodeURIComponent(
          'Name: ' + name + '\nEmail: ' + email + '\n\n' + message
        );

      window.location.href = mailtoLink;
    });
  }

  // --- Year in footer ---
  var yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
