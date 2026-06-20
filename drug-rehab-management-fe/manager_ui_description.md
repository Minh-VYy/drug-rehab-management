# 📋 MÔ TẢ GIAO DIỆN CÁN BỘ QUẢN LÝ — RehabCare Đà Nẵng

> **Dành cho AI hỗ trợ tiếp theo.** Tài liệu này mô tả đầy đủ những gì cần build cho vai trò **Cán bộ quản lý (manager)** trong project `drug-rehab-management-fe`.

---

## 1. TỔNG QUAN DỰ ÁN

| Mục | Chi tiết |
|---|---|
| **Framework** | Vanilla HTML + CSS + JavaScript (không dùng framework) |
| **Kiến trúc** | SPA (Single Page App) dùng hash-based routing |
| **Entry point** | `dashboard.html` |
| **CSS chính** | `css/dashboard-premium.css` (dark glassmorphism, đồng bộ index.html) |
| **Router** | `js/router.js` — hash-based `#/path` |
| **Sidebar** | `js/components/sidebar.js` |
| **Topbar** | `js/components/topbar.js` |
| **View loader** | `js/view-loader.js` — fetch HTML partials vào `#main-content` |
| **Auth** | `js/auth.js` — role là `'manager'`, hằng số `ROLES.MANAGER` |

---

## 2. BACKGROUND & THIẾT KẾ

Background của toàn bộ app (body) là:
```css
background: linear-gradient(145deg, #060d1f 0%, #0f1f4e 40%, #1a3a8f 75%, #1e56d6 100%);
```
Cards có `background: rgba(255,255,255,0.92); backdrop-filter: blur(16px);`  
Sidebar có `background: rgba(8,14,40,0.95); backdrop-filter: blur(24px);`  
Topbar có `background: rgba(8,16,50,0.72); backdrop-filter: blur(20px);`

---

## 3. CẤU TRÚC FILE CẦN TẠO

```
views/manager/
├── manager-dashboard.html        ← Dashboard Cán bộ quản lý
└── treatment-approval.html       ← Phê duyệt phác đồ điều trị

js/pages/manager/
├── manager-dashboard.page.js     ← Logic dashboard
└── treatment-approval.page.js    ← Logic phê duyệt (đã có, cần cải thiện)

js/data/
└── mock-treatment-plans.data.js  ← Dữ liệu mock phác đồ
```

Thêm vào `dashboard.html` (sau các script hiện tại):
```html
<script src="js/data/mock-treatment-plans.data.js"></script>
<script src="js/pages/manager/manager-dashboard.page.js"></script>
<script src="js/pages/manager/treatment-approval.page.js"></script>
```

Thêm route vào `js/main.js` trong hàm `registerAppRoutes()`:
```js
Router.addRoute('/treatment-approval', () => {
    if (typeof TreatmentApprovalPage !== 'undefined') {
        TreatmentApprovalPage.render('main-content');
    }
});
```

Thêm vào `renderRoleDashboard()` trong `js/main.js`:
```js
if (user.role === ROLES.MANAGER && typeof ManagerDashboardPage !== 'undefined') {
    ManagerDashboardPage.render('main-content');
    return;
}
```

---

## 4. DỮ LIỆU MOCK — `mock-treatment-plans.data.js`

