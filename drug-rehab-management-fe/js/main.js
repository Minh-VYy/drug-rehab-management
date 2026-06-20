

/* ---- Role configuration ---- */
const RoleConfig = {
  admin: { label: 'Quản trị hệ thống', icon: 'fa-shield-halved', portal: 'dashboard.html' },
  doctor: { label: 'Bác sĩ phụ trách', icon: 'fa-user-doctor', portal: 'dashboard.html' },
  staff: { label: 'Cán bộ trung tâm', icon: 'fa-id-badge', portal: 'dashboard.html' },
  manager: { label: 'Cán bộ quản lý', icon: 'fa-chart-pie', portal: 'dashboard.html' },
  director: { label: 'Lãnh đạo trung tâm', icon: 'fa-building-user', portal: 'dashboard.html' },
  police: { label: 'Cán bộ quản lý hồ sơ (CA)', icon: 'fa-badge-check', portal: 'dashboard.html' },
  family: { label: 'Người thân', icon: 'fa-heart', portal: 'dashboard.html' },
};

/* ---- Fake login / role switch ---- */
function fakeLogin(roleOrUsername, nameOrPassword, requestedRole) {
  if (typeof Auth !== 'undefined' && (requestedRole || nameOrPassword === '123456')) {
    return Auth.fakeLogin(roleOrUsername, nameOrPassword, requestedRole);
  }

  const cfg = RoleConfig[roleOrUsername];
  if (!cfg) return;
  sessionStorage.setItem('auth_role', roleOrUsername);
  sessionStorage.setItem('auth_name', nameOrPassword || cfg.label);
  window.location.href = cfg.portal;
}

function switchRole(role) {
  const cfg = RoleConfig[role];
  if (!cfg) return;
  fakeLogin(role, cfg.label);
}

function getCurrentUser() {
  if (typeof Auth !== 'undefined' && Auth.getCurrentUser()) {
    return Auth.getCurrentUser();
  }
  return {
    role: sessionStorage.getItem('auth_role') || 'staff',
    name: sessionStorage.getItem('auth_name') || 'Người dùng',
    fullName: sessionStorage.getItem('auth_name') || 'Người dùng',
    username: sessionStorage.getItem('auth_user') || '',
  };
}

function logout() {
  if (typeof Auth !== 'undefined') {
    Auth.logout();
    return;
  }
  sessionStorage.clear();
  window.location.href = 'login.html';
}

/* ---- Toast notifications ---- */
function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.success} toast-icon ${type}"></i>
    <span class="toast-msg">${message}</span>
    <i class="fa-solid fa-xmark toast-close" onclick="this.closest('.toast').remove()"></i>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

/* ---- Modal ---- */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Close on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* ---- Confirm dialog ---- */
function showConfirm(message, onConfirm, type = 'danger') {
  const overlay = document.getElementById('confirmOverlay');
  const msgEl = document.getElementById('confirmMessage');
  const btnEl = document.getElementById('confirmBtn');
  if (!overlay) return;
  msgEl.textContent = message;
  btnEl.className = `btn btn-${type}`;
  btnEl.onclick = () => { overlay.classList.remove('open'); onConfirm(); };
  overlay.classList.add('open');
}

/* ---- Table rendering ---- */
function renderTable(tbodyId, columns, data, actions) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="${columns.length + (actions ? 1 : 0)}" style="text-align:center;color:var(--text-muted);padding:2rem">Không có dữ liệu</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(row => `
    <tr>
      ${columns.map(col => `<td>${col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}</td>`).join('')}
      ${actions ? `<td>${actions(row)}</td>` : ''}
    </tr>
  `).join('');
}

/* ---- Status badge helper ---- */
function statusBadge(status) {
  const map = {
    'Chờ duyệt': 'warning', 'Chờ phản hồi': 'warning', 'Chờ phê duyệt': 'warning', 'Đã lên lịch': 'warning',
    'Đã duyệt': 'success', 'Đã tiếp nhận': 'success', 'Đồng ý': 'success', 'Hoàn thành': 'success',
    'Đang áp dụng': 'primary', 'Đang điều trị': 'primary', 'Hiển thị': 'primary', 'Đã phản hồi': 'primary', 'Đã phê duyệt': 'primary',
    'Từ chối': 'danger', 'Hủy': 'danger', 'Ẩn': 'danger', 'Thất bại': 'danger', 'Inactive': 'danger',
    'Tự nguyện': 'success', 'Bắt buộc': 'danger',
  };
  const cls = map[status] || 'secondary';
  return `<span class="badge badge-${cls}">${status}</span>`;
}

/* ---- Sidebar toggle (mobile) ---- */
function initSidebarToggle() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

/* ---- Tab switching ---- */
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector || '.tab-nav');
  if (!container) return;
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('active', p.id === target);
      });
    });
  });
}

