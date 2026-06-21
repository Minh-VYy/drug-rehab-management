const VisitRegistrationPage = {
    history: [],

    async render(containerId) {
        const success = await ViewLoader.load("views/family/visit-registration.html", containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Đăng ký thăm gặp');
        
        const form = document.getElementById('visit-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
        
        this.loadHistory();
    },

    async loadHistory() {
        try {
            const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
            const relativeId = user && user.relativeId ? user.relativeId : 1;

            const response = await API.getVisitRequestsByRelative(relativeId);
            if (response && response.success) {
                this.history = response.data;
                this.renderHistory();
            }
        } catch (error) {
            console.error('Lỗi khi tải lịch sử đăng ký thăm gặp:', error);
        }
    },

    async handleSubmit() {
        const dateInput = document.getElementById('ngayTham').value;
        const shiftInput = document.getElementById('caTham').value;
        const typeInput = document.getElementById('hinhThucTham').value;
        const patientInput = document.getElementById('maBenhNhan').value.trim();

        if (!dateInput || !shiftInput || !typeInput || !patientInput) {
            if (typeof Toast !== 'undefined') Toast.show('Vui lòng điền đầy đủ các trường bắt buộc', 'warning');
            return;
        }

        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        const relativeId = user && user.relativeId ? user.relativeId : 1;

        const data = {
            relativeId: relativeId,
            patientId: patientInput,
            visitType: typeInput,
            visitDate: dateInput,
            visitShift: parseInt(shiftInput, 10)
        };

        try {
            const response = await API.createVisitRequest(data);
            if (response && response.success) {
                if (typeof Toast !== 'undefined') Toast.show('Đăng ký lịch thăm gặp thành công!', 'success');
                const form = document.getElementById('visit-form');
                if (form) form.reset();
                this.loadHistory();
            }
        } catch (error) {
            console.error('Lỗi khi đăng ký thăm gặp:', error);
            if (typeof Toast !== 'undefined') Toast.show('Không thể đăng ký thăm gặp. Vui lòng kiểm tra lại mã bệnh nhân.', 'error');
        }
    },

    renderHistory() {
        const tbody = document.getElementById('history-table-body');
        const emptyState = document.getElementById('history-empty');
        const table = document.getElementById('history-table');

        if (!tbody || !emptyState || !table) return;

        if (this.history.length === 0) {
            emptyState.style.display = 'block';
            table.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        table.style.display = 'table';
        tbody.innerHTML = '';

        this.history.forEach(item => {
            const tr = document.createElement('tr');
            
            let statusHtml = '';
            switch(item.status) {
                case 'CHO_DUYET':
                    statusHtml = '<span class="status-badge warning">Chờ duyệt</span>';
                    break;
                case 'DA_DONG_Y':
                    statusHtml = '<span class="status-badge success">Đã đồng ý</span>';
                    break;
                case 'TU_CHOI':
                case 'HUY':
                    statusHtml = '<span class="status-badge danger">Từ chối/Hủy</span>';
                    break;
                case 'HOAN_THANH':
                    statusHtml = '<span class="status-badge info">Đã hoàn thành</span>';
                    break;
                default:
                    statusHtml = `<span class="status-badge warning">${item.status}</span>`;
            }

            const dateStr = item.visitDate ? new Date(item.visitDate).toLocaleDateString('vi-VN') : '';
            const typeStr = item.visitType === 'TRUC_TIEP' ? 'Trực tiếp' : 'Trực tuyến';
            const shiftStr = `Ca ${item.visitShift}`;

            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${shiftStr}</td>
                <td>${typeStr}</td>
                <td>${item.patientName || item.patientId}</td>
                <td>${statusHtml}</td>
                <td>
                    <button class="btn btn-icon" title="Hủy đăng ký" ${item.status !== 'CHO_DUYET' ? 'disabled style="opacity:0.5"' : ''}>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
};

window.VisitRegistrationPage = VisitRegistrationPage;