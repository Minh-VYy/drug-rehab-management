const VisitHistoryPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/visit-history.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.VisitHistoryPage = VisitHistoryPage;