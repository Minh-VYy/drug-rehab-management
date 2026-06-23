const LeaderDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/leader/leader-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Tổng quan");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("leaderAdvancedDashboard", "leader");
    }
  },
};

window.LeaderDashboardPage = LeaderDashboardPage;
