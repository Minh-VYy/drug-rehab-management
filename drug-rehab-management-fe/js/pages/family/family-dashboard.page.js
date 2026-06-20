const FamilyDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/family/family-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Dashboard người thân");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("familyAdvancedDashboard", "family");
    }
  },
};

window.FamilyDashboardPage = FamilyDashboardPage;
