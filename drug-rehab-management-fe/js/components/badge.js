const Badge = {
    renderStatusBadge(status) {
        let type = 'secondary';
        let text = status;
        
        const s = status.toLowerCase();
        if (s.includes('hoàn thành') || s.includes('đã duyệt') || s.includes('tốt') || s === 'active') {
            type = 'success';
        } else if (s.includes('đang xử lý') || s.includes('chờ') || s.includes('đang điều trị') || s === 'pending') {
            type = 'warning';
        } else if (s.includes('từ chối') || s.includes('hủy') || s.includes('xấu') || s === 'inactive') {
            type = 'danger';
        } else if (s.includes('mới')) {
            type = 'primary';
        }

        return `<span class="badge badge-${type}">${text}</span>`;
    }
};
