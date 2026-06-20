const VisitCheckinPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/staff/visit-checkin.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.VisitCheckinPage = VisitCheckinPage;