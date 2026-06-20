const VoluntaryRegistrationPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/voluntary-registration.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.VoluntaryRegistrationPage = VoluntaryRegistrationPage;