const DoctorDashboardPage = {
  async render(containerId) {
    const success = await ViewLoader.load("views/doctor/doctor-dashboard.html", containerId);
    if (success) this.init();
  },

  init() {
    if (typeof Topbar !== "undefined") Topbar.setTitle("Tổng quan");
    if (window.AdvancedRoleDashboard) {
      AdvancedRoleDashboard.renderRole("doctorAdvancedDashboard", "doctor");
    }
  },
};

window.DoctorDashboardPage = DoctorDashboardPage;
