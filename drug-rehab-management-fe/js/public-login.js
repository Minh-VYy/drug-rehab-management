/* ====================== PUBLIC LOGIN LOGIC ====================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Initialize Particle Canvas ---- */
  if (typeof initParticleCanvas === 'function') {
    initParticleCanvas('loginCanvas', '.auth-left', {
      countFactor: 15,
      speed: 0.28,
      maxDistance: 85
    });
  }
});

/* ---- Password toggle ---- */
function togglePw() {
  const inp = document.getElementById('password');
  const ico = document.querySelector('#pwToggle i');
  if (!inp || !ico) return;

  if (inp.type === 'password') {
    inp.type = 'text';
    ico.className = 'fa-solid fa-eye-slash';
  } else {
    inp.type = 'password';
    ico.className = 'fa-solid fa-eye';
  }
}

function quickLogin(role) {
  const users = {
    admin: 'admin',
    doctor: 'doctor',
    staff: 'nv.hung',
    family: 'nt.lan',
    police: 'ca.nam',
    manager: 'manager',
    director: 'ld.duc'
  };
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (usernameInput) usernameInput.value = users[role] || role;
  if (passwordInput) passwordInput.value = '123456';
  
  if (typeof handleLogin === 'function') {
    handleLogin();
  }
}
