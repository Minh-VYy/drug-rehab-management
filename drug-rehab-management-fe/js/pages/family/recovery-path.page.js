const RecoveryPathPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/family/recovery-path.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.RecoveryPathPage = RecoveryPathPage;