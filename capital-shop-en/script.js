// Vanilla JS — mobile menu, dropdown, product carousel, tabs, testimonial arrows
(function () {
  'use strict';

  /* ---------- Mobile menu + "Pages" dropdown ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var dd = document.querySelector('.has-dropdown');
  var toggle = document.querySelector('.dropdown-toggle');

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    var open = dd.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', function (e) {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Product data (4 photos from the video, repeated) ---------- */
  var products = [];
  for (var i = 0; i < 8; i++) {
    products.push({ img: 'images/p' + ((i % 4) + 1) + '.jpg', name: 'Cashmere Tank + Bag', price: '$99.99', old: '$120.00' });
  }

  var cartIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 2.5h3.6l.5 2.5H22l-2.2 9a2 2 0 0 1-1.9 1.5H8.2l.4 2H19v2H7l-2.6-13H1zM13 7.2h-1.6v2H9.4v1.6h2v2H13v-2h2V9.2h-2z"/><circle cx="9" cy="20.5" r="1.6"/><circle cx="18" cy="20.5" r="1.6"/></svg>';
  var heartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20.5S3.5 15 3.5 8.9A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.3C20.5 15 12 20.5 12 20.5z"/></svg>';
  var zoomIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6M10 7v6M7 10h6"/></svg>';

  var track = document.getElementById('track');
  track.innerHTML = products.map(function (p) {
    return '<li class="slide product">' +
      '<div class="product__media">' +
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        '<img class="alt" src="images/p-hover.jpg" alt="">' +
        '<div class="product__tools">' +
          '<button aria-label="Add to cart">' + cartIcon + '</button>' +
          '<button aria-label="Add to wishlist">' + heartIcon + '</button>' +
          '<button aria-label="Quick view">' + zoomIcon + '</button>' +
        '</div>' +
      '</div>' +
      '<h3 class="product__name">' + p.name + '</h3>' +
      '<p class="product__price"><ins>' + p.price + '</ins><del>' + p.old + '</del></p>' +
    '</li>';
  }).join('');

  /* ---------- Carousel ---------- */
  var index = 0;
  function visible() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--vis'), 10) || 4;
  }
  function maxIndex() { return Math.max(0, products.length - visible()); }
  function render() {
    var slide = track.children[0];
    var gap = parseFloat(getComputedStyle(track).columnGap) || 14;
    var step = slide.getBoundingClientRect().width + gap;
    track.style.transform = 'translateX(' + (-index * step) + 'px)';
  }
  document.querySelectorAll('.slider__arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = parseInt(btn.dataset.dir, 10);
      index += dir;
      if (index > maxIndex()) index = 0;           // loop forward
      if (index < 0) index = maxIndex();           // loop backward
      render();
    });
  });
  window.addEventListener('resize', function () {
    index = Math.min(index, maxIndex());
    render();
  });

  /* ---------- Tabs (Men / Women / Baby / Fashion) ---------- */
  var tabs = document.querySelectorAll('.tabs__btn');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      // quick fade + reset to first slide
      track.classList.add('is-fading');
      setTimeout(function () {
        index = 0; render();
        track.classList.remove('is-fading');
      }, 250);
    });
  });

  /* ---------- Testimonial arrows ---------- */
  var slides = document.querySelectorAll('.testi__slide');
  var current = 0;
  document.querySelectorAll('.testi__arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (slides.length < 2) return;               // only one testimonial is visible in the video
      slides[current].classList.remove('is-active');
      current = (current + parseInt(btn.dataset.t, 10) + slides.length) % slides.length;
      slides[current].classList.add('is-active');
    });
  });

  /* ---------- Newsletter form ---------- */
  var nlForm = document.getElementById('newsletter');
  var nlInput = document.getElementById('nl-email');
  var nlMsg = document.getElementById('nl-msg');
  nlForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlInput.value.trim());
    nlInput.classList.toggle('is-invalid', !ok);
    nlMsg.classList.toggle('is-error', !ok);
    nlMsg.textContent = ok ? 'Thank you for subscribing!' : 'Please enter a valid email address.';
    if (ok) nlForm.reset();
  });
  nlInput.addEventListener('input', function () { nlInput.classList.remove('is-invalid'); });

  /* ---------- Footer year + back to top ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  var toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  render();
})();


/* =====================================================================
   YOU MAY LIKE — carousel (self-contained: own scope, own ids/classes)
   ===================================================================== */
