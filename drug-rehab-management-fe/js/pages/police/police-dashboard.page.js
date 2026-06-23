const PoliceDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/police/police-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Tổng quan");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("policeAdvancedDashboard", "police");
    }
  },
};

window.PoliceDashboardPage = PoliceDashboardPage;
