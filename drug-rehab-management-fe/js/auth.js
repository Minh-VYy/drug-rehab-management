/* =============================================
   auth.js — Authentication (fake / demo)
   Sau này thay bằng REST API /api/auth/login
   ============================================= */

const ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    STAFF: 'staff',
    MANAGER: 'manager',
    LEADER: 'director',
    DIRECTOR: 'director',
    POLICE: 'police',
    FAMILY: 'family'
};

const ROLE_LABELS = {
    admin: 'Quản trị hệ thống',
    doctor: 'Bác sĩ phụ trách',
    staff: 'Nhân viên trung tâm',
    manager: 'Cán bộ quản lý',
    director: 'Lãnh đạo trung tâm',
    police: 'Công an',
    family: 'Người thân'
};

const GENERIC_USER_NAMES = [
    ...Object.values(ROLE_LABELS),
    'Bác Sĩ Phụ Trách',
    'Cán Bộ Trung Tâm',
    'Cán Bộ Quản Lý',
    'Cán Bộ Quản Lý Hồ Sơ',
    'Người Lãnh Đạo Trung Tâm',
    'Quản Trị Hệ Thống',
    'Người Thân Cai Nghiện'
];

const DEMO_ACCOUNTS = [
    { username: 'admin', password: '123456', role: 'admin', name: 'Nguyễn Văn An' },
    { username: 'doctor', password: '123456', role: 'doctor', name: 'BS. Trần Thị Mai' },
    { username: 'manager', password: '123456', role: 'manager', name: 'QL. Phạm Thị Phương' },
    { username: 'bs.mai', password: '123456', role: 'doctor', name: 'BS. Trần Thị Mai' },
    { username: 'nv.hung', password: '123456', role: 'staff', name: 'NV. Lê Văn Hùng' },
    { username: 'ql.phuong', password: '123456', role: 'manager', name: 'QL. Phạm Thị Phương' },
    { username: 'ld.duc', password: '123456', role: 'director', name: 'GĐ. Hoàng Văn Đức' },
    { username: 'ca.nam', password: '123456', role: 'police', name: 'CA. Đặng Văn Nam' },
    { username: 'nt.lan', password: '123456', role: 'family', name: 'Nguyễn Thị Lan' },
];

const ROLE_PORTALS = {
    admin: 'dashboard.html',
    doctor: 'dashboard.html',
    staff: 'dashboard.html',
    manager: 'dashboard.html',
    director: 'dashboard.html',
    police: 'dashboard.html',
    family: 'dashboard.html',
};

