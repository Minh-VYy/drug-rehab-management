const StageApprovalPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/manager/stage-approval.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.StageApprovalPage = StageApprovalPage;