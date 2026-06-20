const SupportResponsePage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/staff/support-response.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.SupportResponsePage = SupportResponsePage;