/* =============================================
   TRUNG TÂM CAI NGHIỆN MA TÚY ĐÀ NẴNG
   main.js — Sample data, UI utilities, role switching
   ============================================= */

/* ---- Sample Data ---- */
const SampleData = {
  users: [
    { id: 'U001', username: 'admin', name: 'Nguyễn Văn An', phone: '0901234567', email: 'admin@rehab.vn', role: 'admin', status: 'active' },
    { id: 'U002', username: 'bs.mai', name: 'BS. Trần Thị Mai', phone: '0902345678', email: 'mai@rehab.vn', role: 'doctor', status: 'active' },
    { id: 'U003', username: 'nv.hung', name: 'NV. Lê Văn Hùng', phone: '0903456789', email: 'hung@rehab.vn', role: 'staff', status: 'active' },
    { id: 'U004', username: 'ql.phuong', name: 'QL. Phạm Thị Phương', phone: '0904567890', email: 'phuong@rehab.vn', role: 'manager', status: 'active' },
    { id: 'U005', username: 'ld.duc', name: 'GĐ. Hoàng Văn Đức', phone: '0905678901', email: 'duc@rehab.vn', role: 'director', status: 'active' },
    { id: 'U006', username: 'ca.nam', name: 'CA. Đặng Văn Nam', phone: '0906789012', email: 'nam@policedn.vn', role: 'police', status: 'active' },
    { id: 'U007', username: 'nt.lan', name: 'Nguyễn Thị Lan', phone: '0907890123', email: 'lan@gmail.com', role: 'family', status: 'active' },
    { id: 'U008', username: 'nt.hanh', name: 'Lê Thị Hạnh', phone: '0908901234', email: 'hanh@gmail.com', role: 'family', status: 'inactive' },
  ],

  patients: [
    { id: 'HV001', name: 'Trần Văn Bình', cccd: '204890123', dob: '1990-03-15', entryDate: '2024-01-10', stage: 'Phục hồi', status: 'Đang điều trị', doctor: 'BS. Trần Thị Mai', source: 'Tự nguyện' },
    { id: 'HV002', name: 'Lê Quang Cường', cccd: '204890456', dob: '1987-07-22', entryDate: '2024-02-05', stage: 'Cắt cơn', status: 'Đang điều trị', doctor: 'BS. Trần Thị Mai', source: 'Bắt buộc' },
    { id: 'HV003', name: 'Nguyễn Đức Hải', cccd: '204890789', dob: '1993-11-08', entryDate: '2024-03-20', stage: 'Tiếp nhận', status: 'Đang điều trị', doctor: 'Chưa phân công', source: 'Tự nguyện' },
    { id: 'HV004', name: 'Phạm Văn Tùng', cccd: '204891012', dob: '1985-05-30', entryDate: '2023-11-12', stage: 'Phục hồi', status: 'Hoàn thành', doctor: 'BS. Trần Thị Mai', source: 'Bắt buộc' },
    { id: 'HV005', name: 'Hoàng Minh Khoa', cccd: '204891345', dob: '1995-09-17', entryDate: '2024-04-01', stage: 'Cắt cơn', status: 'Đang điều trị', doctor: 'BS. Trần Thị Mai', source: 'Tự nguyện' },
  ],

  handoverFiles: [
    { id: 'HB001', patientName: 'Lê Quang Cường', agency: 'CA Q.Hải Châu', submitDate: '2024-02-01', status: 'Đã tiếp nhận' },
    { id: 'HB002', patientName: 'Võ Văn Dũng', agency: 'CA Q.Thanh Khê', submitDate: '2024-04-10', status: 'Chờ duyệt' },
    { id: 'HB003', patientName: 'Lý Thành Đạt', agency: 'CA Q.Liên Chiểu', submitDate: '2024-04-12', status: 'Từ chối' },
    { id: 'HB004', patientName: 'Đỗ Minh Hậu', agency: 'CA H.Hòa Vang', submitDate: '2024-04-15', status: 'Chờ duyệt' },
  ],

  voluntaryForms: [
    { id: 'DN001', patientName: 'Trần Văn Bình', submitDate: '2024-01-05', relationship: 'Bố', status: 'Đã tiếp nhận' },
    { id: 'DN002', patientName: 'Nguyễn Đức Hải', submitDate: '2024-03-15', relationship: 'Anh', status: 'Chờ duyệt' },
    { id: 'DN003', patientName: 'Bùi Văn Thắng', submitDate: '2024-04-10', relationship: 'Mẹ', status: 'Từ chối' },
  ],

  visits: [
    { id: 'TG001', patient: 'Trần Văn Bình', visitor: 'Nguyễn Thị Lan', visitDate: '2024-04-20', shift: 'Sáng', status: 'Đồng ý' },
    { id: 'TG002', patient: 'Lê Quang Cường', visitor: 'Lê Thị Hạnh', visitDate: '2024-04-22', shift: 'Chiều', status: 'Chờ duyệt' },
    { id: 'TG003', patient: 'Trần Văn Bình', visitor: 'Nguyễn Thị Lan', visitDate: '2024-03-18', shift: 'Sáng', status: 'Hoàn thành' },
    { id: 'TG004', patient: 'Hoàng Minh Khoa', visitor: 'Hoàng Thị Hoa', visitDate: '2024-04-25', shift: 'Sáng', status: 'Chờ duyệt' },
  ],

  medicalRecords: [
    { id: 'BA001', patientId: 'HV001', patientName: 'Trần Văn Bình', doctor: 'BS. Trần Thị Mai', history: 'Heroin 3 năm', allergy: 'Không', height: 170, weight: 63, created: '2024-01-10' },
    { id: 'BA002', patientId: 'HV002', patientName: 'Lê Quang Cường', doctor: 'BS. Trần Thị Mai', history: 'Ma túy đá 2 năm', allergy: 'Penicillin', height: 165, weight: 55, created: '2024-02-05' },
    { id: 'BA003', patientId: 'HV005', patientName: 'Hoàng Minh Khoa', doctor: 'BS. Trần Thị Mai', history: 'Cần sa 1 năm', allergy: 'Không', height: 172, weight: 68, created: '2024-04-01' },
  ],

  treatmentPlans: [
    { id: 'PD001', patientName: 'Trần Văn Bình', stage: 'Phục hồi', startDate: '2024-02-01', endDate: '2024-06-30', status: 'Đang áp dụng' },
    { id: 'PD002', patientName: 'Lê Quang Cường', stage: 'Cắt cơn', startDate: '2024-02-10', endDate: '2024-03-10', status: 'Chờ phê duyệt' },
    { id: 'PD003', patientName: 'Hoàng Minh Khoa', stage: 'Cắt cơn', startDate: '2024-04-05', endDate: '2024-05-05', status: 'Đã phê duyệt' },
  ],

  proposals: [
    { id: 'DX001', patientName: 'Trần Văn Bình', doctor: 'BS. Trần Thị Mai', type: 'Chuyển giai đoạn', fromStage: 'Cắt cơn', toStage: 'Phục hồi', date: '2024-02-01', status: 'Đã duyệt' },
    { id: 'DX002', patientName: 'Hoàng Minh Khoa', doctor: 'BS. Trần Thị Mai', type: 'Chuyển giai đoạn', fromStage: 'Tiếp nhận', toStage: 'Cắt cơn', date: '2024-04-05', status: 'Chờ duyệt' },
    { id: 'DX003', patientName: 'Phạm Văn Tùng', doctor: 'BS. Trần Thị Mai', type: 'Hoàn thành', fromStage: 'Phục hồi', toStage: 'Hoàn thành', date: '2024-04-10', status: 'Chờ duyệt' },
  ],

  notifications: [
    { id: 'TB001', title: 'Lịch thăm gặp tuần tới', target: 'Người thân', date: '2024-04-14', status: 'Hiển thị' },
    { id: 'TB002', title: 'Thay đổi lịch sinh hoạt', target: 'Nội bộ', date: '2024-04-12', status: 'Hiển thị' },
    { id: 'TB003', title: 'Hướng dẫn quy trình mới', target: 'Tất cả', date: '2024-04-10', status: 'Ẩn' },
  ],

  supportRequests: [
    { id: 'HT001', requester: 'Nguyễn Thị Lan', title: 'Hỏi về lịch thăm gặp', type: 'Thông tin', date: '2024-04-14', status: 'Chờ phản hồi' },
    { id: 'HT002', requester: 'Lê Thị Hạnh', title: 'Đề nghị hỗ trợ thuốc', type: 'Y tế', date: '2024-04-13', status: 'Đã phản hồi' },
  ],

  medicines: [
    { id: 'TH001', name: 'Methadone', unit: 'ml', qty: 500, note: 'Bảo quản nhiệt độ thường' },
    { id: 'TH002', name: 'Diazepam', unit: 'viên', qty: 200, note: 'Kiểm soát đặc biệt' },
    { id: 'TH003', name: 'Vitamin B1', unit: 'viên', qty: 1000, note: '' },
    { id: 'TH004', name: 'Paracetamol', unit: 'viên', qty: 800, note: '' },
  ],

  activities: [
    { id: 'HD001', name: 'Thể dục buổi sáng', type: 'Thể chất', time: '06:00 - 07:00', desc: 'Tập thể dục nhóm ngoài sân' },
    { id: 'HD002', name: 'Sinh hoạt nhóm', type: 'Tâm lý', time: '09:00 - 10:30', desc: 'Chia sẻ kinh nghiệm, hỗ trợ nhau' },
    { id: 'HD003', name: 'Học nghề may', type: 'Dạy nghề', time: '14:00 - 16:00', desc: 'Lớp học nghề may mặc' },
  ],

  logs: [
    { time: '2024-04-15 08:32', user: 'bs.mai', role: 'Bác sĩ', action: 'Cập nhật bệnh án BA001', ip: '192.168.1.10', status: 'Thành công' },
    { time: '2024-04-15 08:15', user: 'nv.hung', role: 'Nhân viên', action: 'Duyệt thăm gặp TG001', ip: '192.168.1.11', status: 'Thành công' },
    { time: '2024-04-15 07:55', user: 'ql.phuong', role: 'Quản lý', action: 'Duyệt phác đồ PD003', ip: '192.168.1.12', status: 'Thành công' },
    { time: '2024-04-14 16:40', user: 'ca.nam', role: 'Công an', action: 'Gửi hồ sơ HB004', ip: '10.0.0.5', status: 'Thành công' },
    { time: '2024-04-14 14:22', user: 'nt.lan', role: 'Người thân', action: 'Đăng ký thăm gặp TG004', ip: '27.64.x.x', status: 'Thành công' },
    { time: '2024-04-14 10:05', user: 'unknown', role: '-', action: 'Đăng nhập thất bại', ip: '103.x.x.x', status: 'Thất bại' },
  ]
};