```javascript
const MockTreatmentPlans = [
    {
        maPhacdoDT: 'PD001',
        maBenhAn: 'BA001',
        maBacSi: 'BS. Trần Thị Mai',
        maQuanLy: 'QL001',
        loaiMaTuy: 'Heroin',
        giaiDoan: 'Cắt cơn',
        noiDungPhacdoDT: 'Sử dụng Methadone 30mg/ngày kết hợp theo dõi sinh hiệu mỗi 6 giờ. Bổ sung vitamin B1, B12.',
        mucTieu: 'Giảm triệu chứng cai nghiện, ổn định thể trạng trong 7 ngày đầu.',
        ngayBatDau: '2024-01-10',
        ngayKetThucDuKien: '2024-02-10',
        trangThai: 'ChoPheDuyet',
        ngayPheDuyet: null,
        ghiChuPheDuyet: ''
    },
    {
        maPhacdoDT: 'PD002',
        maBenhAn: 'BA002',
        maBacSi: 'BS. Nguyễn Văn An',
        maQuanLy: 'QL001',
        loaiMaTuy: 'Amphetamine',
        giaiDoan: 'Phục hồi',
        noiDungPhacdoDT: 'Tư vấn tâm lý 3 lần/tuần, liệu pháp hành vi nhận thức CBT.',
        mucTieu: 'Tái hòa nhập cộng đồng, kiểm soát cơn thèm nhớ.',
        ngayBatDau: '2024-01-15',
        ngayKetThucDuKien: '2024-04-15',
        trangThai: 'DaPheDuyet',
        ngayPheDuyet: '2024-01-16',
        ghiChuPheDuyet: 'Phác đồ phù hợp, đồng ý áp dụng.'
    },
    {
        maPhacdoDT: 'PD003',
        maBenhAn: 'BA003',
        maBacSi: 'BS. Trần Thị Mai',
        maQuanLy: 'QL001',
        loaiMaTuy: 'Cần sa',
        giaiDoan: 'Điều trị duy trì',
        noiDungPhacdoDT: 'Liệu pháp nhóm 2 lần/tuần, hoạt động thể chất hàng ngày.',
        mucTieu: 'Duy trì trạng thái không tái nghiện sau 6 tháng.',
        ngayBatDau: '2024-01-20',
        ngayKetThucDuKien: '2024-07-20',
        trangThai: 'TuChoi',
        ngayPheDuyet: '2024-01-21',
        ghiChuPheDuyet: 'Thiếu đánh giá tâm lý ban đầu, cần bổ sung trước khi phê duyệt.'
    },
    {
        maPhacdoDT: 'PD004',
        maBenhAn: 'BA004',
        maBacSi: 'BS. Nguyễn Văn An',
        maQuanLy: null,
        loaiMaTuy: 'Heroin',
        giaiDoan: 'Cắt cơn',
        noiDungPhacdoDT: 'Buprenorphine 8mg/ngày, giảm liều dần theo tuần.',
        mucTieu: 'Cắt cơn an toàn trong 14 ngày, không có biến chứng.',
        ngayBatDau: '2024-02-01',
        ngayKetThucDuKien: '2024-02-15',
        trangThai: 'ChoPheDuyet',
        ngayPheDuyet: null,
        ghiChuPheDuyet: ''
    }
];
window.MockTreatmentPlans = MockTreatmentPlans;
```

---

## 5. DASHBOARD MANAGER — `views/manager/manager-dashboard.html`