/* ---- Drug rows (medicine schedule) ---- */
let drugRowCount = 0;
function addDrugRow(tableId) {
  drugRowCount++;
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="form-control" placeholder="Tên thuốc" /></td>
    <td><input class="form-control" placeholder="VD: 50mg" /></td>
    <td>
      <select class="form-control">
        <option>1 lần/ngày</option><option>2 lần/ngày</option>
        <option>3 lần/ngày</option><option>Khi cần</option>
      </select>
    </td>
    <td><input class="form-control" type="time" /></td>
    <td><button class="btn btn-sm btn-danger" onclick="this.closest('tr').remove()"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
}

/* ---- Fake charts (canvas bar / line) ---- */
function drawBarChart(canvasId, labels, values, color = '#2563EB') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const max = Math.max(...values, 1);
  const barW = (W - 60) / labels.length - 10;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = 20 + (H - 50) * (1 - i / 4);
    ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(W - 10, y); ctx.stroke();
    ctx.fillStyle = '#94A3B8'; ctx.font = '10px Segoe UI';
    ctx.fillText(Math.round(max * i / 4), 5, y + 4);
  }

  labels.forEach((lbl, i) => {
    const x = 55 + i * ((W - 60) / labels.length);
    const bH = ((H - 50) * values[i]) / max;
    const y = H - 30 - bH;
    // Bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, bH, [4, 4, 0, 0]) : ctx.rect(x, y, barW, bH);
    ctx.fill();
    // Label
    ctx.fillStyle = '#64748B'; ctx.font = '9px Segoe UI';
    ctx.fillText(lbl, x + barW / 2 - (lbl.length * 3), H - 10);
    // Value
    ctx.fillStyle = '#1E293B'; ctx.font = 'bold 9px Segoe UI';
    ctx.fillText(values[i], x + barW / 2 - 5, y - 4);
  });
}

function drawLineChart(canvasId, labels, values, color = '#10B981') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const max = Math.max(...values, 1);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, W, H);

  const pts = values.map((v, i) => ({
    x: 55 + i * ((W - 65) / (labels.length - 1)),
    y: 20 + (H - 50) * (1 - v / max),
  }));

  // Fill area
  ctx.beginPath();
  ctx.moveTo(pts[0].x, H - 30);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H - 30);
  ctx.closePath();
  ctx.fillStyle = color + '22';
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots & labels
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = '#94A3B8'; ctx.font = '9px Segoe UI';
    ctx.fillText(labels[i], p.x - labels[i].length * 2.5, H - 10);
    ctx.fillStyle = '#1E293B'; ctx.font = 'bold 9px Segoe UI';
    ctx.fillText(values[i], p.x - 5, p.y - 8);
  });
}

function drawPieChart(canvasId, segments) {
  // segments: [{label, value, color}]
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 30;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let angle = -Math.PI / 2;
  ctx.clearRect(0, 0, W, H);

  segments.forEach(seg => {
    const sweep = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    // Label
    const midAngle = angle + sweep / 2;
    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Segoe UI';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(seg.value / total * 100) + '%', lx, ly);
    angle += sweep;
  });

  // Legend
  let lx = 10, ly = H - 22;
  segments.forEach(seg => {
    ctx.fillStyle = seg.color;
    ctx.fillRect(lx, ly, 12, 10);
    ctx.fillStyle = '#64748B'; ctx.font = '9px Segoe UI'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(seg.label, lx + 14, ly + 5);
    lx += ctx.measureText(seg.label).width + 30;
  });
}

