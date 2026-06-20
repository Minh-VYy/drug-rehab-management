const Card = {
    renderStatCard(title, value, iconClass, colorType, trend = null) {
        // colorType: primary, success, warning, danger
        let trendHtml = '';
        if (trend) {
            const isUp = trend > 0;
            const trendClass = isUp ? 'up' : (trend < 0 ? 'down' : 'neutral');
            const trendIcon = isUp ? 'fa-arrow-trend-up' : (trend < 0 ? 'fa-arrow-trend-down' : 'fa-minus');
            trendHtml = `
                <div class="stat-trend ${trendClass}">
                    <i class="fa-solid ${trendIcon}"></i>
                    <span>${Math.abs(trend)}% tháng trước</span>
                </div>
            `;
        }

        return `
            <div class="stat-card">
                <div class="stat-card-icon stat-icon-${colorType === 'primary' ? 'blue' : colorType === 'success' ? 'green' : colorType === 'warning' ? 'orange' : 'red'}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="stat-value">${value}</div>
                <div class="stat-label">${title}</div>
                ${trendHtml}
                <div class="stat-orb orb-${colorType === 'primary' ? 'blue' : colorType === 'success' ? 'green' : colorType === 'warning' ? 'orange' : 'red'}"></div>
            </div>
        `;
    }
};
