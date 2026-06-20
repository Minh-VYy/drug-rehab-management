const CompletionProposalPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/doctor/completion-proposal.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.CompletionProposalPage = CompletionProposalPage;