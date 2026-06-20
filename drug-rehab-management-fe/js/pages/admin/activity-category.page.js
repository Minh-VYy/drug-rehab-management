const ActivityCategoryPage = {
    async render(containerId) {
        const success = await ViewLoader.load('views/admin/activity-category.html', containerId);
        if (success) {
            // Initialize logic here
        }
    }
};

window.ActivityCategoryPage = ActivityCategoryPage;