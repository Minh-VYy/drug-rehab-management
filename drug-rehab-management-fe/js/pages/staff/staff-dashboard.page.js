const StaffDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/staff/staff-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Dashboard cán bộ trung tâm");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("staffAdvancedDashboard", "staff");
    }
  },
};

window.StaffDashboardPage = StaffDashboardPage;
