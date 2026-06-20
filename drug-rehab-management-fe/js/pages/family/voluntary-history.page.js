const VoluntaryHistoryPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/voluntary-history.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.VoluntaryHistoryPage = VoluntaryHistoryPage;