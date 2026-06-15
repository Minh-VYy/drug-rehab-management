/**
 * Reusable particle canvas animation for RehabCare Đà Nẵng landing pages
 * @param {string} canvasId ID of the canvas element
 * @param {string} containerSelector CSS selector of the parent container for size calculation
 * @param {object} options Customization options (color, speed, maxDistance, countFactor)
 */
function initParticleCanvas(canvasId, containerSelector, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const color = options.color || 'rgba(148,197,255,';
  const maxDistance = options.maxDistance || 90;
  const speed = options.speed !== undefined ? options.speed : 0.28;
  const countFactor = options.countFactor || 15; // Dividor for particle count based on width

  let particles = [];

  function resize() {
    canvas.width = container.offsetWidth || window.innerWidth;
    canvas.height = container.offsetHeight || container.clientHeight || 500;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(canvas.width / countFactor);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        a: Math.random() * 0.45 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color + p.a + ')';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = color + (0.07 * (1 - dist / maxDistance)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  drawParticles();
}