(function () {
  'use strict';

  var section = document.querySelector('.you-may-like-section');
  var track = document.getElementById('you-may-like-track');
  var prevBtn = document.getElementById('you-may-like-prev');
  var nextBtn = document.getElementById('you-may-like-next');
  var carousel = document.getElementById('you-may-like-carousel');
  if (!section || !track || !prevBtn || !nextBtn) return;

  var DIR = 'images/you-may-like/';
  var HOVER_IMG = DIR + 'product-5.jpg';
  var base = { name: 'Cashmere Tank + Bag', price: '$99.99', oldPrice: '$120.00' };
  var order = [
    ['product-1.jpg', HOVER_IMG], ['product-2.jpg', HOVER_IMG], ['product-3.jpg', HOVER_IMG],
    ['product-4.jpg', HOVER_IMG], ['product-5.jpg', DIR + 'product-1.jpg'],
    ['product-3.jpg', HOVER_IMG], ['product-2.jpg', HOVER_IMG], ['product-4.jpg', HOVER_IMG]
  ];

  var ICONS = {
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20.5" r="1.2"/><circle cx="18" cy="20.5" r="1.2"/><path d="M2 3h2.6l2.4 11.5a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L21 7H5.4"/><path d="M13 7.5v5M10.5 10h5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.6-4.6M11 8v6M8 11h6"/></svg>'
  };

  /* ----- render cards ----- */
  track.innerHTML = order.map(function (o) {
    return '<li class="you-may-like-card">' +
      '<div class="you-may-like-image">' +
        '<img src="' + DIR + o[0] + '" alt="' + base.name + '">' +
        '<img class="you-may-like-img-hover" src="' + o[1] + '" alt="" aria-hidden="true">' +
        '<div class="you-may-like-actions">' +
          '<button type="button" aria-label="Add to cart">' + ICONS.cart + '</button>' +
          '<button type="button" class="you-may-like-wish" aria-label="Add to wishlist">' + ICONS.heart + '</button>' +
          '<button type="button" aria-label="Quick view">' + ICONS.search + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="you-may-like-info">' +
        '<a href="#" class="you-may-like-name">' + base.name + '</a>' +
        '<div class="you-may-like-price"><span class="you-may-like-now">' + base.price + '</span><span class="you-may-like-old">' + base.oldPrice + '</span></div>' +
      '</div>' +
    '</li>';
  }).join('');

  /* wishlist toggle + stop "#" links from jumping to the top */
  track.addEventListener('click', function (e) {
    if (e.target.closest('a')) e.preventDefault();
    var wish = e.target.closest('.you-may-like-wish');
    if (wish) wish.classList.toggle('is-active');
  });

  /* ----- slider ----- */
  var cards = track.children;
  var index = 0;

  function visible() {
    return parseInt(getComputedStyle(section).getPropertyValue('--yml-visible'), 10) || 1;
  }
  function maxIndex() { return Math.max(0, cards.length - visible()); }
  function update() {
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    var step = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = 'translateX(' + (-index * step) + 'px)';
  }
  function next() { index = index >= maxIndex() ? 0 : index + 1; update(); }
  function prev() { index = index <= 0 ? maxIndex() : index - 1; update(); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  /* keyboard (only while focus is inside this carousel) + touch swipe */
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  var startX = null;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    startX = null;
  });

  window.addEventListener('resize', function () {
    index = Math.min(index, maxIndex());
    track.style.transition = 'none';
    update();
    requestAnimationFrame(function () { track.style.transition = ''; });
  });

  update();
})();
