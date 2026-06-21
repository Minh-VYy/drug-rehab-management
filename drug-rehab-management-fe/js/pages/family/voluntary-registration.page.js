const VoluntaryRegistrationPage = {
    history: [],

    async render(containerId) {
        const success = await ViewLoader.load("views/family/voluntary-registration.html", containerId);
        if (success) {
            this.init();
        }
    },

    init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Đăng ký tự nguyện');
        
        const form = document.getElementById('voluntary-form');
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

            const response = await API.getVoluntaryAdmissionsByRelative(relativeId);
            if (response && response.success) {
                this.history = response.data;
                this.renderHistory();
            }
        } catch (error) {
            console.error('Lỗi khi tải lịch sử đăng ký tự nguyện:', error);
        }
    },

    async handleSubmit() {
        // Collect data
        const data = {
            patientFullName: document.getElementById('hoTen').value.trim(),
            patientDateOfBirth: document.getElementById('ngaySinh').value,
            permanentAddress: document.getElementById('diaChi').value.trim(),
            patientIdentityNumber: document.getElementById('cccd').value.trim(),
            relationshipToPatient: document.getElementById('quanHe').value.trim(),
            drugTypeUsed: document.getElementById('loaiMaTuy').value,
            clinicalSymptoms: document.getElementById('bieuHien').value.trim(),
            // Mock file names since we don't have file upload API yet
            identityCardFrontFile: "mat_truoc_cccd.jpg",
            identityCardBackFile: "mat_sau_cccd.jpg"
        };

        if (!data.patientFullName || !data.patientIdentityNumber || !data.drugTypeUsed) {
            if (typeof Toast !== 'undefined') Toast.show('Vui lòng điền đầy đủ các trường bắt buộc', 'warning');
            return;
        }

        const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        data.relativeId = user && user.relativeId ? user.relativeId : 1;

        try {
            const response = await API.createVoluntaryAdmission(data);
            if (response && response.success) {
                if (typeof Toast !== 'undefined') Toast.show('Gửi đơn đăng ký thành công!', 'success');
                const form = document.getElementById('voluntary-form');
                if (form) form.reset();
                this.loadHistory();
            }
        } catch (error) {
            console.error('Lỗi khi gửi đơn:', error);
            if (typeof Toast !== 'undefined') Toast.show('Không thể gửi đơn', 'error');
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
                case 'DA_TIEP_NHAN':
                case 'DA_NHAP_TRAI':
                    statusHtml = '<span class="status-badge success">Đã tiếp nhận</span>';
                    break;
                case 'TU_CHOI':
                case 'GIA_DINH_HUY':
                    statusHtml = '<span class="status-badge danger">Đã hủy/Từ chối</span>';
                    break;
                default:
                    statusHtml = `<span class="status-badge warning">${item.status}</span>`;
            }

            const dateStr = item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('vi-VN') : '';

            tr.innerHTML = `
                <td>Mã NV chưa gán</td>
                <td>${item.patientFullName}</td>
                <td>${dateStr}</td>
                <td>${statusHtml}</td>
                <td>
                    <button class="btn btn-icon" title="Xem chi tiết">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
};

window.VoluntaryRegistrationPage = VoluntaryRegistrationPage;