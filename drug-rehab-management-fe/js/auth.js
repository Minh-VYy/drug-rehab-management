/* =============================================
   auth.js — Authentication (fake / demo)
   Sau này thay bằng REST API /api/auth/login
   ============================================= */

const DEMO_ACCOUNTS = [
    { username: 'admin', password: '123456', role: 'admin', name: 'Nguyễn Văn An' },
    { username: 'bs.mai', password: '123456', role: 'doctor', name: 'BS. Trần Thị Mai' },
    { username: 'nv.hung', password: '123456', role: 'staff', name: 'NV. Lê Văn Hùng' },
    { username: 'ql.phuong', password: '123456', role: 'manager', name: 'QL. Phạm Thị Phương' },
    { username: 'ld.duc', password: '123456', role: 'director', name: 'GĐ. Hoàng Văn Đức' },
    { username: 'ca.nam', password: '123456', role: 'police', name: 'CA. Đặng Văn Nam' },
    { username: 'nt.lan', password: '123456', role: 'family', name: 'Nguyễn Thị Lan' },
];

const ROLE_PORTALS = {
    admin: 'portals/admin.html',
    doctor: 'portals/doctor.html',
    staff: 'portals/staff.html',
    manager: 'portals/manager.html',
    director: 'portals/director.html',
    police: 'portals/police.html',
    family: 'portals/family.html',
};

/* ---- Login form handler ---- */
function handleLogin(e) {
    if (e) e.preventDefault();
    hideAlert('loginAlert');

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!username || !password) {
        showAlert('loginAlert', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', 'danger');
        return;
    }

    const account = DEMO_ACCOUNTS.find(a =>
        a.username === username && a.password === password
    );

    if (!account) {
        showAlert('loginAlert', 'Tên đăng nhập hoặc mật khẩu không đúng. Thử: admin / 123456', 'danger');
        shakeForm();
        return;
    }

    // Save session
    sessionStorage.setItem('auth_role', account.role);
    sessionStorage.setItem('auth_name', account.name);
    sessionStorage.setItem('auth_user', account.username);

    showAlert('loginAlert', `Đăng nhập thành công! Đang chuyển hướng...`, 'success');
    setTimeout(() => {
        window.location.href = ROLE_PORTALS[account.role] || 'portals/family.html';
    }, 800);
}

/* ---- Register form handler ---- */
function handleRegister(e) {
    if (e) e.preventDefault();
    let valid = true;

    const fields = [
        { id: 'reg_name', label: 'Họ tên', minLen: 3 },
        { id: 'reg_phone', label: 'Số điện thoại', pattern: /^0\d{9}$/ },
        { id: 'reg_email', label: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        { id: 'reg_username', label: 'Tên đăng nhập', minLen: 4 },
        { id: 'reg_password', label: 'Mật khẩu', minLen: 6 },
    ];

    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.id + '_err');
        if (!el) return;
        const val = el.value.trim();
        let msg = '';
        if (!val) {
            msg = `${f.label} không được để trống.`;
        } else if (f.minLen && val.length < f.minLen) {
            msg = `${f.label} phải có ít nhất ${f.minLen} ký tự.`;
        } else if (f.pattern && !f.pattern.test(val)) {
            msg = `${f.label} không hợp lệ.`;
        }
        if (msg) {
            valid = false;
            el.classList.add('is-invalid');
            if (err) { err.textContent = msg; err.classList.add('show'); }
        } else {
            el.classList.remove('is-invalid');
            if (err) err.classList.remove('show');
        }
    });

    // Password confirm
    const pw = document.getElementById('reg_password')?.value;
    const cpw = document.getElementById('reg_confirm')?.value;
    const cpwErr = document.getElementById('reg_confirm_err');
    if (pw && cpw && pw !== cpw) {
        valid = false;
        document.getElementById('reg_confirm')?.classList.add('is-invalid');
        if (cpwErr) { cpwErr.textContent = 'Mật khẩu xác nhận không khớp.'; cpwErr.classList.add('show'); }
    }

    if (!valid) return;

    showAlert('registerAlert', 'Đăng ký thành công! Tài khoản đang chờ xét duyệt. Bạn sẽ được thông báo qua email.', 'success');
    document.getElementById('registerForm')?.reset();
}

/* ---- Helpers ---- */
function showAlert(id, msg, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `alert alert-${type}`;
    el.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${msg}`;
    el.style.display = 'flex';
}

function hideAlert(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

function shakeForm() {
    const form = document.querySelector('.auth-card');
    if (!form) return;
    form.style.animation = 'shake .4s ease';
    setTimeout(() => form.style.animation = '', 500);
}

/* ---- Guard: redirect if not logged in ---- */
function requireAuth() {
    if (!sessionStorage.getItem('auth_role')) {
        window.location.href = '../login.html';
    }
}

/* CSS shake animation (injected) */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`;
document.head.appendChild(shakeStyle);