const Auth = {
    login(username, password, role) {
        const account = DEMO_ACCOUNTS.find(a =>
            a.username === username &&
            a.password === password &&
            (!role || a.role === role)
        );

        if (!account) return null;
        this.setSession(account);
        return account;
    },

    fakeLogin(username, password, role) {
        const account = DEMO_ACCOUNTS.find(a =>
            a.username === username &&
            a.password === password &&
            (!role || a.role === role)
        );

        if (!account) return null;
        this.setSession(account);
        return account;
    },

    setSession(account) {
        const role = account.role;
        const displayName = this.resolveDisplayName(account, role);
        const user = {
            username: account.username,
            role,
            roleLabel: ROLE_LABELS[role] || role,
            name: displayName,
            fullName: displayName,
            token: account.token || `demo-token-${account.username}`
        };

        sessionStorage.setItem('auth_role', user.role);
        sessionStorage.setItem('auth_name', user.fullName);
        sessionStorage.setItem('auth_user', user.username);
        sessionStorage.setItem('auth_token', user.token);
        localStorage.setItem('auth_user_data', JSON.stringify(user));
    },

    getCurrentUser() {
        const saved = localStorage.getItem('auth_user_data');
        if (saved) {
            try {
                return this.normalizeUser(JSON.parse(saved));
            } catch {
                localStorage.removeItem('auth_user_data');
            }
        }

        const role = sessionStorage.getItem('auth_role');
        const name = sessionStorage.getItem('auth_name');
        const username = sessionStorage.getItem('auth_user');
        if (!role || !username) return null;

        return this.normalizeUser({
            username,
            role,
            roleLabel: ROLE_LABELS[role] || role,
            name: name || username,
            fullName: name || username,
            token: sessionStorage.getItem('auth_token')
        });
    },

    normalizeUser(user) {
        if (!user) return null;
        const role = user.role;
        const displayName = this.resolveDisplayName(user, role);
        return {
            ...user,
            roleLabel: user.roleLabel || ROLE_LABELS[role] || role,
            name: displayName,
            fullName: displayName
        };
    },

    resolveDisplayName(account, role) {
        const rawName = account.fullName || account.name || account.displayName || '';
        const trimmedName = String(rawName).trim();
        if (trimmedName && !this.isGenericDisplayName(trimmedName, role)) {
            return trimmedName;
        }
        return account.username || 'Người dùng';
    },

    isGenericDisplayName(name, role) {
        const normalizedName = this.normalizeText(name);
        const roleLabel = ROLE_LABELS[role];
        return GENERIC_USER_NAMES.some(genericName => this.normalizeText(genericName) === normalizedName)
            || (roleLabel && this.normalizeText(roleLabel) === normalizedName);
    },

    normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    },

    getDisplayName(user = this.getCurrentUser()) {
        return this.resolveDisplayName(user || {}, user?.role);
    },

    getToken() {
        return this.getCurrentUser()?.token || sessionStorage.getItem('auth_token') || null;
    },

    isAuthenticated() {
        return Boolean(this.getCurrentUser());
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return Boolean(user && user.role === role);
    },

    requireRole(role) {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }

        if (!this.hasRole(role)) {
            if (typeof Toast !== 'undefined') {
                Toast.show('Bạn không có quyền truy cập chức năng này', 'danger');
            }
            return false;
        }

        return true;
    },

    roleLabel(role) {
        return ROLE_LABELS[role] || role;
    },

    logout() {
        sessionStorage.removeItem('auth_role');
        sessionStorage.removeItem('auth_name');
        sessionStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user_data');
        window.location.href = 'login.html';
    }
};

window.ROLES = ROLES;
window.Auth = Auth;

/* ---- Login form handler ---- */
async function handleLogin(e) {
    if (e) e.preventDefault();
    hideAlert('loginAlert');

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!username) {
        showAlert('loginAlert', 'Vui lòng nhập tên đăng nhập.', 'danger');
        return;
    }

    if (!password) {
        showAlert('loginAlert', 'Vui lòng nhập mật khẩu.', 'danger');
        return;
    }

    try {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng nhập...';
        }

        const data = await Api.post('/auth/login', { username, password });
        
        // Map backend roles to frontend ROLES
        const roleMapping = {
            'quantri_hethong': 'admin',
            'can_bo_phu_trach': 'doctor',
            'can_bo_quan_ly': 'manager',
            'can_bo_trung_tam': 'staff',
            'nguoi_lanh_dao': 'director',
            'can_bo_quan_ly_ho_so': 'police',
            'nguoi_than': 'family'
        };

        const backendRole = data.role.toLowerCase();
        const mappedRole = roleMapping[backendRole] || backendRole;

        const account = {
            username: data.username,
            role: mappedRole,
            fullName: data.fullName,
            token: data.token
        };

        Auth.setSession(account);

        showAlert('loginAlert', `Đăng nhập thành công! Đang chuyển hướng...`, 'success');
        setTimeout(() => {
            window.location.href = ROLE_PORTALS[account.role] || 'dashboard.html';
        }, 800);
    } catch (err) {
        showAlert('loginAlert', err.message || 'Tài khoản hoặc mật khẩu không đúng.', 'danger');
        shakeForm();
    } finally {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng nhập';
        }
    }
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
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

function isAuthenticated() {
    return Auth.isAuthenticated();
}

function fakeLogin(username, password, role) {
    return Auth.fakeLogin(username, password, role);
}

function hasRole(role) {
    return Auth.hasRole(role);
}

function requireRole(role) {
    return Auth.requireRole(role);
}

function getCurrentUser() {
    return Auth.getCurrentUser() || { role: 'guest', name: 'Người dùng', fullName: 'Người dùng' };
}

function logout() {
    Auth.logout();
}

/* CSS shake animation (injected) */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`;
document.head.appendChild(shakeStyle);
