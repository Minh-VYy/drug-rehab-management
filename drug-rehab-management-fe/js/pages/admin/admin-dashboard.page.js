const AdminDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/admin/admin-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Dashboard quản trị");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("adminAdvancedDashboard", "admin");
    }
  },
};

window.AdminDashboardPage = AdminDashboardPage;
