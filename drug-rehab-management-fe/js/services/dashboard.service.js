const DashboardService = {
    roleAliases: {
        admin: 'admin',
        doctor: 'doctor',
        staff: 'staff',
        manager: 'manager',
        director: 'leader',
        leader: 'leader',
        police: 'police',
        family: 'family',
        common: 'common'
    },

    normalizeRole(role) {
        const key = String(role || 'common').trim().toLowerCase();
        return this.roleAliases[key] || key || 'common';
    },

    async getRoleDashboard(role) {
        const apiClient = window.Api || window.API;

        if (!apiClient || typeof apiClient.getRoleDashboard !== 'function') {
            throw new Error('Dashboard API client is not available');
        }

        return apiClient.getRoleDashboard(this.normalizeRole(role));
    },

    async getCurrentUserDashboard() {
        const user = window.Auth && typeof Auth.getCurrentUser === 'function'
            ? Auth.getCurrentUser()
            : null;
        return this.getRoleDashboard(user?.role || 'common');
    }
};

window.DashboardService = DashboardService;