/* ---- Role configuration ---- */
const RoleConfig = {
  admin: { label: 'Quản trị hệ thống', icon: 'fa-shield-halved', portal: 'portals/admin.html' },
  doctor: { label: 'Bác sĩ phụ trách', icon: 'fa-user-doctor', portal: 'portals/doctor.html' },
  staff: { label: 'Cán bộ trung tâm', icon: 'fa-id-badge', portal: 'portals/staff.html' },
  manager: { label: 'Cán bộ quản lý', icon: 'fa-chart-pie', portal: 'portals/manager.html' },
  director: { label: 'Lãnh đạo trung tâm', icon: 'fa-building-user', portal: 'portals/director.html' },
  police: { label: 'Cán bộ quản lý hồ sơ (CA)', icon: 'fa-badge-check', portal: 'portals/police.html' },
  family: { label: 'Người thân', icon: 'fa-heart', portal: 'portals/family.html' },
};

/* ---- Fake login / role switch ---- */
function fakeLogin(role, name) {
  const cfg = RoleConfig[role];
  if (!cfg) return;
  sessionStorage.setItem('auth_role', role);
  sessionStorage.setItem('auth_name', name || cfg.label);
  window.location.href = cfg.portal;
}

function switchRole(role) {
  const cfg = RoleConfig[role];
  if (!cfg) return;
  fakeLogin(role, cfg.label);
}

function getCurrentUser() {
  return {
    role: sessionStorage.getItem('auth_role') || 'staff',
    name: sessionStorage.getItem('auth_name') || 'Người dùng',
  };
}

function logout() {
  sessionStorage.clear();
  window.location.href = '../login.html';
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

  // Topbar user info
  const user = getCurrentUser();
  const avatarEls = document.querySelectorAll('.topbar-avatar');
  avatarEls.forEach(el => {
    el.textContent = user.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  });
  const nameEls = document.querySelectorAll('.topbar-username');
  nameEls.forEach(el => el.textContent = user.name);
});