/* ---- Init on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initTabs();

  if (document.getElementById('app-layout')) {
    initDashboardApp();
    return;
  }

  // Public page user info placeholders
  const user = getCurrentUser();
  const displayName = typeof Auth !== 'undefined'
    ? Auth.getDisplayName(user)
    : (user.name || user.fullName || 'Người dùng');
  const avatarEls = document.querySelectorAll('.topbar-avatar');
  avatarEls.forEach(el => {
    el.textContent = displayName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  });
  const nameEls = document.querySelectorAll('.topbar-username');
  nameEls.forEach(el => el.textContent = displayName);
});

function initDashboardApp() {
  if (typeof Auth === 'undefined' || !Auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const user = Auth.getCurrentUser();
  Sidebar.render(user);
  Topbar.render(user);
  registerAppRoutes();
  Router.init();

  if (typeof initParticleCanvas === 'function' && document.getElementById('dashboardCanvas')) {
    initParticleCanvas('dashboardCanvas', 'body', {
      color: 'rgba(21, 94, 239,', // Primary blue
      countFactor: 30,
      speed: 0.15,
      maxDistance: 110
    });
  }
}


function registerAppRoutes() {
  Router.addRoute('/', renderRoleDashboard);

  // Common routes
  Router.addRoute('/dashboard', () => {
    if (typeof DashboardHomePage !== 'undefined') DashboardHomePage.render('main-content');
  });
  Router.addRoute('/profile', () => {
    if (typeof ProfilePage !== 'undefined') ProfilePage.render('main-content');
  });
  Router.addRoute('/notifications', () => {
    if (typeof NotificationPage !== 'undefined') NotificationPage.render('main-content');
  });
  Router.addRoute('/forbidden', () => {
    if (typeof ForbiddenPage !== 'undefined') ForbiddenPage.render('main-content');
  });

  // Doctor routes
  Router.addRoute('/medical-records', () => {
    if (typeof MedicalRecordPage !== 'undefined') {
      MedicalRecordPage.render('main-content');
    }
  });

  // Manager routes
  Router.addRoute('/treatment-approval', () => {
    if (typeof TreatmentApprovalPage !== 'undefined') {
      TreatmentApprovalPage.render('main-content');
    }
  });

  // Admin routes
  Router.addRoute('/medicines', () => {
    if (typeof MedicineCategoryPage !== 'undefined') {
      MedicineCategoryPage.render('main-content');
    }
  });

  Router.addRoute('/users', () => {
    if (typeof UserManagementPage !== 'undefined') {
      UserManagementPage.render('main-content');
    }
  });

  Router.addRoute('/roles', () => {
    if (typeof RoleManagementPage !== 'undefined') {
      RoleManagementPage.render('main-content');
    }
  });

  Router.addRoute('/system-logs', () => {
    if (typeof SystemLogPage !== 'undefined') {
      SystemLogPage.render('main-content');
    }
  });

  // Leader routes
  Router.addRoute('/reports', () => {
    if (typeof LeaderReportPage !== 'undefined') {
      LeaderReportPage.render('main-content');
    }
  });

  Router.addRoute('/approvals-receive', () => {
    if (typeof IntakeApprovalPage !== 'undefined') {
      IntakeApprovalPage.render('main-content');
    }
  });

  Router.addRoute('/approvals-complete', () => {
    if (typeof CompletionApprovalPage !== 'undefined') {
      CompletionApprovalPage.render('main-content');
    }
  });

  // Police routes
  Router.addRoute('/transfer', () => {
    if (typeof HandoverCreatePage !== 'undefined') {
      HandoverCreatePage.render('main-content');
    }
  });

  // Staff routes
  Router.addRoute('/receive', () => {
    if (typeof IntakeConfirmationPage !== 'undefined') {
      IntakeConfirmationPage.render('main-content');
    }
  });

  Router.addRoute('/patients', () => {
    if (typeof PatientManagementPage !== 'undefined') {
      PatientManagementPage.render('main-content');
    }
  });

  Router.addRoute('/visits', () => {
    if (typeof VisitApprovalPage !== 'undefined') {
      VisitApprovalPage.render('main-content');
    }
  });

  Router.addRoute('/activities', () => {
    if (typeof ActivitySchedulePage !== 'undefined') {
      ActivitySchedulePage.render('main-content');
    }
  });

  Router.addRoute('/attendance', () => {
    if (typeof AttendancePage !== 'undefined') {
      AttendancePage.render('main-content');
    }
  });
}

function renderRoleDashboard() {
  const user = Auth.getCurrentUser();

  if (user.role === ROLES.DOCTOR && typeof DoctorDashboardPage !== 'undefined') {
    DoctorDashboardPage.render('main-content');
    return;
  }

  if (user.role === ROLES.ADMIN && typeof AdminDashboardPage !== 'undefined') {
    AdminDashboardPage.render('main-content');
    return;
  }

  if (user.role === ROLES.FAMILY && typeof FamilyDashboardPage !== 'undefined') {
    FamilyDashboardPage.render('main-content');
    return;
  }

  if (user.role === ROLES.MANAGER && typeof ManagerDashboardPage !== 'undefined') {
    ManagerDashboardPage.render('main-content');
    return;
  }

  if (user.role === ROLES.DIRECTOR && typeof LeaderDashboardPage !== 'undefined') {
    LeaderDashboardPage.render('main-content');
    return;
  }

  if (user.role === ROLES.STAFF && typeof StaffDashboardPage !== 'undefined') {
    StaffDashboardPage.render('main-content');
    return;
  }

  // Fallback
  const container = document.getElementById('main-content');
  if (container) {
    container.innerHTML = `
      <div class="card" style="margin:1rem;">
        <div class="card-body" style="text-align:center; padding:3rem;">
          <h2 style="font-size:2.5rem; margin-bottom:1rem; color:var(--primary-light);">
            <i class="fa-solid fa-person-digging"></i>
          </h2>
          <h3 style="color:var(--text-primary); margin-bottom:8px;">Dashboard đang được nâng cấp</h3>
          <p style="color:var(--text-muted);">
            Giao diện cho vai trò <strong>${user.roleLabel || user.role}</strong>
            đang trong quá trình phát triển.
          </p>
        </div>
      </div>
    `;
  }
}
