const MedicineSchedulePage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/medicine-schedule.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.MedicineSchedulePage = MedicineSchedulePage;