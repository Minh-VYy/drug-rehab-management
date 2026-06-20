const DashboardHomePage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/common/dashboard-home.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Trang chủ');
        }

        this.renderUserInfo();
        this.renderActionsBasedOnRole();
    },

    renderUserInfo() {
        const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const greetingEl = document.getElementById('welcomeGreeting');
        const roleEl = document.getElementById('welcomeRole');

        if (currentUser) {
            if (greetingEl) greetingEl.textContent = `Xin chào, ${currentUser.hoTen || currentUser.username}!`;
            if (roleEl) roleEl.textContent = this.getRoleName(currentUser.role);
        } else {
            // Fallback for demo
            if (greetingEl) greetingEl.textContent = `Xin chào, Quản trị viên!`;
            if (roleEl) roleEl.textContent = `Quản trị hệ thống`;
        }
    },

    getRoleName(roleCode) {
        const map = {
            'ADMIN': 'Quản trị hệ thống',
            'LANHDAO': 'Lãnh đạo trung tâm',
            'BACSI': 'Bác sĩ điều trị',
            'CANBOQUANLY': 'Cán bộ quản lý',
            'CANBOTRUNGTAM': 'Cán bộ trung tâm',
            'NGUOITHAN': 'Người thân',
            'CONGAN': 'Công an'
        };
        return map[roleCode] || 'Nhân sự Trung tâm';
    },

    renderActionsBasedOnRole() {
        const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const role = currentUser ? currentUser.role : 'ADMIN';
        const actionsGrid = document.getElementById('welcomeActions');
        if (!actionsGrid) return;

        let actionsHtml = '';

        if (role === 'ADMIN') {
            actionsHtml = `
                <a href="#/admin/dashboard" class="action-card-3d action-primary">
                    <div class="action-icon"><i class="fa-solid fa-chart-pie"></i></div>
                    <h3>Thống kê Quản trị</h3>
                    <p>Xem tổng quan hệ thống</p>
                </a>
                <a href="#/admin/users" class="action-card-3d action-info">
                    <div class="action-icon"><i class="fa-solid fa-users-gear"></i></div>
                    <h3>Quản lý Tài khoản</h3>
                    <p>Phân quyền & cấp phát tài khoản</p>
                </a>
                <a href="#/admin/staff" class="action-card-3d action-success">
                    <div class="action-icon"><i class="fa-solid fa-id-badge"></i></div>
                    <h3>Quản lý Nhân sự</h3>
                    <p>Danh sách cán bộ, y bác sĩ</p>
                </a>
            `;
        } else if (role === 'LANHDAO') {
            actionsHtml = `
                <a href="#/leader/dashboard" class="action-card-3d action-primary">
                    <div class="action-icon"><i class="fa-solid fa-chart-line"></i></div>
                    <h3>Báo cáo Tổng quan</h3>
                    <p>Thống kê số liệu trung tâm</p>
                </a>
                <a href="#/leader/intake-approval" class="action-card-3d action-warning">
                    <div class="action-icon"><i class="fa-solid fa-file-signature"></i></div>
                    <h3>Duyệt Tiếp nhận</h3>
                    <p>Phê duyệt hồ sơ vào trung tâm</p>
                </a>
            `;
        } else if (role === 'BACSI') {
            actionsHtml = `
                <a href="#/doctor/dashboard" class="action-card-3d action-primary">
                    <div class="action-icon"><i class="fa-solid fa-stethoscope"></i></div>
                    <h3>Bảng tin Bác sĩ</h3>
                    <p>Tổng quan công việc hôm nay</p>
                </a>
                <a href="#/doctor/medical-record" class="action-card-3d action-info">
                    <div class="action-icon"><i class="fa-solid fa-notes-medical"></i></div>
                    <h3>Hồ sơ Bệnh án</h3>
                    <p>Cập nhật tình trạng học viên</p>
                </a>
                <a href="#/doctor/treatment-plan" class="action-card-3d action-success">
                    <div class="action-icon"><i class="fa-solid fa-pills"></i></div>
                    <h3>Phác đồ Điều trị</h3>
                    <p>Lập phác đồ & kê đơn</p>
                </a>
            `;
        } else if (role === 'CANBOQUANLY') {
            actionsHtml = `
                <a href="#/manager/dashboard" class="action-card-3d action-primary">
                    <div class="action-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                    <h3>Bảng tin Quản lý</h3>
                    <p>Tiến độ & công việc</p>
                </a>
                <a href="#/manager/treatment-approval" class="action-card-3d action-success">
                    <div class="action-icon"><i class="fa-solid fa-check-double"></i></div>
                    <h3>Duyệt Phác đồ</h3>
                    <p>Xác nhận phác đồ điều trị</p>
                </a>
            `;
        } else {
            // Default generic actions
            actionsHtml = `
                <a href="#/profile" class="action-card-3d action-primary">
                    <div class="action-icon"><i class="fa-solid fa-user"></i></div>
                    <h3>Hồ sơ Cá nhân</h3>
                    <p>Cập nhật thông tin của bạn</p>
                </a>
                <a href="#/notifications" class="action-card-3d action-warning">
                    <div class="action-icon"><i class="fa-solid fa-bell"></i></div>
                    <h3>Thông báo</h3>
                    <p>Xem thông báo hệ thống</p>
                </a>
            `;
        }

        actionsGrid.innerHTML = actionsHtml;
    }
};

window.DashboardHomePage = DashboardHomePage;