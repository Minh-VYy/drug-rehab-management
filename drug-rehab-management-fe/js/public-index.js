/* ====================== PUBLIC INDEX LOGIC ====================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Initialize Particle Canvas ---- */
  if (typeof initParticleCanvas === 'function') {
    initParticleCanvas('particleCanvas', '#hero', {
      countFactor: 14,
      speed: 0.3,
      maxDistance: 90
    });
  }

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---- 3D card tilt effect ---- */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = (e.clientY - cy) / (rect.height / 2) * -10;
      const ry = (e.clientX - cx) / (rect.width / 2) * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.feature-card, .process-step');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 80 * Array.from(revealEls).indexOf(entry.target) % 6);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      revealObserver.observe(el);
    });
  }

  /* ---- Animated counter ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    let current = 0;
    const inc = target / (dur / 16);
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, 16);
  }

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsStrip);
  }

  /* ---- Smooth hero parallax ---- */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroContent.style.transform = `translateY(${sy * 0.25}px)`;
        heroContent.style.opacity = `${1 - sy / window.innerHeight * 1.3}`;
      }
    }, { passive: true });
  }
});
