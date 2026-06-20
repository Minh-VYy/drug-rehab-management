const HandoverHistoryPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/police/handover-history.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.HandoverHistoryPage = HandoverHistoryPage;