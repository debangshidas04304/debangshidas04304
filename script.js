/* ============================================================
   script.js – Debangshi Das Portfolio
   Handles: Preloader, Cursor, Navbar, Three.js Hero, GSAP,
            Typed.js, AOS, Counters, Progress Bars, SVG Rings,
            Project Filter, Swiper, Smooth Scroll, GitHub API,
            Dark/Light Mode Toggle
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
     5. THREE.JS NEURAL-NETWORK HERO ANIMATION
  ---------------------------------------------------------- */
  (function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 50 : 100;
    const CONNECTION_DIST = isMobile ? 90 : 130;
    const SPEED = 0.35;

    // Renderer (antialias off on mobile for performance, on for desktop)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 400;

    // Particle positions & velocities
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 600;
      positions[i3 + 1] = (Math.random() - 0.5) * 400;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      velocities[i3]     = (Math.random() - 0.5) * SPEED;
      velocities[i3 + 1] = (Math.random() - 0.5) * SPEED;
      velocities[i3 + 2] = 0;
    }

    // Points
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    const pointMat = new THREE.PointsMaterial({ size: 2.5, color: 0xa78bfa, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(pointGeo, pointMat);
    scene.add(points);

    // Lines (pre-allocate max connections)
    const MAX_SEGS    = PARTICLE_COUNT * PARTICLE_COUNT;
    const linePosArr  = new Float32Array(MAX_SEGS * 6);
    const lineGeo     = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
    const lineMat  = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.18 });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    const pts = pointGeo.attributes.position.array;

    let rafId;
    let active = true;

    function animate() {
      if (!active) return;
      rafId = requestAnimationFrame(animate);

      // Move particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        pts[i3]     += velocities[i3];
        pts[i3 + 1] += velocities[i3 + 1];
        if (pts[i3]     >  300 || pts[i3]     < -300) velocities[i3]     *= -1;
        if (pts[i3 + 1] >  200 || pts[i3 + 1] < -200) velocities[i3 + 1] *= -1;
      }
      pointGeo.attributes.position.needsUpdate = true;

      // Build connections
      let segCount = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = pts[i*3] - pts[j*3];
          const dy = pts[i*3+1] - pts[j*3+1];
          if (dx * dx + dy * dy < CONNECTION_DIST * CONNECTION_DIST) {
            const base = segCount * 6;
            linePosArr[base]     = pts[i*3];
            linePosArr[base + 1] = pts[i*3 + 1];
            linePosArr[base + 2] = pts[i*3 + 2];
            linePosArr[base + 3] = pts[j*3];
            linePosArr[base + 4] = pts[j*3 + 1];
            linePosArr[base + 5] = pts[j*3 + 2];
            segCount++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, segCount * 2);

      renderer.render(scene, camera);
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        active = false;
        cancelAnimationFrame(rafId);
      } else {
        active = true;
        animate();
      }
    });

    // Responsive resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    animate();
  }());

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

  /* ----------------------------------------------------------
     DARK / LIGHT MODE TOGGLE
  ---------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon      = document.getElementById('themeIcon');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark',  isDark);
    document.body.classList.toggle('light', !isDark);
    if (themeIcon) {
      themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (_) {}
  }

  // Initialize from saved preference
  const savedTheme = (() => { try { return localStorage.getItem('theme'); } catch (_) { return null; } })();
  applyTheme(savedTheme !== 'light'); // default dark

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark'));
    });
  }

  /* ----------------------------------------------------------
     GITHUB API – live profile card (cached 24 h)
  ---------------------------------------------------------- */
  (function loadGitHubProfile() {
    const GITHUB_USER   = 'debangshidas04304';
    const CACHE_KEY     = 'gh_profile_' + GITHUB_USER;
    const CACHE_TTL     = 24 * 60 * 60 * 1000; // 24 hours
    const FALLBACK_BIO  = 'Full Stack Developer · MCA Student · MERN Enthusiast';

    function renderProfile(data) {
      const avatar    = document.getElementById('gh-avatar');
      const name      = document.getElementById('gh-name');
      const login     = document.getElementById('gh-login');
      const bio       = document.getElementById('gh-bio');
      const repos     = document.getElementById('gh-repos');
      const followers = document.getElementById('gh-followers');
      const following = document.getElementById('gh-following');

      if (avatar)    { avatar.src = data.avatar_url; avatar.alt = data.name || GITHUB_USER; }
      if (name)      name.textContent    = data.name    || GITHUB_USER;
      if (login)     login.textContent   = '@' + data.login;
      if (bio)       bio.textContent     = data.bio     || FALLBACK_BIO;
      if (repos)     repos.textContent   = data.public_repos;
      if (followers) followers.textContent = data.followers;
      if (following) following.textContent = data.following;
    }

    // Try cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, data } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) { renderProfile(data); return; }
      }
    } catch (_) {}

    // Fetch fresh data
    fetch('https://api.github.com/users/' + GITHUB_USER)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`GitHub API failed: ${r.status}`)))
      .then(data => {
        renderProfile(data);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch (_) {}
      })
      .catch(() => {
        // Silently fall back to placeholder bio
        const bio = document.getElementById('gh-bio');
        if (bio) bio.textContent = FALLBACK_BIO;
      });
  }());

});
