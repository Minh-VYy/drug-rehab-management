/* ====================== PUBLIC INDEX LOGIC ====================== */

document.addEventListener('DOMContentLoaded', () => {
  const homeOverviewReady = loadPublicHomeOverview();

  /* ---- Initialize Particle Canvas ---- */
  if (typeof initParticleCanvas === 'function') {
    const particleTarget = document.querySelector('#hero') ? '#hero' : '.page-header';
    initParticleCanvas('particleCanvas', particleTarget, {
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
  const revealEls = document.querySelectorAll('.feature-card, .process-step, .sign-card, .req-card, .timeline-item');
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
          homeOverviewReady.finally(() => {
            entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          });
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

  /* ---- Subpages Logic (Tabs & Accordion) ---- */
  const tabs = document.querySelectorAll('.guide-tab');
  const panels = document.querySelectorAll('.guide-panel');
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const pnl = document.getElementById(targetId);
        if(pnl) pnl.classList.add('active');
      });
    });
  }

  const accordions = document.querySelectorAll('.accordion-item');
  if (accordions.length > 0) {
    accordions.forEach(acc => {
      const header = acc.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          accordions.forEach(item => {
            if (item !== acc) item.classList.remove('active');
          });
          acc.classList.toggle('active');
        });
      }
    });
  }

  /* ---- Active Nav Link logic ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref && linkHref === currentPath) {
      link.classList.add('active');
      link.style.background = 'var(--bg)';
      link.style.color = 'var(--text)';
      link.style.fontWeight = '700';
    }
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

async function loadPublicHomeOverview() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    setPublicHomeStatus('Đang tải dữ liệu từ hệ thống...');
    const baseUrl = typeof CONFIG !== 'undefined' ? CONFIG.BASE_API_URL : 'http://localhost:8080/api/v1';
    const response = await fetch(`${baseUrl}/public/home`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.message || 'Public home API request failed');
    }

    applyPublicHomeOverview(payload?.data || payload);
    setPublicHomeStatus('Đã đồng bộ dữ liệu từ hệ thống.', 'success');
  } catch (error) {
    resetPublicHomeOverview();
    setPublicHomeStatus('Chưa kết nối được backend. Kiểm tra API /api/v1/public/home.', 'error');
    console.warn('Public home overview unavailable:', error);
  } finally {
    clearTimeout(timeoutId);
  }
}

function applyPublicHomeOverview(data) {
  if (!data) return;

  setCounterValue('statTotalPatients', data.totalPatients);
  setCounterValue('statCompletionRate', data.completionRate, '%');
  setCounterValue('statActiveDoctors', data.activeDoctors);

  const supportAvailability = document.getElementById('statSupportAvailability');
  if (supportAvailability && data.supportAvailability) {
    supportAvailability.textContent = data.supportAvailability;
  }

  const completedPatients = document.getElementById('heroCompletedPatients');
  if (completedPatients && Number.isFinite(Number(data.completedPatients))) {
    completedPatients.textContent = `${formatPublicNumber(data.completedPatients)} học viên`;
  }

  const roleLevels = document.getElementById('heroRoleLevels');
  if (roleLevels && Number.isFinite(Number(data.roleLevels))) {
    roleLevels.textContent = `Bảo mật ${data.roleLevels} cấp`;
  }
}

function resetPublicHomeOverview() {
  setCounterValue('statTotalPatients', 0);
  setCounterValue('statCompletionRate', 0, '%');
  setCounterValue('statActiveDoctors', 0);

  const supportAvailability = document.getElementById('statSupportAvailability');
  if (supportAvailability) {
    supportAvailability.textContent = '--';
  }

  const completedPatients = document.getElementById('heroCompletedPatients');
  if (completedPatients) {
    completedPatients.textContent = '-- học viên';
  }

  const roleLevels = document.getElementById('heroRoleLevels');
  if (roleLevels) {
    roleLevels.textContent = 'Bảo mật -- cấp';
  }
}

function setPublicHomeStatus(message, type = '') {
  const status = document.getElementById('statsApiStatus');
  if (!status) return;

  status.textContent = message;
  status.classList.toggle('is-success', type === 'success');
  status.classList.toggle('is-error', type === 'error');
}

function setCounterValue(id, value, suffix = '') {
  const el = document.getElementById(id);
  const number = Number(value);
  if (!el || !Number.isFinite(number)) return;

  el.dataset.count = String(Math.max(0, Math.round(number)));
  if (suffix) {
    el.dataset.suffix = suffix;
  }
  el.textContent = `0${el.dataset.suffix || ''}`;
}

function formatPublicNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  const rounded = Math.max(0, Math.round(number));
  return rounded > 0 ? `${rounded.toLocaleString('vi-VN')}+` : '0';
}
