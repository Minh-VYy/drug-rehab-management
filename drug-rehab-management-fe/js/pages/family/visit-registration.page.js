const VisitRegistrationPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/visit-registration.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.VisitRegistrationPage = VisitRegistrationPage;