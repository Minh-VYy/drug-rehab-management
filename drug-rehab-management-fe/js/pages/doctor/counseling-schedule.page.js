const CounselingSchedulePage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/counseling-schedule.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.CounselingSchedulePage = CounselingSchedulePage;