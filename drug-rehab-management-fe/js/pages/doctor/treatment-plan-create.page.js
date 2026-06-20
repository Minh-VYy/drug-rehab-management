const TreatmentPlanCreatePage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/treatment-plan-create.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.TreatmentPlanCreatePage = TreatmentPlanCreatePage;