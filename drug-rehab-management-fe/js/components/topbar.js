const Topbar = {
    render(user) {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        const displayName = typeof Auth !== 'undefined'
            ? Auth.getDisplayName(user)
            : (user.fullName || user.name || user.username || 'Người dùng');
        const displayRole = user.roleLabel || (typeof Auth !== 'undefined' ? Auth.roleLabel(user.role) : user.role);
        const initial = displayName ? displayName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() : 'U';
        const username = user?.username || sessionStorage.getItem('auth_user') || 'user';
        const savedAvatar = localStorage.getItem('avatar_' + username);
        const avatarHtml = savedAvatar 
            ? `<img src="${savedAvatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` 
            : initial;

        container.innerHTML = `
            <button class="topbar-btn" id="sidebar-toggle" onclick="document.getElementById('sidebar-container').classList.toggle('open'); document.querySelector('.sidebar-overlay')?.classList.toggle('open')">
                <i class="fa-solid fa-bars"></i>
            </button>
            <div class="topbar-title">
                <h2 id="topbar-title">Trang Chủ</h2>
            </div>
            <div class="topbar-actions">
                <a href="#/notifications" data-link class="topbar-btn has-notif" id="btn-notification" title="Thông báo" style="overflow: visible !important;">
                    <i class="fa-regular fa-bell"></i>
                    <span class="noti-badge" id="topbarNotiBadge" style="display:none; position:absolute; top:-4px; right:-4px; background:var(--danger); color:#fff; font-size:11px; font-weight:bold; border-radius:10px; padding:3px 6px; line-height:1; box-shadow: 0 0 0 2px #1e293b;">0</span>
                </a>
                <div class="topbar-divider"></div>
                <div class="topbar-user-wrap" id="topbar-user-wrap">
                    <button class="topbar-user" id="topbar-user-btn" title="Tài khoản của bạn" style="text-decoration:none; background:transparent; border:none;">
                        <div class="topbar-avatar" style="display:flex; align-items:center; justify-content:center; overflow:hidden;">${avatarHtml}</div>
                        <div class="topbar-user-info" style="text-align:left;">
                            <div class="user-name">${displayName}</div>
                            <div class="user-role">${displayRole}</div>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="font-size:10px;color:rgba(255,255,255,0.4);margin-left:4px;"></i>
                    </button>
                    <div class="topbar-dropdown-menu" id="userDropdown">
                        <div class="dropdown-header">
                            <div class="dropdown-header-title">Tài khoản của tôi</div>
                        </div>
                        <a href="#/profile" class="dropdown-item" onclick="document.getElementById('userDropdown').classList.remove('active');">
                            <i class="fa-regular fa-user"></i> Thông tin cá nhân
                        </a>
                        <a href="#/profile?tab=password" class="dropdown-item" onclick="document.getElementById('userDropdown').classList.remove('active');">
                            <i class="fa-solid fa-lock"></i> Đổi mật khẩu
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item dropdown-item-danger" onclick="if(typeof Auth !== 'undefined') Auth.logout(); return false;">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Toggle logic
        setTimeout(() => {
            const userBtn = document.getElementById('topbar-user-btn');
            const dropdown = document.getElementById('userDropdown');
            if (userBtn && dropdown) {
                userBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });
                
                // Close when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target) && !userBtn.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        }, 0);
    },
    setTitle(title) {
        const titleEl = document.getElementById('topbar-title');
        if (titleEl) titleEl.innerText = title;
    },
    updateNotificationCount(count) {
        const badge = document.getElementById('topbarNotiBadge');
        if (badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }
};
