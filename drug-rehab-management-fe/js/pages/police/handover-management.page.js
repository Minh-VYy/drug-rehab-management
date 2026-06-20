const HandoverManagementPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/police/handover-management.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.HandoverManagementPage = HandoverManagementPage;