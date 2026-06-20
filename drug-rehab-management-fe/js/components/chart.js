const Chart = {
    renderBarChart(data) {
        const max = Math.max(...data.map(d => d.value), 10);
        const barsHtml = data.map(item => {
            const height = Math.max((item.value / max) * 100, 2);
            return `
                <div class="chart-bar-col">
                    <div style="flex: 1; display: flex; align-items: flex-end; width: 100%; position: relative;">
                        <div class="chart-bar" style="height: ${height}%;">
                            <div class="chart-bar-tip">${item.value}</div>
                        </div>
                    </div>
                    <div class="chart-bar-label">${item.label}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="chart-container">
                <div class="chart-canvas-wrap">
                    <div class="chart-bar-grid">
                        ${barsHtml}
                    </div>
                </div>
            </div>
        `;
    }
};
