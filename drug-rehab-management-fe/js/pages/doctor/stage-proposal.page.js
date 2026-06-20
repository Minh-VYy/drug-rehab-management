const StageProposalPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/stage-proposal.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.StageProposalPage = StageProposalPage;