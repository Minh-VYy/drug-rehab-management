const Sidebar = {
    render(user) {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        const role = user.role;
        let menuItems = [];

        if (role === ROLES.FAMILY) {
            menuItems = [
                { path: '/',               icon: 'fa-solid fa-house',          text: 'Dashboard' },
                { path: '/register-rehab', icon: 'fa-solid fa-file-signature', text: 'Đăng ký cai nghiện' },
                { path: '/visit-register', icon: 'fa-solid fa-calendar-plus',  text: 'Đăng ký thăm gặp' },
                { path: '/treatment-path', icon: 'fa-solid fa-route',          text: 'Lộ trình phục hồi' },
                { path: '/support',        icon: 'fa-solid fa-headset',        text: 'Yêu cầu hỗ trợ' }
            ];
        } else if (role === ROLES.POLICE) {
            menuItems = [
                { path: '/',               icon: 'fa-solid fa-house',          text: 'Dashboard' },
                { path: '/transfer',       icon: 'fa-solid fa-file-export',    text: 'Gửi hồ sơ bàn giao' },
                { path: '/transfer-list',  icon: 'fa-solid fa-list',           text: 'DS hồ sơ bàn giao' }
            ];
        } else if (role === ROLES.STAFF) {
            menuItems = [
                { path: '/',           icon: 'fa-solid fa-house',            text: 'Dashboard' },
                { path: '/receive',    icon: 'fa-solid fa-file-import',      text: 'Tiếp nhận hồ sơ' },
                { path: '/patients',   icon: 'fa-solid fa-users',            text: 'Quản lý học viên' },
                { path: '/visits',     icon: 'fa-solid fa-calendar-check',   text: 'Duyệt thăm gặp' },
                { path: '/activities', icon: 'fa-solid fa-clipboard-list',   text: 'Lập lịch sinh hoạt' },
                { path: '/attendance', icon: 'fa-solid fa-user-check',       text: 'Điểm danh' },
                { path: '/support-management', icon: 'fa-solid fa-headset', text: 'Quản lý hỗ trợ' }
            ];
        } else if (role === ROLES.DOCTOR) {
            menuItems = [
                { path: '/',                icon: 'fa-solid fa-house',        text: 'Dashboard' },
                { path: '/medical-records', icon: 'fa-solid fa-file-medical', text: 'Cập nhật hồ sơ bệnh án' },
                { path: '/treatment-plan-create', icon: 'fa-solid fa-file-signature', text: 'Lập phác đồ điều trị' },
                { path: '/treatment-diary', icon: 'fa-solid fa-book-medical', text: 'Nhật ký điều trị' }
            ];
        } else if (role === ROLES.MANAGER) {
            menuItems = [
                { path: '/',                   icon: 'fa-solid fa-house',        text: 'Dashboard' },
                { path: '/assignment',         icon: 'fa-solid fa-user-doctor',  text: 'Phân công phụ trách' },
                { path: '/treatment-approval', icon: 'fa-solid fa-stamp',        text: 'Phê duyệt phác đồ' },
                { path: '/stage-approval',     icon: 'fa-solid fa-forward-step', text: 'Duyệt chuyển giai đoạn' },
                { path: '/manager-reports',    icon: 'fa-solid fa-chart-line',   text: 'Báo cáo quản lý' }
            ];
        } else if (role === ROLES.LEADER) {
            menuItems = [
                { path: '/',                   icon: 'fa-solid fa-house',         text: 'Dashboard' },
                { path: '/reports',            icon: 'fa-solid fa-chart-pie',     text: 'Báo cáo tổng quan' },
                { path: '/approvals-receive',  icon: 'fa-solid fa-check-double',  text: 'Phê duyệt tiếp nhận' },
                { path: '/approvals-complete', icon: 'fa-solid fa-award',         text: 'Phê duyệt hoàn thành' }
            ];
        } else if (role === ROLES.ADMIN) {
            menuItems = [
                { path: '/',            icon: 'fa-solid fa-house',         text: 'Dashboard' },
                { path: '/users',       icon: 'fa-solid fa-users-gear',    text: 'Quản lý tài khoản' },
                { path: '/roles',       icon: 'fa-solid fa-user-shield',   text: 'Quản lý vai trò' },
                { path: '/medicines',   icon: 'fa-solid fa-capsules',      text: 'Danh mục thuốc' },
                { path: '/system-logs', icon: 'fa-solid fa-server',        text: 'Hoạt động hệ thống' }
            ];
        }

        const displayName = typeof Auth !== 'undefined'
            ? Auth.getDisplayName(user)
            : (user.fullName || user.name || user.username || 'Người dùng');
        const displayRole = user.roleLabel || (typeof Auth !== 'undefined' ? Auth.roleLabel(user.role) : user.role);
        const initial = displayName
            ? displayName.split(' ').filter(Boolean).map(w => w[0]).slice(-2).join('').toUpperCase()
            : 'U';

        const menuHtml = menuItems.map(item => `
            <div class="nav-item">
                <a href="#${item.path}" class="nav-link" data-link>
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                </a>
            </div>`).join('');

        container.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <img src="assets/images/logo_transparent.png" alt="Logo"
                        class="sidebar-logo-icon"
                        onerror="this.style.display='none';">
                    <div class="sidebar-logo-text">
                        <div class="brand-name">Rehab Center</div>
                        <div class="brand-sub">Hệ thống quản lý</div>
                    </div>
                </div>
            </div>
            <div class="sidebar-section-label">Main Menu</div>
            <nav class="sidebar-nav" id="sidebar-nav">
                ${menuHtml}
            </nav>

        `;
    }
};