```html
<div class="page-header page-header-row">
    <div>
        <h1>Xin chào, <span id="mgr-user-name">Quản lý</span> 👋</h1>
        <p id="mgr-subtitle">Tổng quan phác đồ điều trị đang chờ phê duyệt.</p>
    </div>
    <div class="dash-date-card">
        <div id="mgr-date-num" class="dash-date-num"></div>
        <div id="mgr-date-label" class="dash-date-label"></div>
    </div>
</div>

<div class="stats-grid" id="mgr-stats">
    <!-- Stat cards rendered by JS -->
</div>

<div class="dashboard-content-grid">
    <div class="card">
        <div class="card-header">
            <div>
                <div class="card-title">
                    <div class="card-title-icon" style="background:rgba(245,158,11,0.12);color:#d97706;">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                    Phác đồ chờ phê duyệt
                </div>
                <div class="card-header-meta">Các phác đồ cần xử lý gần đây</div>
            </div>
            <button class="btn btn-sm btn-outline"
                onclick="Router.navigate('/treatment-approval')">
                <i class="fa-solid fa-arrow-right"></i> Xem tất cả
            </button>
        </div>
        <div class="card-body">
            <div class="recent-list" id="mgr-pending-list"></div>
        </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <!-- Approval status chart -->
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <div class="card-title-icon" style="background:rgba(99,102,241,0.12);color:#6366f1;">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    Tỉ lệ phê duyệt
                </div>
            </div>
            <div class="card-body" id="mgr-chart"></div>
        </div>

        <!-- Quick actions -->
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <div class="card-title-icon" style="background:rgba(16,185,129,0.12);color:#10b981;">
                        <i class="fa-solid fa-bolt"></i>
                    </div>
                    Thao tác nhanh
                </div>
            </div>
            <div class="card-body">
                <div class="quick-actions">
                    <a href="#" onclick="Router.navigate('/treatment-approval'); return false;"
                        class="quick-action-btn">
                        <div class="qa-icon orange">
                            <i class="fa-solid fa-stamp"></i>
                        </div>
                        <div>
                            <div class="qa-text">Phê duyệt phác đồ</div>
                            <div class="qa-sub">Xem danh sách chờ duyệt</div>
                        </div>
                        <i class="fa-solid fa-chevron-right"
                            style="margin-left:auto;color:var(--text-muted);font-size:11px;"></i>
                    </a>
                    <a href="#" class="quick-action-btn">
                        <div class="qa-icon purple">
                            <i class="fa-solid fa-chart-bar"></i>
                        </div>
                        <div>
                            <div class="qa-text">Thống kê</div>
                            <div class="qa-sub">Báo cáo phác đồ</div>
                        </div>
                        <i class="fa-solid fa-chevron-right"
                            style="margin-left:auto;color:var(--text-muted);font-size:11px;"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## 6. DASHBOARD PAGE JS — `js/pages/manager/manager-dashboard.page.js`

```javascript
const ManagerDashboardPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/manager/manager-dashboard.html', containerId);
        if (success) this.init();
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Dashboard Cán bộ quản lý');

        const plans = typeof MockTreatmentPlans !== 'undefined' ? MockTreatmentPlans : [];
        const pending  = plans.filter(p => p.trangThai === 'ChoPheDuyet').length;
        const approved = plans.filter(p => p.trangThai === 'DaPheDuyet').length;
        const rejected = plans.filter(p => p.trangThai === 'TuChoi').length;
        const applying = plans.filter(p => p.trangThai === 'DangApDung').length;

        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : { fullName: 'Quản lý' };

        // Name & subtitle
        const nameEl = document.getElementById('mgr-user-name');
        if (nameEl) nameEl.textContent = user.fullName || 'Quản lý';

        const subtitleEl = document.getElementById('mgr-subtitle');
        if (subtitleEl) subtitleEl.innerHTML = pending > 0
            ? `Bạn có <strong style="color:#f59e0b;">${pending} phác đồ</strong> đang chờ phê duyệt.`
            : `Không có phác đồ nào chờ phê duyệt. Chúc bạn làm việc tốt! 🎉`;

        // Date
        const now = new Date();
        const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
        const months = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
        const numEl = document.getElementById('mgr-date-num');
        const lblEl = document.getElementById('mgr-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (lblEl) lblEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;

        // Stats
        const statsEl = document.getElementById('mgr-stats');
        if (statsEl && typeof Card !== 'undefined') {
            statsEl.innerHTML = `
                ${Card.renderStatCard('Tổng phác đồ',   plans.length, 'fa-solid fa-file-medical-alt', 'primary', 8)}
                ${Card.renderStatCard('Chờ phê duyệt',  pending,      'fa-solid fa-clock',            'warning')}
                ${Card.renderStatCard('Đã phê duyệt',   approved,     'fa-solid fa-circle-check',     'success', 15)}
                ${Card.renderStatCard('Từ chối',         rejected,     'fa-solid fa-circle-xmark',     'danger')}
            `;
        }

        // Pending list
        const listEl = document.getElementById('mgr-pending-list');
        if (listEl) {
            const pendingPlans = plans.filter(p => p.trangThai === 'ChoPheDuyet').slice(0, 5);
            if (!pendingPlans.length) {
                listEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fa-solid fa-check-circle"></i></div>
                        <div class="empty-state-title">Không có phác đồ chờ duyệt</div>
                        <div class="empty-state-msg">Tất cả phác đồ đã được xử lý.</div>
                    </div>`;
            } else {
                listEl.innerHTML = pendingPlans.map(p => `
                    <div class="recent-item">
                        <div class="recent-avatar" style="background:rgba(245,158,11,0.12);color:#d97706;">
                            <i class="fa-solid fa-file-medical-alt"></i>
                        </div>
                        <div class="recent-info">
                            <div class="recent-name">${p.maPhacdoDT} &nbsp;·&nbsp; ${p.maBenhAn}</div>
                            <div class="recent-sub">${p.maBacSi} &nbsp;|&nbsp; ${p.loaiMaTuy} — ${p.giaiDoan}</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                            <span class="badge badge-warning">Chờ duyệt</span>
                            <button class="btn btn-sm btn-outline"
                                onclick="Router.navigate('/treatment-approval')">
                                <i class="fa-solid fa-stamp"></i>
                            </button>
                        </div>
                    </div>`).join('');
            }
        }

        // Chart — bar chart showing plan counts by status
        const chartEl = document.getElementById('mgr-chart');
        const chartData = [
            { label: 'Chờ duyệt', value: pending },
            { label: 'Đã duyệt',  value: approved },
            { label: 'Từ chối',   value: rejected },
            { label: 'Đang áp',   value: applying }
        ];
        if (chartEl && typeof Chart !== 'undefined') {
            chartEl.innerHTML = Chart.renderBarChart(chartData);
        }
    }
};

window.ManagerDashboardPage = ManagerDashboardPage;
```

---

## 7. TREATMENT APPROVAL VIEW — `views/manager/treatment-approval.html`

```html
<div class="page-header page-header-row">
    <div>
        <h1>Phê duyệt <span>Phác đồ điều trị</span></h1>
        <p>Xem xét và phê duyệt hoặc từ chối phác đồ do bác sĩ lập.</p>
    </div>
    <div style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);
                color:#818cf8; width:52px; height:52px; border-radius:14px;
                display:flex; align-items:center; justify-content:center;
                font-size:22px; flex-shrink:0;">
        <i class="fa-solid fa-stamp"></i>
    </div>
</div>

<!-- Stats mini -->
<div class="stats-grid" id="ta-stats"></div>

<div style="display:grid; grid-template-columns:1fr;">
    <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:1rem;">
            <div class="card-title">
                <div class="card-title-icon"><i class="fa-solid fa-table-list"></i></div>
                Danh sách phác đồ
            </div>
            <div class="toolbar" style="margin-bottom:0;">
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    <input id="ta-search" type="search"
                        placeholder="Tìm mã phác đồ, mã bệnh án..."
                        oninput="TreatmentApprovalPage.applyFilter()">
                </div>
                <div class="filter-group">
                    <select id="ta-status-filter" class="filter-select"
                        onchange="TreatmentApprovalPage.applyFilter()">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="ChoPheDuyet" selected>Chờ phê duyệt</option>
                        <option value="DaPheDuyet">Đã phê duyệt</option>
                        <option value="TuChoi">Từ chối</option>
                        <option value="DangApDung">Đang áp dụng</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card-body" id="ta-table"></div>
    </div>
</div>
```

---

## 8. TREATMENT APPROVAL PAGE JS — `js/pages/manager/treatment-approval.page.js`

```javascript
const TreatmentApprovalPage = {
    plans: [],

    async render(containerId) {
        const success = await ViewLoader.load('views/manager/treatment-approval.html', containerId);
        if (success) this.init();
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Phê duyệt phác đồ điều trị');
        this.plans = typeof MockTreatmentPlans !== 'undefined' ? MockTreatmentPlans : [];
        this.renderStats();
        this.applyFilter();
    },

    renderStats() {
        const el = document.getElementById('ta-stats');
        if (!el || typeof Card === 'undefined') return;
        const pending  = this.plans.filter(p => p.trangThai === 'ChoPheDuyet').length;
        const approved = this.plans.filter(p => p.trangThai === 'DaPheDuyet').length;
        const rejected = this.plans.filter(p => p.trangThai === 'TuChoi').length;
        const applying = this.plans.filter(p => p.trangThai === 'DangApDung').length;
        el.innerHTML = `
            ${Card.renderStatCard('Tổng phác đồ',  this.plans.length, 'fa-solid fa-file-medical-alt', 'primary')}
            ${Card.renderStatCard('Chờ phê duyệt', pending,           'fa-solid fa-clock',            'warning')}
            ${Card.renderStatCard('Đã phê duyệt',  approved,          'fa-solid fa-circle-check',     'success')}
            ${Card.renderStatCard('Từ chối',        rejected,          'fa-solid fa-circle-xmark',     'danger')}
        `;
    },

    getFilteredPlans() {
        const search = (document.getElementById('ta-search')?.value || '').toLowerCase().trim();
        const status = document.getElementById('ta-status-filter')?.value || 'all';
        return this.plans.filter(p => {
            const matchSearch = !search
                || p.maPhacdoDT.toLowerCase().includes(search)
                || p.maBenhAn.toLowerCase().includes(search)
                || (p.maBacSi && p.maBacSi.toLowerCase().includes(search));
            const matchStatus = status === 'all' || p.trangThai === status;
            return matchSearch && matchStatus;
        });
    },

    applyFilter() {
        this.renderTable(this.getFilteredPlans());
    },

    renderStatusBadge(status) {
        const map = {
            'ChoPheDuyet': `<span class="badge badge-warning"><i class="fa-solid fa-clock" style="font-size:9px;"></i> Chờ phê duyệt</span>`,
            'DaPheDuyet':  `<span class="badge badge-success"><i class="fa-solid fa-circle-check" style="font-size:9px;"></i> Đã phê duyệt</span>`,
            'TuChoi':      `<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark" style="font-size:9px;"></i> Từ chối</span>`,
            'DangApDung':  `<span class="badge badge-blue"><i class="fa-solid fa-play" style="font-size:9px;"></i> Đang áp dụng</span>`,
            'HoanThanh':   `<span class="badge badge-gray"><i class="fa-solid fa-check" style="font-size:9px;"></i> Hoàn thành</span>`,
        };
        return map[status] || `<span class="badge badge-gray">${status}</span>`;
    },

    renderTable(data) {
        const target = document.getElementById('ta-table');
        if (!target) return;

        if (!data.length) {
            target.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <div class="empty-state-title">Không tìm thấy phác đồ</div>
                    <div class="empty-state-msg">Không có phác đồ nào phù hợp với bộ lọc.</div>
                </div>`;
            return;
        }

        const rows = data.map(p => {
            // Action buttons — only show approve/reject for ChoPheDuyet
            const actions = p.trangThai === 'ChoPheDuyet'
                ? `<div class="action-btns">
                    <button class="btn btn-sm btn-outline"
                        onclick="TreatmentApprovalPage.openDetail('${p.maPhacdoDT}')">
                        <i class="fa-solid fa-eye"></i> Xem
                    </button>
                    <button class="btn btn-sm btn-success"
                        onclick="TreatmentApprovalPage.openApproveModal('${p.maPhacdoDT}')">
                        <i class="fa-solid fa-check"></i> Duyệt
                    </button>
                    <button class="btn btn-sm btn-danger"
                        onclick="TreatmentApprovalPage.openRejectModal('${p.maPhacdoDT}')">
                        <i class="fa-solid fa-xmark"></i> Từ chối
                    </button>
                </div>`
                : `<div class="action-btns">
                    <button class="btn btn-sm btn-outline"
                        onclick="TreatmentApprovalPage.openDetail('${p.maPhacdoDT}')">
                        <i class="fa-solid fa-eye"></i> Xem
                    </button>
                </div>`;

            return [
                `<span class="td-code">${p.maPhacdoDT}</span>`,
                p.maBenhAn,
                p.maBacSi || '—',
                p.loaiMaTuy,
                p.giaiDoan,
                p.ngayBatDau,
                p.ngayKetThucDuKien,
                this.renderStatusBadge(p.trangThai),
                actions
            ];
        });

        if (typeof Table !== 'undefined') {
            target.innerHTML = Table.renderTable(
                ['Mã phác đồ','Mã bệnh án','Bác sĩ','Loại ma túy',
                 'Giai đoạn','Ngày bắt đầu','Ngày kết thúc','Trạng thái','Thao tác'],
                rows
            );
        }
    },

    getPlan(id) {
        return this.plans.find(p => p.maPhacdoDT === id);
    },

    openDetail(id) {
        const p = this.getPlan(id);
        if (!p) return;
        const content = `
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Mã phác đồ</div>
                    <div class="detail-value code">${p.maPhacdoDT}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mã bệnh án</div>
                    <div class="detail-value">${p.maBenhAn}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Bác sĩ lập</div>
                    <div class="detail-value">${p.maBacSi}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Trạng thái</div>
                    <div class="detail-value" style="background:transparent;border:none;padding:0;">
                        ${this.renderStatusBadge(p.trangThai)}
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Loại ma túy</div>
                    <div class="detail-value">${p.loaiMaTuy}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Giai đoạn</div>
                    <div class="detail-value">${p.giaiDoan}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ngày bắt đầu</div>
                    <div class="detail-value">${p.ngayBatDau}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ngày kết thúc DK</div>
                    <div class="detail-value">${p.ngayKetThucDuKien}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Nội dung phác đồ</div>
                    <div class="detail-value">${p.noiDungPhacdoDT}</div>
                </div>
                <div class="detail-item span-2">
                    <div class="detail-label">Mục tiêu điều trị</div>
                    <div class="detail-value">${p.mucTieu}</div>
                </div>
                ${p.ghiChuPheDuyet ? `
                <div class="detail-item span-2">
                    <div class="detail-label">Ghi chú phê duyệt</div>
                    <div class="detail-value">${p.ghiChuPheDuyet}</div>
                </div>` : ''}
            </div>`;
        const footer = p.trangThai === 'ChoPheDuyet'
            ? `<button class="btn btn-outline" onclick="Modal.close()">Đóng</button>
               <button class="btn btn-success"
                onclick="TreatmentApprovalPage.openApproveModal('${id}'); Modal.close();">
                <i class="fa-solid fa-check"></i> Phê duyệt
               </button>
               <button class="btn btn-danger"
                onclick="TreatmentApprovalPage.openRejectModal('${id}'); Modal.close();">
                <i class="fa-solid fa-xmark"></i> Từ chối
               </button>`
            : `<button class="btn btn-outline" onclick="Modal.close()">Đóng</button>`;
        if (typeof Modal !== 'undefined') Modal.open(`Chi tiết phác đồ ${id}`, content, footer);
    },

    openApproveModal(id) {
        const content = `
            <div class="confirm-box">
                <div class="confirm-box-icon" style="color:var(--success);">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="confirm-box-text">
                    <p>Bạn sắp <strong>phê duyệt</strong> phác đồ <strong>${id}</strong>.
                    Hành động này sẽ cập nhật trạng thái thành <strong>Đã phê duyệt</strong>.</p>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Ghi chú phê duyệt (không bắt buộc)</label>
                <textarea class="form-control" id="approve-note" rows="3"
                    placeholder="Nhập ghi chú nếu có..."></textarea>
            </div>`;
        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-success" onclick="TreatmentApprovalPage.doApprove('${id}')">
                <i class="fa-solid fa-check"></i> Xác nhận phê duyệt
            </button>`;
        if (typeof Modal !== 'undefined') Modal.open('Phê duyệt phác đồ', content, footer);
    },

    openRejectModal(id) {
        const content = `
            <div class="confirm-box" style="border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);">
                <div class="confirm-box-icon" style="color:var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="confirm-box-text">
                    <p>Bạn sắp <strong>từ chối</strong> phác đồ <strong>${id}</strong>.</p>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">
                    Lý do từ chối <span class="required">*</span>
                </label>
                <textarea class="form-control" id="reject-reason" rows="3"
                    placeholder="Nhập lý do từ chối (bắt buộc)..."></textarea>
                <div class="form-error" id="reject-error" style="display:none;">
                    <i class="fa-solid fa-circle-exclamation"></i> Vui lòng nhập lý do từ chối
                </div>
            </div>`;
        const footer = `
            <button class="btn btn-outline" onclick="Modal.close()">Hủy</button>
            <button class="btn btn-danger" onclick="TreatmentApprovalPage.doReject('${id}')">
                <i class="fa-solid fa-xmark"></i> Xác nhận từ chối
            </button>`;
        if (typeof Modal !== 'undefined') Modal.open('Từ chối phác đồ', content, footer);
    },

    doApprove(id) {
        const plan = this.getPlan(id);
        if (!plan) return;
        const note = document.getElementById('approve-note')?.value || '';
        plan.trangThai = 'DaPheDuyet';
        plan.ngayPheDuyet = new Date().toISOString().slice(0, 10);
        plan.ghiChuPheDuyet = note || 'Phê duyệt thành công.';
        if (typeof Modal !== 'undefined') Modal.close();
        if (typeof Toast !== 'undefined') Toast.show(`Phê duyệt phác đồ ${id} thành công!`, 'success');
        this.renderStats();
        this.applyFilter();
    },

    doReject(id) {
        const reason = document.getElementById('reject-reason')?.value?.trim() || '';
        const errEl = document.getElementById('reject-error');
        if (!reason) {
            if (errEl) errEl.style.display = 'flex';
            return;
        }
        const plan = this.getPlan(id);
        if (!plan) return;
        plan.trangThai = 'TuChoi';
        plan.ngayPheDuyet = new Date().toISOString().slice(0, 10);
        plan.ghiChuPheDuyet = reason;
        if (typeof Modal !== 'undefined') Modal.close();
        if (typeof Toast !== 'undefined') Toast.show(`Đã từ chối phác đồ ${id}.`, 'error');
        this.renderStats();
        this.applyFilter();
    }
};

window.TreatmentApprovalPage = TreatmentApprovalPage;
```

---

## 9. CSS CLASSES CẦN BIẾT

Tất cả CSS đã có trong `css/dashboard-premium.css`. Các class quan trọng:

| Class | Mô tả |
|---|---|
| `.card` | Card trắng glassmorphism |
| `.card-header`, `.card-body` | Header và body của card |
| `.card-title` | Tiêu đề card với icon |
| `.stats-grid` | Grid 4 cột cho stat cards |
| `.stat-card` | Stat card (dùng `Card.renderStatCard()`) |
| `.badge-warning` | Badge cam — ChoPheDuyet |
| `.badge-success` | Badge xanh lá — DaPheDuyet |
| `.badge-danger` | Badge đỏ — TuChoi |
| `.badge-blue` | Badge xanh dương — DangApDung |
| `.badge-gray` | Badge xám — HoanThanh |
| `.btn-success` | Nút xanh lá gradient |
| `.btn-danger` | Nút đỏ gradient |
| `.btn-outline` | Nút viền trắng |
| `.btn-sm` | Nút nhỏ |
| `.action-btns` | Flex container cho action buttons trong bảng |
| `.table-responsive` | Wrapper bảng có scroll ngang |
| `.detail-grid` | Grid 2 cột cho xem chi tiết |
| `.detail-item`, `.detail-label`, `.detail-value` | Item trong detail view |
| `.detail-item.span-2` | Item chiếm 2 cột |
| `.form-grid` | Grid form 2 cột |
| `.form-group` | Nhóm form |
| `.form-control` | Input/textarea styled |
| `.confirm-box` | Box xác nhận có icon |
| `.quick-action-btn` | Button thao tác nhanh |
| `.qa-icon.orange` | Icon cam |
| `.qa-icon.purple` | Icon tím |
| `.empty-state` | Trạng thái rỗng có icon |
| `.dash-date-card`, `.dash-date-num`, `.dash-date-label` | Date widget góc phải |
| `.dashboard-content-grid` | Grid 2 cột: `1fr 380px` |
| `.recent-list`, `.recent-item` | Danh sách recent activities |
| `.quick-actions`, `.quick-action-btn` | Quick action buttons |

---

## 10. LƯU Ý QUAN TRỌNG

> [!IMPORTANT]
> - Router sử dụng hash `#/path` — link trong sidebar phải là `href="#/treatment-approval"`
> - Sidebar active state tự động cập nhật theo `Router.updateActiveState(path)`
> - `Toast.show(message, type)` — type: `'success'`, `'error'`, `'warning'`, `'info'`
> - `Modal.open(title, contentHTML, footerHTML)` và `Modal.close()`
> - Tài khoản demo manager: `username: manager`, `password: 123456`, `role: manager`

> [!NOTE]
> Sidebar của Cán bộ quản lý chỉ có 2 menu:
> - Dashboard (path: `/`)
> - Phê duyệt phác đồ (path: `/treatment-approval`)
> 
> Các chức năng khác (phân công, báo cáo, thay đổi giai đoạn) **KHÔNG** thuộc phạm vi module này.
