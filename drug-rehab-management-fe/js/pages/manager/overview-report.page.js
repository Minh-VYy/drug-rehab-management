const OverviewReportPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/manager/overview-report.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.OverviewReportPage = OverviewReportPage;