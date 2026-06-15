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

/* ---- Quick demo login ---- */
const QUICK = {
  admin: 'Nguyễn Văn An',
  doctor: 'BS. Trần Thị Mai',
  staff: 'NV. Lê Văn Hùng',
  family: 'Nguyễn Thị Lan',
  police: 'CA. Đặng Văn Nam',
  manager: 'QL. Phạm Thị Phương',
  director: 'GĐ. Hoàng Văn Đức'
};

function quickLogin(role) {
  const users = {
    admin: 'admin',
    doctor: 'bs.mai',
    staff: 'nv.hung',
    family: 'nt.lan',
    police: 'ca.nam',
    manager: 'ql.phuong',
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
