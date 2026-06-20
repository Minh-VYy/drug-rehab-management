const CreateNotificationPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/staff/create-notification.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.CreateNotificationPage = CreateNotificationPage;