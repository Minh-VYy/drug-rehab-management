const LeaderDashboardPage = {
    data: {
        activePatients: 0,
        pendingIntakes: 0,
        pendingCompletions: 0,
        completedPatients: 0,
        recentTasks: [],
        stageStats: []
    },

    async render(containerId) {
        const success = await ViewLoader.load('views/leader/leader-dashboard.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Dashboard lãnh đạo');
        }

        this.renderCurrentUser();
        this.renderDate();
        await this.loadDashboardData();
        this.renderStats();
        this.renderRecentTasks();
        this.renderStageChart();
        this.bindActions();
    },

    async loadDashboardData() {
        if (typeof Api === 'undefined') return;

        try {
            const data = await Api.getLeaderDashboard();
            this.data = {
                activePatients: Number(data?.activePatients ?? 0),
                pendingIntakes: Number(data?.pendingIntakes ?? 0),
                pendingCompletions: Number(data?.pendingCompletions ?? 0),
                completedPatients: Number(data?.completedPatients ?? 0),
                recentTasks: Array.isArray(data?.recentTasks) ? data.recentTasks : [],
                stageStats: Array.isArray(data?.stageStats) ? data.stageStats : []
            };
        } catch (error) {
            console.warn('Lỗi API Leader Dashboard, tự động dùng Mock Data:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock) do chưa kết nối Backend', 'warning');
            
            // Mock fallback
            this.data = {
                activePatients: 245,
                pendingIntakes: 12,
                pendingCompletions: 8,
                completedPatients: 156,
                recentTasks: [
                    { id: 'HSBG-2026-001', code: 'HSBG-2026-001', type: 'tiep_nhan', subjectName: 'Trần Tuấn Kiệt', requestDate: '2026-06-20', status: 'ChoDuyet' },
                    { id: 'DXHT-001', code: 'DXHT-001', type: 'hoan_thanh', subjectName: 'Nguyễn Văn Trọng', requestDate: '2026-06-15', status: 'ChoDuyet' }
                ],
                stageStats: [
                    { label: 'Cắt cơn giải độc', value: 45, color: '#ef4444' },
                    { label: 'Phục hồi hành vi', value: 120, color: '#f59e0b' },
                    { label: 'Lao động trị liệu', value: 80, color: '#3b82f6' }
                ]
            };
        }
    },

    renderCurrentUser() {
        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const nameEl = document.getElementById('leader-user-name');
        if (nameEl) {
            nameEl.textContent = typeof Auth !== 'undefined'
                ? Auth.getDisplayName(user)
                : (user?.fullName || user?.name || 'Lãnh đạo');
        }
    },

    renderDate() {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        const numEl = document.getElementById('leader-date-num');
        const labelEl = document.getElementById('leader-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (labelEl) labelEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;
    },

    renderStats() {
        this.setText('leader-active-patients', this.data.activePatients);
        this.setText('leader-pending-intakes', this.data.pendingIntakes);
        this.setText('leader-pending-completions', this.data.pendingCompletions);
        this.setText('leader-completed-patients', this.data.completedPatients);
    },

    renderRecentTasks() {
        const tbody = document.getElementById('leaderRecentTaskList');
        if (!tbody) return;

        if (!this.data.recentTasks.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">
                        Không có hồ sơ cần xử lý.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.data.recentTasks.map(item => `
            <tr>
                <td><span class="td-code">${this.escapeHtml(item.code)}</span></td>
                <td>${this.escapeHtml(item.type)}</td>
                <td>${this.escapeHtml(item.subject)}</td>
                <td>${this.escapeHtml(item.date)}</td>
                <td>${this.renderStatusBadge(item.status)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline btn-icon" title="Xem" data-route="${this.escapeHtml(item.route || '/approvals-receive')}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderStatusBadge(status) {
        const map = {
            ChoDuyet: { label: 'Chờ duyệt', cls: 'badge-orange' },
            DaTiepNhan: { label: 'Đã tiếp nhận', cls: 'badge-green' },
            DaHoanThanh: { label: 'Đã hoàn thành', cls: 'badge-green' },
            TuChoi: { label: 'Từ chối', cls: 'badge-red' }
        };
        const item = map[status] || { label: status || '-', cls: 'badge-gray' };
        return `<span class="badge ${item.cls}">${this.escapeHtml(item.label)}</span>`;
    },

    renderStageChart() {
        const chartEl = document.getElementById('leaderStageChart');
        if (!chartEl) return;

        if (typeof Chart !== 'undefined' && typeof Chart.renderBarChart === 'function') {
            chartEl.innerHTML = Chart.renderBarChart(this.data.stageStats);
            return;
        }

        chartEl.innerHTML = '<div class="module-empty-state">Không tải được biểu đồ.</div>';
    },

    bindActions() {
        const btnViewAll = document.getElementById('btnViewAllLeaderTasks');
        if (btnViewAll) {
            btnViewAll.addEventListener('click', () => Router.navigate('/approvals-receive'));
        }

        const tbody = document.getElementById('leaderRecentTaskList');
        if (tbody) {
            tbody.addEventListener('click', event => {
                const button = event.target.closest('button[data-route]');
                if (button) Router.navigate(button.dataset.route);
            });
        }
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    },

    showToast(message, type = 'success') {
        if (typeof Toast !== 'undefined' && typeof Toast.show === 'function') {
            Toast.show(message, type);
        } else if (typeof showToast === 'function') {
            showToast(message, type);
        }
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

window.LeaderDashboardPage = LeaderDashboardPage;
