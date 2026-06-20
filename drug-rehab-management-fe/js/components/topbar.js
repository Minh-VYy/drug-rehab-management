const Topbar = {
    render(user) {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        const displayName = typeof Auth !== 'undefined'
            ? Auth.getDisplayName(user)
            : (user.fullName || user.name || user.username || 'Người dùng');
        const displayRole = user.roleLabel || (typeof Auth !== 'undefined' ? Auth.roleLabel(user.role) : user.role);
        const initial = displayName ? displayName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() : 'U';

        container.innerHTML = `
            <button class="topbar-btn" id="sidebar-toggle" onclick="document.getElementById('sidebar-container').classList.toggle('open'); document.querySelector('.sidebar-overlay')?.classList.toggle('open')">
                <i class="fa-solid fa-bars"></i>
            </button>
            <div class="topbar-title">
                <h2 id="topbar-title">Hệ thống Quản lý</h2>
            </div>
            <div class="topbar-actions">
                <a href="#/notifications" data-link class="topbar-btn has-notif" id="btn-notification" title="Thông báo" style="overflow: visible !important;">
                    <i class="fa-regular fa-bell"></i>
                    <span class="noti-badge" id="topbarNotiBadge" style="display:none; position:absolute; top:-4px; right:-4px; background:var(--danger); color:#fff; font-size:11px; font-weight:bold; border-radius:10px; padding:3px 6px; line-height:1; box-shadow: 0 0 0 2px #1e293b;">0</span>
                </a>
                <div class="topbar-divider"></div>
                <a href="#/profile" data-link class="topbar-user" id="topbar-user-menu" title="Tài khoản của bạn" style="text-decoration:none;">
                    <div class="topbar-avatar">${initial}</div>
                    <div class="topbar-user-info">
                        <div class="user-name">${displayName}</div>
                        <div class="user-role">${displayRole}</div>
                    </div>
                    <i class="fa-solid fa-chevron-down" style="font-size:10px;color:rgba(255,255,255,0.4);margin-left:4px;"></i>
                </a>
            </div>
        `;
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
