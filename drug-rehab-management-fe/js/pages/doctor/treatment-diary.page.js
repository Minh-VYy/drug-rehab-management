const TreatmentDiaryPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/treatment-diary.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.TreatmentDiaryPage = TreatmentDiaryPage;