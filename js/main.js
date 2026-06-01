/**
 * Kuri China - 高端猎头服务网站交互脚本
 */

(function () {
  'use strict';

  // === Navbar Scroll Effect ===
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  // === Active Nav Link ===
  function setActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('kurichina/'))))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // === Mobile Hamburger ===
  function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // === Scroll Animation (Intersection Observer) ===
  function initScrollAnimations() {
    var fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // === Stats Counter Animation ===
  function initCounters() {
    var statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    var animated = false;
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach(function (el) {
            animateCounter(el);
          });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.stats');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var step = target / (duration / 16);
    var current = 0;

    function update() {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        return;
      }
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // === Job Search / Filter ===
  function initJobFilter() {
    var searchForm = document.querySelector('.search-form');
    if (!searchForm) return;

    var industrySelect = document.getElementById('filter-industry');
    var funcSelect = document.getElementById('filter-function');
    var locInput = document.getElementById('filter-location');

    function filterJobs() {
      var industry = industrySelect ? industrySelect.value : '';
      var func = funcSelect ? funcSelect.value : '';
      var loc = locInput ? locInput.value.toLowerCase().trim() : '';

      var jobCards = document.querySelectorAll('.job-card');

      jobCards.forEach(function (card) {
        var cardIndustry = card.getAttribute('data-industry') || '';
        var cardFunc = card.getAttribute('data-function') || '';
        var cardLoc = card.getAttribute('data-location') || '';

        var match = true;
        if (industry && cardIndustry !== industry) match = false;
        if (func && cardFunc !== func) match = false;
        if (loc && cardLoc.toLowerCase().indexOf(loc) === -1) match = false;

        card.style.display = match ? 'flex' : 'none';
      });

      // Check empty state
      var visibleCount = document.querySelectorAll('.job-card[style*="display: flex"], .job-card:not([style])').length;
      var noResults = document.getElementById('no-results');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    searchForm.addEventListener('change', filterJobs);
    searchForm.addEventListener('input', filterJobs);
  }

  // === Contact Form Validation ===
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstError = null;

      // Reset errors
      form.querySelectorAll('.form-error').forEach(function (el) { el.textContent = ''; });
      form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });

      // Name
      var name = document.getElementById('contact-name');
      if (name && !name.value.trim()) {
        showError(name, '请输入姓名');
        valid = false;
        if (!firstError) firstError = name;
      }

      // Email
      var email = document.getElementById('contact-email');
      if (email) {
        if (!email.value.trim()) {
          showError(email, '请输入邮箱');
          valid = false;
          if (!firstError) firstError = email;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          showError(email, '请输入有效的邮箱地址');
          valid = false;
          if (!firstError) firstError = email;
        }
      }

      // Phone (optional but validate if filled)
      var phone = document.getElementById('contact-phone');
      if (phone && phone.value.trim() && !/^[\d\-+() ]{7,20}$/.test(phone.value)) {
        showError(phone, '请输入有效的电话号码');
        valid = false;
        if (!firstError) firstError = phone;
      }

      // Company
      var company = document.getElementById('contact-company');
      if (company && !company.value.trim()) {
        showError(company, '请输入公司名称');
        valid = false;
        if (!firstError) firstError = company;
      }

      // Message
      var message = document.getElementById('contact-message');
      if (message && !message.value.trim()) {
        showError(message, '请输入需求描述');
        valid = false;
        if (!firstError) firstError = message;
      } else if (message && message.value.trim().length < 10) {
        showError(message, '需求描述至少10个字');
        valid = false;
        if (!firstError) firstError = message;
      }

      if (valid) {
        // Simulate submission
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;

        setTimeout(function () {
          submitBtn.textContent = '提交成功';
          submitBtn.style.background = '#27ae60';
          submitBtn.style.borderColor = '#27ae60';
          form.reset();

          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
          }, 2000);
        }, 800);
      } else if (firstError) {
        firstError.focus();
      }
    });
  }

  function showError(input, message) {
    input.classList.add('error');
    var parent = input.closest('.form-group');
    if (parent) {
      var errorEl = parent.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
      }
    }
  }

  // === Smooth Scroll for Anchors ===
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var position = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: position, behavior: 'smooth' });
        }
      });
    });
  }

  // === Init All ===
  function init() {
    setActiveNav();
    initHamburger();
    initScrollAnimations();
    initCounters();
    initJobFilter();
    initContactForm();
    initSmoothScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial scroll check
    onScroll();

    // Add data attributes to job cards for filtering (on jobs page)
    var jobCards = document.querySelectorAll('.job-card');
    if (jobCards.length) {
      // Data attributes are already in HTML
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();