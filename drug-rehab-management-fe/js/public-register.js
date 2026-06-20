/* ====================== PUBLIC REGISTER LOGIC ====================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Initialize Particle Canvas ---- */
  if (typeof initParticleCanvas === 'function') {
    initParticleCanvas('registerCanvas', '.auth-left', {
      countFactor: 16,
      speed: 0.25,
      maxDistance: 85
    });
  }

  /* ---- Password strength listener ---- */
  const pwInput = document.getElementById('reg_password');
  if (pwInput) {
    pwInput.addEventListener('input', function() {
      const v = this.value;
      let score = 0;
      if (v.length >= 6) score++;
      if (v.length >= 10) score++;
      if (/[A-Z]/.test(v) || /[0-9]/.test(v)) score++;
      if (/[!@#$%^&*]/.test(v)) score++;
      
      const colors = ['#ef4444', '#f97316', '#eab308', '#10b981'];
      const labels = ['Rất yếu', 'Trung bình', 'Khá mạnh', 'Mạnh'];
      
      document.querySelectorAll('.strength-bar').forEach((bar, i) => {
        bar.style.background = i < score ? colors[score - 1] : '#e2e8f0';
      });
      
      const lbl = document.getElementById('pwStrengthLabel');
      if (lbl) {
        lbl.textContent = v ? `Độ mạnh: ${labels[score - 1] || ''}` : '';
        lbl.style.color = v ? colors[score - 1] : '#94a3b8';
      }
    });
  }
});

/* ---- Multi-step form ---- */
let currentStep = 0;

function goStep(n) {
  if (n > currentStep && !validateStep(currentStep)) return;
  if (n === 2) fillConfirm();
  
  const currentPanel = document.querySelector(`#panel${currentStep}`);
  const currentTab = document.querySelector(`#tab${currentStep}`);
  if (currentPanel) currentPanel.classList.remove('active');
  if (currentTab) {
    currentTab.classList.remove('active');
    if (n > currentStep) currentTab.classList.add('done');
  }
  
  currentStep = n;
  
  const nextPanel = document.querySelector(`#panel${n}`);
  const nextTab = document.querySelector(`#tab${n}`);
  if (nextPanel) nextPanel.classList.add('active');
  if (nextTab) nextTab.classList.add('active');
  
  // Update side progress dots
  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (dot) {
      dot.classList.remove('active', 'done');
      if (i < currentStep) dot.classList.add('done');
      if (i === currentStep) dot.classList.add('active');
    }
  }
}

function validateStep(step) {
  let ok = true;
  
  function err(id, msg) {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + '_err');
    if (!el) return;
    el.classList.add('is-invalid');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
    ok = false;
  }
  
  function clear(id) {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + '_err');
    if (!el) return;
    el.classList.remove('is-invalid');
    if (errEl) errEl.classList.remove('show');
  }
  
  if (step === 0) {
    const name = document.getElementById('reg_name')?.value.trim();
    const phone = document.getElementById('reg_phone')?.value.trim();
    const email = document.getElementById('reg_email')?.value.trim();
    const rel = document.getElementById('reg_relation')?.value;
    
    clear('reg_name');
    clear('reg_phone');
    clear('reg_email');
    clear('reg_relation');
    
    if (!name || name.length < 3) {
      err('reg_name', 'Họ tên phải có ít nhất 3 ký tự.');
    }
    if (!phone || !/^0\d{9}$/.test(phone)) {
      err('reg_phone', 'Số điện thoại không hợp lệ (VD: 0901234567).');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err('reg_email', 'Email không hợp lệ.');
    }
    if (!rel) {
      err('reg_relation', 'Vui lòng chọn mối quan hệ.');
    }
  }
  
  if (step === 1) {
    const user = document.getElementById('reg_username')?.value.trim();
    const pw = document.getElementById('reg_password')?.value;
    const cpw = document.getElementById('reg_confirm')?.value;
    
    clear('reg_username');
    clear('reg_password');
    clear('reg_confirm');
    
    if (!user || user.length < 4) {
      err('reg_username', 'Tên đăng nhập phải có ít nhất 4 ký tự.');
    }
    if (!pw || pw.length < 6) {
      err('reg_password', 'Mật khẩu phải có ít nhất 6 ký tự.');
    }
    if (pw && cpw && pw !== cpw) {
      err('reg_confirm', 'Mật khẩu xác nhận không khớp.');
    }
  }
  
  return ok;
}

function fillConfirm() {
  const confirmName = document.getElementById('confirm_name');
  const confirmPhone = document.getElementById('confirm_phone');
  const confirmEmail = document.getElementById('confirm_email');
  const confirmRelation = document.getElementById('confirm_relation');
  const confirmUser = document.getElementById('confirm_user');

  if (confirmName) confirmName.textContent = document.getElementById('reg_name')?.value || '—';
  if (confirmPhone) confirmPhone.textContent = document.getElementById('reg_phone')?.value || '—';
  if (confirmEmail) confirmEmail.textContent = document.getElementById('reg_email')?.value || '—';
  if (confirmRelation) confirmRelation.textContent = document.getElementById('reg_relation')?.value || '—';
  if (confirmUser) confirmUser.textContent = document.getElementById('reg_username')?.value || '—';
}

async function submitRegister() {
  const agreeCheck = document.getElementById('agreeTerms');
  const a = document.getElementById('registerAlert');
  if (!a) return;

  if (agreeCheck && !agreeCheck.checked) {
    a.className = 'alert alert-danger show';
    a.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Vui lòng đồng ý với Điều khoản sử dụng.';
    return;
  }
  
  const payload = {
    fullName: document.getElementById('reg_name')?.value?.trim(),
    phoneNumber: document.getElementById('reg_phone')?.value?.trim(),
    email: document.getElementById('reg_email')?.value?.trim(),
    username: document.getElementById('reg_username')?.value?.trim(),
    password: document.getElementById('reg_password')?.value,
    roleName: 'NGUOI_THAN'
  };

  try {
    document.querySelectorAll('.btn-green, .btn-secondary').forEach(b => {
      b.disabled = true;
    });

    await Api.post('/auth/register', payload);

    a.className = 'alert alert-success show';
    a.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đăng ký thành công! Tài khoản đang chờ xét duyệt. Sẽ tự động chuyển về trang Đăng nhập...';
    
    // Tự động chuyển hướng về trang login sau 2 giây
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
  } catch (err) {
    a.className = 'alert alert-danger show';
    a.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${err.message || 'Đăng ký thất bại, vui lòng thử lại.'}`;
    document.querySelectorAll('.btn-green, .btn-secondary').forEach(b => {
      b.disabled = false;
    });
  }
}
