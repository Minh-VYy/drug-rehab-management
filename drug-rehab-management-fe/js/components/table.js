const Table = {
    renderTable(headers, rows) {
        const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
        const bodyHtml = rows.map(row => {
            const cellsHtml = row.map(cell => `<td>${cell}</td>`).join('');
            return `<tr>${cellsHtml}</tr>`;
        }).join('');

        return `
            <div class="table-responsive">
                <table class="table">
                    <thead><tr>${headerHtml}</tr></thead>
                    <tbody>${bodyHtml || '<tr><td colspan="100%" class="text-center text-muted">Không có dữ liệu</td></tr>'}</tbody>
                </table>
            </div>
        `;
    }
};
