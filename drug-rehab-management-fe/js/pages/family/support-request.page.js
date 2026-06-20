const SupportRequestPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/support-request.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.SupportRequestPage = SupportRequestPage;