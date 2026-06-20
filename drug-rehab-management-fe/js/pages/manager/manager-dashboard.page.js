const ManagerDashboardPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/manager/manager-dashboard.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (!this.hasManagerAccess()) {
            this.renderNoAccess();
            return;
        }

        if (typeof Topbar !== 'undefined') Topbar.setTitle('Dashboard Cán bộ quản lý');

        const plans = await this.getPlans();
        const stats = this.getStats(plans);
        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : { fullName: 'Quản lý' };

        const nameEl = document.getElementById('mgr-user-name');
        if (nameEl) {
            nameEl.textContent = typeof Auth !== 'undefined'
                ? Auth.getDisplayName(user)
                : (user.fullName || user.name || 'Quản lý');
        }

        const subtitleEl = document.getElementById('mgr-subtitle');
        if (subtitleEl) {
            subtitleEl.innerHTML = stats.pending > 0
                ? `Bạn có <strong style="color:#f59e0b;">${stats.pending} phác đồ</strong> đang chờ phê duyệt.`
                : 'Không có phác đồ nào chờ phê duyệt. Các hồ sơ đã được xử lý đầy đủ.';
        }

        this.renderDate();
        this.renderStats(stats, plans.length);
        this.renderPendingList(plans);
        this.renderChart(stats);
    },

    hasManagerAccess() {
        if (typeof Auth === 'undefined') return true;
        const user = Auth.getCurrentUser();
        return user && user.role === ROLES.MANAGER;
    },

    renderNoAccess() {
        const container = document.getElementById('main-content');
        if (!container) return;
        container.innerHTML = `
            <div class="forbidden-page">
                <div class="forbidden-code">403</div>
                <h2 style="color:#fff;">Không có quyền truy cập</h2>
                <p style="color:rgba(255,255,255,0.65);">Chức năng phê duyệt phác đồ chỉ dành cho Cán bộ quản lý.</p>
            </div>`;
    },

    async getPlans() {
        if (typeof Api === 'undefined' || typeof Api.getTreatmentPlans === 'undefined') {
            console.warn('Api helper chưa sẵn sàng');
            return [];
        }

        try {
            const data = await Api.getTreatmentPlans();
            return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.items) ? data.items : [];
        } catch (error) {
            console.error('Lỗi API Manager Dashboard:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Không thể tải dữ liệu phác đồ', 'error');
            return [];
        }
    },

    getStats(plans) {
        return {
            pending: plans.filter(p => p.trangThai === 'ChoPheDuyet').length,
            approved: plans.filter(p => p.trangThai === 'DaPheDuyet').length,
            rejected: plans.filter(p => p.trangThai === 'TuChoi').length,
            applying: plans.filter(p => p.trangThai === 'DangApDung').length
        };
    },

    renderDate() {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        const numEl = document.getElementById('mgr-date-num');
        const labelEl = document.getElementById('mgr-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (labelEl) labelEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;
    },

    renderStats(stats, total) {
        const statsEl = document.getElementById('mgr-stats');
        if (!statsEl || typeof Card === 'undefined') return;

        statsEl.innerHTML = `
            ${Card.renderStatCard('Tổng phác đồ', total, 'fa-solid fa-file-medical', 'primary', 8)}
            ${Card.renderStatCard('Chờ phê duyệt', stats.pending, 'fa-solid fa-clock', 'warning')}
            ${Card.renderStatCard('Đã phê duyệt', stats.approved, 'fa-solid fa-circle-check', 'success', 15)}
            ${Card.renderStatCard('Từ chối', stats.rejected, 'fa-solid fa-circle-xmark', 'danger')}
        `;
    },

    renderPendingList(plans) {
        const listEl = document.getElementById('mgr-pending-list');
        if (!listEl) return;

        const pendingPlans = plans.filter(p => p.trangThai === 'ChoPheDuyet').slice(0, 5);
        if (!pendingPlans.length) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-check-circle"></i></div>
                    <div class="empty-state-title">Không có phác đồ chờ duyệt</div>
                    <div class="empty-state-msg">Tất cả phác đồ đã được xử lý.</div>
                </div>`;
            return;
        }

        listEl.innerHTML = pendingPlans.map(plan => `
            <div class="recent-item">
                <div class="recent-avatar" style="background:rgba(245,158,11,0.12);color:#d97706;">
                    <i class="fa-solid fa-file-medical"></i>
                </div>
                <div class="recent-info">
                    <div class="recent-name">${this.escapeHtml(plan.maPhacdoDT)} &nbsp;·&nbsp; ${this.escapeHtml(plan.maBenhAn)}</div>
                    <div class="recent-sub">${this.escapeHtml(plan.maBacSi || 'Chưa rõ')} &nbsp;|&nbsp; ${this.escapeHtml(plan.loaiMaTuy)} - ${this.escapeHtml(plan.giaiDoan)}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                    <span class="badge badge-warning">Chờ duyệt</span>
                    <button class="btn btn-sm btn-outline" onclick="Router.navigate('/treatment-approval')">
                        <i class="fa-solid fa-stamp"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderChart(stats) {
        const chartEl = document.getElementById('mgr-chart');
        if (!chartEl || typeof Chart === 'undefined') return;

        chartEl.innerHTML = Chart.renderBarChart([
            { label: 'Chờ', value: stats.pending },
            { label: 'Duyệt', value: stats.approved },
            { label: 'Từ chối', value: stats.rejected },
            { label: 'Áp dụng', value: stats.applying }
        ]);
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

window.ManagerDashboardPage = ManagerDashboardPage;
