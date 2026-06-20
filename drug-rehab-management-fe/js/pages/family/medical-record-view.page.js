const MedicalRecordViewPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/medical-record-view.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.MedicalRecordViewPage = MedicalRecordViewPage;