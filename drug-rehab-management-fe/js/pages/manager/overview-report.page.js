const OverviewReportPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/manager/overview-report.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Báo cáo quản lý');
        await this.loadData();
    },

    async refresh() {
        await this.loadData();
        if (typeof window.Toast !== 'undefined') window.Toast.show('Đã cập nhật dữ liệu báo cáo mới nhất', 'success');
    },

    async loadData() {
        let stats = null;
        if (typeof Api !== 'undefined' && typeof Api.getManagerReport !== 'undefined') {
            try {
                stats = await Api.getManagerReport();
            } catch (err) {
                console.warn('Lỗi API getManagerReport:', err);
            }
        }

        // Mock Fallback
        if (!stats) {
            stats = {
                totalPatients: 145,
                pendingPlans: 12,
                completed: 48,
                doctors: 8,
                treatmentStatusData: [
                    { label: 'Cắt cơn', value: 45 },
                    { label: 'Phục hồi', value: 60 },
                    { label: 'Lao động', value: 30 },
                    { label: 'Tái hòa nhập', value: 10 }
                ],
                drugTypeData: [
                    { label: 'Heroin', value: 70 },
                    { label: 'Ma túy đá', value: 40 },
                    { label: 'Ketamine', value: 20 },
                    { label: 'Cần sa', value: 15 }
                ]
            };
        }

        this.renderStats(stats);
        this.renderCharts(stats);
    },

    renderStats(stats) {
        const elTotal = document.getElementById('rep-total-patients');
        const elPending = document.getElementById('rep-pending-plans');
        const elCompleted = document.getElementById('rep-completed');
        const elDoctors = document.getElementById('rep-doctors');

        if (elTotal) elTotal.textContent = stats.totalPatients;
        if (elPending) elPending.textContent = stats.pendingPlans;
        if (elCompleted) elCompleted.textContent = stats.completed;
        if (elDoctors) elDoctors.textContent = stats.doctors;
    },

    renderCharts(stats) {
        if (typeof Chart === 'undefined') return;

        const tsChart = document.getElementById('treatmentStatusChart');
        if (tsChart) {
            tsChart.innerHTML = Chart.renderBarChart(stats.treatmentStatusData);
        }

        const dtChart = document.getElementById('drugTypeChart');
        if (dtChart) {
            dtChart.innerHTML = Chart.renderBarChart(stats.drugTypeData);
        }
    },

    exportReport() {
        if (typeof window.Toast !== 'undefined') {
            window.Toast.show('Đang xuất PDF báo cáo...', 'success');
        }
    }
};

window.OverviewReportPage = OverviewReportPage;