const ForbiddenPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/common/forbidden.html', containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') {
            Topbar.setTitle('Truy cập bị từ chối');
        }

        const btnGoHome = document.getElementById('btnGoHome');
        if (btnGoHome) {
            btnGoHome.addEventListener('click', () => {
                // Determine the correct home based on role
                const currentUser = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
                if (!currentUser) {
                    window.location.hash = '/login';
                    return;
                }
                
                const role = currentUser.role;
                if (role === 'ADMIN') window.location.hash = '/admin/dashboard';
                else if (role === 'LANHDAO') window.location.hash = '/leader/dashboard';
                else if (role === 'BACSI') window.location.hash = '/doctor/dashboard';
                else if (role === 'CANBOQUANLY') window.location.hash = '/manager/dashboard';
                else window.location.hash = '/dashboard';
            });
        }
    }
};

window.ForbiddenPage = ForbiddenPage;