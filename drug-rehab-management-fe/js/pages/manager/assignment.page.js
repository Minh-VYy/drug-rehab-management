const AssignmentPage = {
    patients: [],
    doctors: [],

    async render(containerId) {
        const success = await ViewLoader.load('views/manager/assignment.html', containerId);
        if (success) await this.init();
    },

    async init() {
        if (typeof Topbar !== 'undefined') Topbar.setTitle('Phân công phụ trách điều trị');
        
        // Load data
        await Promise.all([
            this.loadPatients(),
            this.loadDoctors()
        ]);

        this.applyFilter();
    },

    async refresh() {
        await this.init();
        if (typeof window.Toast !== 'undefined') window.Toast.show('Đã làm mới dữ liệu', 'success');
    },

    async loadPatients() {
        if (typeof Api !== 'undefined' && typeof Api.getPatientsForAssignment !== 'undefined') {
            try {
                const res = await Api.getPatientsForAssignment();
                if (Array.isArray(res)) {
                    this.patients = res;
                    return;
                } else if (res && Array.isArray(res.data)) {
                    this.patients = res.data;
                    return;
                }
            } catch (err) {
                console.warn('Lỗi API getPatientsForAssignment:', err);
            }
        }

        // Mock Fallback
        this.patients = [
            { maNguoiCaiNghien: 'NCN-001', hoTen: 'Nguyễn Văn Trọng', trangThai: 'DANG_CAI_NGHIEN', bacSiPhuTrach: 'BS. Mai Hoàng Yến', maBacSi: 'BS001' },
            { maNguoiCaiNghien: 'NCN-002', hoTen: 'Lý Hải Nam', trangThai: 'DANG_CAI_NGHIEN', bacSiPhuTrach: 'BS. Mai Hoàng Yến', maBacSi: 'BS001' },
            { maNguoiCaiNghien: 'NCN-003', hoTen: 'Phạm Thị Dung', trangThai: 'DANG_KHAM_SUC_KHOE', bacSiPhuTrach: null, maBacSi: null },
            { maNguoiCaiNghien: 'NCN-004', hoTen: 'Hoàng Văn Đạt', trangThai: 'DANG_KHAM_SUC_KHOE', bacSiPhuTrach: null, maBacSi: null },
        ];
    },

    async loadDoctors() {
        if (typeof Api !== 'undefined' && typeof Api.getDoctors !== 'undefined') {
            try {
                const res = await Api.getDoctors();
                if (Array.isArray(res)) {
                    this.doctors = res;
                    return;
                } else if (res && Array.isArray(res.data)) {
                    this.doctors = res.data;
                    return;
                }
            } catch (err) {
                console.warn('Lỗi API getDoctors:', err);
            }
        }

        // Mock Fallback
        this.doctors = [
            { maBacSi: 'BS001', hoTen: 'BS. Mai Hoàng Yến', chuyenKhoa: 'Nội tiết' },
            { maBacSi: 'BS002', hoTen: 'BS. Trần Văn Hùng', chuyenKhoa: 'Tâm thần học' }
        ];
    },

    applyFilter() {
        const search = (document.getElementById('assign-search')?.value || '').toLowerCase().trim();
        const status = document.getElementById('assign-status-filter')?.value || 'all';

        const filtered = this.patients.filter(p => {
            const matchesSearch = !search || p.hoTen.toLowerCase().includes(search) || p.maNguoiCaiNghien.toLowerCase().includes(search);
            
            let matchesStatus = true;
            if (status === 'unassigned') matchesStatus = !p.maBacSi;
            if (status === 'assigned') matchesStatus = !!p.maBacSi;

            return matchesSearch && matchesStatus;
        });

        this.renderTable(filtered);
    },

    renderTable(data) {
        const target = document.getElementById('assign-table');
        if (!target) return;

        if (!data.length) {
            target.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-user-doctor"></i></div>
                    <div class="empty-state-title">Không tìm thấy học viên</div>
                    <div class="empty-state-msg">Không có học viên nào phù hợp với bộ lọc hiện tại.</div>
                </div>`;
            return;
        }

        const rows = data.map(p => {
            const isAssigned = !!p.maBacSi;
            const statusBadge = isAssigned 
                ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Đã phân công</span>'
                : '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Chưa phân công</span>';

            const actionBtn = isAssigned
                ? `<button class="btn btn-sm btn-outline" onclick="AssignmentPage.openAssignModal('${p.maNguoiCaiNghien}')"><i class="fa-solid fa-rotate"></i> Đổi bác sĩ</button>`
                : `<button class="btn btn-sm btn-primary" onclick="AssignmentPage.openAssignModal('${p.maNguoiCaiNghien}')"><i class="fa-solid fa-plus"></i> Phân công</button>`;

            return [
                `<span class="td-code">${this.escapeHtml(p.maNguoiCaiNghien)}</span>`,
                this.escapeHtml(p.hoTen),
                this.escapeHtml(p.trangThai),
                isAssigned ? `<strong style="color:var(--primary);">${this.escapeHtml(p.bacSiPhuTrach)}</strong>` : '<span style="color:var(--text-light);">Chưa có</span>',
                statusBadge,
                `<div class="action-btns">${actionBtn}</div>`
            ];
        });

        if (typeof Table !== 'undefined') {
            target.innerHTML = Table.renderTable(
                ['Mã học viên', 'Tên học viên', 'Trạng thái', 'Bác sĩ phụ trách', 'Trạng thái PC', 'Thao tác'],
                rows
            );
        }
    },

    openAssignModal(patientId) {
        const p = this.patients.find(x => x.maNguoiCaiNghien === patientId);
        if (!p) return;

        document.getElementById('assign-patient-id').value = p.maNguoiCaiNghien;
        document.getElementById('assign-patient-name').value = `${p.maNguoiCaiNghien} - ${p.hoTen}`;
        
        const docSelect = document.getElementById('assign-doctor');
        docSelect.innerHTML = '<option value="">-- Chọn bác sĩ --</option>' + this.doctors.map(d => 
            `<option value="${d.maBacSi}" ${p.maBacSi === d.maBacSi ? 'selected' : ''}>${this.escapeHtml(d.hoTen)} (${this.escapeHtml(d.chuyenKhoa)})</option>`
        ).join('');

        // Reset errors
        document.getElementById('assign-doctor-error').style.display = 'none';
        document.getElementById('assign-start-error').style.display = 'none';
        document.getElementById('assign-end-error').style.display = 'none';

        // Set default dates
        const now = new Date();
        document.getElementById('assign-start-date').value = now.toISOString().split('T')[0];
        
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        document.getElementById('assign-end-date').value = nextMonth.toISOString().split('T')[0];

        if (typeof Modal !== 'undefined') Modal.open('assignModal');
    },

    async saveAssignment() {
        const patientId = document.getElementById('assign-patient-id').value;
        const doctorId = document.getElementById('assign-doctor').value;
        const startDate = document.getElementById('assign-start-date').value;
        const endDate = document.getElementById('assign-end-date').value;

        let hasErr = false;
        if (!doctorId) { document.getElementById('assign-doctor-error').style.display = 'flex'; hasErr = true; }
        else document.getElementById('assign-doctor-error').style.display = 'none';

        if (!startDate) { document.getElementById('assign-start-error').style.display = 'flex'; hasErr = true; }
        else document.getElementById('assign-start-error').style.display = 'none';

        if (!endDate || endDate < startDate) { document.getElementById('assign-end-error').style.display = 'flex'; hasErr = true; }
        else document.getElementById('assign-end-error').style.display = 'none';

        if (hasErr) return;

        const payload = {
            maBacSi: doctorId,
            ngayBatDau: startDate,
            ngayKetThucDuKien: endDate
        };

        try {
            if (typeof Api !== 'undefined' && typeof Api.assignDoctor !== 'undefined') {
                await Api.assignDoctor(patientId, payload);
            }
            
            // Update local state for mock/fallback
            const p = this.patients.find(x => x.maNguoiCaiNghien === patientId);
            if (p) {
                p.maBacSi = doctorId;
                const doc = this.doctors.find(d => d.maBacSi === doctorId);
                if (doc) p.bacSiPhuTrach = doc.hoTen;
            }

            if (typeof Modal !== 'undefined') Modal.close('assignModal');
            if (typeof window.Toast !== 'undefined') window.Toast.show('Đã phân công bác sĩ thành công!', 'success');
            this.applyFilter();

        } catch (err) {
            console.error('Lỗi phân công:', err);
            if (typeof window.Toast !== 'undefined') window.Toast.show('Phân công thất bại. Vui lòng thử lại.', 'error');
        }
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

window.AssignmentPage = AssignmentPage;