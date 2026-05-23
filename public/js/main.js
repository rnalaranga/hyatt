/* ═══════════════════════════════════════════════════════════════════════════════
   HYATT PHOTOGRAPHY — MAIN JAVASCRIPT
   Animations · Interactions · Gallery · Cursor
   ═══════════════════════════════════════════════════════════════════════════════ */

'use strict';

// ─── PAGE LOADER ────────────────────────────────────────────────────────────────
(function initLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<span class="loader-logo">HYATT</span>';
  document.body.appendChild(loader);
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.remove('loading');
      setTimeout(() => loader.remove(), 700);
    }, 400);
  });
})();

// ─── THEME MANAGER ───────────────────────────────────────────────────────────────
(function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
})();

// ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────────
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .masonry-item, .grid-item, .featured-card, .filter-tab, .service-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
    }
  });

  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.85)');
  document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
})();

// ─── NAVIGATION ─────────────────────────────────────────────────────────────────
(function initNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!header) return;

  // Add .on-dark-hero class if inner page has a dark page-hero banner
  if (document.querySelector('.page-hero')) {
    header.classList.add('on-dark-hero');
  }

  // Scroll: add .scrolled class
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('active');
      menu.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && menu.classList.contains('active')) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Mark current page link active
    const currentPath = window.location.pathname;
    menu.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/') ||
          (currentPath !== '/' && href !== '/' && currentPath.startsWith(href))) {
        link.classList.add('active-page');
      }
    });
  }
})();

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
})();

// ─── HORIZONTAL DRAG SCROLL (Featured) ──────────────────────────────────────────
(function initDragScroll() {
  const scroll = document.getElementById('featured-scroll');
  if (!scroll) return;

  let isDown = false;
  let startX, scrollLeft;

  scroll.addEventListener('mousedown', (e) => {
    isDown = true;
    scroll.classList.add('dragging');
    startX = e.pageX - scroll.offsetLeft;
    scrollLeft = scroll.scrollLeft;
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    scroll.classList.remove('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    scroll.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  let touchStartX = 0;
  let touchScrollLeft = 0;

  scroll.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = scroll.scrollLeft;
  }, { passive: true });

  scroll.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (touchStartX - x) * 1.2;
    scroll.scrollLeft = touchScrollLeft + walk;
  }, { passive: true });
})();

// ─── PORTFOLIO FILTER ────────────────────────────────────────────────────────────
(function initFilter() {
  const tabs    = document.querySelectorAll('.filter-tab');
  const gallery = document.getElementById('masonry-gallery');
  if (!tabs.length || !gallery) return;

  const items = gallery.querySelectorAll('.masonry-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      // Premium staggered shuffle transition
      // Step 1: Fade out and shrink all items
      items.forEach(item => {
        item.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px) scale(0.95)';
      });

      // Step 2: Apply filter display and trigger staggered fade in
      setTimeout(() => {
        let delayIndex = 0;
        items.forEach(item => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
            
            // Staggered trigger
            setTimeout(() => {
              item.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, delayIndex * 40); // Stagger delay (40ms)
            delayIndex++;
          } else {
            item.classList.add('hidden');
          }
        });
      }, 350);
    });
  });
})();

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────────
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const closeBtn  = document.getElementById('lightbox-close');
  const prevBtn   = document.getElementById('lightbox-prev');
  const nextBtn   = document.getElementById('lightbox-next');
  const lbImg     = document.getElementById('lightbox-img');
  const lbInfo    = document.getElementById('lightbox-info');
  if (!lightbox) return;

  const items = Array.from(document.querySelectorAll('.masonry-item'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    if (!item) return;

    // Get image src or use placeholder
    const img = item.querySelector('img');
    const placeholder = item.querySelector('.img-placeholder');
    const caption = item.querySelector('.masonry-caption');

    if (img) {
      lbImg.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}">`;
    } else if (placeholder) {
      const clone = placeholder.cloneNode(true);
      clone.style.minHeight = '400px';
      clone.style.minWidth  = '600px';
      lbImg.innerHTML = '';
      lbImg.appendChild(clone);
    }

    if (caption) {
      lbInfo.innerHTML = caption.innerHTML;
      lbInfo.style.cssText = 'opacity:1;transform:none;color:var(--text-primary)';
    }

    lightbox.removeAttribute('hidden');
    setTimeout(() => lightbox.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 300);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    openLightbox(currentIndex);
  }

  // Open on click
  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  // Close
  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Navigate
  prevBtn && prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn && nextBtn.addEventListener('click', () => navigate(1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
})();

// ─── COUNTER ANIMATION (About page) ─────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();



// ─── CONTACT FORM ────────────────────────────────────────────────────────────────
(function initContactForm() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    // Client-side validation
    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    [name, email, message].forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim() || (field.type === 'email' && !field.value.includes('@'))) {
        field.style.borderColor = '#e05252';
        field.style.boxShadow  = '0 0 0 3px rgba(224,82,82,0.15)';
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text') && (submitBtn.querySelector('.btn-text').textContent = 'Sending...');
    }
  });

  // Remove error on input
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    });
  });
})();

// ─── FAQ SMOOTH ACCORDION ────────────────────────────────────────────────────────
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Close siblings
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });
})();

// ─── SMOOTH SCROLL ANCHOR ────────────────────────────────────────────────────────
(function initSmoothAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

// ─── HERO SCROLL-ZOOM PARALLAX ───────────────────────────────────────────────────
(function initHeroParallax() {
  const heroSection = document.getElementById('hero-section');
  if (!heroSection) return;

  const heroContent = heroSection.querySelector('.hero-content');
  const scrollIndicator = heroSection.querySelector('.hero-scroll-indicator');
  const panels = heroSection.querySelectorAll('.panel-bg');

  let tick = false;

  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(updateParallax);
      tick = true;
    }
  }, { passive: true });

  function updateParallax() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    if (scrollY <= viewportHeight) {
      // Shift panel backgrounds downward at individual layered rates for dynamic 3D depth
      panels.forEach((bg, idx) => {
        const speed = 0.15 + (idx * 0.03);
        bg.style.transform = `translateY(${scrollY * speed}px) scale(1.08)`;
      });

      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.38}px)`;
        heroContent.style.opacity = `${Math.max(1 - scrollY * 0.0022, 0)}`;
      }

      if (scrollIndicator) {
        scrollIndicator.style.opacity = `${Math.max(1 - scrollY * 0.005, 0)}`;
      }
    }

    tick = false;
  }
})();

// ─── INIT ────────────────────────────────────────────────────────────────────────
console.log('%c✦ HYATT PHOTOGRAPHY', 'color: #FFFFFF; font-size: 1.2rem; font-weight: bold; letter-spacing: 0.3em;');
console.log('%cNext Level Photography — Australia', 'color: #A8A29E; font-size: 0.85rem;');
