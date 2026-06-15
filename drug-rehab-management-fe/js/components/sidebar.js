const Sidebar = {
    render(user) {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        const role = user.role;
        let menuItems = [];

        // Dynamic Menu Items based on Role
        if (role === ROLES.FAMILY) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/profile', icon: 'fa-solid fa-address-card', text: 'Hồ sơ cá nhân' },
                { path: '/register-rehab', icon: 'fa-solid fa-file-signature', text: 'Đăng ký cai nghiện' },
                { path: '/visit-register', icon: 'fa-solid fa-calendar-plus', text: 'Đăng ký thăm gặp' },
                { path: '/treatment-path', icon: 'fa-solid fa-route', text: 'Lộ trình phục hồi' },
                { path: '/support', icon: 'fa-solid fa-headset', text: 'Yêu cầu hỗ trợ' }
            ];
        } else if (role === ROLES.POLICE) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/transfer', icon: 'fa-solid fa-file-export', text: 'Gửi hồ sơ bàn giao' },
                { path: '/transfer-list', icon: 'fa-solid fa-list', text: 'DS hồ sơ bàn giao' }
            ];
        } else if (role === ROLES.STAFF) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/receive', icon: 'fa-solid fa-file-import', text: 'Tiếp nhận hồ sơ' },
                { path: '/patients', icon: 'fa-solid fa-users', text: 'Quản lý học viên' },
                { path: '/visits', icon: 'fa-solid fa-calendar-check', text: 'Duyệt thăm gặp' },
                { path: '/activities', icon: 'fa-solid fa-clipboard-list', text: 'Lập lịch sinh hoạt' },
                { path: '/attendance', icon: 'fa-solid fa-user-check', text: 'Điểm danh' }
            ];
        } else if (role === ROLES.DOCTOR) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/patients', icon: 'fa-solid fa-users-medical', text: 'Hồ sơ bệnh án' },
                { path: '/treatment-logs', icon: 'fa-solid fa-book-medical', text: 'Nhật ký điều trị' },
                { path: '/treatment-plans', icon: 'fa-solid fa-notes-medical', text: 'Phác đồ điều trị' },
                { path: '/medicine-schedule', icon: 'fa-solid fa-pills', text: 'Lịch uống thuốc' },
                { path: '/counseling', icon: 'fa-solid fa-brain', text: 'Lịch tư vấn tâm lý' }
            ];
        } else if (role === ROLES.MANAGER) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/assignments', icon: 'fa-solid fa-user-doctor', text: 'Phân công cán bộ' },
                { path: '/approvals', icon: 'fa-solid fa-stamp', text: 'Duyệt phác đồ' },
                { path: '/reports', icon: 'fa-solid fa-chart-line', text: 'Báo cáo tổng quan' }
            ];
        } else if (role === ROLES.LEADER) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/reports', icon: 'fa-solid fa-chart-pie', text: 'Báo cáo tổng quan' },
                { path: '/approvals-receive', icon: 'fa-solid fa-check-double', text: 'Phê duyệt tiếp nhận' },
                { path: '/approvals-complete', icon: 'fa-solid fa-award', text: 'Phê duyệt hoàn thành' }
            ];
        } else if (role === ROLES.ADMIN) {
            menuItems = [
                { path: '/', icon: 'fa-solid fa-house', text: 'Dashboard' },
                { path: '/users', icon: 'fa-solid fa-users-gear', text: 'Quản lý tài khoản' },
                { path: '/roles', icon: 'fa-solid fa-user-shield', text: 'Quản lý vai trò' },
                { path: '/medicines', icon: 'fa-solid fa-capsules', text: 'Danh mục thuốc' },
                { path: '/system-logs', icon: 'fa-solid fa-server', text: 'Hoạt động hệ thống' }
            ];
        }

        const menuHtml = menuItems.map(item => `
            <a href="${item.path}" class="nav-item ${item.path === '/' ? 'active' : ''}" data-link>
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `).join('');

        container.innerHTML = `
            <div class="sidebar-header">
                <i class="fa-solid fa-house-medical"></i>
                <span>Rehab Center</span>
            </div>
            <nav class="sidebar-nav">
                ${menuHtml}
            </nav>
            <div class="sidebar-footer">
                <button class="btn btn-outline btn-block text-danger" onclick="Auth.logout()">
                    <i class="fa-solid fa-sign-out-alt"></i> Đăng xuất
                </button>
            </div>
        `;
    }
};
