const PoliceDashboardPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/police/police-dashboard.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.PoliceDashboardPage = PoliceDashboardPage;