const Topbar = {
    render(user) {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

        container.innerHTML = `
            <div class="topbar-left">
                <button class="mobile-menu-btn" onclick="document.getElementById('sidebar-container').classList.toggle('open')">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <h2 class="page-title" id="topbar-title">Hệ thống Quản lý</h2>
            </div>
            <div class="topbar-right">
                <button class="btn btn-outline" style="border: none; padding: 8px;">
                    <i class="fa-solid fa-bell"></i>
                </button>
                <div class="user-profile" onclick="alert('Tính năng quản lý tài khoản đang phát triển')">
                    <div class="user-info text-right" style="display: flex; flex-direction: column;">
                        <span class="user-name" style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">${user.fullName}</span>
                        <span class="user-role" style="font-size: 0.75rem; color: var(--muted-text);">${user.role}</span>
                    </div>
                    <div class="avatar">${initial}</div>
                </div>
            </div>
        `;
    },
    setTitle(title) {
        const titleEl = document.getElementById('topbar-title');
        if (titleEl) titleEl.innerText = title;
    }
};
