const AdminDashboardPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/admin/admin-dashboard.html', containerId);
        if (success) {
            this.init();
        }
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Quản trị Hệ thống');

        this.renderDate();
        this.renderCurrentUser();

        let data = null;
        if (typeof Api !== 'undefined') {
            try {
                data = await Api.getAdminDashboard();
            } catch (error) {
                console.warn('Lỗi API Admin Dashboard, dùng Mock data fallback:', error);
                if (typeof window.Toast !== 'undefined') window.Toast.show('Đang dùng dữ liệu mẫu (Mock) do chưa kết nối Backend', 'warning');
            }
        }

        // Mock Fallback matching SQL data
        if (!data) {
            data = {
                totalAccounts: 842,
                totalRoles: 8,
                todayVisits: 1254,
                systemErrors: 0,
                recentAccounts: [
                    { username: 'admin01', name: 'Admin Hệ thống', role: 'Quản trị HT', status: 'HoatDong' },
                    { username: 'bacsi01', name: 'BS. Mai Hoàng Yến', role: 'Bác sĩ', status: 'HoatDong' },
                    { username: 'nguoithan01', name: 'Nguyễn Bá Quyền', role: 'Người thân', status: 'TamKhoa' }
                ]
            };
        }

        const statsEl = document.getElementById('admin-stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div class="stat-card-3d">
                    <div class="stat-icon-3d icon-primary-3d"><i class="fa-solid fa-users-gear"></i></div>
                    <div class="stat-value-3d">${data.totalAccounts}</div>
                    <div class="stat-label-3d">Tài khoản Hệ thống</div>
                </div>
                <div class="stat-card-3d">
                    <div class="stat-icon-3d icon-warning-3d"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="stat-value-3d">${data.totalRoles}</div>
                    <div class="stat-label-3d">Nhóm Quyền (Roles)</div>
                </div>
                <div class="stat-card-3d">
                    <div class="stat-icon-3d icon-success-3d"><i class="fa-solid fa-eye"></i></div>
                    <div class="stat-value-3d">${data.todayVisits}</div>
                    <div class="stat-label-3d">Lượt truy cập hôm nay</div>
                </div>
                <div class="stat-card-3d">
                    <div class="stat-icon-3d icon-danger-3d"><i class="fa-solid fa-bug"></i></div>
                    <div class="stat-value-3d">${data.systemErrors}</div>
                    <div class="stat-label-3d">Lỗi hệ thống</div>
                </div>
            `;
        }

        const tableEl = document.getElementById('admin-accounts-table');
        if (tableEl && typeof Table !== 'undefined' && typeof Badge !== 'undefined') {
            const rows = data.recentAccounts.map(acc => [
                acc.username,
                acc.name,
                acc.role,
                Badge.renderStatusBadge(acc.status === 'HoatDong' ? 'Active' : 'Inactive'),
                acc.status === 'HoatDong' 
                    ? '<button class="btn btn-sm btn-outline text-danger">Khóa</button>'
                    : '<button class="btn btn-sm btn-outline text-success">Mở</button>'
            ]);
            tableEl.innerHTML = Table.renderTable(
                ['Username', 'Họ tên', 'Role', 'Trạng thái', 'Hành động'],
                rows
            );
        }
    },

    renderCurrentUser() {
        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const nameEl = document.getElementById('admin-user-name');
        if (nameEl) {
            nameEl.textContent = typeof Auth !== 'undefined'
                ? Auth.getDisplayName(user)
                : (user?.fullName || user?.name || 'Admin');
        }
    },

    renderDate() {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
        const numEl = document.getElementById('admin-date-num');
        const labelEl = document.getElementById('admin-date-label');
        if (numEl) numEl.textContent = now.getDate();
        if (labelEl) labelEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getFullYear()}`;
    }
};

window.AdminDashboardPage = AdminDashboardPage;