const LeaderReportPage = {
    reportData: {
        overview: {
            activePatients: 0,
            pendingIntakes: 0,
            pendingCompletions: 0,
            completedPatients: 0,
            completionRate: 0
        },
        stageStats: [],
        monthlyReports: [],
        insights: []
    },

    async render(containerId) {
        const success = await ViewLoader.load('views/leader/leader-report.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Báo cáo tổng quan');
        }
        this.bindEvents();
        this.renderDate();
        await this.loadReportData();
    },

    async loadReportData() {
        try {
            const data = typeof Api !== 'undefined' ? await Api.getLeaderReport() : null;
            const activePatients = Number(data?.activePatients ?? 0);
            const completedPatients = Number(data?.completedPatients ?? 0);
            const totalResolved = activePatients + completedPatients;
            const completionRate = totalResolved > 0
                ? Math.round((completedPatients / totalResolved) * 1000) / 10
                : 0;

            this.reportData = {
                overview: {
                    activePatients,
                    pendingIntakes: Number(data?.pendingIntakes ?? 0),
                    pendingCompletions: Number(data?.pendingCompletions ?? 0),
                    completedPatients,
                    completionRate
                },
                stageStats: Array.isArray(data?.stageStats) ? data.stageStats : [],
                monthlyReports: this.buildMonthlyReports(data, completionRate),
                insights: this.buildInsights(data, completionRate)
            };

            this.renderOverview(this.reportData.overview);
            this.renderInsights(this.reportData.insights);
            this.renderTable(this.reportData.monthlyReports);
            this.renderChart(this.reportData.stageStats);
        } catch (error) {
            console.warn('Lỗi API Leader Report, dùng Mock data fallback:', error);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu báo cáo (Mock) do chưa kết nối Backend', 'warning');
            
            // Mock Fallback
            const mockData = {
                activePatients: 245,
                pendingIntakes: 12,
                pendingCompletions: 8,
                completedPatients: 156,
                stageStats: [
                    { label: 'Cắt cơn giải độc', value: 45, color: '#ef4444' },
                    { label: 'Phục hồi hành vi', value: 120, color: '#f59e0b' },
                    { label: 'Lao động trị liệu', value: 80, color: '#3b82f6' }
                ]
            };
            
            const activePatients = mockData.activePatients;
            const completedPatients = mockData.completedPatients;
            const totalResolved = activePatients + completedPatients;
            const completionRate = Math.round((completedPatients / totalResolved) * 1000) / 10;

            this.reportData = {
                overview: {
                    activePatients,
                    pendingIntakes: mockData.pendingIntakes,
                    pendingCompletions: mockData.pendingCompletions,
                    completedPatients,
                    completionRate
                },
                stageStats: mockData.stageStats,
                monthlyReports: this.buildMonthlyReports(mockData, completionRate),
                insights: this.buildInsights(mockData, completionRate)
            };
            
            this.renderOverview(this.reportData.overview);
            this.renderInsights(this.reportData.insights);
            this.renderTable(this.reportData.monthlyReports);
            this.renderChart(this.reportData.stageStats);
        }
    },

    buildMonthlyReports(data, completionRate) {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        return [
            {
                month: `${month}/${year}`,
                newIntakes: Number(data?.pendingIntakes ?? 0),
                activePatients: Number(data?.activePatients ?? 0),
                completedPatients: Number(data?.completedPatients ?? 0),
                rejectedPatients: 0,
                completionRate: `${completionRate}%`
            }
        ];
    },

    buildInsights(data, completionRate) {
        const pendingIntakes = Number(data?.pendingIntakes ?? 0);
        const pendingCompletions = Number(data?.pendingCompletions ?? 0);

        return [
            {
                type: 'info',
                title: 'Tổng quan',
                description: `Hiện có ${Number(data?.activePatients ?? 0)} người đang điều trị và ${Number(data?.completedPatients ?? 0)} người đã hoàn thành.`
            },
            {
                type: pendingIntakes > 0 ? 'warning' : 'up',
                title: 'Tiếp nhận',
                description: pendingIntakes > 0
                    ? `Còn ${pendingIntakes} hồ sơ tiếp nhận chờ lãnh đạo xử lý.`
                    : 'Không còn hồ sơ tiếp nhận đang chờ duyệt.'
            },
            {
                type: pendingCompletions > 0 ? 'warning' : 'up',
                title: 'Hoàn thành',
                description: pendingCompletions > 0
                    ? `Còn ${pendingCompletions} đề xuất hoàn thành cần xem xét.`
                    : 'Không còn đề xuất hoàn thành đang chờ duyệt.'
            },
            {
                type: 'info',
                title: 'Tỷ lệ hoàn thành',
                description: `Tỷ lệ hoàn thành hiện tại là ${completionRate}%.`
            }
        ];
    },

    renderOverview(overview) {
        this.setText('repActivePatients', overview.activePatients);
        this.setText('repPendingIntakes', overview.pendingIntakes);
        this.setText('repPendingCompletions', overview.pendingCompletions);
        this.setText('repCompletedPatients', overview.completedPatients);
        this.setText('repCompletionRate', `${overview.completionRate}%`);
    },

    renderDate() {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        const numEl = document.getElementById('report-date-num');
        const labelEl = document.getElementById('report-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (labelEl) labelEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;
    },

    renderInsights(insights) {
        const container = document.getElementById('reportInsightsList');
        if (!container) return;

        const iconMap = {
            up: '<i class="fa-solid fa-arrow-trend-up" style="color:#10B981;"></i>',
            warning: '<i class="fa-solid fa-triangle-exclamation" style="color:#F59E0B;"></i>',
            info: '<i class="fa-solid fa-lightbulb" style="color:#3B82F6;"></i>'
        };

        container.innerHTML = insights.map(item => `
            <div class="module-detail-item" style="margin-bottom:16px;">
                <div class="module-detail-label" style="display:flex;gap:10px;align-items:center;margin-bottom:6px;font-size:1rem;color:var(--text-primary);">
                    ${iconMap[item.type] || iconMap.info} <strong>${this.escapeHtml(item.title)}</strong>
                </div>
                <div class="module-detail-value" style="font-size:0.95rem;color:var(--text-muted);line-height:1.5;padding-left:26px;">
                    ${this.escapeHtml(item.description)}
                </div>
            </div>
        `).join('');
    },

    renderTable(reports) {
        const tbody = document.getElementById('monthlyReportTableBody');
        if (!tbody) return;

        if (!reports || !reports.length) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có dữ liệu báo cáo.</td></tr>';
            return;
        }

        tbody.innerHTML = reports.map(item => `
            <tr>
                <td><strong>${this.escapeHtml(item.month)}</strong></td>
                <td>${this.escapeHtml(item.newIntakes)}</td>
                <td>${this.escapeHtml(item.activePatients)}</td>
                <td>${this.escapeHtml(item.completedPatients)}</td>
                <td>${this.escapeHtml(item.rejectedPatients)}</td>
                <td><span class="badge badge-green">${this.escapeHtml(item.completionRate)}</span></td>
            </tr>
        `).join('');
    },

    renderChart(stageStats) {
        const chartEl = document.getElementById('stageChart');
        if (!chartEl) return;

        if (typeof Chart !== 'undefined' && typeof Chart.renderBarChart === 'function') {
            chartEl.innerHTML = Chart.renderBarChart(stageStats || []);
        } else {
            chartEl.innerHTML = '<div class="module-empty-state">Không tải được biểu đồ.</div>';
        }
    },

    bindEvents() {
        const btnRefresh = document.getElementById('btnRefreshReport');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => this.loadReportData());
        }

        const btnExport = document.getElementById('btnExportReport');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                this.showToast('Chức năng xuất báo cáo đang được phát triển.', 'success');
            });
        }

        const filter = document.getElementById('reportTimeFilter');
        if (filter) {
            filter.addEventListener('change', () => this.loadReportData());
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

window.LeaderReportPage = LeaderReportPage;
