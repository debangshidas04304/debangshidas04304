/* ============================================================
   script.js – Debangshi Das Portfolio
   Handles: Preloader, Cursor, Navbar, Particles, GSAP,
            Typed.js, AOS, Counters, Progress Bars, SVG Rings,
            Project Filter, Swiper, Smooth Scroll
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PRELOADER
  ---------------------------------------------------------- */
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1500);
  });

  // Fallback in case 'load' fires before DOMContentLoaded resolves
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 4000);

  /* ----------------------------------------------------------
     2. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    // Snap dot instantly
    dotX = e.clientX;
    dotY = e.clientY;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top  = dotY + 'px';
  });

  // Smooth outer cursor with lerp
  function animateCursor() {
    cursor.style.left = cursorX + 'px';
    cursor.style.top  = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale on hover over interactive elements
  const interactiveEls = document.querySelectorAll('a, button, .skill-card, .hobby-flip-card, .project-card');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '50px';
      cursor.style.height  = '50px';
      cursor.style.background = 'rgba(124, 58, 237, 0.12)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '32px';
      cursor.style.height  = '32px';
      cursor.style.background = 'transparent';
    });
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    if (cursor)    cursor.style.display    = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  /* ----------------------------------------------------------
     3. NAVBAR SCROLL EFFECT
  ---------------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     4. BACK TO TOP
  ---------------------------------------------------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     5. PARTICLES.JS INIT
  ---------------------------------------------------------- */
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 70, density: { enable: true, value_area: 900 } },
        color: { value: ['#7c3aed', '#2563eb', '#a78bfa', '#60a5fa'] },
        shape: { type: 'circle' },
        opacity: {
          value: 0.45,
          random: true,
          anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.3, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#7c3aed',
          opacity: 0.12,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab:  { distance: 160, line_linked: { opacity: 0.4 } },
          push:  { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }

  /* ----------------------------------------------------------
     6. TYPED.JS
  ---------------------------------------------------------- */
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: [
        'MCA Student',
        'Full Stack Developer',
        'MERN Stack Enthusiast',
        'Problem Solver',
        'Lifelong Learner'
      ],
      typeSpeed:    55,
      backSpeed:    30,
      backDelay:    1800,
      startDelay:   600,
      loop:         true,
      showCursor:   true,
      cursorChar:   '|',
      smartBackspace: true
    });
  }

  /* ----------------------------------------------------------
     7. AOS INIT
  ---------------------------------------------------------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 0
    });
  }

  /* ----------------------------------------------------------
     8. GSAP HERO ENTRANCE ANIMATIONS
  ---------------------------------------------------------- */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Check if elements exist before animating
    const heroGreeting = document.getElementById('heroGreeting');
    const heroName     = document.getElementById('heroName');
    const heroRole     = document.getElementById('heroRole');
    const heroQuote    = document.getElementById('heroQuote');
    const heroButtons  = document.getElementById('heroButtons');
    const heroSocials  = document.getElementById('heroSocials');

    if (heroName) {
      const tl = gsap.timeline({ delay: 1.6 }); // after preloader

      tl.to(heroGreeting, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          from: { y: 30 } })
        .to(heroName,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .to(heroRole,     { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(heroQuote,    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .to(heroButtons,  { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
        .to(heroSocials,  { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');

      // Set initial states
      gsap.set([heroGreeting, heroName, heroRole, heroQuote, heroButtons, heroSocials],
        { y: 40, opacity: 0 });
    }

    /* --------------------------------------------------------
       9. GSAP SCROLLTRIGGER – Section reveals
    -------------------------------------------------------- */
    // Stagger section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header.querySelector('.section-title'), {
        scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.7, ease: 'power3.out'
      });
    });

    /* --------------------------------------------------------
       11. PROGRESS BAR ANIMATION
    -------------------------------------------------------- */
    function animateSkillBars() {
      const bars = document.querySelectorAll('.skill-bar[data-pct]');
      bars.forEach(bar => {
        const pct = bar.getAttribute('data-pct');
        ScrollTrigger.create({
          trigger: bar.closest('.skill-card') || bar,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(bar, {
              width: pct + '%',
              duration: 1.2,
              ease: 'power2.out',
              delay: 0.1
            });
          },
          once: true
        });
      });
    }

    // Re-run on tab switch (Alpine emits events as Alpine observes DOM)
    document.addEventListener('animateBars', animateSkillBars);
    // Initial animation for default tab
    setTimeout(animateSkillBars, 300);

    // Re-animate whenever Alpine shows a new tab
    const tabButtons = document.querySelectorAll('.skills-tab');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(animateSkillBars, 100);
      });
    });

    /* --------------------------------------------------------
       12. SVG RING PROGRESS ANIMATION
    -------------------------------------------------------- */
    const rings = document.querySelectorAll('.ring-fill[data-pct]');
    const circumference = 2 * Math.PI * 40; // r=40

    rings.forEach(ring => {
      const pct    = parseFloat(ring.getAttribute('data-pct'));
      const offset = circumference - (pct / 100) * circumference;

      // Set gradient on ring stroke
      const svgEl = ring.closest('svg');
      if (svgEl) {
        const ns   = 'http://www.w3.org/2000/svg';
        const defs = document.createElementNS(ns, 'defs');
        const grad = document.createElementNS(ns, 'linearGradient');
        const id   = 'grad-' + Math.random().toString(36).slice(2, 8);
        grad.setAttribute('id', id);
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%');
        grad.setAttribute('y2', '100%');

        const stop1 = document.createElementNS(ns, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#7c3aed');
        const stop2 = document.createElementNS(ns, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#2563eb');

        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);
        svgEl.prepend(defs);
        ring.setAttribute('stroke', `url(#${id})`);
      }

      ScrollTrigger.create({
        trigger: ring.closest('.learning-card'),
        start: 'top 88%',
        onEnter: () => {
          gsap.fromTo(ring,
            { strokeDashoffset: circumference },
            { strokeDashoffset: offset, duration: 1.6, ease: 'power2.out', delay: 0.2 }
          );
        },
        once: true
      });
    });
  }

  /* ----------------------------------------------------------
     10. COUNTER ANIMATION (Stats)
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const stepTime  = 20;
    const steps     = duration / stepTime;
    const increment = target / steps;
    let current     = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, stepTime);
  }

  // Use IntersectionObserver
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ----------------------------------------------------------
     13. PROJECT FILTER
  ---------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     14. SWIPER.JS (Mobile Projects)
  ---------------------------------------------------------- */
  function initSwiper() {
    if (window.innerWidth <= 768 && typeof Swiper !== 'undefined') {
      const swiperEl = document.querySelector('.projects-swiper');
      if (swiperEl && swiperEl.style.display !== 'none') {
        new Swiper('.projects-swiper', {
          slidesPerView: 1,
          spaceBetween: 16,
          centeredSlides: true,
          loop: false,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          grabCursor: true,
          keyboard: { enabled: true },
          a11y: {
            prevSlideMessage: 'Previous project',
            nextSlideMessage: 'Next project'
          }
        });
      }
    }
  }

  // Responsive switch
  function handleResize() {
    const grid   = document.getElementById('projectsGrid');
    const swiper = document.querySelector('.projects-swiper');

    if (!grid || !swiper) return;

    if (window.innerWidth <= 768) {
      grid.style.display   = 'none';
      swiper.style.display = 'block';
    } else {
      grid.style.display   = 'grid';
      swiper.style.display = 'none';
    }
  }

  handleResize();
  initSwiper();
  window.addEventListener('resize', () => { handleResize(); }, { passive: true });

  /* ----------------------------------------------------------
     15. SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     MISC: Active nav link on scroll
  ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = '#a78bfa';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ----------------------------------------------------------
     SKILL BAR initial trigger for visible tab
  ---------------------------------------------------------- */
  // Trigger immediately if skills section is in view on load
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            document.querySelectorAll('.skill-bar[data-pct]').forEach(bar => {
              const pct = bar.getAttribute('data-pct');
              bar.style.width = pct + '%';
            });
          }, 200);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(skillsSection);
  }

});
