const AssignmentPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/manager/assignment.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.AssignmentPage = AssignmentPage;