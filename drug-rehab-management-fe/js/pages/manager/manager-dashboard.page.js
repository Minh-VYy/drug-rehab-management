const ManagerDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/manager/manager-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Dashboard cán bộ quản lý");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("managerAdvancedDashboard", "manager");
    }
  },
};

window.ManagerDashboardPage = ManagerDashboardPage;
