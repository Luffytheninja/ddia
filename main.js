/* ═══════════════════════════════════════════════════════════
   DDIA — Main JavaScript
   Custom cursor, navigation, scroll reveals, delightful UX
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .category-card, .vibe-card, .value-pill');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });
  }


  // ── NAVIGATION TOGGLE ──
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // ── SCROLL REVEAL ──
  const revealElements = () => {
    // Add reveal class to elements that should animate in
    const selectors = [
      '.shop__header',
      '.category-card',
      '.about__text',
      '.vibes__header',
      '.newsletter__container'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
        }
      });
    });

    // Add stagger class to appropriate containers
    document.querySelectorAll('.about__values, .shop__grid').forEach(el => {
      if (!el.classList.contains('reveal-stagger')) {
        el.classList.add('reveal-stagger');
        el.classList.add('reveal');
      }
    });
  };

  revealElements();

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  // ── CATEGORY CARD TILT (Desktop only) ──
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  // ── PARALLAX HERO BLOBS ──
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const blobs = document.querySelectorAll('.shape');
      blobs.forEach((blob, i) => {
        const speed = 0.3 + (i * 0.1);
        blob.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }


  // ── NAV BACKGROUND ON SCROLL ──
  const nav = document.getElementById('mainNav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.style.mixBlendMode = 'normal';
        nav.style.background = 'rgba(26, 10, 30, 0.8)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.webkitBackdropFilter = 'blur(20px)';
      } else {
        nav.style.mixBlendMode = 'difference';
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }


  // ── NEWSLETTER FORM ──
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('.newsletter__btn');
      const originalText = btn.textContent;
      btn.textContent = '♥ You\'re In!';
      btn.style.background = 'linear-gradient(135deg, var(--forest), var(--forest-light))';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        newsletterForm.reset();
      }, 3000);
    });
  }


  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
