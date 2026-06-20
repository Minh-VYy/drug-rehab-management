const DoctorDashboardPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/doctor-dashboard.html', containerId);
        if (success) {
            await this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Dashboard Bác sĩ');

        const records = await this.getRecords();
        const needUpdate = records.filter(r => {
            const dateStr = r.ngayCapNhatCuoi || r.created;
            if (!dateStr) return true;
            return (new Date() - new Date(dateStr)) > 7 * 24 * 60 * 60 * 1000;
        }).length;
        const updated = records.length - needUpdate;
        const avgWeight = records.length
            ? (records.reduce((sum, item) => sum + Number(item.canNang || item.weight || 0), 0) / records.length).toFixed(1)
            : '0';

        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : { fullName: 'Bác sĩ' };

        // Update user name
        const userNameEl = document.getElementById('dash-user-name');
        if (userNameEl) {
            userNameEl.textContent = typeof Auth !== 'undefined'
                ? Auth.getDisplayName(user)
                : (user.fullName || user.name || 'Bác sĩ');
        }

        const subtitleEl = document.getElementById('dash-subtitle');
        if (subtitleEl) {
            subtitleEl.innerHTML = needUpdate > 0
                ? `Bạn có <strong style="color:#f59e0b;">${needUpdate} hồ sơ</strong> cần cập nhật hôm nay.`
                : `Tất cả hồ sơ đã được cập nhật. Chúc bạn làm việc hiệu quả! 🎉`;
        }

        // Date card
        const currentDate = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
        const numEl = document.getElementById('dash-date-num');
        const labelEl = document.getElementById('dash-date-label');
        if (numEl) numEl.textContent = currentDate.getDate();
        if (labelEl) labelEl.textContent = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        // Stat cards
        const statsEl = document.getElementById('dash-stats');
        if (statsEl && typeof Card !== 'undefined') {
            statsEl.innerHTML = `
                ${Card.renderStatCard('Tổng Bệnh Án', records.length, 'fa-solid fa-file-medical', 'primary', 12)}
                ${Card.renderStatCard('Đã Cập Nhật', updated, 'fa-solid fa-circle-check', 'success', 5)}
                ${Card.renderStatCard('Cần Cập Nhật', needUpdate, 'fa-solid fa-clock', 'warning', -2)}
                ${Card.renderStatCard('Cân Nặng TB', `${avgWeight} kg`, 'fa-solid fa-weight-scale', 'danger')}
            `;
        }

        // Recent list
        const recentEl = document.getElementById('dash-recent-list');
        if (recentEl) {
            if (!records.length) {
                recentEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
                        <div class="empty-state-title">Chưa có hồ sơ nào</div>
                        <div class="empty-state-msg">Các hồ sơ bệnh án sẽ hiển thị ở đây.</div>
                    </div>`;
            } else {
                const statusColors = {
                    'Cần cập nhật': { color: '#d97706', bg: 'rgba(245,158,11,0.1)', icon: 'fa-clock' },
                    'Đã cập nhật':  { color: '#059669', bg: 'rgba(16,185,129,0.1)',  icon: 'fa-circle-check' }
                };
                recentEl.innerHTML = records.slice(0, 5).map(record => {
                    const dateStr = record.ngayCapNhatCuoi || record.created;
                    const isOld = !dateStr || (new Date() - new Date(dateStr)) > 7*24*60*60*1000;
                    const state = isOld ? 'Cần cập nhật' : 'Đã cập nhật';
                    const sc = statusColors[state];
                    return `
                    <div class="recent-item">
                        <div class="recent-avatar">
                            <i class="fa-solid fa-file-medical"></i>
                        </div>
                        <div class="recent-info">
                            <div class="recent-name">${record.maBenhAn || record.id} &nbsp;·&nbsp; ${record.maNguoiCaiNghien || record.patientId}</div>
                            <div class="recent-sub">BS. ${record.maBacSi || record.doctor || 'Không rõ'} &nbsp;|&nbsp; ${record.ngayCapNhatCuoi || record.created || 'Chưa cập nhật'}</div>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
                            <span style="background:${sc.bg}; color:${sc.color}; font-size:11px; font-weight:600; padding:3px 9px; border-radius:999px; display:flex; align-items:center; gap:4px;">
                                <i class="fa-solid ${sc.icon}" style="font-size:9px;"></i>${state}
                            </span>
                            <button class="btn btn-sm btn-outline" onclick="Router.navigate('/medical-records')">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>`;
                }).join('');
            }
        }

        // Chart
        const chartEl = document.getElementById('dash-chart');
        const chartData = [
            { label: 'T2', value: 5 }, { label: 'T3', value: 8 },  { label: 'T4', value: 12 },
            { label: 'T5', value: 7 }, { label: 'T6', value: 15 }, { label: 'T7', value: 9 }, { label: 'CN', value: 4 }
        ];
        if (chartEl && typeof Chart !== 'undefined') {
            chartEl.innerHTML = Chart.renderBarChart(chartData);
        }
    },

    async getRecords() {
        if (typeof Api !== 'undefined') {
            try {
                const records = await Api.getMedicalRecords();
                if (Array.isArray(records)) return records;
            } catch (error) {
                console.warn('Lỗi API Doctor Dashboard, dùng Mock data fallback:', error);
                if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock) do chưa kết nối Backend', 'warning');
            }
        }

        const now = new Date();
        const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString();

        // Mock Fallback matching SQL data
        return [
            { maBenhAn: 'BA-001', maNguoiCaiNghien: 'NCN-001', maBacSi: 'BS001', canNang: 65.0, ngayCapNhatCuoi: oneDayAgo },
            { maBenhAn: 'BA-002', maNguoiCaiNghien: 'NCN-002', maBacSi: 'BS001', canNang: 58.0, ngayCapNhatCuoi: tenDaysAgo },
            { maBenhAn: 'BA-003', maNguoiCaiNghien: 'NCN-003', maBacSi: 'BS001', canNang: 62.0, ngayCapNhatCuoi: tenDaysAgo },
            { maBenhAn: 'BA-004', maNguoiCaiNghien: 'NCN-004', maBacSi: 'BS001', canNang: 70.0, ngayCapNhatCuoi: oneDayAgo }
        ];
    }
};

window.DoctorDashboardPage = DoctorDashboardPage;
