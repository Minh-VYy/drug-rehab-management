const Card = {
    renderStatCard(title, value, iconClass, colorType) {
        // colorType: primary, success, warning, danger
        return `
            <div class="card stat-card stat-${colorType}">
                <div class="stat-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="stat-info">
                    <h4>${title}</h4>
                    <p class="stat-value">${value}</p>
                </div>
            </div>
        `;
    }
};
