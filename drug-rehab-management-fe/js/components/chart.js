const Chart = {
    // Simple DOM-based bar chart
    renderBarChart(data) {
        const max = Math.max(...data.map(d => d.value));
        const barsHtml = data.map(item => {
            const height = (item.value / max) * 100;
            return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 200px; width: 40px;">
                    <div style="background-color: var(--primary); width: 100%; height: ${height}%; border-radius: 4px 4px 0 0; transition: height 0.5s;"></div>
                    <div style="margin-top: 8px; font-size: 0.8rem; color: var(--muted-text); text-align: center;">${item.label}</div>
                </div>
            `;
        }).join('');

        return `
            <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 240px; padding: 20px; background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                ${barsHtml}
            </div>
        `;
    }
};
