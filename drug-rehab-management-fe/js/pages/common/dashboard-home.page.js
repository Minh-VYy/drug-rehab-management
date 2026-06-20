const DashboardHomePage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/common/dashboard-home.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Dashboard");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("commonAdvancedDashboard", "common");
    }
  },
};

window.DashboardHomePage = DashboardHomePage;
